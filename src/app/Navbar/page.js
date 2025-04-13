'use client';
import * as React from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLoginClick = () => {
    router.push('/Auth');
  };

  const navItems = ['Home', 'About Us', 'Contact Us', 'Login'];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontFamily: "'Comic Sans MS', cursive" }}>
        GhibliClimate
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton 
              sx={{ textAlign: 'center' }}
              onClick={item === 'Login' ? handleLoginClick : undefined}
            >
              <ListItemText 
                primary={item} 
                primaryTypographyProps={{
                  fontFamily: "'Comic Sans MS', cursive"
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: '#FCFFE0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo - Left Side */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* SVG Logo */}
            <Box 
              component="div" 
              sx={{ 
                mr: 1,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 60 60" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Earth Circle */}
                <circle cx="30" cy="30" r="28" fill="#B7CFA9" stroke="#2C3639" strokeWidth="2" />
                
                {/* Totoro-like ears */}
                <path d="M20 10C15 5 10 15 15 18" stroke="#2C3639" strokeWidth="2" strokeLinecap="round" />
                <path d="M40 10C45 5 50 15 45 18" stroke="#2C3639" strokeWidth="2" strokeLinecap="round" />
                
                {/* Tree silhouette */}
                <path d="M30 15V45" stroke="#2C3639" strokeWidth="2" />
                <path d="M22 25C25 18 35 18 38 25" stroke="#2C3639" strokeWidth="2" fill="#B7CFA9" />
                <path d="M20 32C25 22 35 22 40 32" stroke="#2C3639" strokeWidth="2" fill="#B7CFA9" />
                <path d="M18 40C25 25 35 25 42 40" stroke="#2C3639" strokeWidth="2" fill="#B7CFA9" />

                {/* Leaf on top */}
                <path d="M30 5C25 8 35 8 30 5" stroke="#2C3639" strokeWidth="1.5" fill="#B7CFA9" />
              </svg>
            </Box>
            
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', sm: 'flex' },
                fontFamily: "'Comic Sans MS', cursive",
                fontWeight: 700,
                color: '#1A4D2E',
                textDecoration: 'none',
              }}
            >
              GhibliClimate
            </Typography>
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Mobile Brand Name */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              display: { xs: 'flex', sm: 'none' },
              flexGrow: 1,
              fontFamily: "'Comic Sans MS', cursive",
              fontWeight: 700,
              color: '#1A4D2E',
              textDecoration: 'none',
            }}
          >
            GhibliClimate
          </Typography>

          {/* Navigation Links - Right Side */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <Button 
                key={item} 
                sx={{ 
                  my: 2, 
                  color: '#1A4D2E', 
                  display: 'block',
                  mx: 1,
                  px: 2,
                  fontFamily: "'Comic Sans MS', cursive",
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
                onClick={item === 'Login' ? handleLoginClick : undefined}
              >
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}