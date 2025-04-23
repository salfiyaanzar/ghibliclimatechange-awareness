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
  CircularProgress
} from '@mui/material';
import Navbar from '../Navbar/page';
import bgimage from '../../assets/hero3.jpg';

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
    <Navbar />
    {/* Hero Section - Keeping the same size as before */}
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
          Earth’s Future: Act Now
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
        
        {/* Earth Day Countdown Section - Keeping as is */}
        <Paper 
          elevation={3}
          sx={{
            p: 5,
            backgroundColor: '#FCFFE0',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #F1C8CB',
            maxWidth: '700px',
            mx: 'auto',
            textAlign: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '30%',
              background: 'linear-gradient(0deg, rgba(241, 200, 203, 0.2) 0%, rgba(255, 255, 255, 0) 100%)'
            }
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ 
              color: '#1A4D2E',
              fontWeight: 600
            }}
          >
            Earth Day Countdown
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              my: 4
            }}
          >
            <CircularProgress 
              variant="determinate" 
              value={100 - (daysToEarthDay / 365 * 100)} 
              size={160}
              thickness={5}
              sx={{ color: '#1A4D2E' }}
            />
            <Box
              sx={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h2"
                component="div"
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#1A4D2E'
                }}
              >
                {daysToEarthDay}
              </Typography>
            </Box>
          </Box>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mt: 2,
              color: '#1A4D2E'
            }}
          >
            Days until we celebrate our beautiful planet
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              mt: 3,
              fontStyle: 'italic',
              color: '#1A4D2E'
            }}
          >
            "The earth is a garden, we are all its caretakers"
          </Typography>
        </Paper>

        {/* Call to Action Section - Keeping as is */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            backgroundColor: '#FCFFE0',
            borderRadius: 3,
            textAlign: 'center',
            position: 'relative'
          }}
        >
          <Typography 
            variant="h5" 
            component="h3"
            sx={{ 
              mb: 3,
              color: '#1A4D2E',
              fontWeight: 600
            }}
          >
            Join Our Climate Journey
          </Typography>
          
          <Typography 
            variant="body1" 
            paragraph
            sx={{ color: '#1A4D2E' }}
          >
            Like the heroes in Ghibli films who protect their magical worlds, together we can safeguard our home.
          </Typography>
          
          <Button 
            variant="contained" 
            sx={{
              backgroundColor: '#1A4D2E',
              '&:hover': {
                backgroundColor: '#2C6E44',
              },
              color: '#FCFFE0',
              py: 1.5,
              px: 5,
              fontSize: '1rem',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Learn More
          </Button>
        </Box>
      </Container>
    </Box>
    </>
  );
}