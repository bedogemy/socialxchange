// netlify/functions/transaction.js
// Netlify serverless function to securely execute account operations (Point Deductions)
// Implements Double-Validation to prevent clients from cheating or creating negative point balances

const { initializeApp, getApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

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
  // CORS setup
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    const { email, serviceId, cost } = JSON.parse(event.body || '{}');

    if (!email || !serviceId || cost === undefined || cost <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'بيانات الطلب غير مكتملة أو غير صالحة.' })
      };
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Initialize Firebase
    let app;
    try {
      app = getApp('netlify-transaction');
    } catch (e) {
      app = initializeApp(firebaseConfig, 'netlify-transaction');
    }
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

    // Fetch the user document from the DB first (Server-side single source of absolute truth)
    const userDocRef = doc(db, 'users', `vanilla_${normalizedEmail}`);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'المستخدم غير موجود بقاعدة البيانات.' })
      };
    }

    const userData = userSnapshot.data();
    const currentPoints = userData.points || 0;

    // Server-Side Validation: Ensure the user actually has enough points!
    if (currentPoints < cost) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: `عذراً، رصيدك غير كافٍ. تحتاج إلى ${cost} نقطة بينما رصيدك الحالي هو ${currentPoints} نقطة.`,
          currentPoints
        })
      };
    }

    // Perform safe deduction
    const remainingPoints = currentPoints - cost;
    
    // Update user document with the new balance
    const updatedUser = {
      ...userData,
      points: remainingPoints
    };
    await setDoc(userDocRef, updatedUser);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `تم تنفيذ خدمة "${serviceId}" بنجاح! تم خصم ${cost} نقطة.`,
        newPoints: remainingPoints
      })
    };

  } catch (error) {
    console.error('Error in transaction Netlify Function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'حدث خطأ غير متوقع أثناء معالجة العملية: ' + error.message })
    };
  }
};
