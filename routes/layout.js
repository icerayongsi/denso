const { json } = require('express');
const express = require('express');
const app = express();
const server = require('http').createServer();
const mongoose = require("mongoose");
const router = express.Router();
const Data_Schema = require('../models/Schema');
const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://broker.hivemq.com')
const io = require('socket.io')(5000);

let encodeUrl = express.urlencoded({ extended: false });

// mongoose.connect('mongodb://localhost:27017/TPM', {
//   useNewUrlParser: true
// });

// mongoose.connect('mongodb+srv://icerayongsi:poo14789630@cluster0.c1fr4nt.mongodb.net/TPM', {
//   useNewUrlParser: true
// });

// mongodb+srv://icerayongsi:poo14789630@cluster0.c1fr4nt.mongodb.net/


var title = 'Denso';

client.on('connect', () => {
  client.subscribe('22060001/#');
  client.subscribe('22060050/#');
});

// client.on('message', (topic, message) => {
//   console.log(JSON.parse(message.toString()));
// });

io.on("connection", (socket) => {

  console.log("Websocket connected!!");
  
  client.on('message', (topic, message) => {
    // console.log(topic.substring(0,8));

    if (topic.substring(0,8) == '22060001') {
      message = JSON.parse(message.toString());
      socket.emit('temp-chamber', {
        bz1 : message.data[0].Z1_Atmosphere_R,
        bz2 : message.data[0].Z2_Atmosphere_R,
        bz3 : message.data[0].Z3_Atmosphere_R,
        bz4 : message.data[0].Z4_Atmosphere_R,
        bz5 : message.data[0].Z4_Atmosphere_L,
        pre1 : message.data[0].Front_Heater,
        pre2 : message.data[0].Exit_Chamber_Heater,
      });
    }

    if (topic.substring(0,8) == '22060050') {
      message = JSON.parse(message.toString());
      socket.emit('vibrator', {
        vi1_Z : message.data[0].Vibrator_1_1,
        vi1_X : message.data[0].Vibrator_1_3,
        vi2_Z : message.data[0].Vibrator_2_1,
        vi2_X : message.data[0].Vibrator_2_3,
        vi3_Z : message.data[0].Vibrator_3_1,
        vi3_X : message.data[0].Vibrator_3_3,
        vi4_Z : message.data[0].Vibrator_4_1,
        vi4_X : message.data[0].Vibrator_4_3,
        vi5_Z : message.data[0].Vibrator_5_1,
        vi5_X : message.data[0].Vibrator_5_3,
        vi6_Z : message.data[0].Vibrator_6_1,
        vi6_X : message.data[0].Vibrator_6_3,
        vi7_Z : message.data[0].Vibrator_7_1,
        vi7_X : message.data[0].Vibrator_7_3,
        vi8_Z : message.data[0].Vibrator_8_1,
        vi8_X : message.data[0].Vibrator_8_3,
        vi9_Z : message.data[0].Vibrator_9_1,
        vi9_X : message.data[0].Vibrator_9_3,
      });
      socket.emit('temp', {
        temp_1 : message.data[0].temp_1,
        temp_2 : message.data[0].temp_2,
        temp_3 : message.data[0].temp_3,
        temp_4 : message.data[0].temp_4,
        temp_5 : message.data[0].temp_5,
        temp_6 : message.data[0].temp_6,
        temp_7 : message.data[0].temp_7,
        temp_8 : message.data[0].temp_8,
        temp_9 : message.data[0].temp_9,
      });
    } 
    
  });

  
});

const data = [{}];

router.get('/', function(req, res, next) {
  res.render('layout', { title: title ,header : 'Mechine layout',sw : 1});
});

router.post('/', encodeUrl, async (req, res, next) => {
  console.log(req.body.sw);
});

router.get('/BrazingGIC1', function(req, res, next) {
  console.log(req.query.page);
  res.render('dashboard/BrazingGIC_1/BrazingGIC_1', { title: title ,header : 'BrazingGIC 1',page : req.query.page});
});

