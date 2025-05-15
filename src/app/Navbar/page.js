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
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const [userData, setUserData] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    // Fetch user profile data when component mounts
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // No token, user is not logged in
          setUserData(null);
          return;
        }

        const response = await fetch(`${BACKEND_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // Handle unauthorized or other errors
          if (response.status === 401) {
            localStorage.removeItem('token');
            setUserData(null);
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        // Network error, CORS error, or other fetch failure
        console.error('Error fetching user profile:', error);
        setUserData(null); // Optionally clear user data
      }
    };

    fetchUserProfile();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Use relative path for navigation
        router.push('/Auth');
        return;
      }

      // Call the logout API
      const response = await fetch(`${BACKEND_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove token from local storage
        localStorage.removeItem('token');
        // Redirect to Auth page with relative path
        router.push('/Auth');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback if router fails
      try {
        localStorage.removeItem('token');
        window.location.href = '/Auth';
      } catch (e) {
        console.error('Fallback navigation failed:', e);
      }
    } finally {
      handleClose(); // Close the menu regardless of outcome
    }
  };

  // Modified nav items - removed 'Login'
  const navItems = ['Home', 'About Us'];

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
        {userData ? (
          <>
            <ListItem disablePadding>
              <ListItemButton 
                sx={{ textAlign: 'center' }}
                onClick={handleProfileClick}
              >
                <ListItemText 
                  primary={userData.fullName} 
                  primaryTypographyProps={{
                    fontFamily: "'Comic Sans MS', cursive",
                    fontWeight: 'bold'
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                sx={{ textAlign: 'center', color: 'crimson' }}
                onClick={handleLogout}
              >
                <LogoutIcon sx={{ mr: 1, fontSize: 18 }} />
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{
                    fontFamily: "'Comic Sans MS', cursive",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton 
              sx={{ textAlign: 'center' }}
              onClick={() => router.push('/Auth')}
            >
              <ListItemText 
                primary="Login" 
                primaryTypographyProps={{
                  fontFamily: "'Comic Sans MS', cursive"
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
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
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
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
              >
                {item}
              </Button>
            ))}
            
            {/* User Profile Display */}
            {userData ? (
              <>
                <Button
                  id="profile-button"
                  aria-controls={open ? 'profile-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleProfileClick}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    ml: 2,
                    backgroundColor: 'rgba(183, 207, 169, 0.3)',
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(183, 207, 169, 0.5)',
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      mr: 1, 
                      bgcolor: '#1A4D2E',
                      fontSize: '14px'
                    }}
                  >
                    {userData.fullName.charAt(0)}
                  </Avatar>
                  <Typography
                    sx={{
                      fontFamily: "'Comic Sans MS', cursive",
                      color: '#1A4D2E',
                      fontWeight: 600
                    }}
                  >
                    {userData.fullName}
                  </Typography>
                </Button>
                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'profile-button',
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      borderRadius: 2,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{ 
                      fontFamily: "'Comic Sans MS', cursive",
                      display: 'flex',
                      alignItems: 'center',
                      minWidth: '150px'
                    }}
                  >
                    <LogoutIcon sx={{ mr: 1, fontSize: 20, color: '#D04848' }} />
                    <Typography color="#D04848">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button 
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
                onClick={() => router.push('/Auth')}
              >
                Login
              </Button>
            )}
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