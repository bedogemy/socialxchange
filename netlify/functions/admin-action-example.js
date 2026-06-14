// netlify/functions/admin-action-example.js
// هيكل برمجي آمن لحماية لوحة التحكم والتحقق من صلاحيات المسؤولين (Admin Security Verification)

const jwt = require('jsonwebtoken');
const { initializeApp, getApp } = require('firebase/app');
const { getFirestore, doc, getDoc, updateDoc } = require('firebase/firestore');

// تحميل إعدادات Firebase لتمكين الاتصال المباشر بقاعدة البيانات بأمان
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
  // تفعيل هيدرات الاستجابة لـ CORS لتمكين الاستدعاء الآمن من الـ SPA
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  };

  // معالجة طلبات ما قبل الإرسال (Preflight CORS Request)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // 1. استخراج التوكن من الهيدر (Authorization: Bearer <TOKEN>)
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'عذراً! رمز التحقق مفقود، يجب عليك تسجيل الدخول أولاً كمسؤول للوصول إلى هذه لوحة الصلاحيات.'
      })
    };
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('CRITICAL ERROR: process.env.JWT_SECRET is not configured in Netlify Settings!');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'خطأ داخلي في الخادم: لم يتم تهيئة مفتاح التوقيع السري للـ JWT على نظام الاستضافة.'
      })
    };
  }

  try {
    // 2. التحقق من صحة وصلاحية الـ Token وفكه
    const decoded = jwt.verify(token, jwtSecret);

    // 3. التحقق من الرتبة والدور الحماية (Role-Based Access Control)
    if (!decoded || decoded.role !== 'admin') {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'وصول مرفوض! حسابك الحالي لا يمتلك صلاحية الإدارة (Administrator). هذه العملية مسجلة ومحمية.'
        })
      };
    }

    // =========================================================================
    // [نجاح التحقق بنجاح] - يمكنك الآن الاستعلام بأمان كامل من قاعدة بياناتك هنا
    // =========================================================================
    
    // تمثيل الاتصال بقاعدة البيانات
    let app;
    try {
      app = getApp('netlify-admin-app');
    } catch (e) {
      app = initializeApp(firebaseConfig, 'netlify-admin-app');
    }
    const firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);

    // مثال على استقبال جسم الطلب (POST body data)
    let requestData = {};
    if (event.body) {
      try {
        requestData = JSON.parse(event.body);
      } catch (pErr) {
        console.warn('Could not parse request body:', pErr.message);
      }
    }

    console.log(`Authorized action by Admin: ${decoded.email || decoded.userId}`);

    // هنا تضع الكود الخاص بك للاستعلام أو التعديل، مثال:
    // const taskRef = doc(firestoreDb, 'tasks', requestData.taskId);
    // await updateDoc(taskRef, { status: 'approved' });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'تم التحقق من هويتك كمسؤول بنجاح، وتم تنفيذ الإجراء المطلوب بأمان.',
        adminInfo: {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role
        },
        data: {
          // نتائج استعلام قاعدة البيانات الخاصة بك تأتي هنا
          status: "completed",
          processedAt: new Date().toISOString()
        }
      })
    };

  } catch (error) {
    console.error('JWT Security Verification Failed:', error.message);
    
    // إرجاع رسالة خطأ واضحة في حال كان التوكن منتهي الصلاحية أو تم تغيير توقيعه بشكل خبيث
    const responseMsg = error.name === 'TokenExpiredError' 
      ? 'انتهت صلاحية جلسة العمل الآمنة الخاصة بك. يرجى تسجيل الدخول مجدداً كمسؤول.'
      : 'رمز التحقق غير صالح أو مزور! عملية الوصول هذه منتهكة وسيتم الإبلاغ عنها.';

    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        success: false,
        error: responseMsg,
        details: error.message
      })
    };
  }
};
