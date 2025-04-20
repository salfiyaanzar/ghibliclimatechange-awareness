'use client';
import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Checkbox, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Paper, 
  Container, 
  Chip,
  Stack,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Snackbar,
  Alert,
  Popper,
  ClickAwayListener
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Ghibli-inspired theme
const ghibliTheme = createTheme({
  palette: {
    primary: {
      main: '#1A4D2E', // Forest green for Ghibli's nature themes
      dark: '#2E7D32',
      light: '#81C784',
      contrastText: '#F8DCDA',
    },
    secondary: {
      main: '#64B5F6', // Sky blue for Ghibli skies
      dark: '#1976D2',
      light: '#90CAF9',
    },
    background: {
      default: '#F8DCDA', // Soft cream background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#3E3E3E',
      secondary: '#727272',
    },
    error: {
      main: '#EF5350',
    },
    warning: {
      main: '#FFB74D',
    },
    info: {
      main: '#64B5F6',
    },
    success: {
      main: '#81C784',
    },
  },
  typography: {
    fontFamily: "'Quicksand', 'Roboto', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          fontWeight: 600,
          padding: '10px 24px',
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

// Sample initial goals - only used if API fails
const sampleGoals = [
  { _id: '1', goal: "Reduce shower time by 2 minutes", completed: false, category: "personal" },
  { _id: '2', goal: "Start a small balcony garden", completed: false, category: "home" },
  { _id: '3', goal: "Switch to reusable shopping bags", completed: true, category: "personal" },
  { _id: '4', goal: "Organize a neighborhood clean-up day", completed: false, category: "community" }
];

// Goal suggestions by category
const goalSuggestions = {
  personal: [
    "Reduce shower time by 2 minutes",
    "Switch to reusable water bottles",
    "Take public transport once a week",
    "Go meat-free on Mondays",
    "Start composting food scraps",
    "Bring reusable bags when shopping",
    "Switch to LED light bulbs",
    "Start using a bicycle for short trips",
    "Buy second-hand clothes instead of new",
    "Turn off electronics when not in use"
  ],
  home: [
    "Start a small balcony garden",
    "Install a water-saving showerhead",
    "Set up a rainwater collection system",
    "Reduce heating by 1 degree in winter",
    "Install solar panels on the roof",
    "Create a compost bin for food waste",
    "Use natural cleaning products",
    "Improve home insulation",
    "Start a vegetable garden",
    "Switch to energy-efficient appliances"
  ],
  community: [
    "Organize a neighborhood clean-up day",
    "Start a community garden",
    "Begin a local recycling initiative",
    "Host a clothing swap event",
    "Advocate for bike lanes in your area",
    "Organize a tree planting event",
    "Start a repair cafe for fixing items",
    "Create a local seed library",
    "Petition for more public transport options",
    "Organize climate education workshops"
  ]
};

// Main component
export default function ClimateActionGoals() {
  const [goals, setGoals] = useState([]);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('personal');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [inputRef, setInputRef] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  
  // Fetch goals from API on component mount
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/get-goals', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch goals');
        }
        
        const data = await response.json();
        setGoals(data);
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError('Failed to load goals. Using sample data instead.');
        setGoals(sampleGoals);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);
  
  // Filter suggestions based on input text and selected category
  useEffect(() => {
    if (newGoalText.trim() === '') {
      setShowSuggestions(false);
      return;
    }
    
    // Get suggestions for the current category or all categories if needed
    const relevantSuggestions = 
      newGoalCategory === 'all' 
        ? [...goalSuggestions.personal, ...goalSuggestions.home, ...goalSuggestions.community]
        : goalSuggestions[newGoalCategory];
    
    // Filter suggestions that contain the input text (case insensitive)
    const filtered = relevantSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(newGoalText.toLowerCase())
    );
    
    // Limit to 5 suggestions
    setFilteredSuggestions(filtered.slice(0, 5));
    setShowSuggestions(filtered.length > 0);
  }, [newGoalText, newGoalCategory]);
  
  // Add a new goal
  const addGoal = async () => {
    if (newGoalText.trim() === '') return;
    
    try {
      const response = await fetch('http://localhost:5000/add-goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          goal: newGoalText,
          category: newGoalCategory,
          completed: false
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add goal');
      }
      
      const savedGoal = await response.json();
      
      // Add the new goal with the structure returned from the API
      setGoals([...goals, savedGoal]);
      setNewGoalText('');
      setShowSuggestions(false);
      setNotification({
        open: true,
        message: 'Goal added successfully!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error adding goal:', err);
      setNotification({
        open: true,
        message: 'Failed to add goal. Please try again.',
        severity: 'error'
      });
    }
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    setNewGoalText(e.target.value);
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setNewGoalText(suggestion);
    setShowSuggestions(false);
  };
  
  // Toggle goal completion status
  const toggleGoal = async (id) => {
    try {
      const goalToUpdate = goals.find(g => g._id === id);
      if (!goalToUpdate) return;
      
      // Use the new toggle-goal endpoint that supports both completing and uncompleting
      const response = await fetch(`http://localhost:5000/toggle-goal/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to update goal');
      }
      
      const result = await response.json();
      
      // Update goal in state
      setGoals(goals.map(goal => 
        goal._id === id ? result.goal : goal
      ));
      
      setNotification({
        open: true,
        message: result.goal.completed ? 'Goal marked as completed!' : 'Goal marked as incomplete!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating goal:', err);
      setNotification({
        open: true,
        message: 'Failed to update goal status. Please try again.',
        severity: 'error'
      });
    }
  };
  
  // Delete a goal
  const deleteGoal = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete-goal/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }
      
      // Remove goal from state
      setGoals(goals.filter(goal => goal._id !== id));
      setNotification({
        open: true,
        message: 'Goal deleted successfully!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error deleting goal:', err);
      setNotification({
        open: true,
        message: 'Failed to delete goal. Please try again.',
        severity: 'error'
      });
    }
  };
  
  // Handle notification close
  const handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };
  
  // Filter goals based on selected category
  const filteredGoals = filter === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === filter);
  
  // Handle click away to close suggestions
  const handleClickAway = () => {
    setShowSuggestions(false);
  };
  
  return (
    <ThemeProvider theme={ghibliTheme}>
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          py: 4
        }}
      >
        <Container maxWidth="md">
          <Paper 
            elevation={3}
            sx={{ 
              p: 4, 
              borderRadius: 3,
              backgroundColor: '#FCFFE0',
              border: '1px solid #E0E0E0',
              boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                mb: 3, 
                color: 'primary.main',
                fontWeight: 'bold' 
              }}
            >
              My Climate Action Goals
            </Typography>
            
            {/* Category filter */}
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ mb: 3 }}
            >
              {['all', 'personal', 'home', 'community'].map((category) => (
                <Chip
                  key={category}
                  label={category.charAt(0).toUpperCase() + category.slice(1)}
                  onClick={() => setFilter(category)}
                  color={filter === category ? 'primary' : 'default'}
                  variant={filter === category ? 'filled' : 'outlined'}
                  sx={{ 
                    borderRadius: 4,
                    fontWeight: filter === category ? 600 : 400
                  }}
                />
              ))}
            </Stack>
            
            {/* Add new goal with category selection */}
            <Box 
              sx={{ 
                display: 'flex', 
                mb: 4, 
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                position: 'relative'
              }}
            >
              <ClickAwayListener onClickAway={handleClickAway}>
                <Box sx={{ position: 'relative', flexGrow: 2 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Add a new climate action goal..."
                    value={newGoalText}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addGoal();
                      }
                    }}
                    inputRef={setInputRef}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: 'primary.light',
                        },
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                  
                  {/* Suggestions dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <Paper
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        zIndex: 1000,
                        mt: 0.5,
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        maxHeight: 300,
                        overflow: 'auto',
                      }}
                    >
                      <List sx={{ p: 0 }}>
                        {filteredSuggestions.map((suggestion, index) => (
                          <ListItem
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            sx={{
                              p: 1.5,
                              '&:hover': {
                                backgroundColor: 'rgba(26, 77, 46, 0.08)',
                                cursor: 'pointer'
                              },
                            }}
                          >
                            <ListItemText 
                              primary={suggestion} 
                              sx={{ 
                                '& .MuiTypography-root': { 
                                  fontSize: '0.95rem' 
                                } 
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </Box>
              </ClickAwayListener>
              
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={newGoalCategory}
                  label="Category"
                  onChange={(e) => setNewGoalCategory(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.light',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="home">Home</MenuItem>
                  <MenuItem value="community">Community</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                variant="contained"
                color="primary"
                onClick={addGoal}
                startIcon={<AddIcon fontSize="small" />}
                sx={{ 
                  height: { sm: 'auto' },
                  alignSelf: { xs: 'stretch', sm: 'auto' }
                }}
              >
                Add
              </Button>
            </Box>
            
            {/* Goals list with cream background and border */}
            <Paper
              variant="outlined"
              sx={{
                bgcolor: '#F8DCDA', // Cream background
                borderRadius: 2,
                p: 2,
                border: '1px solid #E0E0E0',
                boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
              }}
            >
              {loading ? (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  <Typography>Loading your goals...</Typography>
                </Box>
              ) : error ? (
                <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>
                  <Typography>{error}</Typography>
                </Box>
              ) : filteredGoals.length === 0 ? (
                <Box 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }}
                >
                  <Typography>
                    {filter === 'all' 
                      ? "Your climate action goals will appear here. Add your first goal above!"
                      : `No goals in the "${filter}" category yet.`
                    }
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {filteredGoals.map((goal) => (
                    <ListItem
                      key={goal._id}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        bgcolor: 'background.paper',
                        border: '1px solid #E0E0E0',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                        }
                      }}
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          onClick={() => deleteGoal(goal._id)}
                          sx={{ color: 'text.secondary' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={goal.completed}
                          onChange={() => toggleGoal(goal._id)}
                          sx={{
                            color: 'primary.main',
                            '&.Mui-checked': {
                              color: 'primary.main',
                            }
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={goal.goal}
                        secondary={`Category: ${goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}`}
                        sx={{
                          '& .MuiTypography-root:first-of-type': {
                            textDecoration: goal.completed ? 'line-through' : 'none',
                            color: goal.completed ? 'text.secondary' : 'text.primary',
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Paper>
          
          <Box 
            component="footer"
            sx={{ 
              textAlign: 'center', 
              mt: 2, 
              color: 'text.secondary',
              fontSize: 14
            }}
          >
            Inspired by Studio Ghibli's love for nature
          </Box>
        </Container>
      </Box>
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}