router.get('/BrazingGIC1/history', function(req, res, next) {
  res.render('history', { title: title ,header : 'BrazingGIC 1'});
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

router.post('/BrazingGIC1/sort-chart', encodeUrl, async (req, res, next) => {
  data_x_zxis = [0.843, 0.981, 0.904, 0.783, 1.203, 0.737, 0.737, 0.873, 0.835, 0.806, 0.972, 1, 0.838, 0.717, 0.798, 0.79, 0.976, 0.567, 0.682, 0.976, 0.972, 0.998,0.998, 0.798, 0.77, 0.953, 0.876, 0.976, 1.106, 0.842]
  data_z_zxis = [0.843, 0.981, 0.904, 0.783, 1.203, 0.737, 0.737, 0.873, 0.835, 0.806, 0.972, 1, 0.838, 0.717, 0.798, 0.79, 0.976, 0.567, 0.682, 0.976, 0.972, 0.998, 0.998, 0.798, 0.77, 0.953, 0.876, 0.976, 1.106, 0.842]
  label_day = ['8/13/2022', '8/14/2022', '8/15/2022', '8/16/2022', '8/17/2022', '8/18/2022', '8/19/2022', '8/20/2022', '8/21/2022', '8/22/2022', '8/23/2022', '8/24/2022', '8/25/2022', '8/26/2022', '8/27/2022', '8/28/2022', '8/29/2022', '8/30/2022', '8/31/2022', '9/1/2022', '9/2/2022', '9/3/2022', '9/4/2022', '9/5/2022', '9/6/2022', '9/7/2022', '9/8/2022', '9/9/2022', '9/10/2022', '9/11/2022']
  label_week = ['1/23/2022', '1/30/2022', '2/6/2022', '2/13/2022', '2/20/2022', '2/27/2022', '3/13/2022', '3/20/2022', '3/27/2022', '4/3/2022', '4/10/2022', '4/17/2022', '4/24/2022', '5/1/2022', '5/8/2022', '5/15/2022', '5/22/2022', '5/29/2022', '6/5/2022', '6/12/2022', '6/19/2022', '6/26/2022', '7/10/2022', '7/17/2022', '7/24/2022', '8/7/2022', '8/14/2022', '8/28/2022', '9/4/2022', '9/11/2022']
  label_month = ['4/11/2020', '5/11/2020', '6/11/2020', '7/11/2020', '8/11/2020', '9/11/2020', '10/11/2020', '11/11/2020', '12/11/2020', '1/11/2021', '2/11/2021', '3/11/2021', '4/11/2021', '5/11/2021', '6/11/2021', '7/11/2021', '8/11/2021', '9/11/2021', '10/11/2021', '11/11/2021', '12/11/2021', '1/11/2022', '2/11/2022', '3/11/2022', '4/11/2022', '5/11/2022', '6/11/2022', '7/11/2022', '8/11/2022', '9/11/2022']

  var x_0 = [];
  var x_1 = [];
  var x_2 = [];
  var x_3 = [];
  var x_4 = [];
  var x_5 = [];
  var x_6 = [];
  var x_7 = [];
  var x_8 = [];

  var z_0 = [];
  var z_1 = [];
  var z_2 = [];
  var z_3 = [];
  var z_4 = [];
  var z_5 = [];
  var z_6 = [];
  var z_7 = [];
  var z_8 = [];

  data_x_zxis.forEach((element,i) => {
    x_0.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);
    z_0.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);

    x_1.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);
    z_1.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);

    x_2.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);
    z_2.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);

    x_3.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);
    z_3.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);

    x_4.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);
    z_4.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);

    x_5.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);
    z_5.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);

    x_6.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);
    z_6.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);

    x_7.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);
    z_7.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);

    x_8.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);
    z_8.push(data_z_zxis[i] + (Math.floor(Math.random() * 300 )) / 1000);
  });

    // console.log(x_0)
    // console.log(req.body.type)

  if (req.body.type == 'days') {
    res.status(200).send({ 
      x_0 : x_0 , 
      z_0 : z_0 ,
      x_1 : x_1 , 
      z_1 : z_1 ,
      x_2 : x_2 , 
      z_2 : z_2 ,
      x_3 : x_3 , 
      z_3 : z_3 ,
      x_4 : x_4 , 
      z_4 : z_4 ,
      x_5 : x_5 , 
      z_5 : z_5 ,
      x_6 : x_6 , 
      z_6 : z_6 ,
      x_7 : x_7 , 
      z_7 : z_7 ,
      x_8 : x_8 , 
      z_8 : z_8 ,
      label : label_day});
  } else if (req.body.type == 'weeks') {
    res.status(200).send({ 
      x_0 : x_0 , 
      z_0 : z_0 ,
      x_1 : x_1 , 
      z_1 : z_1 ,
      x_2 : x_2 , 
      z_2 : z_2 ,
      x_3 : x_3 , 
      z_3 : z_3 ,
      x_4 : x_4 , 
      z_4 : z_4 ,
      x_5 : x_5 , 
      z_5 : z_5 ,
      x_6 : x_6 , 
      z_6 : z_6 ,
      x_7 : x_7 , 
      z_7 : z_7 ,
      x_8 : x_8 , 
      z_8 : z_8 , 
      label : label_week});
  } else if (req.body.type == 'month') {
    res.status(200).send({ 
      x_0 : x_0 , 
      z_0 : z_0 ,
      x_1 : x_1 , 
      z_1 : z_1 ,
      x_2 : x_2 , 
      z_2 : z_2 ,
      x_3 : x_3 , 
      z_3 : z_3 ,
      x_4 : x_4 , 
      z_4 : z_4 ,
      x_5 : x_5 , 
      z_5 : z_5 ,
      x_6 : x_6 , 
      z_6 : z_6 ,
      x_7 : x_7 , 
      z_7 : z_7 ,
      x_8 : x_8 , 
      z_8 : z_8 ,
      label : label_month});
  } 

});

