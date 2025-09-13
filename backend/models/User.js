import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v); 
      },
      message: 'Please provide a valid 10-digit phone number'
    }
  },
  addr: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    minlength: [10, 'Address must be at least 10 characters long'],
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  otp: {
    type: String,
    default: null,
    validate: {
      validator: function(v) {
        return v === null || /^\d{6}$/.test(v);
      },
      message: 'OTP must be a 6-digit number'
    }
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});


userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

userSchema.pre('save', async function(next) {
  if (this.isModified('email')) {
    const existingUser = await mongoose.models.User.findOne({ 
      email: this.email, 
      _id: { $ne: this._id } 
    });
    if (existingUser) {
      const error = new Error('Email already exists');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  
  if (this.isModified('phone')) {
    const existingUser = await mongoose.models.User.findOne({ 
      phone: this.phone, 
      _id: { $ne: this._id } 
    });
    if (existingUser) {
      const error = new Error('Phone number already exists');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  
  next();
});

const User = mongoose.model('User', userSchema);

export default User;