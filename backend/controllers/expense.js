const Expense = require('../models/expense');
const User = require('../models/signup');
const S3Services = require('../services/s3services');
const UserServices=require("../services/userServices");

const addExpense = async (req, res, next) => {
    try {
      const { price, description, category } = req.body;
      const userEmail = req.headers.useremail;
      const user = await User.findOne({ email: userEmail });
      if (price == undefined || price.length <= 0) {
        return res.status(400).json({ success: false, message: 'parameters missing' });
      }
      const userId = user._id;
      const newExpense = new Expense({ price, description, category, userId });
      await newExpense.save();
      if (!user.expenses) {
        user.expenses = []; 
      }
    user.expenses.push(newExpense);
    await user.save();
    res.status(201).json({ expense: newExpense, success: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: err });
    }
  };
  
const getExpenses = async (req,res)=>{
  try {    
      const userEmail = req.headers.email;
      const user = await User.findOne({ email: userEmail });
      if (user.isPremiumUser) {
          const expenses = await Expense.find({ userId: user._id });
          return res.status(201).json({ expenses, success: true, message: "Premium user" });
      } else {
          const expenses = await Expense.find({ userId: user._id });
          return res.status(200).json({ expenses, success: true });
      }
  } catch (error) {
      console.error(error);
      res.status(402).json({ error: error, success: false });
  }
};


const deleteExpense = async (req, res) => {
  try {
      const expenseId = req.params.id;
      if (!expenseId || expenseId.length === 0) {
          return res.status(400).json({ success: false });
      }
      const userEmail = req.headers.email;
      const user = await User.findOne({ email: userEmail });
      const deletedExpense = await Expense.findOneAndDelete({ _id: expenseId, userId: user._id });

      if (!deletedExpense) {
          return res.status(404).json({ success: false, message: 'Expense does not belong to the user' });
      }

      res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
      console.error(error);
      res.status(403).json({ success: false, message: "Failed" });
  }
};

const editExpense = async (req, res, next) => {
  try {
    const expenseId = req.params.id;
    console.log("1>>",expenseId);
    const { price, description, category } = req.body; 
    console.log(req.body);

    const existingExpense = await Expense.findOne({ where: { id: expenseId, userDetailId: req.user.id } });

    if (!existingExpense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Update the expense fields
    existingExpense.price = price;
    existingExpense.description = description;
    existingExpense.category = category;

    await existingExpense.save();

    res.status(200).json({ success: true, message: 'Expense updated successfully', updatedExpense: existingExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'An error occurred while updating the expense' });
  }
}


const downloadExpense = async (req,res) => {
  try{
  const userDetailId = req.user.id;
  const expenses = await Expense.findAll({ where: { userDetailId: userDetailId }});
  // const expenses = await UserServices.getExpenses(req);
  // console.log(expenses);
  const stringifiedExpenses = JSON.stringify(expenses);

  console.log('1',stringifiedExpenses)
  const filename = `Expense${userDetailId}/${new Date()}.txt`;
  console.log('2',filename)
  const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, filename);
  console.log(fileUrl)
  res.status(201).json({fileUrl , success: true}) 
}catch(err){
  console.log(err);
res.status(500).json({fileUrl:"Something==>went wrong",success:false})
}
}

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    editExpense,
    downloadExpense,

}