const getRandomFloat = (min, max, decimals) => {
  let str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

router.post('/BrazingGIC1/sort-chart-temp', encodeUrl, async (req, res, next) => {
  let label_day = ['8/13/2022', '8/14/2022', '8/15/2022', '8/16/2022', '8/17/2022', '8/18/2022', '8/19/2022', '8/20/2022', '8/21/2022', '8/22/2022', '8/23/2022', '8/24/2022', '8/25/2022', '8/26/2022', '8/27/2022', '8/28/2022', '8/29/2022', '8/30/2022', '8/31/2022', '9/1/2022', '9/2/2022', '9/3/2022', '9/4/2022', '9/5/2022', '9/6/2022', '9/7/2022', '9/8/2022', '9/9/2022', '9/10/2022', '9/11/2022']
  let label_week = ['1/23/2022', '1/30/2022', '2/6/2022', '2/13/2022', '2/20/2022', '2/27/2022', '3/13/2022', '3/20/2022', '3/27/2022', '4/3/2022', '4/10/2022', '4/17/2022', '4/24/2022', '5/1/2022', '5/8/2022', '5/15/2022', '5/22/2022', '5/29/2022', '6/5/2022', '6/12/2022', '6/19/2022', '6/26/2022', '7/10/2022', '7/17/2022', '7/24/2022', '8/7/2022', '8/14/2022', '8/28/2022', '9/4/2022', '9/11/2022']
  let label_month = ['4/11/2020', '5/11/2020', '6/11/2020', '7/11/2020', '8/11/2020', '9/11/2020', '10/11/2020', '11/11/2020', '12/11/2020', '1/11/2021', '2/11/2021', '3/11/2021', '4/11/2021', '5/11/2021', '6/11/2021', '7/11/2021', '8/11/2021', '9/11/2021', '10/11/2021', '11/11/2021', '12/11/2021', '1/11/2022', '2/11/2022', '3/11/2022', '4/11/2022', '5/11/2022', '6/11/2022', '7/11/2022', '8/11/2022', '9/11/2022']

  let temp_1 = [];
  let temp_2 = [];
  let temp_3 = [];
  let temp_4 = [];
  let temp_5 = [];
  let temp_6 = [];
  let temp_7 = [];
  let temp_8 = [];
  let temp_9 = [];

  for(let i = 0; i <= 30;i++) {
    temp_1.push(getRandomFloat(53,56,0));
    temp_2.push(getRandomFloat(53,47,0));
    temp_3.push(getRandomFloat(45,47,0));
    temp_4.push(getRandomFloat(45,47,0));
    temp_5.push(getRandomFloat(45,47,0));
    temp_6.push(getRandomFloat(45,47,0));
    temp_7.push(getRandomFloat(45,47,0));
    temp_8.push(getRandomFloat(45,47,0));
    temp_9.push(getRandomFloat(49,51,0));
  }


  if (req.body.type == 'days') {
    res.status(200).send({ 
      temp_1 : temp_1,
      temp_2 : temp_2,
      temp_3 : temp_3,
      temp_4 : temp_4,
      temp_5 : temp_5,
      temp_6 : temp_6,
      temp_7 : temp_7,
      temp_8 : temp_8,
      temp_9 : temp_9,
      label : label_day
    });
  } else if (req.body.type == 'weeks') {
    res.status(200).send({ 
      temp_1 : temp_1,
      temp_2 : temp_2,
      temp_3 : temp_3,
      temp_4 : temp_4,
      temp_5 : temp_5,
      temp_6 : temp_6,
      temp_7 : temp_7,
      temp_8 : temp_8,
      temp_9 : temp_9,
      label : label_week
    });
  } else if (req.body.type == 'month') {
    res.status(200).send({ 
      temp_1 : temp_1,
      temp_2 : temp_2,
      temp_3 : temp_3,
      temp_4 : temp_4,
      temp_5 : temp_5,
      temp_6 : temp_6,
      temp_7 : temp_7,
      temp_8 : temp_8,
      temp_9 : temp_9,
      label : label_month
    });
  } 
      


});

router.post('/BrazingGIC1/sort-chart-current', encodeUrl, async (req, res, next) => {
  let label_day = ['8/13/2022', '8/14/2022', '8/15/2022', '8/16/2022', '8/17/2022', '8/18/2022', '8/19/2022', '8/20/2022', '8/21/2022', '8/22/2022', '8/23/2022', '8/24/2022', '8/25/2022', '8/26/2022', '8/27/2022', '8/28/2022', '8/29/2022', '8/30/2022', '8/31/2022', '9/1/2022', '9/2/2022', '9/3/2022', '9/4/2022', '9/5/2022', '9/6/2022', '9/7/2022', '9/8/2022', '9/9/2022', '9/10/2022', '9/11/2022']
  let label_week = ['1/23/2022', '1/30/2022', '2/6/2022', '2/13/2022', '2/20/2022', '2/27/2022', '3/13/2022', '3/20/2022', '3/27/2022', '4/3/2022', '4/10/2022', '4/17/2022', '4/24/2022', '5/1/2022', '5/8/2022', '5/15/2022', '5/22/2022', '5/29/2022', '6/5/2022', '6/12/2022', '6/19/2022', '6/26/2022', '7/10/2022', '7/17/2022', '7/24/2022', '8/7/2022', '8/14/2022', '8/28/2022', '9/4/2022', '9/11/2022']
  let label_month = ['4/11/2020', '5/11/2020', '6/11/2020', '7/11/2020', '8/11/2020', '9/11/2020', '10/11/2020', '11/11/2020', '12/11/2020', '1/11/2021', '2/11/2021', '3/11/2021', '4/11/2021', '5/11/2021', '6/11/2021', '7/11/2021', '8/11/2021', '9/11/2021', '10/11/2021', '11/11/2021', '12/11/2021', '1/11/2022', '2/11/2022', '3/11/2022', '4/11/2022', '5/11/2022', '6/11/2022', '7/11/2022', '8/11/2022', '9/11/2022']

  let current_1 = [];
  let current_2 = [];
  let current_3 = [];
  let current_4 = [];
  let current_5 = [];
  let current_6 = [];
  let current_7 = [];
  let current_8 = [];
  let current_9 = [];

  for(let i = 0; i <= 30;i++) {
    current_1.push(getRandomFloat(4, 5, 1));
    current_2.push(getRandomFloat(4, 5, 1));
    current_3.push(getRandomFloat(4, 5, 1));
    current_4.push(getRandomFloat(4, 5, 1));
    current_5.push(getRandomFloat(4, 5, 1));
    current_6.push(getRandomFloat(4, 5, 1));
    current_7.push(getRandomFloat(4, 5, 1));
    current_8.push(getRandomFloat(4, 5, 1));
    current_9.push(getRandomFloat(4, 5, 1));
  }


  if (req.body.type == 'days') {
    res.status(200).send({ 
      current_1 : current_1,
      current_2 : current_2,
      current_3 : current_3,
      current_4 : current_4,
      current_5 : current_5,
      current_6 : current_6,
      current_7 : current_7,
      current_8 : current_8,
      current_9 : current_9,
      label : label_day
    });
  } else if (req.body.type == 'weeks') {
    res.status(200).send({ 
      current_1 : current_1,
      current_2 : current_2,
      current_3 : current_3,
      current_4 : current_4,
      current_5 : current_5,
      current_6 : current_6,
      current_7 : current_7,
      current_8 : current_8,
      current_9 : current_9,
      label : label_week
    });
  } else if (req.body.type == 'month') {
    res.status(200).send({ 
      current_1 : current_1,
      current_2 : current_2,
      current_3 : current_3,
      current_4 : current_4,
      current_5 : current_5,
      current_6 : current_6,
      current_7 : current_7,
      current_8 : current_8,
      current_9 : current_9,
      label : label_month
    });
  } 
      
});

module.exports = router;
