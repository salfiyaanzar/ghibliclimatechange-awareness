'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  FormControlLabel, 
  Checkbox, 
  Button, 
  Stepper, 
  Step, 
  StepLabel,
  Card,
  CardContent,
  Divider,
  Grid,
  Slider,
  LinearProgress,
  Tooltip,
  useTheme,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { 
  DirectionsCar, 
  DirectionsBus, 
  Train, 
  Flight, 
  Home, 
  RestaurantMenu, 
  ShoppingBag, 
  Recycling,
  BarChart,
  ChevronRight,
  ChevronLeft
} from '@mui/icons-material';

// Create a custom Ghibli-inspired theme
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

// Carbon footprint calculator component
function GhibliClimateCalculator() {

  // Add this at the beginning of your GhibliClimateCalculator component
useEffect(() => {
  // Apply the background color to the entire body
  document.body.style.backgroundColor = '#F8DCDA';
  
  // Cleanup when component unmounts
  return () => {
    document.body.style.backgroundColor = '';
  };
}, []);
  // Steps for the stepper
  const steps = ['Transportation', 'Home', 'Diet', 'Lifestyle', 'Waste', 'Results'];
  const [activeStep, setActiveStep] = useState(0);

  // State for form data
  const [formData, setFormData] = useState({
    transport: {
      carDistance: 0,
      carType: 'petrol',
      busDistance: 0,
      trainDistance: 0,
      shortHaulFlights: 0,
      mediumHaulFlights: 0,
      longHaulFlights: 0
    },
    home: {
      electricity: 0,
      gas: 0,
      heatingSource: 'gas',
      householdSize: 1
    },
    diet: {
      dietType: 'average'
    },
    lifestyle: {
      clothes: 0,
      electronics: 0,
      entertainment: 0
    },
    waste: {
      recycles: true,
      composts: false
    }
  });

  // State for calculated results
  const [results, setResults] = useState(null);

  // Constants for CO2e calculations
  const emissionFactors = {
    car: {
      petrol: 0.192,
      diesel: 0.171,
      electric: 0.050,
      hybrid: 0.105
    },
    bus: 0.105,
    train: 0.041,
    flights: {
      short: 0.254,
      medium: 0.151,
      long: 0.149
    },
    electricity: 0.475,
    gas: 2.0,
    diet: {
      vegan: 1.5,
      vegetarian: 1.7,
      low: 2.0,
      average: 2.5,
      high: 3.3
    },
    goods: {
      clothes: 0.3,
      electronics: 0.5,
      entertainment: 0.2
    },
    waste: {
      noRecycling: 0.2,
      composting: -0.1
    }
  };

  // Global averages for comparison
  const globalAverages = {
    world: 4.7,
    us: 16,
    europe: 7.8,
    india: 2,
    sustainable: 2
  };

  // Handle input changes
  const handleChange = (category, field, value) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category],
        [field]: value
      }
    });
  };

  // Handle next step
  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      calculateFootprint();
    }
    setActiveStep(prevStep => prevStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  // Reset the form
  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      transport: {
        carDistance: 0,
        carType: 'petrol',
        busDistance: 0,
        trainDistance: 0,
        shortHaulFlights: 0,
        mediumHaulFlights: 0,
        longHaulFlights: 0
      },
      home: {
        electricity: 0,
        gas: 0,
        heatingSource: 'gas',
        householdSize: 1
      },
      diet: {
        dietType: 'average'
      },
      lifestyle: {
        clothes: 0,
        electronics: 0,
        entertainment: 0
      },
      waste: {
        recycles: true,
        composts: false
      }
    });
    setResults(null);
  };

  // Calculate carbon footprint
  const calculateFootprint = () => {
    // Transportation calculations
    const carEmissions = (formData.transport.carDistance * 52 * emissionFactors.car[formData.transport.carType]) / 1000; // Convert to tons
    const busEmissions = (formData.transport.busDistance * 52 * emissionFactors.bus) / 1000;
    const trainEmissions = (formData.transport.trainDistance * 52 * emissionFactors.train) / 1000;
    
    const flightEmissions = (
      (formData.transport.shortHaulFlights * 1000 * emissionFactors.flights.short) +
      (formData.transport.mediumHaulFlights * 3000 * emissionFactors.flights.medium) +
      (formData.transport.longHaulFlights * 6000 * emissionFactors.flights.long)
    ) / 1000; // Convert to tons

    const transportTotal = carEmissions + busEmissions + trainEmissions + flightEmissions;

    // Home energy calculations
    const electricityEmissions = (formData.home.electricity * 12 * emissionFactors.electricity) / 1000;
    const gasEmissions = (formData.home.gas * 12 * emissionFactors.gas) / 1000;
    const homeTotal = (electricityEmissions + gasEmissions) / Math.max(1, formData.home.householdSize);

    // Diet calculations
    const dietTotal = emissionFactors.diet[formData.diet.dietType];

    // Lifestyle calculations
    const clothesEmissions = (formData.lifestyle.clothes * 12 * emissionFactors.goods.clothes) / 1000;
    const electronicsEmissions = (formData.lifestyle.electronics * 12 * emissionFactors.goods.electronics) / 1000;
    const entertainmentEmissions = (formData.lifestyle.entertainment * 12 * emissionFactors.goods.entertainment) / 1000;
    const lifestyleTotal = clothesEmissions + electronicsEmissions + entertainmentEmissions;

    // Waste calculations
    const wasteTotal = (formData.waste.recycles ? 0 : emissionFactors.waste.noRecycling) + 
                      (formData.waste.composts ? emissionFactors.waste.composting : 0);

    // Calculate total footprint
    const totalFootprint = transportTotal + homeTotal + dietTotal + lifestyleTotal + wasteTotal;

    // Set results
    setResults({
      total: totalFootprint.toFixed(2),
      breakdown: {
        transport: transportTotal.toFixed(2),
        home: homeTotal.toFixed(2),
        diet: dietTotal.toFixed(2),
        lifestyle: lifestyleTotal.toFixed(2),
        waste: wasteTotal.toFixed(2)
      },
      comparison: {
        world: ((totalFootprint / globalAverages.world) * 100).toFixed(0),
        us: ((totalFootprint / globalAverages.us) * 100).toFixed(0),
        europe: ((totalFootprint / globalAverages.europe) * 100).toFixed(0),
        india: ((totalFootprint / globalAverages.india) * 100).toFixed(0),
        sustainable: ((totalFootprint / globalAverages.sustainable) * 100).toFixed(0)
      }
    });
  };

  // Get background color based on footprint
  const getFootprintColor = (value) => {
    if (value <= 2) return '#4CAF50'; // Green for good
    if (value <= 5) return '#FFC107'; // Yellow for average
    if (value <= 10) return '#FF9800'; // Orange for above average
    return '#F44336'; // Red for high
  };

  // Get content based on current step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <DirectionsCar color="primary" sx={{ mr: 1 }} />
              Transportation
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Car - Weekly Distance (km)"
                  type="number"
                  value={formData.transport.carDistance}
                  onChange={(e) => handleChange('transport', 'carDistance', Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0 } }}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Car Type</InputLabel>
                  <Select
                    value={formData.transport.carType}
                    onChange={(e) => handleChange('transport', 'carType', e.target.value)}
                    label="Car Type"
                  >
                    <MenuItem value="petrol">Petrol</MenuItem>
                    <MenuItem value="diesel">Diesel</MenuItem>
                    <MenuItem value="hybrid">Hybrid</MenuItem>
                    <MenuItem value="electric">Electric</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Bus - Weekly Distance (km)"
                  type="number"
                  value={formData.transport.busDistance}
                  onChange={(e) => handleChange('transport', 'busDistance', Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0 } }}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Train - Weekly Distance (km)"
                  type="number"
                  value={formData.transport.trainDistance}
                  onChange={(e) => handleChange('transport', 'trainDistance', Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0 } }}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Flights per Year
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Short Haul (<1000 km)"
                  type="number"
                  value={formData.transport.shortHaulFlights}
                  onChange={(e) => handleChange('transport', 'shortHaulFlights', Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0 } }}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Medium Haul (1000-3700 km)"
                  type="number"
                  value={formData.transport.mediumHaulFlights}
                  onChange={(e) => handleChange('transport', 'mediumHaulFlights', Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0 } }}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Long Haul (>3700 km)"
                  type="number"
                  value={formData.transport.longHaulFlights}
                  onChange={(e) => handleChange('transport', 'longHaulFlights', Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0 } }}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Home color="primary" sx={{ mr: 1 }} />
              Home Energy
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monthly Electricity Usage (kWh)"
                  type="number"
                  value={formData.home.electricity}
                  onChange={(e) => handleChange('home', 'electricity', Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0 } }}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monthly Gas Usage (m³)"
                  type="number"
                  value={formData.home.gas}
                  onChange={(e) => handleChange('home', 'gas', Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0 } }}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Heating Source</InputLabel>
                  <Select
                    value={formData.home.heatingSource}
                    onChange={(e) => handleChange('home', 'heatingSource', e.target.value)}
                    label="Heating Source"
                  >
                    <MenuItem value="gas">Gas</MenuItem>
                    <MenuItem value="electric">Electric</MenuItem>
                    <MenuItem value="oil">Oil</MenuItem>
                    <MenuItem value="wood">Wood</MenuItem>
                    <MenuItem value="heat_pump">Heat Pump</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Number of People in Household"
                  type="number"
                  value={formData.home.householdSize}
                  onChange={(e) => handleChange('home', 'householdSize', Math.max(1, Number(e.target.value)))}
                  InputProps={{ inputProps: { min: 1 } }}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <RestaurantMenu color="primary" sx={{ mr: 1 }} />
              Diet
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Diet Type</InputLabel>
              <Select
                value={formData.diet.dietType}
                onChange={(e) => handleChange('diet', 'dietType', e.target.value)}
                label="Diet Type"
              >
                <MenuItem value="vegan">Vegan</MenuItem>
                <MenuItem value="vegetarian">Vegetarian</MenuItem>
                <MenuItem value="low">Low Meat Consumption</MenuItem>
                <MenuItem value="average">Average Meat Consumption</MenuItem>
                <MenuItem value="high">High Meat Consumption</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Estimated Annual Emissions:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card variant="outlined" sx={{ bgcolor: '#E8F5E9', height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">Vegan</Typography>
                      <Typography variant="h4" color="primary">1.5</Typography>
                      <Typography variant="body2">tons CO₂e/year</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined" sx={{ bgcolor: '#FFF8E1', height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">Average</Typography>
                      <Typography variant="h4" color="warning.main">2.5</Typography>
                      <Typography variant="body2">tons CO₂e/year</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined" sx={{ bgcolor: '#FFEBEE', height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">High Meat</Typography>
                      <Typography variant="h4" color="error.main">3.3</Typography>
                      <Typography variant="body2">tons CO₂e/year</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
      
      case 3:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingBag color="primary" sx={{ mr: 1 }} />
              Lifestyle & Consumption
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Monthly Spending on Clothes ($)"
                  type="number"
                  value={formData.lifestyle.clothes}
                  onChange={(e) => handleChange('lifestyle', 'clothes', Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0 } }}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Monthly Spending on Electronics ($)"
                  type="number"
                  value={formData.lifestyle.electronics}
                  onChange={(e) => handleChange('lifestyle', 'electronics', Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0 } }}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Monthly Entertainment ($)"
                  type="number"
                  value={formData.lifestyle.entertainment}
                  onChange={(e) => handleChange('lifestyle', 'entertainment', Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0 } }}
                  margin="normal"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Note:</strong> Consumption emissions are calculated based on the 
                environmental impact of producing, distributing, and disposing of goods and services. 
                Reducing consumption and choosing sustainable products can lower your carbon footprint.
              </Typography>
            </Box>
          </Box>
        );
      
      case 4:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Recycling color="primary" sx={{ mr: 1 }} />
              Waste & Recycling
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.waste.recycles}
                      onChange={(e) => handleChange('waste', 'recycles', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="I regularly recycle paper, plastic, glass, and metal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.waste.composts}
                      onChange={(e) => handleChange('waste', 'composts', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="I compost food and garden waste"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Impact of Waste Management:
              </Typography>
              <Typography variant="body2" paragraph>
                • Recycling regularly can reduce your carbon footprint by approximately 0.2 tons CO₂e per year.
              </Typography>
              <Typography variant="body2" paragraph>
                • Composting food waste can reduce your carbon footprint by approximately 0.1 tons CO₂e per year.
              </Typography>
              <Typography variant="body2">
                • Reducing overall waste through sustainable consumption choices provides additional benefits not captured here.
              </Typography>
            </Box>
          </Box>
        );
      
      case 5:
        return (
          <Box sx={{ p: 3 }}>
            {results && (
              <>
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                  Your Carbon Footprint: 
                  <Box component="span" sx={{ 
                    color: getFootprintColor(parseFloat(results.total)),
                    ml: 1,
                    fontWeight: 'bold'
                  }}>
                    {results.total} tons CO₂e/year
                  </Box>
                </Typography>
                
                <Card variant="outlined" sx={{ mb: 4 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Breakdown by Category
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" gutterBottom>
                          <DirectionsCar fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Transportation
                        </Typography>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {results.breakdown.transport} tons
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(results.breakdown.transport / results.total) * 100}
                          color="primary"
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" gutterBottom>
                          <Home fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Home Energy
                        </Typography>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {results.breakdown.home} tons
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(results.breakdown.home / results.total) * 100}
                          color="primary"
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" gutterBottom>
                          <RestaurantMenu fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Diet
                        </Typography>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {results.breakdown.diet} tons
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(results.breakdown.diet / results.total) * 100}
                          color="primary"
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          <ShoppingBag fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Lifestyle
                        </Typography>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {results.breakdown.lifestyle} tons
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(results.breakdown.lifestyle / results.total) * 100}
                          color="primary"
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          <Recycling fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Waste
                        </Typography>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {results.breakdown.waste} tons
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(results.breakdown.waste / results.total) * 100}
                          color="primary"
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                
                <Card variant="outlined" sx={{ mb: 4 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      How You Compare
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" gutterBottom>
                          Global Average (4.7 tons)
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(100, parseFloat(results.comparison.world))}
                            color={parseFloat(results.comparison.world) > 100 ? "error" : "success"}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2" sx={{ ml: 1, minWidth: '40px' }}>
                            {results.comparison.world}%
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" gutterBottom>
                          US Average (16 tons)
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(100, parseFloat(results.comparison.us))}
                            color={parseFloat(results.comparison.us) > 100 ? "error" : "success"}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2" sx={{ ml: 1, minWidth: '40px' }}>
                            {results.comparison.us}%
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" gutterBottom>
                          European Average (7.8 tons)
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(100, parseFloat(results.comparison.europe))}
                            color={parseFloat(results.comparison.europe) > 100 ? "error" : "success"}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2" sx={{ ml: 1, minWidth: '40px' }}>
                            {results.comparison.europe}%
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          India Average (2 tons)
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(100, parseFloat(results.comparison.india))}
                            color={parseFloat(results.comparison.india) > 100 ? "error" : "success"}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2" sx={{ ml: 1, minWidth: '40px' }}>
                            {results.comparison.india}%
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                          Sustainable Target (2 tons)
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(100, parseFloat(results.comparison.sustainable))}
                            color={parseFloat(results.comparison.sustainable) > 100 ? "error" : "success"}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2" sx={{ ml: 1, minWidth: '40px' }}>
                            {results.comparison.sustainable}%
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Ghibli-Inspired Tips to Reduce Your Carbon Footprint
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, height: '100%' }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Transportation
                          </Typography>
                          <Typography variant="body2" paragraph>
                            &quot;Take the train like Chihiro in Spirited Away. Embrace public transportation and reduce flight frequency.&quot;
                          </Typography>
                          <Typography variant="body2">
                            • Consider biking or walking for short trips
                            <br />
                            • Use public transport when possible
                            <br />
                            • Choose rail over air travel when feasible
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, height: '100%' }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Home & Energy
                          </Typography>
                          <Typography variant="body2" paragraph>
                            &quot;Live simply like Mei and Satsuki in My Neighbor Totoro. Reduce your energy use and connect with nature.&quot;
                          </Typography>
                          <Typography variant="body2">
                            • Install energy-efficient appliances
                            <br />
                            • Use natural ventilation when possible
                            <br />
                            • Consider renewable energy sources
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, height: '100%' }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Diet & Consumption
                          </Typography>
                          <Typography variant="body2" paragraph>
                            &quot;Eat like in Princess Mononoke &ndash; local, plant-based, and with respect for the forest spirits.&quot;
                          </Typography>
                          <Typography variant="body2">
                            • Reduce meat consumption
                            <br />
                            • Buy local and seasonal produce
                            <br />
                            • Minimize food waste
                            <br />
                            • Choose sustainable products
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </>
            )}
          </Box>
        );
      
      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={ghibliTheme}>
      <Container  sx={{ 
    py: 4, 
    bgcolor: '#F8DCDA', // Ensure this pink color is consistent
    minHeight: '100vh', // Make sure it covers the full viewport height
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }}>
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'relative', 
            overflow: 'hidden',
            mb: 4,
            borderRadius: 4,
            backgroundColor: '#FCFFE0',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              GhibliClimate
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: 'text.secondary' }}>
              Carbon Footprint Calculator
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', mb: 2 }}>
              Inspired by the environmental themes in Studio Ghibli films, this calculator helps you understand your carbon impact and find harmony with nature. Complete all sections to get your personalized results.
            </Typography>
          </Box>
        </Paper>

        <Paper 
          elevation={3} 
          sx={{ 
            position: 'relative', 
            overflow: 'hidden',
            borderRadius: 4,
            backgroundColor: '#FCFFE0',
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel sx={{ pt: 3, pb: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box>
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ChevronLeft />}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button 
                    onClick={handleReset}
                    variant="outlined"
                    color="primary"
                  >
                    Recalculate
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    endIcon={<ChevronRight />}
                  >
                    {activeStep === steps.length - 2 ? 'Calculate' : 'Next'}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
        
        <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body2">
            GhibliClimate © {new Date().getFullYear()} | Inspired by Studio Ghibli&apos;s environmental themes
          </Typography>
          <Typography variant="caption" display="block">
            Carbon calculations are approximate and based on average emission factors
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default GhibliClimateCalculator;