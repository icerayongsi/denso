const { json } = require('express');
var express = require('express');
const app = express();
const mongoose = require("mongoose");
var router = express.Router();
const Data_Schema = require('../models/Schema');

let encodeUrl = express.urlencoded({ extended: false });

mongoose.connect('mongodb://localhost:27017/TPM', {
  useNewUrlParser: true
});

const data = [{}];

router.get('/test', async (req, res) => {
  
  res.json(product);
});

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

data_x_zxis = [0.843, 0.981, 0.904, 0.783, 1.203, 0.737, null, 0.873, 0.835, 0.806, 0.972, 1, 0.838, 0.717, 0.798, 0.79, 0.976, 0.567, 0.682, 0.976, 0.972, 0.998,null, 0.798, 0.77, 0.953, 0.876, 0.976, 1.106, 0.842]
data_z_zxis = [0.843, 0.981, 0.904, 0.783, 1.203, 0.737, null, 0.873, 0.835, 0.806, 0.972, 1, 0.838, 0.717, 0.798, 0.79, 0.976, 0.567, 0.682, 0.976, 0.972, 0.998, null, 0.798, 0.77, 0.953, 0.876, 0.976, 1.106, 0.842]
label = ['7/31/2022', '8/1/2022', '8/2/2022', '8/3/2022', '8/4/2022', '8/5/2022', '8/6/2022', '8/7/2022', '8/8/2022', '8/9/2022', '8/10/2022', '8/11/2022', '8/12/2022', '8/13/2022', '8/14/2022', '8/15/2022', '8/16/2022', '8/17/2022', '8/18/2022', '8/19/2022', '8/20/2022', '8/21/2022', '8/22/2022', '8/23/2022', '8/24/2022', '8/25/2022', '8/26/2022', '8/27/2022', '8/28/2022', '8/29/2022']

router.get('/Dashboard/last-30', encodeUrl, async (req, res, next) => {
  res.render('main/dashboard_index_30', { title: 'Dashboard last 30 day',
                                          data_x_zxis_j : JSON.stringify(data_x_zxis),
                                          data_x_zxis : data_x_zxis,
                                          data_z_zxis_j : JSON.stringify(data_z_zxis),
                                          data_z_zxis : data_z_zxis,
                                          label_j : JSON.stringify(label),
                                          label : label
                                        });
});

router.post('/Dashboard', encodeUrl, async (req, res, next) => {

  const data_1 = await Data_Schema.find({times : 
    { 
      $gte : Date.parse(req.body.fromdate), 
      $lte : Date.parse(req.body.todate) + 1000}
    },
      [
        'data.Vibrator_1_1',
        'data.Vibrator_1_3',
        'times'
      ]
  );

  data_1.forEach(element => console.log(element));


  let fromdate_ = new Date((Date.parse(req.body.fromdate))).toLocaleString("en-US", {timeZone: "Asia/Bangkok",hour12: false});
  let todate_ = new Date((Date.parse(req.body.todate))).toLocaleString("en-US", {timeZone: "Asia/Bangkok",hour12: false});
  const obj = {title: 'Dashboard',from: fromdate_, to: todate_};
  //res.render('main/dashboard_index', JSON.stringify(obj));
  res.render('main/dashboard_index', { title: 'Dashboard' ,from: fromdate_, to: todate_, data : JSON.stringify(data_1)});
  //res.send(JSON.stringify(obj));

});

module.exports = router;
