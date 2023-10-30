const mongoose = require('mongoose');



const expenseSchema = new mongoose.Schema({
    
    price: {
        type: Number,
    },
    category: {
        type: String,
    },
    description: {
        type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  });
  const Expense = mongoose.model('Expense', expenseSchema);
  module.exports = Expense;
