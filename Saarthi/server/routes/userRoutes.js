// // // // const express = require('express');
// // // // const router = express.Router();
// // // // const userController = require('../controllers/userController');
// // // // const auth = require('../middleware/auth');

// // // // /**
// // // //  * User Routes
// // // //  * All routes require authentication
// // // //  */

// // // // // GET /api/user/details - Get user details and bank info
// // // // router.get('/details', auth, userController.getUserDetails);

// // // // // POST /api/user/link-atm - Link ATM card
// // // // router.post('/link-atm', auth, userController.linkAtm);

// // // // // POST /api/user/set-mpin - Set mPIN
// // // // router.post('/set-mpin', auth, userController.setMpin);

// // // // // POST /api/user/verify-mpin - Verify mPIN
// // // // router.post('/verify-mpin', auth, userController.verifyMpin);

// // // // // GET /api/user/profile - Get user profile
// // // // router.get('/profile', auth, userController.getProfile);

// // // // module.exports = router;



// // // const express = require('express');
// // // const router = express.Router();
// // // const userController = require('../controllers/userController');
// // // const auth = require('../middleware/auth');

// // // /**
// // //  * User Routes
// // //  * All routes require authentication
// // //  */

// // // // GET /api/user/details - Get dashboard details (STATEFUL)
// // // router.get('/details', auth, userController.getDashboardDetails);

// // // // POST /api/user/link-atm - Link ATM card (STATEFUL)
// // // router.post('/link-atm', auth, userController.linkAtm);

// // // // POST /api/user/set-mpin - Set mPIN (NEW ROUTE)
// // // router.post('/set-mpin', auth, userController.setMpin);

// // // // POST /api/user/verify-mpin - Verify mPIN
// // // router.post('/verify-mpin', auth, userController.verifyMpin);

// // // // GET /api/user/profile - Get user profile
// // // router.get('/profile', auth, userController.getProfile);

// // // module.exports = router;











// // const express = require('express');
// // const router = express.Router();
// // const userController = require('../controllers/userController');
// // const auth = require('../middleware/auth');

// // /**
// //  * User Routes
// //  * All routes require authentication
// //  */

// // // GET /api/user/details - Get dashboard details (includes UPI & reminders)
// // router.get('/details', auth, userController.getDashboardDetails);

// // // POST /api/user/link-atm - Link ATM card
// // router.post('/link-atm', auth, userController.linkAtm);

// // // POST /api/user/set-mpin - Set mPIN
// // router.post('/set-mpin', auth, userController.setMpin);

// // // POST /api/user/create-upi - Create UPI ID & generate QR code (NEW)
// // router.post('/create-upi', auth, userController.createUpiId);

// // // POST /api/user/verify-mpin - Verify mPIN
// // router.post('/verify-mpin', auth, userController.verifyMpin);

// // // GET /api/user/profile - Get user profile
// // router.get('/profile', auth, userController.getProfile);

// // module.exports = router;











// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');
// const auth = require('../middleware/auth');

// /**
//  * User Routes
//  * All routes require authentication
//  */

// // GET /api/user/details - Get dashboard details (includes UPI & reminders)
// router.get('/details', auth, userController.getDashboardDetails);

// // POST /api/user/link-atm - Link ATM card
// router.post('/link-atm', auth, userController.linkAtm);

// // POST /api/user/set-mpin - Set mPIN
// router.post('/set-mpin', auth, userController.setMpin);

// // POST /api/user/create-upi - Create UPI ID & generate QR code (NEW)
// router.post('/create-upi', auth, userController.createUpiId);

// // POST /api/user/verify-mpin - Verify mPIN
// router.post('/verify-mpin', auth, userController.verifyMpin);

// // GET /api/user/profile - Get user profile
// router.get('/profile', auth, userController.getProfile);

// module.exports = router;


















const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

/**
 * User Routes
 * All routes require authentication
 */

// GET /api/user/details - Get dashboard details (includes UPI & reminders)
router.get('/details', auth, userController.getDashboardDetails);

// GET /api/user/transactions - Get filtered transactions (NEW)
router.get('/transactions', auth, userController.getTransactions);

// POST /api/user/link-atm - Link ATM card
router.post('/link-atm', auth, userController.linkAtm);

// POST /api/user/set-mpin - Set mPIN
router.post('/set-mpin', auth, userController.setMpin);

// POST /api/user/create-upi - Create UPI ID & generate QR code (NEW)
router.post('/create-upi', auth, userController.createUpiId);

// POST /api/user/verify-mpin - Verify mPIN
router.post('/verify-mpin', auth, userController.verifyMpin);

// GET /api/user/profile - Get user profile
router.get('/profile', auth, userController.getProfile);

// Reminder management
router.get('/reminders', auth, userController.getReminders);
router.post('/reminders', auth, userController.createReminder);
router.delete('/reminders/:id', auth, userController.deleteReminder);

module.exports = router;