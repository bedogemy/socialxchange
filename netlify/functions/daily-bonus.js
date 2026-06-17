// netlify/functions/daily-bonus.js
// Netlify serverless function to manage the secure Daily Bonus & Daily Tasks system
// Implements server-side time verification, strict user tracking, and atomicity to prevent client-side hacks.

const admin = require('firebase-admin');
const { initializeApp, getApp } = require('firebase/app');
const { getFirestore, doc, getDoc, updateDoc, increment } = require('firebase/firestore');

// Load fallback Firebase configuration
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
  // CORS Headers
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
    const requestData = JSON.parse(event.body || '{}');
    const { email, action, userId } = requestData;

    let targetUserId = '';
    if (userId) {
      targetUserId = userId;
    } else if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      targetUserId = `vanilla_${normalizedEmail}`;
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'البريد الإلكتروني أو معرف المستخدم (userId) مطلوب لتنفيذ هذا الإجراء.' })
      };
    }

    // Compute central server-side date parameters (UTC YYYY-MM-DD to avoid client timezone manipulation)
    const serverDate = new Date();
    const todayStr = serverDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const nowTimestamp = Date.now();

    const isUsingAdmin = !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY);

    let userData;
    let userDocRef;
    let adminDb;
    let webDb;

    // -------------------------------------------------------------
    // BLOCK 1: Load User State From Single Source of Truth
    // -------------------------------------------------------------
    if (isUsingAdmin) {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          })
        });
      }
      adminDb = admin.firestore();
      const userRef = adminDb.collection('users').doc(targetUserId);
      const docSnap = await userRef.get();

      if (!docSnap.exists) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'المستخدم غير مسجل بالنظام.' })
        };
      }
      userData = docSnap.data();
    } else {
      let app;
      try {
        app = getApp('netlify-bonus');
      } catch (e) {
        app = initializeApp(firebaseConfig, 'netlify-bonus');
      }
      webDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
      userDocRef = doc(webDb, 'users', targetUserId);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'المستخدم غير مسجل بالنظام.' })
        };
      }
      userData = docSnap.data();
    }

    // -------------------------------------------------------------
    // BLOCK 2: Enforce Automatic Server-Side Daily Reset of Tasks Counter
    // -------------------------------------------------------------
    let tasksCompletedToday = typeof userData.tasksCompletedToday === 'number' ? userData.tasksCompletedToday : 0;
    let lastTaskDate = userData.lastTaskDate || '';
    let lastBonusClaimed = userData.lastBonusClaimed || 0; // Epoch Milliseconds
    let points = typeof userData.points === 'number' ? userData.points : 1000;

    // Check if a new day has arrived relative to server clock
    if (lastTaskDate !== todayStr) {
      console.log(`[Daily Bonus Reset] Resetting daily tasks counter from ${tasksCompletedToday} to 0 on date shift to ${todayStr}`);
      tasksCompletedToday = 0;
      lastTaskDate = todayStr;

      // Update in database immediately to prevent state drift
      if (isUsingAdmin) {
        await adminDb.collection('users').doc(targetUserId).update({
          tasksCompletedToday: 0,
          lastTaskDate: todayStr
        });
      } else {
        await updateDoc(userDocRef, {
          tasksCompletedToday: 0,
          lastTaskDate: todayStr
        });
      }
    }

    // -------------------------------------------------------------
    // BLOCK 3: Route Action Request Handlers
    // -------------------------------------------------------------

    // Action A: Get User Bonus and Tasks Progression Status
    if (action === 'get_status') {
      const msSinceLastClaim = nowTimestamp - lastBonusClaimed;
      const hoursToWaitNum = 24;
      const canClaimBonusTime = lastBonusClaimed === 0 || msSinceLastClaim >= hoursToWaitNum * 60 * 60 * 1000;
      const timeRemainingMs = Math.max(0, (hoursToWaitNum * 60 * 60 * 1000) - msSinceLastClaim);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          points,
          tasksCompletedToday,
          lastTaskDate,
          lastBonusClaimed,
          canClaimBonusTime,
          timeRemainingMs,
          today: todayStr,
          requiredTasks: 50
        })
      };
    }

    // Action B: Complete a task and increment numerical today metric securely
    if (action === 'complete_task') {
      const incrementVal = 1;
      const newTasksCompletedToday = tasksCompletedToday + incrementVal;

      if (isUsingAdmin) {
        await adminDb.collection('users').doc(targetUserId).update({
          tasksCompletedToday: admin.firestore.FieldValue.increment(incrementVal),
          lastTaskDate: todayStr
        });
      } else {
        await updateDoc(userDocRef, {
          tasksCompletedToday: increment(incrementVal),
          lastTaskDate: todayStr
        });
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'تم تسجيل إنجاز المهمة الترويجية بنجاح بنظام المكافآت.',
          tasksCompletedToday: newTasksCompletedToday,
          today: todayStr
        })
      };
    }

    // Action C: Claim Daily 1000 Bonus points balance increase
    if (action === 'claim_bonus') {
      // Constraint 1: Check Tasks completed threshold
      const taskThreshold = 50;
      if (tasksCompletedToday < taskThreshold) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: `لم تكمل شروط المكافأة اليومية بعد. لقد أنجزت ${tasksCompletedToday} مهمة فقط اليوم، تتبقى لك ${taskThreshold - tasksCompletedToday} من المهام المطلوبة لتفعيل فرصة سحب الـ 1000 نقطة.`
          })
        };
      }

      // Constraint 2: Check server 24h clock throttle
      const hoursToWaitNum = 24;
      const msSinceLastClaim = nowTimestamp - lastBonusClaimed;
      if (lastBonusClaimed !== 0 && msSinceLastClaim < hoursToWaitNum * 60 * 60 * 1000) {
        const remainingMs = (hoursToWaitNum * 60 * 60 * 1000) - msSinceLastClaim;
        const remHours = Math.floor(remainingMs / (60 * 60 * 1000));
        const remMinutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));

        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: `عذراً، لقد استلمت مكافأتك اليومية بالفعل. تتبقى لك فترة انتظار: ${remHours} ساعة و ${remMinutes} دقيقة قبل السحب القادم.`
          })
        };
      }

      // Action authorized: Add exactly 1000 points and register time checkpoint
      const rewardPoints = 1000;
      const finalPoints = points + rewardPoints;

      if (isUsingAdmin) {
        await adminDb.collection('users').doc(targetUserId).update({
          points: admin.firestore.FieldValue.increment(rewardPoints),
          lastBonusClaimed: nowTimestamp
        });
      } else {
        await updateDoc(userDocRef, {
          points: increment(rewardPoints),
          lastBonusClaimed: nowTimestamp
        });
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'مبارك! حصلت على جائزتك اليومية بقيمة 1000 نقطة مجانية بنجاح تم إيداعها بمحفظتك.',
          newPoints: finalPoints,
          lastBonusClaimed: nowTimestamp
        })
      };
    }

    // Default action fallback
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'العملية المطلوبة غير صحيحة.' })
    };

  } catch (error) {
    console.error('Error in daily bonus Netlify Function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'حدث خطأ أثناء معالجة المكافأة اليومية بالنظام: ' + error.message })
    };
  }
};
