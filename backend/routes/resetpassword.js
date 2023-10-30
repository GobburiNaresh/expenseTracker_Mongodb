const express =require('express');

const resetpasswordController = require('../controllers/resetpassword');


const router = express.Router();

router.post('/forgotpassword', resetpasswordController.forgotpassword)
router.get('/resetpassword/:id', resetpasswordController.resetpassword)

module.exports=router;


module.exports = router;