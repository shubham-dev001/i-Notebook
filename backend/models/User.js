const mongoose = require("mongoose");
 const { Schema } = mongoose;
const validator = require("validator");

const UserSchema = new Schema({
     name: {
        type: String,
        require: true,
         minlength: [3, "Name must be at least 3 characters"],
         maxlength: [50, "Name cannot exceed 50 characters"]
     },
      email: {
        type: String,
        require: true,
        unique: true,
        minlength: [5, "Email must be at least 5 characters"],
        maxlength: [100, "Email cannot exceed 100 characters"],
        validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email address",
       },
     },
      password: {
        type: String,
        require: true,
        unique: true,
        minlength: [6, "Password must be at least 6 characters"],
        maxlength: [1024, "Password is too long"]
     },
      date: {
        type: Date,
        default: Date.now,
     },
});
const User = mongoose.model("user", UserSchema);  
module.exports = User;
