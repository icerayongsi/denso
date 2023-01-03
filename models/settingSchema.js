const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const _Schema = new Schema({
  BrazingGIC1 : Object,
  _IF : Object,
  Injection : Object
});

const setting_Model = mongoose.model('mc_configs', _Schema);

module.exports = setting_Model;