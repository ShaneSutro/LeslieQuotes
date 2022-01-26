import React, { useEffect, useState } from 'react';
import './App.css';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

function App() {
  useEffect(() => {
    fetch('/api/v1').then((response) => console.log(response));
  }, []);

  const config = {
    apiKey: process.env.REACT_APP_KEY,
    authDomain: process.env.REACT_APP_DOMAIN,
  };
  firebase.initializeApp(config);

  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/signedIn',
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  };

  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  const user = firebase.auth().currentUser;
  user?.getIdToken().then((token) => console.log(token));

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

  if (!isSignedIn) {
    return (
      <div className="App">
        <div id="firebaseui-auth-container" />
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  }
  return (
    <div>
      <h1>My App</h1>
      <p>Welcome {JSON.stringify(firebase.auth().currentUser)}! You are now signed-in!</p>
      <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
    </div>
  );
}

export default App;
