// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');

// /**
//  * Authentication Routes
//  * All voice biometric authentication endpoints
//  */

// // POST /api/auth/signup - Register new user with voice enrollment
// router.post('/signup', authController.signup);

// // POST /api/auth/login - Login with voice verification
// router.post('/login', authController.login);

// // POST /api/auth/check-voice - Quick voice check for assistant
// router.post('/check-voice', authController.checkVoice);

// module.exports = router;



const express = require('express');
const router = express.Router();
const multer = require('multer');
const authController = require('../controllers/authController');

// Configure multer for memory storage (audio files)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/') || file.mimetype === 'application/octet-stream') {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

/**
 * Authentication Routes
 * All voice biometric authentication endpoints
 */

// POST /api/auth/signup - Register new user with voice enrollment
router.post('/signup', upload.single('audio'), authController.signup);

// POST /api/auth/login - Login with voice verification
router.post('/login', upload.single('audio'), authController.login);

// POST /api/auth/check-voice - Quick voice check for assistant
router.post('/check-voice', upload.single('audio'), authController.checkVoice);

module.exports = router;