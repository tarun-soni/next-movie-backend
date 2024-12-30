import mongoose from 'mongoose';

interface User {
  name: string;
  email: string;
  password: string;
}

const userSchema: mongoose.Schema<User> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model('User', userSchema);
