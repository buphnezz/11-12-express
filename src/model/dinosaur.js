'use strict';

import mongoose from 'mongoose';

const dinosaurSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
    minlength: 10,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

  // Zachary Mongoose wants to create a model out of schema
export default mongoose.model('dinosaur', dinosaurSchema);
  
