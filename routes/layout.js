const { json } = require('express');
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const router = express.Router();
const Data_Schema = require('../models/Schema');

let encodeUrl = express.urlencoded({ extended: false });

// mongoose.connect('mongodb://localhost:27017/TPM', {
//   useNewUrlParser: true
// });

// mongoose.connect('mongodb+srv://icerayongsi:poo14789630@cluster0.c1fr4nt.mongodb.net/TPM', {
//   useNewUrlParser: true
// });

// mongodb+srv://icerayongsi:poo14789630@cluster0.c1fr4nt.mongodb.net/


const data = [{}];

router.get('/', function(req, res, next) {
  res.render('layout', { title: 'Denso' ,header : 'Mechine layout'});
});

router.get('/BrazingGIC1', function(req, res, next) {
  console.log(req.query.page);
  res.render('BrazingGIC_1', { title: 'Denso' ,header : 'BrazingGIC 1',page : req.query.page});
});

router.get('/BrazingGIC1/history', function(req, res, next) {
  res.render('history', { title: 'Denso' ,header : 'BrazingGIC 1'});
});

router.post('/BrazingGIC1/history', encodeUrl, async (req, res, next) => {

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
  res.render('dashboard/BrazingGIC_1/BrazingGIC_1_history/history_index', {  title: 'Dashboard',
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
