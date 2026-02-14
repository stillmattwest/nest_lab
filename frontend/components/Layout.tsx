'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar className="gap-2">
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Nest Lab Blog
          </Typography>
          <Button
            color="inherit"
            component={Link}
            href="/"
            variant={pathname === '/' ? 'outlined' : 'text'}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            href="/blog"
            variant={pathname === '/blog' || pathname?.startsWith('/blog/') ? 'outlined' : 'text'}
          >
            Blog
          </Button>
          {!loading && (
            <>
              {user ? (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    href="/blog/new"
                    variant="text"
                  >
                    New post
                  </Button>
                  <IconButton
                    color="inherit"
                    onClick={handleMenuOpen}
                    aria-label="account menu"
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    <Typography variant="body2">
                      {user.name?.split(' ')[0] ?? user.email}
                    </Typography>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} href="/login">
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    href="/register"
                    variant="outlined"
                  >
                    Register
                  </Button>
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" className="py-8">
        {children}
      </Container>
    </>
  );
}
