const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = (collection) => {

  const Model = new Schema({
    data : Object
  });
  
  const Model_ = mongoose.model(collection, Model);

  return Model_;
}