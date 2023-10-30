const path = require('path');

const express = require('express');

const mongoose = require("mongoose");

const bodyParser = require('body-parser');

const User = require('./models/signup');
const Expense = require('./models/expense');
const Order = require('./models/orders');
const Forgotpassword = require('./models/resetpassword');

const app = express();

var cors = require('cors');
app.use(cors());



const dotenv = require('dotenv');
dotenv.config();


const userRoutes = require('./routes/signup');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premiumFeature');
const resetPasswordRoutes = require('./routes/resetpassword')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use('/user', userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumRoutes);
app.use('/password', resetPasswordRoutes);

mongoose
  .connect('mongodb+srv://nareshgobburi:NARESH123@expensetracker.bzgmogi.mongodb.net/')
  .then((result) => {
    console.log("Connected mongodb");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });