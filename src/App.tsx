import React, { useEffect, useState } from 'react';
import './App.css';
import { Outlet, Route, Routes } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import Login from './components/Login';
import Logout from './components/Logout';
import { AppBar, Box, Button, Paper, Popover, Toolbar, Typography } from '@mui/material';

function App() {
  const config = {
    apiKey: process.env.REACT_APP_KEY,
    authDomain: process.env.REACT_APP_DOMAIN,
  };
  firebase.initializeApp(config);

  // Configure FirebaseUI.
  const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/home',
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  };

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget);
  };

  const closePopover = () => {
    setAnchor(null);
  };

  const logout = () => {
    firebase.auth().signOut();
  };

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  const user = firebase.auth().currentUser;

  const createToken = async () => {
    const user = firebase.auth().currentUser;
    const token = user && (await user.getIdToken());
    const payloadHeader = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    return payloadHeader;
  };

  useEffect(() => {
    createToken().then((headers) => {
      fetch('/test', {
        headers,
      });
    });
  });

  return (
    <Box>
      <AppBar>
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }} variant="h6">
            Leslie Quotes
          </Typography>
          <Button onClick={!isSignedIn ? openPopover : logout} variant="text" color="inherit">
            {!isSignedIn ? 'Login' : `Hi, ${user?.displayName?.split(' ')[0]}! (sign out)`}
          </Button>
          <Popover
            open={Boolean(anchor) && !isSignedIn}
            anchorEl={anchor}
            onClose={closePopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box sx={{ minWidth: 360, minHeight: 215 }}>
              <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </Box>
          </Popover>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );

  // if (!isSignedIn) {
  //   return (
  //     <div className="App">
  //       <div id="firebaseui-auth-container" />
  //       <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  //       <Outlet />
  //     </div>
  //   );
  // }
  // return (
  //   <div>
  //     <h1>My App</h1>
  //     <p>Welcome {firebase.auth().currentUser?.displayName}! You are now signed-in!</p>
  //     <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
  //     <Outlet />
  //   </div>
  // );
}

export default App;
