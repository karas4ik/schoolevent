const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  type: String,
  startTime: Date,
  endTime: Date,
  location: String,
  createdBy: String // ID учителя
});

module.exports = mongoose.model('Event', eventSchema);