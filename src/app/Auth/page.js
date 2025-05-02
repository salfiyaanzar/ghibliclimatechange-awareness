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
  Button,
  Divider,
  ThemeProvider,
  createTheme,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { Lock, PersonAdd } from '@mui/icons-material';

// Reuse the same Ghibli-inspired theme
const ghibliTheme = createTheme({
  palette: {
    primary: {
      main: '#1A4D2E', // Forest green
      dark: '#2E7D32',
      light: '#81C784',
      contrastText: '#F8DCDA',
    },
    secondary: {
      main: '#64B5F6', // Sky blue
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
  },
  typography: {
    fontFamily: "'Quicksand', 'Roboto', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h4: {
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

const BACKEND_URL = 'https://ghibliclimatechange-awareness.onrender.com';

function GhibliAuthPage() {
  const [tabValue, setTabValue] = useState(0); // 0 for Login, 1 for Register
  const [formData, setFormData] = useState({
    loginEmail: '',
    loginPassword: '',
    registerFullName: '',  // Changed from registerName to registerFullName
    registerEmail: '',
    registerPassword: '',
    registerConfirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({ checked: false, available: false });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Check if the API server is running
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Use a simple HEAD request to check if the server is responding
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch(`${BACKEND_URL}`, {
          method: 'HEAD',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        setApiStatus({ checked: true, available: response.ok });
      } catch (error) {
        console.log('API check error:', error);
        setApiStatus({ checked: true, available: false });
      }
    };
    
    checkApiStatus();
  }, []);

  // Handle tab change between Login and Register
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Mock functionality for development if API is not available
  const handleMockAuth = (type) => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      if (type === 'login') {
        // Simulate successful login
        window.location.href = 'http://localhost:3000/HomePage';
      } else {
        // Simulate successful registration
        setSnackbar({
          open: true,
          message: 'Registration successful! Please log in.',
          severity: 'success'
        });
        
        // Clear registration form
        setFormData({
          ...formData,
          registerFullName: '',
          registerEmail: '',
          registerPassword: '',
          registerConfirmPassword: '',
        });
        
        // Switch to login tab
        setTabValue(0);
      }
      setIsLoading(false);
    }, 1500);
  };

  // Handle form submission with API calls
  const handleSubmit = async (event, type) => {
    event.preventDefault();
    setIsLoading(true);
    
    // If API is not available, use mock functionality
    if (!apiStatus.available) {
      handleMockAuth(type);
      return;
    }
    
    try {
      if (type === 'login') {
        // Login API call
        const response = await fetch(`${BACKEND_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.loginEmail,
            password: formData.loginPassword,
          }),
          // Add credentials to handle cookies if needed
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Store the token in localStorage
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
          
          // Redirect to dashboard on successful login
          window.location.href = 'http://localhost:3000/HomePage';
        } else {
          // Display error message
          setSnackbar({
            open: true,
            message: data.error || 'Login failed. Please check your credentials.',
            severity: 'error'
          });
        }
      } else {
        // Password validation
        if (formData.registerPassword !== formData.registerConfirmPassword) {
          setSnackbar({
            open: true,
            message: 'Passwords do not match',
            severity: 'error'
          });
          setIsLoading(false);
          return;
        }
        
        // Register API call
        const response = await fetch(`${BACKEND_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.registerFullName,  // Changed to match backend expectation
            email: formData.registerEmail,
            password: formData.registerPassword,
          }),
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Show success message and switch to login tab
          setSnackbar({
            open: true,
            message: 'Registration successful! Please log in.',
            severity: 'success'
          });
          
          // Clear registration form
          setFormData({
            ...formData,
            registerFullName: '',
            registerEmail: '',
            registerPassword: '',
            registerConfirmPassword: '',
          });
          
          // Switch to login tab
          setTabValue(0);
        } else {
          // Display error message
          setSnackbar({
            open: true,
            message: data.error || 'Registration failed. Please try again.',
            severity: 'error'
          });
        }
      }
    } catch (error) {
      // Handle network errors
      console.error('Auth error:', error);
      setSnackbar({
        open: true,
        message: `Connection error: ${error.message || 'Server may be offline'}. Please try again later.`,
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={ghibliTheme}>
      <Box
        sx={{
          bgcolor: '#F8DCDA',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          {!apiStatus.checked ? (
            // Loading state while checking API
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Connecting to server...</Typography>
            </Box>
          ) : (
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                backgroundColor: '#FCFFE0',
                overflow: 'hidden',
              }}
            >
              {/* API Status Banner */}
              {!apiStatus.available && (
                <Alert severity="warning" sx={{ borderRadius: 0 }}>
                  Server connection unavailable. Running in development mode.
                </Alert>
              )}
            
              {/* Header */}
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{ color: 'primary.main', fontWeight: 'bold' }}
                >
                  GhibliClimate
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Connect with nature and track your carbon footprint
                </Typography>
              </Box>

              {/* Tabs for Login/Register */}
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
                sx={{
                  bgcolor: 'background.paper',
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Tab
                  icon={<Lock fontSize="small" />}
                  iconPosition="start"
                  label="Login"
                  sx={{ fontWeight: 600 }}
                />
                <Tab
                  icon={<PersonAdd fontSize="small" />}
                  iconPosition="start"
                  label="Register"
                  sx={{ fontWeight: 600 }}
                />
              </Tabs>

              {/* Form Content */}
              <Box sx={{ p: 4 }}>
                {tabValue === 0 ? (
                  // Login Form
                  <Box
                    component="form"
                    onSubmit={(e) => handleSubmit(e, 'login')}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.loginEmail}
                      onChange={(e) => handleChange('loginEmail', e.target.value)}
                      required
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      value={formData.loginPassword}
                      onChange={(e) => handleChange('loginPassword', e.target.value)}
                      required
                      margin="normal"
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </Box>
                ) : (
                  // Register Form
                  <Box
                    component="form"
                    onSubmit={(e) => handleSubmit(e, 'register')}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    <TextField
                      fullWidth
                      label="Full Name"
                      type="text"
                      value={formData.registerFullName}
                      onChange={(e) => handleChange('registerFullName', e.target.value)}
                      required
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.registerEmail}
                      onChange={(e) => handleChange('registerEmail', e.target.value)}
                      required
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      value={formData.registerPassword}
                      onChange={(e) =>
                        handleChange('registerPassword', e.target.value)
                      }
                      required
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      type="password"
                      value={formData.registerConfirmPassword}
                      onChange={(e) =>
                        handleChange('registerConfirmPassword', e.target.value)
                      }
                      required
                      margin="normal"
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Footer */}
              <Divider />
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  GhibliClimate © {new Date().getFullYear()} | Inspired by Studio
                  Ghibli's environmental themes
                </Typography>
              </Box>
            </Paper>
          )}
        </Container>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default GhibliAuthPage;