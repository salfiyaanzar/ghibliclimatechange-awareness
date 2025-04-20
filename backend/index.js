const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const authenticate=require('./middleware/Authenticate');
const Goal=require('./models/Goals');
const cors = require('cors');


const app = express();
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Add all your frontend URLs
    credentials: true
  }));

// MongoDB connection string
const uri = `mongodb://salfiyaanzar:salfiya123%40blog@ac-b0wesq6-shard-00-00.if6ancn.mongodb.net:27017,ac-b0wesq6-shard-00-01.if6ancn.mongodb.net:27017,ac-b0wesq6-shard-00-02.if6ancn.mongodb.net:27017/?replicaSet=atlas-cmwu91-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=ghibliclimate`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true   //
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Register API - Creates a new user
app.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate input (basic check)
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Please provide fullName, email, and password.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    res.status(201).json({
      message: 'User registered successfully',
      user: savedUser
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login API - Authenticates the user and generates a JWT token
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If no user found, return error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the password matches the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      secret, // Use an environment variable for security in production
      { expiresIn: '1h' } // Token expiration time (optional)
    );

    // Send response with the token
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/profile', authenticate, async (req, res) => {
    try {
      // Access the user ID from the decoded JWT token (added in the authenticate middleware)
      const userId = req.user.userId;
  
      // Find the user based on the userId
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Respond with user data
      res.status(200).json({
        message: 'User profile',
        user: {
          fullName: user.fullName,
          email: user.email
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Logout API - Clears the token on client side
app.post('/logout', authenticate, (req, res) => {
  try {
    // In a stateless JWT system, the token remains valid until expiration
    // The actual "logout" happens on the client side by removing the token
    res.status(200).json({ 
      message: 'Logout successful. Please remove the token on client side.',
      logout: true 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/add-goal', authenticate, async (req, res) => {
  try {
    const { goal, category, completed = false } = req.body; // completed defaults to false if not provided

    if (!goal || !category) {
      return res.status(400).json({ error: 'Goal and category are required.' });
    }

    console.log("Authenticated user:", req.user);

    const newGoal = new Goal({
      user: req.user.userId, // comes from JWT payload
      goal,
      category,
      completed
    });

    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    console.error('Error saving goal:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.get('/get-goals', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId; // comes from JWT payload

    // Fetch goals associated with the authenticated user
    const goals = await Goal.find({ user: userId });

    res.status(200).json(goals); // this includes `completed` by default
  } catch (err) {
    console.error('Error fetching goals:', err);
    res.status(500).json({ error: 'Something went wrong while fetching goals.' });
  }
});

// Backend endpoint for toggling goal completion status
app.patch('/toggle-goal/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const goalId = req.params.id;

    // Find the goal and ensure it belongs to the authenticated user
    const goal = await Goal.findOne({ _id: goalId, user: userId });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found or unauthorized.' });
    }

    // Toggle the completed status
    goal.completed = !goal.completed;
    await goal.save();

    res.status(200).json({ 
      message: goal.completed ? 'Goal marked as completed.' : 'Goal marked as incomplete.',
      goal 
    });
  } catch (err) {
    console.error('Error toggling goal completion:', err);
    res.status(500).json({ error: 'Something went wrong while updating the goal.' });
  }
});

app.delete('/delete-goal/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const goalId = req.params.id;

    // Find and delete the goal if it belongs to the user
    const deletedGoal = await Goal.findOneAndDelete({ _id: goalId, user: userId });

    if (!deletedGoal) {
      return res.status(404).json({ error: 'Goal not found or unauthorized.' });
    }

    res.status(200).json({ message: 'Goal deleted successfully.', goal: deletedGoal });
  } catch (err) {
    console.error('Error deleting goal:', err);
    res.status(500).json({ error: 'Something went wrong while deleting the goal.' });
  }
});


app.get('/', (req, res) => {
  res.send('Hello from Express and MongoDB!');
});

app.listen(5000, () => {
  console.log(`🚀 Server is running at http://localhost:5000`);
});
