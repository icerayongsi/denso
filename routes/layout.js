const { json } = require('express');
const express = require('express');
const app = express();
const server = require('http').createServer();
const mongoose = require("mongoose");
const router = express.Router();
const Data_Schema = require('../models/Schema');
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')
const io = require('socket.io')(5000);
const moment = require('moment');
const { type } = require('os');

let encodeUrl = express.urlencoded({ extended: false });


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
    console.log(message);
    if (topic.substring(0, 8) == '22060001') {
      message = JSON.parse(message.toString());
      socket.emit('temp-chamber', {
        bz1: message.data[0].Z1_Atmosphere_R,
        bz2: message.data[0].Z2_Atmosphere_R,
        bz3: message.data[0].Z3_Atmosphere_R,
        bz4: message.data[0].Z4_Atmosphere_R,
        bz5: message.data[0].Z4_Atmosphere_L,
        pre1: message.data[0].Front_Heater,
        pre2: message.data[0].Exit_Chamber_Heater,
      });
      socket.emit('other-sensor', {
        Meshbelt_Speed: message.data[0].Meshbelt_Speed,
        O2_Density: message.data[0].O2_Density,
        N2_Gas_supply: message.data[0].N2_Gas_supply,
      });
    }

    if (topic.substring(0, 8) == '22060050') {
      message = JSON.parse(message.toString());
      socket.emit('vibrator', {
        vi1_Z: message.data[0].Vibrator_1_1,
        vi1_X: message.data[0].Vibrator_1_3,
        vi2_Z: message.data[0].Vibrator_2_1,
        vi2_X: message.data[0].Vibrator_2_3,
        vi3_Z: message.data[0].Vibrator_3_1,
        vi3_X: message.data[0].Vibrator_3_3,
        vi4_Z: message.data[0].Vibrator_4_1,
        vi4_X: message.data[0].Vibrator_4_3,
        vi5_Z: message.data[0].Vibrator_5_1,
        vi5_X: message.data[0].Vibrator_5_3,
        vi6_Z: message.data[0].Vibrator_6_1,
        vi6_X: message.data[0].Vibrator_6_3,
        vi7_Z: message.data[0].Vibrator_7_1,
        vi7_X: message.data[0].Vibrator_7_3,
        vi8_Z: message.data[0].Vibrator_8_1,
        vi8_X: message.data[0].Vibrator_8_3,
        vi9_Z: message.data[0].Vibrator_9_1,
        vi9_X: message.data[0].Vibrator_9_3,
      });
      socket.emit('temp', {
        temp_1: message.data[0].temp_1,
        temp_2: message.data[0].temp_2,
        temp_3: message.data[0].temp_3,
        temp_4: message.data[0].temp_4,
        temp_5: message.data[0].temp_5,
        temp_6: message.data[0].temp_6,
        temp_7: message.data[0].temp_7,
        temp_8: message.data[0].temp_8,
        temp_9: message.data[0].temp_9,
      });
    }
  });
});

const data = [{}];

router.get('/', async (req, res, next) => {

  // let first_row = await Data_Schema.findOne({}, { times: 1 })
  // let result_month = [];
  // for (i = 0; i < 4; i++) {

  //   let last_month = Date.now() - 2678400000 * (1 + i);

  //   result_month.push(await Data_Schema.aggregate([
  //     {
  //       $match: {
  //         times: {
  //           $gte: Date.now() - 2678400000 * (1 + i),
  //           $lte: Date.now() - 2678400000 * (0 + i)
  //         }
  //       }
  //     },
  //     {
  //       $group:
  //       {
  //         _id: moment().subtract(i, "month").format('DD/MM/YYYY'),
  //         vi1_z_max: { $max: "$data.Vibrator_1_1" },
  //         vi1_x_max: { $max: "$data.Vibrator_1_3" },
  //         vi2_z_max: { $max: "$data.Vibrator_2_1" },
  //         vi2_x_max: { $max: "$data.Vibrator_2_3" },
  //         vi3_z_max: { $max: "$data.Vibrator_3_1" },
  //         vi3_x_max: { $max: "$data.Vibrator_3_3" },
  //         vi4_z_max: { $max: "$data.Vibrator_4_1" },
  //         vi4_x_max: { $max: "$data.Vibrator_4_3" },
  //         vi5_z_max: { $max: "$data.Vibrator_5_1" },
  //         vi5_x_max: { $max: "$data.Vibrator_5_3" },
  //         vi6_z_max: { $max: "$data.Vibrator_6_1" },
  //         vi6_x_max: { $max: "$data.Vibrator_6_3" },
  //         vi7_z_max: { $max: "$data.Vibrator_7_1" },
  //         vi7_x_max: { $max: "$data.Vibrator_7_3" },
  //         vi8_z_max: { $max: "$data.Vibrator_8_1" },
  //         vi8_x_max: { $max: "$data.Vibrator_8_3" },
  //         vi9_z_max: { $max: "$data.Vibrator_9_1" },
  //         vi9_x_max: { $max: "$data.Vibrator_9_3" },
  //       }
  //     }

  //   ]));
  //   if (last_month < first_row.times) {
  //     break;
  //   }
  // }
  // let date_label = []
  // let x_1 = []
  // result_month.forEach((elment, i) => {

  //   date_label.push(elment[0]._id)
  //   x_1.push(elment[0].vi1_z_max[0]);

  // });
  // console.log(date_label);
  // console.log(x_1);

  res.render('layout', { title: title, header: 'Mechine layout', sw: 1 });
});

