const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const node_22060050_Schema = new Schema({
  times : Number
});

const node_22060050_Model = mongoose.model('22060050', node_22060050_Schema);

module.exports = node_22060050_Model;