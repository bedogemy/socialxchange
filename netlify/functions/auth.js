// netlify/functions/auth.js
// Netlify serverless function for Authentication (Signup / Login)
// This file enforces strict user-data security and prevents accidental point overwrites (no overrides on login)

const admin = require('firebase-admin');
const { initializeApp: serverInitApp, getApp: serverGetApp } = require('firebase/app');
const { getFirestore: serverGetFirestore, doc: serverDoc, getDoc: serverGetDoc, setDoc: serverSetDoc } = require('firebase/firestore');

// Load or fallback Firebase configuration
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

exports.handler = async function(event, context) {
  // Setup standard headers for CORS and JSON response
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const requestData = JSON.parse(event.body || '{}');
    const { action, email, password, displayName, userId } = requestData;

    const targetEmail = (email || '').toLowerCase().trim();
    if (!targetEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'العنوان البريدي مطلوب.' })
      };
    }

    const targetUserId = userId || `vanilla_${targetEmail}`;

    // -------------------------------------------------------------
    // OPTION A: Using Firebase Admin SDK (Requested in environment)
    // -------------------------------------------------------------
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
      console.log("Using Firebase Admin SDK for auth handler...");
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
        // ✅ USER EXISTS: Return real data without any point override
        const userData = docSnap.data();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: "Login successful",
            user: {
              email: userData.email,
              displayName: userData.displayName || targetEmail.split('@')[0],
              points: typeof userData.points === 'number' ? userData.points : 1000
            }
          })
        };
      } else {
        // 🆕 NEW USER: Create account with exactly 1000 welcome points
        const defaultPoints = 1000;
        const newUser = {
          email: targetEmail,
          displayName: (displayName || targetEmail.split('@')[0]).trim(),
          password: password || '123456',
          points: defaultPoints,
          createdAt: new Date().toISOString()
        };

        await userRef.set(newUser);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            message: "User created",
            user: {
              email: newUser.email,
              displayName: newUser.displayName,
              points: newUser.points
            }
          })
        };
      }
    }

    // -------------------------------------------------------------
    // OPTION B: Web SDK Fallback (Ensures Sandbox Preview keeps working)
    // -------------------------------------------------------------
    else {
      console.log("Using Web SDK fallback for auth handler...");
      let fbApp;
      try {
        fbApp = serverGetApp('netlify-auth');
      } catch (e) {
        fbApp = serverInitApp(firebaseConfig, 'netlify-auth');
      }
      const firestoreDb = serverGetFirestore(fbApp, firebaseConfig.firestoreDatabaseId);

      const userDocRef = serverDoc(firestoreDb, 'users', targetUserId);
      const userDocSnapshot = await serverGetDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        if (action === 'login' || !action) {
          // Check password if available (only in Web SDK development)
          if (password && userData.password && userData.password !== password) {
            return {
              statusCode: 401,
              headers,
              body: JSON.stringify({ error: 'كلمة المرور المدخلة غير صحيحة.' })
            };
          }
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'تم تسجيل الدخول بنجاح.',
            user: {
              email: userData.email,
              displayName: userData.displayName || targetEmail.split('@')[0],
              points: typeof userData.points === 'number' ? userData.points : 1000
            }
          })
        };
      } else {
        // If they requested a strict login only and user doesn't exist
        if (action === 'login') {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'هذا البريد الإلكتروني غير مسجل. يرجى إنشاء حساب جديد أولاً.' })
          };
        }

        // Otherwise auto-create / signup
        const defaultPoints = 1000;
        const newUser = {
          email: targetEmail,
          displayName: (displayName || targetEmail.split('@')[0]).trim(),
          password: password || '123456',
          points: defaultPoints,
          createdAt: Date.now()
        };

        await serverSetDoc(userDocRef, newUser);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'تم تسجيل الحساب بنجاح وتم منحك 1000 نقطة ترحيبية!',
            user: {
              email: newUser.email,
              displayName: newUser.displayName,
              points: newUser.points
            }
          })
        };
      }
    }

  } catch (error) {
    console.error('Error in auth Netlify Function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'فشل النظام في معالجة المصادقة: ' + error.message })
    };
  }
};
