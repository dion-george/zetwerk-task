const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
  skills: { type: String, required: true },
}, {
  timestamps: true,
});

autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, 'Counter');
var Counter = mongoose.model('Counter', userSchema);

const User = mongoose.model('User', userSchema);

module.exports = User;