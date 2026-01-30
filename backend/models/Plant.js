const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  comments: [{
    text: String,
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Plant', plantSchema);
