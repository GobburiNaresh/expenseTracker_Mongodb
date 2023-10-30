const path = require('path');

const express = require('express');

const router = express.Router();

const expenseController = require('../controllers/expense');

const userauthentication = require('../middleware/auth')

router.post('/addExpense',userauthentication.authenticate ,expenseController.addExpense);

router.get('/getExpenses',userauthentication.authenticate ,expenseController.getExpenses);

router.delete('/deleteExpense/:id',userauthentication.authenticate ,expenseController.deleteExpense);

router.put('/editExpense/:id',userauthentication.authenticate ,expenseController.editExpense);


router.get('/download', userauthentication.authenticate,expenseController.downloadExpense);



// router.post('/download-record',userauthentication.authenticate,expenseController.saveDownloadRecord);
// router.get('/download-records/:user_id', userauthentication.authenticate,expenseController.getDownloadRecords);




module.exports = router;