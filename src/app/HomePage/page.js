'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Container, 
  Grid, 
  Paper,
  CircularProgress,
  AppBar,
  Toolbar
} from '@mui/material';
import Navbar from '../Navbar/page';
import bgimage from '../../assets/hero3.jpg';
import globe from '../../assets/worldmap.jpeg';


export default function Home() {
  // State for Earth Day countdown
  const [daysToEarthDay, setDaysToEarthDay] = useState(0);
  
  // Calculate days until next Earth Day (April 22nd)
  useEffect(() => {
    const calculateDaysToEarthDay = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let earthDay = new Date(currentYear, 3, 22); // April is month 3 (0-indexed)
      
      // If Earth Day has already passed this year, calculate for next year
      if (now > earthDay) {
        earthDay = new Date(currentYear + 1, 3, 22);
      }
      
      const differenceInTime = earthDay.getTime() - now.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      setDaysToEarthDay(differenceInDays);
    };
    
    calculateDaysToEarthDay();
    // Update the counter every day
    const interval = setInterval(calculateDaysToEarthDay, 86400000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    {/* Fixed Navbar */}
    <AppBar position="fixed" sx={{ 
      backgroundColor: '#fcffe0',
      zIndex: 1000
    }}>
      <Toolbar>
        <Navbar />
      </Toolbar>
    </AppBar>
    <Toolbar /> {/* Spacer for fixed navbar */}
    
    {/* Hero Section */}
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${bgimage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        pb: 8,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(rgba(85, 107, 47, 0.4), rgba(107, 142, 35, 0.4))', // Earthy green mist gradient
          zIndex: 1
        },
        zIndex: 2,
        position: 'relative',
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          textAlign: 'center',
          mt: 8
        }}
      >
        <Typography 
          variant="h1" 
          component="h1"
          sx={{ 
            color: '#FCFFE0',
            fontWeight: 700,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            mb: 3,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
          }}
        >
          Earth&apos;s Future: Act Now
        </Typography>
        
        <Typography 
          variant="h5"
          component="p"
          sx={{ 
            color: '#FCFFE0',
            mb: 6,
            maxWidth: '800px',
            mx: 'auto',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
          }}
        >
          Helping people work together for a better future by learning about and supporting efforts to protect the environment.
        </Typography>
        
        <Button 
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#FCFFE0',
            '&:hover': {
              backgroundColor: '#7E8C69',
            },
            color: '#1A4D2E',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: '30px'
          }}
        >
          Learn More
        </Button>
      </Container>
    </Box>
    
    {/* Main Content Section */}
    <Box
      sx={{
        minHeight: '100vh',
        background: '#F8DCDA',
        position: 'relative',
        overflow: 'hidden',
        pt: 8,
        pb: 10
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Section Heading */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              color: '#1A4D2E',
              fontWeight: 700,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              display: 'inline-block'
            }}
          >
            What You Should Know
          </Typography>
        </Box>

        {/* Earth Day Countdown Widget - Redesigned to be smaller and cuter */}
        

        {/* Cards Section - Modified to ensure horizontal alignment */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          gap: 3,
          mb: 8
        }}>
          {/* Carbon Footprint Card */}
          <Card 
            sx={{
              flex: { xs: '1 1 100%', md: '0 1 30%' }, // Reduced width
              maxWidth: { xs: '100%', md: '30%' }, // Limit max width
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#FCFFE0',
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid #F1C8CB',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 5px 10px rgba(0,0,0,0.1)'
              }
            }}
          >
            {/* Card Header with Icon and Title */}
            <Box sx={{ 
              p: 3, 
              pb: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 2
            }}>
              {/* Icon */}
              <Box sx={{ 
                width: 70, 
                height: 70, 
                borderRadius: '50%',
                backgroundColor: 'rgba(26, 77, 46, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CircularProgress 
                  variant="determinate" 
                  value={75} 
                  size={45}
                  thickness={4}
                  sx={{ color: '#1A4D2E' }}
                />
              </Box>
              
              {/* Title */}
              <Typography 
                variant="h6" 
                component="div"
                sx={{ 
                  color: '#1A4D2E',
                  fontWeight: 600,
                  textAlign: 'center',
                  pb: 1
                }}
              >
                Find Your Carbon Footprint
              </Typography>
            </Box>
            
            {/* Card Content */}
            <CardContent sx={{ 
              flexGrow: 1, 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 3,
              pt: 2
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 3, 
                  color: '#1A4D2E',
                  textAlign: 'center'
                }}
              >
                Calculate your impact and get personalized recommendations to reduce your carbon footprint.
              </Typography>
              
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => window.location.href = 'http://localhost:3000/CarbonFootprintCalculator'}
                sx={{
                  backgroundColor: '#1A4D2E',
                  '&:hover': {
                    backgroundColor: '#2C6E44',
                  },
                  color: '#FCFFE0',
                  py: 1,
                  fontSize: '0.9rem',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Calculate Now
              </Button>
            </CardContent>
          </Card>
          
          {/* Climate Action Goals Card */}
          <Card 
            sx={{
              flex: { xs: '1 1 100%', md: '0 1 30%' }, // Reduced width
              maxWidth: { xs: '100%', md: '30%' }, // Limit max width
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#FCFFE0',
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid #F1C8CB',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 5px 10px rgba(0,0,0,0.1)'
              }
            }}
          >
            {/* Card Header with Icon and Title */}
            <Box sx={{ 
              p: 3, 
              pb: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 2
            }}>
              {/* Icon */}
              <Box sx={{ 
                width: 70, 
                height: 70, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <Box 
                  sx={{ 
                    width: '5px',
                    height: '18px',
                    backgroundColor: '#1A4D2E',
                    position: 'absolute',
                    bottom: 0,
                  }}
                />
                <Box 
                  sx={{ 
                    width: '50px',
                    height: '35px',
                    backgroundColor: '#1A4D2E',
                    borderRadius: '50px 50px 0 0',
                    position: 'absolute',
                    bottom: '18px',
                  }}
                />
              </Box>
              
              {/* Title */}
              <Typography 
                variant="h6" 
                component="div"
                
                sx={{ 
                  color: '#1A4D2E',
                  fontWeight: 600,
                  textAlign: 'center',
                  pb: 1
                }}
              >
                Your Climate Action Goals
              </Typography>
            </Box>
            
            {/* Card Content */}
            <CardContent sx={{ 
              flexGrow: 1, 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 3,
              pt: 2
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 3, 
                  color: '#1A4D2E',
                  textAlign: 'center'
                }}
              >
                Set personalized goals and track your progress. Join others in meaningful actions for environmental change.
              </Typography>
              
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => window.location.href = 'http://localhost:3000/ClimateActionGoals'}
                sx={{
                  backgroundColor: '#1A4D2E',
                  '&:hover': {
                    backgroundColor: '#2C6E44',
                  },
                  color: '#FCFFE0',
                  py: 1,
                  fontSize: '0.9rem',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Set Your Goals
              </Button>
            </CardContent>
          </Card>
          
          {/* Climate Change Blog Card */}
          <Card 
            sx={{
              flex: { xs: '1 1 100%', md: '0 1 30%' }, // Reduced width
              maxWidth: { xs: '100%', md: '30%' }, // Limit max width
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#FCFFE0',
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid #F1C8CB',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 5px 10px rgba(0,0,0,0.1)'
              }
            }}
          >
            {/* Card Header with Icon and Title */}
            <Box sx={{ 
              p: 3, 
              pb: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 2
            }}>
              {/* Icon */}
              <Box sx={{ 
                width: 70, 
                height: 70, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Box 
                  sx={{ 
                    width: '35px',
                    height: '45px',
                    backgroundColor: '#1A4D2E',
                    borderRadius: '2px',
                    boxShadow: '3px 3px 0 rgba(0,0,0,0.1)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '8px',
                      left: '4px',
                      right: '4px',
                      height: '2px',
                      backgroundColor: '#FCFFE0'
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '16px',
                      left: '4px',
                      right: '4px',
                      height: '2px',
                      backgroundColor: '#FCFFE0'
                    }
                  }}
                />
              </Box>
              
              {/* Title */}
              <Typography 
                variant="h6" 
                component="div"
                sx={{ 
                  color: '#1A4D2E',
                  fontWeight: 600,
                  textAlign: 'center',
                  pb: 1
                }}
              >
                Climate Change Blog
              </Typography>
            </Box>
            
            {/* Card Content */}
            <CardContent sx={{ 
              flexGrow: 1, 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 3,
              pt: 2
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 3, 
                  color: '#1A4D2E',
                  textAlign: 'center'
                }}
              >
                Stay informed with the latest climate science and tips for sustainable living. Explore articles, videos, and interviews.
              </Typography>
              
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => window.location.href = 'http://localhost:3000/ClimateBlog'}
                sx={{
                  backgroundColor: '#1A4D2E',
                  '&:hover': {
                    backgroundColor: '#2C6E44',
                  },
                  color: '#FCFFE0',
                  py: 1,
                  fontSize: '0.9rem',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Read Articles
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mb: 6
        }}>
        <Card sx={{
          width: '320px',
          bgcolor: '#f5ffef',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          border: '1px solid #e0f2e0',
          p: 3,
          position: 'relative'
        }}>
          {/* Spotify-like icon */}
          <Box sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: '#1ed760',
            width: 24,
            height: 24,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.5 16.65C16.32 16.95 15.95 17.05 15.65 16.87C13.57 15.58 10.9 15.3 7.57 16.08C7.23 16.17 6.88 15.95 6.79 15.61C6.7 15.27 6.92 14.92 7.26 14.83C10.91 13.96 13.89 14.29 16.27 15.75C16.57 15.93 16.68 16.3 16.5 16.65ZM17.61 13.75C17.39 14.13 16.92 14.25 16.55 14.03C14.14 12.54 10.32 12.05 7.09 13.19C6.67 13.33 6.21 13.11 6.07 12.69C5.93 12.27 6.15 11.81 6.57 11.67C10.28 10.38 14.54 10.93 17.33 12.65C17.7 12.87 17.83 13.34 17.61 13.75Z" />
            </svg>
          </Box>
          
          {/* Album art and info section */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: '#e0f2e0', 
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              <Box component="img" 
                src={globe.src} 
                alt="Earth art"
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="caption" sx={{ color: '#006400', fontWeight: 500 }}>
                NOW PLAYING
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#006400', fontWeight: 700, mb: 0.5 }}>
                Earth Day Countdown
              </Typography>
              <Typography variant="body2" sx={{ color: '#006400', fontStyle: 'italic' }}>
                Planet Rhythms
              </Typography>
            </Box>
          </Box>
          
          {/* Countdown display */}
          <Box sx={{ 
            bgcolor: 'rgba(0, 100, 0, 0.05)', 
            borderRadius: 2, 
            p: 2, 
            mb: 2 
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ color: '#006400', fontWeight: 700 }}>
                {daysToEarthDay}
              </Typography>
              <Typography variant="body2" sx={{ color: '#006400' }}>
                days remaining
              </Typography>
            </Box>
            
            {/* Progress bar */}
            <Box sx={{ width: '100%', bgcolor: '#d0e8d0', borderRadius: '4px', height: '6px', mt: 1 }}>
              <Box sx={{ 
                width: `${100 - (daysToEarthDay / 365 * 100)}%`, 
                bgcolor: '#006400', 
                height: '100%', 
                borderRadius: '4px' 
              }} />
            </Box>
          </Box>
          
          {/* Music controls */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ color: '#006400' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 6C5.9 6 5 6.9 5 8V16C5 17.1 5.9 18 7 18H17C18.1 18 19 17.1 19 16V8C19 6.9 18.1 6 17 6H7Z" />
              </svg>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: '#006400' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6H8V18H6V6ZM9.5 12L18 18V6L9.5 12Z" />
                </svg>
              </Box>
              <Box sx={{ 
                color: '#006400', 
                bgcolor: '#d0e8d0', 
                borderRadius: '50%', 
                p: 1,
                display: 'flex'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5V19L19 12L8 5Z" />
                </svg>
              </Box>
              <Box sx={{ color: '#006400' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 18H18V6H16V18ZM6 12L14.5 6V18L6 12Z" />
                </svg>
              </Box>
            </Box>
            
            <Box sx={{ color: '#006400' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17C6 19.21 7.79 21 10 21C12.21 21 14 19.21 14 17V7H18V3H12Z" />
              </svg>
            </Box>
          </Box>
          
          {/* Footer message */}
          <Typography variant="body2" sx={{ 
            color: '#006400', 
            textAlign: 'center', 
            mt: 2, 
            fontStyle: 'italic' 
          }}>
            hug our planet ♥
          </Typography>
        </Card>
      </Box>
    </Box>
    </>
  );
}