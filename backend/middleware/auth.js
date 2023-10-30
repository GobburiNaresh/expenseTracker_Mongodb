const jwt = require('jsonwebtoken');
const User = require('../models/signup');

const authenticate = (req,res,next) =>{
    try{
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token is missing' });
        }
        const user =jwt.verify(token, process.env.secretKey);
        User.findById(user.id).then(user => {
            req.user = user;
            next();
        }).catch(err => {
            throw new Error(err)
        })
    } catch (err){
        console.log(err);
        return res.status(401).json({success:false})
    }
}

module.exports = {
    authenticate
}