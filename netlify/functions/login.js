// netlify/functions/login.js
// Netlify serverless function for User Login with direct Firebase connection
// Enforces Single Source of Truth: No points sent from the client can override the backend.

const admin = require('firebase-admin');
const { initializeApp: serverInitApp, getApp: serverGetApp } = require('firebase/app');
const { getFirestore: serverGetFirestore, doc: serverDoc, getDoc: serverGetDoc, setDoc: serverSetDoc } = require('firebase/firestore');

// Load or fallback Firebase configuration (For Web SDK fallback inside sandbox preview)
let firebaseConfig;
try {
  firebaseConfig = require('../../firebase-applet-config.json');
} catch (e) {
  firebaseConfig = {
    projectId: "gen-lang-client-0620333157",
    appId: "1:756396501743:web:dac548a277b43ecba5491a",
    apiKey: "AIzaSyAzPy-BW8-Cfa9-tG6OWpSQerA49ex2fPE",
    authDomain: "gen-lang-client-0620333157.firebaseapp.com",
    firestoreDatabaseId: "ai-studio-56ad2f00-41c5-4cb8-a9c0-f06930931873"
  };
}

exports.handler = async (event, context) => {
  // CORS headers setup
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const requestData = JSON.parse(event.body || '{}');
    const { userId, email } = requestData;

    const targetEmail = (email || '').toLowerCase().trim();
    if (!targetEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'العنوان البريدي مطلوب.' })
      };
    }

    const targetUserId = userId || `vanilla_${targetEmail}`;

    // -------------------------------------------------------------------------
    // OPTION A: Using Firebase Admin SDK (Requested in environment)
    // -------------------------------------------------------------------------
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
      console.log("Using Firebase Admin SDK for login handler...");
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          })
        });
      }
      const db = admin.firestore();
      const userRef = db.collection('users').doc(targetUserId);
      const docSnap = await userRef.get();

      if (docSnap.exists) {
        // ✅ USER EXISTS (Old member): Return real data without any point override
        const userData = docSnap.data();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            message: "Login successful", 
            user: {
              ...userData,
              email: userData.email || targetEmail,
              points: typeof userData.points === 'number' ? userData.points : 1000
            } 
          })
        };
      } else {
        // 🆕 NEW USER: Create account with exactly 1000 welcome points
        const newUser = {
          email: targetEmail,
          displayName: targetEmail.split('@')[0],
          points: 1000,
          createdAt: new Date().toISOString()
        };
        
        await userRef.set(newUser);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ 
            message: "User created", 
            user: newUser 
          })
        };
      }
    }

    // -------------------------------------------------------------------------
    // OPTION B: Web SDK Fallback (Ensures Sandbox Preview keeps working locally)
    // -------------------------------------------------------------------------
    else {
      console.log("Using Web SDK fallback for login handler...");
      let fbApp;
      try {
        fbApp = serverGetApp('netlify-login-fallback');
      } catch (e) {
        fbApp = serverInitApp(firebaseConfig, 'netlify-login-fallback');
      }
      const firestoreDb = serverGetFirestore(fbApp, firebaseConfig.firestoreDatabaseId);

      const userDocRef = serverDoc(firestoreDb, 'users', targetUserId);
      const userDocSnapshot = await serverGetDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: "Login successful",
            user: {
              ...userData,
              email: userData.email || targetEmail,
              points: typeof userData.points === 'number' ? userData.points : 1000
            }
          })
        };
      } else {
        const newUser = {
          email: targetEmail,
          displayName: targetEmail.split('@')[0],
          points: 1000,
          createdAt: new Date().toISOString()
        };

        await serverSetDoc(userDocRef, newUser);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            message: "User created",
            user: newUser
          })
        };
      }
    }

  } catch (error) {
    console.error('Error in login Netlify Function:', error);
    return { 
      statusCode: 500, 
      headers,
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
