const User = require('../models/signup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isStringValid(string){
  if(string == undefined || string.length === 0){
      return true
  }else{
    return false
  }
}

const signup = async (req,res,next) =>{
  try{
  const {name,email,password } = req.body;
    if(isStringValid(name) || isStringValid(email) || isStringValid(password)){
      return res.status(400).json({err: "Bad parameters--something is missing"})
  }

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
      return res.status(400).json({ err: "Email already in use. Please use a different email." });
  }
  
  const saltrounds = 10;
  bcrypt.hash(password, saltrounds ,async(err,hash) =>{
    if (err) {
      console.log(err);
      return res.status(500).json({ err: "Error hashing password" });
  }
    
    await User.create({name,email,password: hash})
    res.status(201).json({message:`Successfully created new user`});
  })
    
  }catch(err){
            res.status(500).json(err);
      }
}

function generateAccessToken(id){
  return jwt.sign({id}, process.env.secretkey);
}

const login = async (req,res) => {
  try{
    const { email, password } = req.body;
    if(isStringValid(email) || isStringValid(password)){
      return res.status(400).json({message: 'Email id or password is missing',success:false})
    }
    const user = await User.findOne({email})
    const userCheck = user.isPremiumUser;
      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
          return res.status(401).json({ success: false, message: 'Passwords do not match' });
      }
      
      const jwttoken = generateAccessToken(user._id); // Assuming the user model has _id as the primary key
      
      res.json({ token: jwttoken, success: true, message: 'Successfully Logged In' , isPremiumUser:userCheck,userEmail:user.email});
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};


module.exports = {
    signup,
    login,
    generateAccessToken
}