router.post('/', encodeUrl, async (req, res, next) => {
  console.log(req.body.sw);
});

router.get('/BrazingGIC1', function (req, res, next) {
  console.log(req.query.page);
  res.render('dashboard/BrazingGIC_1/BrazingGIC_1', { title: title, header: 'BrazingGIC 1', page: req.query.page });
});

router.get('/BrazingGIC1/history', function (req, res, next) {
  res.render('history', { title: title, header: 'BrazingGIC 1' });
});

router.post('/BrazingGIC1/history', encodeUrl, async (req, res, next) => {

  let select_query = [];
  let header = "";

  switch (req.query.category) {
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


  if (req.body.fromdate != undefined && req.body.todate != undefined) {
    var fromdate_ = new Date(Date.parse(req.body.fromdate)).toLocaleString("en-US", { timeZone: "Asia/Bangkok", hour12: false });
    var todate_ = new Date(Date.parse((req.body.todate))).toLocaleString("en-US", { timeZone: "Asia/Bangkok", hour12: false });
    var raw_fromdate = Date.parse(req.body.fromdate);
    var raw_todate = Date.parse(req.body.todate);
    var data_1 = await Data_Schema.find({
      times:
      {
        $gte: Date.parse(req.body.fromdate),
        $lte: Date.parse(req.body.todate) + 1000
      }
    },
      select_query
    );
  } else {
    var fromdate_ = new Date(parseInt(req.query.fromdate)).toLocaleString("en-US", { timeZone: "Asia/Bangkok", hour12: false });
    var todate_ = new Date(parseInt(req.query.todate)).toLocaleString("en-US", { timeZone: "Asia/Bangkok", hour12: false });
    var raw_fromdate = req.query.fromdate;
    var raw_todate = req.query.todate;
    var data_1 = await Data_Schema.find({
      times:
      {
        $gte: req.query.fromdate,
        $lte: (req.query.todate) + 1000
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


  const obj = { title: 'Dashboard', from: fromdate_, to: todate_ };
  //res.render('main/dashboard_index', JSON.stringify(obj));
  res.render('dashboard/BrazingGIC_1/BrazingGIC_1_history/history_index', {
    title: 'Dashboard',
    header: header,
    category: req.query.category,
    from: fromdate_,
    to: todate_,
    data: JSON.stringify(data_1),
    raw_fromdate: raw_fromdate,
    raw_todate: raw_todate
  });
  //res.send(JSON.stringify(obj));

});


const getLastWeeksDate = (days) => {
  let result = []
  for (i = 0; i < days; i++) {
    result.push(moment().isoWeekday((-7 * i) + 1).format('DD/MM/YYYY'));
  }
  return result.reverse();
}

const getLastDaysDate = (days) => {
  let result = [moment().format('DD/MM/YYYY')]
  for (i = 1; i < days; i++) {
    result.push(moment().subtract(i, "days").format('DD/MM/YYYY'));
  }
  return result.reverse();
}

const getLastMonthDate = (month) => {
  let result = []
  for (i = 0; i < month; i++) {
    result.push(moment().subtract(i, 'months').format('DD/MM/YYYY'));
  }
  return result.reverse();
}

// const now = new Date().toLocaleDateString("th-TH", {timeZone: "Asia/Bangkok",hour12: false});
// console.log(moment().month(0).format('DD/MM/YYYY'))
// console.log(getLastMonthDate(4));

router.post('/BrazingGIC1/sort-chart', encodeUrl, async (req, res, next) => {
  data_x_zxis = [0.843, 0.981, 0.904, 0.783, 1.203, 0.737, 0.737, 0.873, 0.835, 0.806, 0.972, 1, 0.838, 0.717, 0.798, 0.79, 0.976, 0.567, 0.682, 0.976, 0.972, 0.998, 0.998, 0.798, 0.77, 0.953, 0.876, 0.976, 1.106, 0.842]
  data_z_zxis = [0.843, 0.981, 0.904, 0.783, 1.203, 0.737, 0.737, 0.873, 0.835, 0.806, 0.972, 1, 0.838, 0.717, 0.798, 0.79, 0.976, 0.567, 0.682, 0.976, 0.972, 0.998, 0.998, 0.798, 0.77, 0.953, 0.876, 0.976, 1.106, 0.842]

  let first_row = await Data_Schema.findOne({}, { times: 1 })

  var date_label = [];

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

  // data_x_zxis.forEach((element, i) => {
  //   x_0.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);
  //   z_0.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);

  //   x_1.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);
  //   z_1.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);

  //   x_2.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);
  //   z_2.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);

  //   x_3.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);
  //   z_3.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);

  //   x_4.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);
  //   z_4.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);

  //   x_5.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);
  //   z_5.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);

  //   x_6.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);
  //   z_6.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);

  //   x_7.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);
  //   z_7.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);

  //   x_8.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);
  //   z_8.push(data_z_zxis[i] + (Math.floor(Math.random() * 300)) / 1000);
  // });

  // console.log(x_0)
  // console.log(req.body.type)

  if (req.body.type == 'days') {

    let result_day = [];
    for (i = 0; i < 26; i++) {

      let last_day = Date.now() - 86400000 * (1 + i);

      result_day.push(await Data_Schema.aggregate([
        {
          $match: {
            times: {
              $gte: Date.now() - 86400000 * (1 + i),
              $lte: Date.now() - 86400000 * (0 + i)
            }
          }
        },
        {
          $group:
          {
            _id: moment().subtract(i, "days").format('DD/MM/YYYY'),
            vi1_z_max: { $max: "$data.Vibrator_1_1" || 0 },
            vi1_x_max: { $max: "$data.Vibrator_1_3" || 0 },
            vi2_z_max: { $max: "$data.Vibrator_2_1" || 0 },
            vi2_x_max: { $max: "$data.Vibrator_2_3" || 0 },
            vi3_z_max: { $max: "$data.Vibrator_3_1" || 0 },
            vi3_x_max: { $max: "$data.Vibrator_3_3" || 0 },
            vi4_z_max: { $max: "$data.Vibrator_4_1" || 0 },
            vi4_x_max: { $max: "$data.Vibrator_4_3" || 0 },
            vi5_z_max: { $max: "$data.Vibrator_5_1" || 0 },
            vi5_x_max: { $max: "$data.Vibrator_5_3" || 0 },
            vi6_z_max: { $max: "$data.Vibrator_6_1" || 0 },
            vi6_x_max: { $max: "$data.Vibrator_6_3" || 0 },
            vi7_z_max: { $max: "$data.Vibrator_7_1" || 0 },
            vi7_x_max: { $max: "$data.Vibrator_7_3" || 0 },
            vi8_z_max: { $max: "$data.Vibrator_8_1" || 0 },
            vi8_x_max: { $max: "$data.Vibrator_8_3" || 0 },
            vi9_z_max: { $max: "$data.Vibrator_9_1" || 0 },
            vi9_x_max: { $max: "$data.Vibrator_9_3" || 0 },
          }
        }

      ]));

      if (last_day < first_row.times) {
        break;
      }
    }

    result_day.forEach((element, i) => {
      //date_label.push(element[0]._id)

      try {
        x_0.push(element[0].vi1_x_max[0] || 0);
        z_0.push(element[0].vi1_z_max[0] || 0);
        x_1.push(element[0].vi2_x_max[0] || 0);
        z_1.push(element[0].vi2_z_max[0] || 0);
        x_2.push(element[0].vi3_x_max[0] || 0);
        z_2.push(element[0].vi3_z_max[0] || 0);
        x_3.push(element[0].vi4_x_max[0] || 0);
        z_3.push(element[0].vi4_z_max[0] || 0);
        x_4.push(element[0].vi5_x_max[0] || 0);
        z_4.push(element[0].vi5_z_max[0] || 0);
        x_5.push(element[0].vi6_x_max[0] || 0);
        z_5.push(element[0].vi6_z_max[0] || 0);
        x_6.push(element[0].vi7_x_max[0] || 0);
        z_6.push(element[0].vi7_z_max[0] || 0);
        x_7.push(element[0].vi8_x_max[0] || 0);
        z_7.push(element[0].vi8_z_max[0] || 0);
        x_8.push(element[0].vi9_x_max[0] || 0);
        z_8.push(element[0].vi9_z_max[0] || 0);
      } catch {
        x_0.push(0);
        z_0.push(0);
        x_1.push(0);
        z_1.push(0);
        x_2.push(0);
        z_2.push(0);
        x_3.push(0);
        z_3.push(0);
        x_4.push(0);
        z_4.push(0);
        x_5.push(0);
        z_5.push(0);
        x_6.push(0);
        z_6.push(0);
        x_7.push(0);
        z_7.push(0);
        x_8.push(0);
        z_8.push(0);
      }

    });


    res.status(200).send({
      x_0: x_0.reverse(),
      z_0: z_0.reverse(),
      x_1: x_1.reverse(),
      z_1: z_1.reverse(),
      x_2: x_2.reverse(),
      z_2: z_2.reverse(),
      x_3: x_3.reverse(),
      z_3: z_3.reverse(),
      x_4: x_4.reverse(),
      z_4: z_4.reverse(),
      x_5: x_5.reverse(),
      z_5: z_5.reverse(),
      x_6: x_6.reverse(),
      z_6: z_6.reverse(),
      x_7: x_7.reverse(),
      z_7: z_7.reverse(),
      x_8: x_8.reverse(),
      z_8: z_8.reverse(),
      label: getLastDaysDate(25)
    });
  } else if (req.body.type == 'weeks') {

    // Query

    let result_week = [];

    for (i = 0; i < 7; i++) {
      let last_week = Date.now() - 604800000 * (1 + i);
      result_week.push(await Data_Schema.aggregate([
        {
          $match: {
            times: {
              $gte: Date.now() - 604800000 * (1 + i),
              $lte: Date.now() - 604800000 * (0 + i)
            }
          }
        },
        {
          $group:
          {
            _id: moment().isoWeekday((-7 * i) + 1).format('DD/MM/YYYY'),
            vi1_z_max: { $max: "$data.Vibrator_1_1" },
            vi1_x_max: { $max: "$data.Vibrator_1_3" },
            vi2_z_max: { $max: "$data.Vibrator_2_1" },
            vi2_x_max: { $max: "$data.Vibrator_2_3" },
            vi3_z_max: { $max: "$data.Vibrator_3_1" },
            vi3_x_max: { $max: "$data.Vibrator_3_3" },
            vi4_z_max: { $max: "$data.Vibrator_4_1" },
            vi4_x_max: { $max: "$data.Vibrator_4_3" },
            vi5_z_max: { $max: "$data.Vibrator_5_1" },
            vi5_x_max: { $max: "$data.Vibrator_5_3" },
            vi6_z_max: { $max: "$data.Vibrator_6_1" },
            vi6_x_max: { $max: "$data.Vibrator_6_3" },
            vi7_z_max: { $max: "$data.Vibrator_7_1" },
            vi7_x_max: { $max: "$data.Vibrator_7_3" },
            vi8_z_max: { $max: "$data.Vibrator_8_1" },
            vi8_x_max: { $max: "$data.Vibrator_8_3" },
            vi9_z_max: { $max: "$data.Vibrator_9_1" },
            vi9_x_max: { $max: "$data.Vibrator_9_3" },
          }
        }
      ]));

      if (last_week <= first_row.times) {
        break;
      }

    }

    result_week.forEach((element, i) => {
      date_label.push(element[0]._id)
      x_0.push(element[0].vi1_x_max[0] || 0);
      z_0.push(element[0].vi1_z_max[0] || 0);
      x_1.push(element[0].vi2_x_max[0] || 0);
      z_1.push(element[0].vi2_z_max[0] || 0);
      x_2.push(element[0].vi3_x_max[0] || 0);
      z_2.push(element[0].vi3_z_max[0] || 0);
      x_3.push(element[0].vi4_x_max[0] || 0);
      z_3.push(element[0].vi4_z_max[0] || 0);
      x_4.push(element[0].vi5_x_max[0] || 0);
      z_4.push(element[0].vi5_z_max[0] || 0);
      x_5.push(element[0].vi6_x_max[0] || 0);
      z_5.push(element[0].vi6_z_max[0] || 0);
      x_6.push(element[0].vi7_x_max[0] || 0);
      z_6.push(element[0].vi7_z_max[0] || 0);
      x_7.push(element[0].vi8_x_max[0] || 0);
      z_7.push(element[0].vi8_z_max[0] || 0);
      x_8.push(element[0].vi9_x_max[0] || 0);
      z_8.push(element[0].vi9_z_max[0] || 0);

    });


    // END Query

    res.status(200).send({
      x_0: x_0.reverse(),
      z_0: z_0.reverse(),
      x_1: x_1.reverse(),
      z_1: z_1.reverse(),
      x_2: x_2.reverse(),
      z_2: z_2.reverse(),
      x_3: x_3.reverse(),
      z_3: z_3.reverse(),
      x_4: x_4.reverse(),
      z_4: z_4.reverse(),
      x_5: x_5.reverse(),
      z_5: z_5.reverse(),
      x_6: x_6.reverse(),
      z_6: z_6.reverse(),
      x_7: x_7.reverse(),
      z_7: z_7.reverse(),
      x_8: x_8.reverse(),
      z_8: z_8.reverse(),
      label: date_label.reverse()
    });
  } else if (req.body.type == 'month') {

    let result_month = [];
    for (i = 0; i < 4; i++) {

      let last_month = Date.now() - 2678400000 * (1 + i);

      result_month.push(await Data_Schema.aggregate([
        {
          $match: {
            times: {
              $gte: Date.now() - 2678400000 * (1 + i),
              $lte: Date.now() - 2678400000 * (0 + i)
            }
          }
        },
        {
          $group:
          {
            _id: moment().subtract(i, "month").format('DD/MM/YYYY'),
            vi1_z_max: { $max: "$data.Vibrator_1_1" },
            vi1_x_max: { $max: "$data.Vibrator_1_3" },
            vi2_z_max: { $max: "$data.Vibrator_2_1" },
            vi2_x_max: { $max: "$data.Vibrator_2_3" },
            vi3_z_max: { $max: "$data.Vibrator_3_1" },
            vi3_x_max: { $max: "$data.Vibrator_3_3" },
            vi4_z_max: { $max: "$data.Vibrator_4_1" },
            vi4_x_max: { $max: "$data.Vibrator_4_3" },
            vi5_z_max: { $max: "$data.Vibrator_5_1" },
            vi5_x_max: { $max: "$data.Vibrator_5_3" },
            vi6_z_max: { $max: "$data.Vibrator_6_1" },
            vi6_x_max: { $max: "$data.Vibrator_6_3" },
            vi7_z_max: { $max: "$data.Vibrator_7_1" },
            vi7_x_max: { $max: "$data.Vibrator_7_3" },
            vi8_z_max: { $max: "$data.Vibrator_8_1" },
            vi8_x_max: { $max: "$data.Vibrator_8_3" },
            vi9_z_max: { $max: "$data.Vibrator_9_1" },
            vi9_x_max: { $max: "$data.Vibrator_9_3" },
          }
        }

      ]));
      if (last_month < first_row.times) {
        break;
      }
    }

    result_month.forEach((element, i) => {
      date_label.push(element[0]._id)
      x_0.push(element[0].vi1_x_max[0]);
      z_0.push(element[0].vi1_z_max[0]);
      x_1.push(element[0].vi2_x_max[0]);
      z_1.push(element[0].vi2_z_max[0]);
      x_2.push(element[0].vi3_x_max[0]);
      z_2.push(element[0].vi3_z_max[0]);
      x_3.push(element[0].vi4_x_max[0]);
      z_3.push(element[0].vi4_z_max[0]);
      x_4.push(element[0].vi5_x_max[0]);
      z_4.push(element[0].vi5_z_max[0]);
      x_5.push(element[0].vi6_x_max[0]);
      z_5.push(element[0].vi6_z_max[0]);
      x_6.push(element[0].vi7_x_max[0]);
      z_6.push(element[0].vi7_z_max[0]);
      x_7.push(element[0].vi8_x_max[0]);
      z_7.push(element[0].vi8_z_max[0]);
      x_8.push(element[0].vi9_x_max[0]);
      z_8.push(element[0].vi9_z_max[0]);
    });

    res.status(200).send({
      x_0: x_0.reverse(),
      z_0: z_0.reverse(),
      x_1: x_1.reverse(),
      z_1: z_1.reverse(),
      x_2: x_2.reverse(),
      z_2: z_2.reverse(),
      x_3: x_3.reverse(),
      z_3: z_3.reverse(),
      x_4: x_4.reverse(),
      z_4: z_4.reverse(),
      x_5: x_5.reverse(),
      z_5: z_5.reverse(),
      x_6: x_6.reverse(),
      z_6: z_6.reverse(),
      x_7: x_7.reverse(),
      z_7: z_7.reverse(),
      x_8: x_8.reverse(),
      z_8: z_8.reverse(),
      label: date_label.reverse()
    });
  }

});

const getRandomFloat = (min, max, decimals) => {
  let str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

router.post('/BrazingGIC1/sort-chart-temp', encodeUrl, async (req, res, next) => {

  let temp_1 = [];
  let temp_2 = [];
  let temp_3 = [];
  let temp_4 = [];
  let temp_5 = [];
  let temp_6 = [];
  let temp_7 = [];
  let temp_8 = [];
  let temp_9 = [];

  for (let i = 0; i <= 30; i++) {
    temp_1.push(getRandomFloat(53, 56, 0));
    temp_2.push(getRandomFloat(53, 47, 0));
    temp_3.push(getRandomFloat(45, 47, 0));
    temp_4.push(getRandomFloat(45, 47, 0));
    temp_5.push(getRandomFloat(45, 47, 0));
    temp_6.push(getRandomFloat(45, 47, 0));
    temp_7.push(getRandomFloat(45, 47, 0));
    temp_8.push(getRandomFloat(45, 47, 0));
    temp_9.push(getRandomFloat(49, 51, 0));
  }


  if (req.body.type == 'days') {
    res.status(200).send({
      temp_1: temp_1,
      temp_2: temp_2,
      temp_3: temp_3,
      temp_4: temp_4,
      temp_5: temp_5,
      temp_6: temp_6,
      temp_7: temp_7,
      temp_8: temp_8,
      temp_9: temp_9,
      label: getLastDaysDate(30)
    });
  } else if (req.body.type == 'weeks') {
    res.status(200).send({
      temp_1: temp_1,
      temp_2: temp_2,
      temp_3: temp_3,
      temp_4: temp_4,
      temp_5: temp_5,
      temp_6: temp_6,
      temp_7: temp_7,
      temp_8: temp_8,
      temp_9: temp_9,
      label: getLastWeeksDate(7)
    });
  } else if (req.body.type == 'month') {
    res.status(200).send({
      temp_1: temp_1,
      temp_2: temp_2,
      temp_3: temp_3,
      temp_4: temp_4,
      temp_5: temp_5,
      temp_6: temp_6,
      temp_7: temp_7,
      temp_8: temp_8,
      temp_9: temp_9,
      label: getLastMonthDate(4)
    });
  }



});

router.post('/BrazingGIC1/sort-chart-current', encodeUrl, async (req, res, next) => {

  let current_1 = [];
  let current_2 = [];
  let current_3 = [];
  let current_4 = [];
  let current_5 = [];
  let current_6 = [];
  let current_7 = [];
  let current_8 = [];
  let current_9 = [];

  for (let i = 0; i <= 30; i++) {
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
      current_1: current_1,
      current_2: current_2,
      current_3: current_3,
      current_4: current_4,
      current_5: current_5,
      current_6: current_6,
      current_7: current_7,
      current_8: current_8,
      current_9: current_9,
      label: getLastDaysDate(30)
    });
  } else if (req.body.type == 'weeks') {
    res.status(200).send({
      current_1: current_1,
      current_2: current_2,
      current_3: current_3,
      current_4: current_4,
      current_5: current_5,
      current_6: current_6,
      current_7: current_7,
      current_8: current_8,
      current_9: current_9,
      label: getLastWeeksDate(7)
    });
  } else if (req.body.type == 'month') {
    res.status(200).send({
      current_1: current_1,
      current_2: current_2,
      current_3: current_3,
      current_4: current_4,
      current_5: current_5,
      current_6: current_6,
      current_7: current_7,
      current_8: current_8,
      current_9: current_9,
      label: getLastMonthDate(4)
    });
  }

});

module.exports = router;
