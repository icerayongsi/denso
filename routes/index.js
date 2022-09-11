const { json } = require('express');
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const router = express.Router();
const Data_Schema = require('../models/Schema');

let encodeUrl = express.urlencoded({ extended: false });

mongoose.connect('mongodb+srv://icerayongsi:poo14789630@cluster0.c1fr4nt.mongodb.net/TPM', {
  useNewUrlParser: true
});

const data = [{}];

router.get('/test', async (req, res) => {
  
  res.json(product);
});

router.get('/', function (req, res, next) {
  res.redirect('/layout');
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

  let select_query = [];
  let header = "";
  console.log(req.body.fromdate);
  console.log(Date.parse(Date(req.body.fromdate).toLocaleString("en-US", {timeZone: "Asia/Bangkok",hour12: false})));
  switch(req.query.category) {
    case 'vi1':
      header = "Vibrator 1";
      select_query.push('data.Vibrator_1_1');
      select_query.push('data.Vibrator_1_3');
      select_query.push('times');
    break;
    case 'vi2':
      header = "Vibrator 2";
      select_query.push('data.Vibrator_2_1');
      select_query.push('data.Vibrator_2_3');
      select_query.push('times');
    break;
    case 'vi3':
      header = "Vibrator 3";
      select_query.push('data.Vibrator_3_1');
      select_query.push('data.Vibrator_3_3');
      select_query.push('times');
    break;
    case 'vi4':
      header = "Vibrator 4";
      select_query.push('data.Vibrator_4_1');
      select_query.push('data.Vibrator_4_3');
      select_query.push('times');
    break;
    case 'vi5': 
      header = "Vibrator 5";
      select_query.push('data.Vibrator_5_1');
      select_query.push('data.Vibrator_5_3');
      select_query.push('times');
    break;
    case 'vi6':
      header = "Vibrator 6";
      select_query.push('data.Vibrator_6_1');
      select_query.push('data.Vibrator_6_3');
      select_query.push('times');
    break;
    case 'vi7':
      header = "Vibrator 7";
      select_query.push('data.Vibrator_7_1');
      select_query.push('data.Vibrator_7_3');
      select_query.push('times');
    break;
    case 'vi8':
      header = "Vibrator 8";
      select_query.push('data.Vibrator_8_1');
      select_query.push('data.Vibrator_8_3');
      select_query.push('times');
    break;
    case 'vi9':
      header = "Vibrator 9";
      select_query.push('data.Vibrator_9_1');
      select_query.push('data.Vibrator_9_3');
      select_query.push('times');
    break;
  }

  console.log(select_query);

  if (req.body.fromdate != undefined && req.body.todate != undefined) {
    var fromdate_ = new Date(Date.parse(req.body.fromdate)).toLocaleString("en-US", {timeZone: "Asia/Bangkok",hour12: false});
    var todate_ = new Date(Date.parse((req.body.todate))).toLocaleString("en-US", {timeZone: "Asia/Bangkok",hour12: false});
    var raw_fromdate = Date.parse(req.body.fromdate);
    var raw_todate = Date.parse(req.body.todate);
    var data_1 = await Data_Schema.find({times : 
      { 
        $gte : Date.parse(req.body.fromdate), 
        $lte : Date.parse(req.body.todate) + 1000
      }
      },
        select_query
    );
  } else {
    var fromdate_ = new Date(parseInt(req.query.fromdate)).toLocaleString("en-US", {timeZone: "Asia/Bangkok",hour12: false});
    var todate_ = new Date(parseInt(req.query.todate)).toLocaleString("en-US", {timeZone: "Asia/Bangkok",hour12: false});
    var raw_fromdate = req.query.fromdate;
    var raw_todate = req.query.todate;
    var data_1 = await Data_Schema.find({times : 
      { 
        $gte : req.query.fromdate, 
        $lte : (req.query.todate) + 1000
      }
      },
        select_query
    );
    console.log(req.query.fromdate);
    console.log(fromdate_);
  }

  // data_1.forEach(element => {
  //   console.log(element);
  // });

  
  const obj = {title: 'Dashboard',from: fromdate_, to: todate_};
  //res.render('main/dashboard_index', JSON.stringify(obj));
  res.render('main/dashboard_index', {  title: 'Dashboard',
                                        header: header,
                                        category : req.query.category,
                                        from: fromdate_, 
                                        to: todate_,
                                        data : JSON.stringify(data_1),
                                        raw_fromdate : raw_fromdate,
                                        raw_todate: raw_todate
                                    });
  //res.send(JSON.stringify(obj));

});

module.exports = router;
