const { json } = require('express');
const express = require('express');
const app = express();
const server = require('http').createServer();
const mongoose = require("mongoose");
const router = express.Router();
const Data_Schema = require('../models/Schema');
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com');
const io = require('socket.io')(5000);
const moment = require('moment');
const sessions = require('express-session');

let encodeUrl = express.urlencoded({ extended: false });

var title = 'Denso';

client.on('connect', () => {
  client.subscribe('22060001/#');
  client.subscribe('22060050/#');
  client.subscribe('22080001/#');
  client.subscribe('22080003/#');
  client.subscribe('22080004/#');
  client.subscribe('22090002/#');
  client.subscribe('22090001/#');
  client.subscribe('22100001/#');
  client.subscribe('22100005/#');
  client.subscribe('22100006/#');
  client.subscribe('22100007/#');
  client.subscribe('22100008/#');
  client.subscribe('22100009/#');

  client.subscribe('denso_inj_status/#');
  client.subscribe('denso_inj_value/#');
});

// client.on('message', (topic, message) => {
//   if (topic.substring(6, 9) == 'inj') {
//       message = JSON.parse(message.toString());
//       message.forEach(element => {
//         console.log(element.MC_NameID);
//         if(element.MC_NameID == 11) {
//           console.log(element);
//         }
//       });
      
//     }
// });

io.on("connection", (socket) => {

  client.on('message', (topic, message) => {

    if (topic == 'denso_inj_status/data') {
      
      message = JSON.parse(message.toString());
      message.forEach(element => {
        socket.emit('inj-' + element.MC_NameID , {
          data : element
        });
      });
    }
    
    if (topic == 'denso_inj_value/data') {
      
      message = JSON.parse(message.toString());
      
      message.forEach(element => {
        socket.emit('inj-data-' + element.MC_NameID , {
          data : element
        });
      });
    }

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
        data : message.data[0]
      });
      socket.emit('other-sensor', {
        Meshbelt_Speed: message.data[0].Meshbelt_Speed,
        O2_Density: message.data[0].O2_Density,
        N2_Gas_supply: message.data[0].N2_Gas_supply,
      });
    }

    if (topic.substring(0, 8) == '22060050') { // BRAZING 1
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

    if (topic.substring(0, 8) == '22090002') { // BRAZING 2
      message = JSON.parse(message.toString());
      socket.emit('BRAZING-2-vibrator', {
        vi1_Z: message.data[0].Vibrator_1_Z,
        vi1_X: message.data[0].Vibrator_1_X,
        vi2_Z: message.data[0].Vibrator_2_Z,
        vi2_X: message.data[0].Vibrator_2_X,
        vi3_Z: message.data[0].Vibrator_3_Z,
        vi3_X: message.data[0].Vibrator_3_X,
        vi4_Z: message.data[0].Vibrator_4_Z,
        vi4_X: message.data[0].Vibrator_4_X,
        vi5_Z: message.data[0].Vibrator_5_Z,
        vi5_X: message.data[0].Vibrator_5_X,
        vi6_Z: message.data[0].Vibrator_6_Z,
        vi6_X: message.data[0].Vibrator_6_X,
        vi7_Z: message.data[0].Vibrator_7_Z,
        vi7_X: message.data[0].Vibrator_7_X,
        vi8_Z: message.data[0].Vibrator_8_Z,
        vi8_X: message.data[0].Vibrator_8_X,
        vi9_Z: message.data[0].Vibrator_9_Z,
        vi9_X: message.data[0].Vibrator_9_X,
      });
      socket.emit('BRAZING-2-temp', {
        temp_1: message.data[0].Temp_1,
        temp_2: message.data[0].Temp_2,
        temp_3: message.data[0].Temp_3,
        temp_4: message.data[0].Temp_4,
        temp_5: message.data[0].Temp_5,
        temp_6: message.data[0].Temp_6,
        temp_7: message.data[0].Temp_7,
        temp_8: message.data[0].Temp_8,
        temp_9: message.data[0].Temp_9,
      });
      socket.emit('BRAZING-2-current', {
        current_1: message.data[0].Current_1,
        current_2: message.data[0].Current_2,
        current_3: message.data[0].Current_3,
        current_4: message.data[0].Current_4,
        current_5: message.data[0].Current_5,
        current_6: message.data[0].Current_6,
        current_7: message.data[0].Current_7,
        current_8: message.data[0].Current_8,
        current_9: message.data[0].Current_9,
      });
    }

    if (topic.substring(0, 8) == '22090001') { // BRAZING BRS
      message = JSON.parse(message.toString());
      socket.emit('BRZING-BRS',{
        PV_After_Burner: message.data[0].PV_After_Burner,
        PV_Degreaser_Zone1: message.data[0].PV_Degreaser_Zone1,
        PV_Degreaser_Zone2: message.data[0].PV_Degreaser_Zone2,
        PV_Degreaser_Zone3: message.data[0].PV_Degreaser_Zone3,
        PV_Debinder_Zone1: message.data[0].PV_Debinder_Zone1,
        PV_Debinder_Zone2: message.data[0].PV_Debinder_Zone2,
        PV_Debinder_Zone3: message.data[0].PV_Debinder_Zone3,
        SV_After_Burner: message.data[0].SV_After_Burner,
        SV_Degreaser_Zone1: message.data[0].SV_Degreaser_Zone1,
        SV_Degreaser_Zone2: message.data[0].SV_Degreaser_Zone2,
        SV_Degreaser_Zone3: message.data[0].SV_Degreaser_Zone3,
        SV_Debinder_Zone1: message.data[0].SV_Debinder_Zone1,
        SV_Debinder_Zone2: message.data[0].SV_Debinder_Zone2,
        SV_Debinder_Zone3: message.data[0].SV_Debinder_Zone3
      });
    }

    if (topic.substring(0, 8) == '22080001') {
      message = JSON.parse(message.toString());
      socket.emit('gcac-1-all-data', {
        MC_Status : message.data[0].MC_Status,
        CH1_PA : message.data[0].CH1_PA,
        CH1_SP_A1 : message.data[0].CH1_SP_A1,
        CH1_SP_A2 : message.data[0].CH1_SP_A2,
        CH1_MPA3 : message.data[0].CH1_MPA3,
        CH1_CT : message.data[0].CH1_CT,
        CH2_PA : message.data[0].CH2_PA,
        CH2_SP_B1 : message.data[0].CH2_SP_B1,
        CH2_SP_B2 : message.data[0].CH2_SP_B2,
        CH2_MPA3 : message.data[0].CH2_MPA3,
        CH2_CT : message.data[0].CH2_CT,
        Bit_Trig : message.data[0].Bit_Trig,
        Cal_BG1_CH1 : message.data[0].Cal_BG1_CH1,
        Cal_BG2_CH1 : message.data[0].Cal_BG2_CH1,
        Cal_SG1_CH1 : message.data[0].Cal_SG1_CH1,
        Cal_SG2_CH1 : message.data[0].Cal_SG2_CH1,
        Cal_NG_CH1 : message.data[0].Cal_NG_CH1,
        Cal_SN_CH1 : message.data[0].Cal_SN_CH1,
        Cal_BG1_CH2 : message.data[0].Cal_BG1_CH2,
        Cal_BG2_CH2 : message.data[0].Cal_BG2_CH2,
        Cal_SG1_CH2 : message.data[0].Cal_SG1_CH2,
        Cal_SG2_CH2 : message.data[0].Cal_SG2_CH2,
        Cal_NG_CH2 : message.data[0].Cal_NG_CH2,
        Cal_SN_CH2 : message.data[0].Cal_SN_CH2,
        Cal_HE : message.data[0].Cal_HE
      });
      //console.log(message);
    }

    if (topic.substring(0, 8) == '22100001') {
      message = JSON.parse(message.toString());
      socket.emit('helium-brs-all-data', {
        MC_Status : message.data[0].MC_Status,
        Pressure_Chamber_A : message.data[0].Pressure_Chamber_A,
        Work_Chamber_A : message.data[0].Work_Chamber_A,
        Work_Chamber_B : message.data[0].Work_Chamber_B,
        Pressure_Chamber_B : message.data[0].Pressure_Chamber_B,
        Leak_rate_A : message.data[0].Leak_rate_A,
        Alarm_A : message.data[0].Alarm_A,
        Leak_rate_B : message.data[0].Leak_rate_B,
        Alarm_B : message.data[0].Alarm_B,
        Pressure_Chamber_C : message.data[0].Pressure_Chamber_C,
        Work_Chamber_C : message.data[0].Work_Chamber_C,
        Work_Chamber_D : message.data[0].Work_Chamber_D,
        Pressure_Chamber_D : message.data[0].Pressure_Chamber_D,
        Leak_rate_C : message.data[0].Leak_rate_C,
        Alarm_C : message.data[0].Alarm_C,
        Leak_rate_D : message.data[0].Leak_rate_D,
        Alarm_D : message.data[0].Alarm_D,
        Pressure_Chamber_E : message.data[0].Pressure_Chamber_E,
        Work_Chamber_E : message.data[0].Work_Chamber_E,
        Work_Chamber_F : message.data[0].Work_Chamber_F,
        Pressure_Chamber_F : message.data[0].Pressure_Chamber_F,
        Leak_rate_E : message.data[0].Leak_rate_E,
        Alarm_E : message.data[0].Alarm_E,
        Leak_rate_F : message.data[0].Leak_rate_F,
        Alarm_F : message.data[0].Alarm_F,
        HCM : message.data[0].HCM,
        status : message.data[0].status,
        calibrate : message.data[0].calibrate
      });
    }

    if (topic.substring(0, 8) == '22080003') { // MPOC
      message = JSON.parse(message.toString());
      socket.emit('mpoc-all-data', {
        Chamber_A_Pa: message.data[0].Chamber_A_Pa,
        Chamber_A_MPa1: message.data[0].Chamber_A_MPa1,
        Chamber_A_MPa2: message.data[0].Chamber_A_MPa2,
        Chamber_A_CT: message.data[0].Chamber_A_CT,
        Chamber_B_Pa: message.data[0].Chamber_B_Pa,
        Chamber_B_MPa1: message.data[0].Chamber_B_MPa1,
        Chamber_B_MPa2: message.data[0].Chamber_B_MPa2,
        Chamber_B_CT: message.data[0].Chamber_B_CT,
        Chamber_C_Pa: message.data[0].Chamber_C_Pa,
        Chamber_C_MPa1: message.data[0].Chamber_C_MPa1,
        Chamber_C_MPa2: message.data[0].Chamber_C_MPa2,
        Chamber_C_CT: message.data[0].Chamber_C_CT,
        He: message.data[0].He,
        Cal_Chamber_A_BG1: message.data[0].Cal_Chamber_A_BG1,
        Cal_Chamber_A_BG2: message.data[0].Cal_Chamber_A_BG2,
        Cal_Chamber_A_SG1: message.data[0].Cal_Chamber_A_SG1,
        Cal_Chamber_A_SG2: message.data[0].Cal_Chamber_A_SG2,
        Cal_Chamber_A_NG: message.data[0].Cal_Chamber_A_NG,
        Cal_Chamber_A_SN: message.data[0].Cal_Chamber_A_SN,
        Cal_Chamber_B_BG1: message.data[0].Cal_Chamber_B_BG1,
        Cal_Chamber_B_BG2: message.data[0].Cal_Chamber_B_BG2,
        Cal_Chamber_B_SG1: message.data[0].Cal_Chamber_B_SG1,
        Cal_Chamber_B_SG2: message.data[0].Cal_Chamber_B_SG2,
        Cal_Chamber_B_NG: message.data[0].Cal_Chamber_B_NG,
        Cal_Chamber_B_SN: message.data[0].Cal_Chamber_B_SN,
        Cal_Chamber_C_BG1: message.data[0].Cal_Chamber_C_BG1,
        Cal_Chamber_C_BG2: message.data[0].Cal_Chamber_C_BG2,
        Cal_Chamber_C_SG1: message.data[0].Cal_Chamber_C_SG1,
        Cal_Chamber_C_SG2: message.data[0].Cal_Chamber_C_SG2,
        Cal_Chamber_C_NG: message.data[0].Cal_Chamber_C_NG,
        Cal_Chamber_C_SN: message.data[0].Cal_Chamber_C_SN,
      });
    }

    if (topic.substring(0, 8) == '22100005') { // I/F BRS 3
      message = JSON.parse(message.toString());
      socket.emit('if-brs-3', {
        data : message
      });
    }

    if (topic.substring(0, 8) == '22100006') { // I/F BRS 2
      message = JSON.parse(message.toString());
      socket.emit('if-brs-2', {
        data : message
      });
    }

    if (topic.substring(0, 8) == '22100007') { // I/F GIC 1
      message = JSON.parse(message.toString());
      socket.emit('if-gic-1', {
        data : message
      });
    }

    if (topic.substring(0, 8) == '22100008') { // I/F GIC 2
      message = JSON.parse(message.toString());
      socket.emit('if-gic-2', {
        data : message
      });
    }

    if (topic.substring(0, 8) == '22100009') { // I/F GIC 1
      message = JSON.parse(message.toString());
      socket.emit('if-gic-1', {
        data : message
      });
    }

    if (topic.substring(0, 8) == '22080004') { // HLOC
      message = JSON.parse(message.toString());
      socket.emit('hloc-all-data', {
        MC_Status : message.data[0].MC_Status,
        Product_Volume : message.data[0].Product_Volume,
        Fault1_16 : message.data[0].Fault1_16,
        Fault17_32 : message.data[0].Fault17_32,
        Fault33_48 : message.data[0].Fault33_48,
        Fault49_64 : message.data[0].Fault49_64,
        CH1_Cycle_Time : message.data[0].CH1_Cycle_Time,
        CH1_Cal_BG : message.data[0].CH1_Cal_BG,
        CH1_Cal_ML : message.data[0].CH1_Cal_ML,
        CH1_SN : message.data[0].CH1_SN,
        CH1_Work_Pressure : message.data[0].CH1_Work_Pressure,
        CH1_Master_OK_Vacuum_Time : message.data[0].CH1_Master_OK_Vacuum_Time,
        CH1_High_Pressure : message.data[0].CH1_High_Pressure,
        CH1_Low_Pressure : message.data[0].CH1_Low_Pressure,
        CH2_Cycle_Time : message.data[0].CH2_Cycle_Time,
        CH2_Cal_BG : message.data[0].CH2_Cal_BG,
        CH2_Cal_ML : message.data[0].CH2_Cal_ML,
        CH2_SN : message.data[0].CH2_SN,
        CH2_Work_Pressure : message.data[0].CH2_Work_Pressure,
        CH2_Master_OK_Vacuum_Time : message.data[0].CH2_Master_OK_Vacuum_Time,
        CH2_High_Pressure : message.data[0].CH2_High_Pressure,
        CH2_Low_Pressure : message.data[0].CH2_Low_Pressure,
        CH3_Cycle_Time : message.data[0].CH3_Cycle_Time,
        CH3_Cal_BG : message.data[0].CH3_Cal_BG,
        CH3_Cal_ML : message.data[0].CH3_Cal_ML,
        CH3_SN : message.data[0].CH3_SN,
        CH3_Work_Pressure : message.data[0].CH3_Work_Pressure,
        CH3_Master_OK_Vacuum_Time : message.data[0].CH3_Master_OK_Vacuum_Time,
        CH3_High_Pressure : message.data[0].CH3_High_Pressure,
        CH3_Low_Pressure : message.data[0].CH3_Low_Pressure,
      });
    }

  });
});

const data = [{}];

router.get('/', async (req, res, next) => {

  // if (!req.session.userid) res.redirect('/login');

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
  // if (!req.session.userid) res.redirect('/login');

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
      // x_6 : [
      //     3.571, 4.362, 6.272,
      //   6.94, 10.657,  12.112,  16.428,
      //   27.278, 0,      0,      0,
      //       0,     0,      0,      0,
      //       0, 0.799,  0.989,  0.892,
      //   1.069, 1.091,  1.035,  2.158,
      //   1.086, 1.053,1.053
      // ],
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

  let first_row = await Data_Schema.findOne({}, { times: 1 })

  let date_label = [];

  let temp_1 = [];
  let temp_2 = [];
  let temp_3 = [];
  let temp_4 = [];
  let temp_5 = [];
  let temp_6 = [];
  let temp_7 = [];
  let temp_8 = [];
  let temp_9 = [];

  // for (let i = 0; i <= 30; i++) {
  //   temp_1.push(getRandomFloat(53, 56, 0));
  //   temp_2.push(getRandomFloat(53, 47, 0));
  //   temp_3.push(getRandomFloat(45, 47, 0));
  //   temp_4.push(getRandomFloat(45, 47, 0));
  //   temp_5.push(getRandomFloat(45, 47, 0));
  //   temp_6.push(getRandomFloat(45, 47, 0));
  //   temp_7.push(getRandomFloat(45, 47, 0));
  //   temp_8.push(getRandomFloat(45, 47, 0));
  //   temp_9.push(getRandomFloat(49, 51, 0));
  // }


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
            temp_1 : { $max: "$data.temp_1" || 0 },
            temp_2 : { $max: "$data.temp_2" || 0 },
            temp_3 : { $max: "$data.temp_3" || 0 },
            temp_4 : { $max: "$data.temp_4" || 0 },
            temp_5 : { $max: "$data.temp_5" || 0 },
            temp_6 : { $max: "$data.temp_6" || 0 },
            temp_7 : { $max: "$data.temp_7" || 0 },
            temp_8 : { $max: "$data.temp_8" || 0 },
            temp_9 : { $max: "$data.temp_9" || 0 },
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
        temp_1.push(element[0].temp_1[0] || 0);
        temp_2.push(element[0].temp_2[0] || 0);
        temp_3.push(element[0].temp_3[0] || 0);
        temp_4.push(element[0].temp_4[0] || 0);
        temp_5.push(element[0].temp_5[0] || 0);
        temp_6.push(element[0].temp_6[0] || 0);
        temp_7.push(element[0].temp_7[0] || 0);
        temp_8.push(element[0].temp_8[0] || 0);
        temp_9.push(element[0].temp_9[0] || 0);
      } catch {
        temp_1.push(0);
        temp_2.push(0);
        temp_3.push(0);
        temp_4.push(0);
        temp_5.push(0);
        temp_6.push(0);
        temp_7.push(0);
        temp_8.push(0);
        temp_9.push(0);
      }

    });

    res.status(200).send({
      temp_1: temp_1.reverse(),
      temp_2: temp_2.reverse(),
      temp_3: temp_3.reverse(),
      temp_4: temp_4.reverse(),
      temp_5: temp_5.reverse(),
      temp_6: temp_6.reverse(),
      temp_7: temp_7.reverse(),
      temp_8: temp_8.reverse(),
      temp_9: temp_9.reverse(),
      label: getLastDaysDate(25)
    });
  } else if (req.body.type == 'weeks') {

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
            temp_1 : { $max: "$data.temp_1" || 0 },
            temp_2 : { $max: "$data.temp_2" || 0 },
            temp_3 : { $max: "$data.temp_3" || 0 },
            temp_4 : { $max: "$data.temp_4" || 0 },
            temp_5 : { $max: "$data.temp_5" || 0 },
            temp_6 : { $max: "$data.temp_6" || 0 },
            temp_7 : { $max: "$data.temp_7" || 0 },
            temp_8 : { $max: "$data.temp_8" || 0 },
            temp_9 : { $max: "$data.temp_9" || 0 },
          }
        }
      ]));

      if (last_week <= first_row.times) {
        break;
      }

    }

    result_week.forEach((element, i) => {
      date_label.push(element[0]._id)
      temp_1.push(element[0].temp_1[0] || 0);
      temp_2.push(element[0].temp_2[0] || 0);
      temp_3.push(element[0].temp_3[0] || 0);
      temp_4.push(element[0].temp_4[0] || 0);
      temp_5.push(element[0].temp_5[0] || 0);
      temp_6.push(element[0].temp_6[0] || 0);
      temp_7.push(element[0].temp_7[0] || 0);
      temp_8.push(element[0].temp_8[0] || 0);
      temp_9.push(element[0].temp_9[0] || 0);

    });

    res.status(200).send({
      temp_1: temp_1.reverse(),
      temp_2: temp_2.reverse(),
      temp_3: temp_3.reverse(),
      temp_4: temp_4.reverse(),
      temp_5: temp_5.reverse(),
      temp_6: temp_6.reverse(),
      temp_7: temp_7.reverse(),
      temp_8: temp_8.reverse(),
      temp_9: temp_9.reverse(),
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
            temp_1 : { $max: "$data.temp_1" || 0 },
            temp_2 : { $max: "$data.temp_2" || 0 },
            temp_3 : { $max: "$data.temp_3" || 0 },
            temp_4 : { $max: "$data.temp_4" || 0 },
            temp_5 : { $max: "$data.temp_5" || 0 },
            temp_6 : { $max: "$data.temp_6" || 0 },
            temp_7 : { $max: "$data.temp_7" || 0 },
            temp_8 : { $max: "$data.temp_8" || 0 },
            temp_9 : { $max: "$data.temp_9" || 0 },
          }
        }

      ]));
      if (last_month < first_row.times) {
        break;
      }
    }

    result_month.forEach((element, i) => {
      date_label.push(element[0]._id)
      temp_1.push(element[0].temp_1[0] || 0);
      temp_2.push(element[0].temp_2[0] || 0);
      temp_3.push(element[0].temp_3[0] || 0);
      temp_4.push(element[0].temp_4[0] || 0);
      temp_5.push(element[0].temp_5[0] || 0);
      temp_6.push(element[0].temp_6[0] || 0);
      temp_7.push(element[0].temp_7[0] || 0);
      temp_8.push(element[0].temp_8[0] || 0);
      temp_9.push(element[0].temp_9[0] || 0);
    });


    res.status(200).send({
      temp_1 : temp_1.reverse(),
      temp_2 : temp_2.reverse(),
      temp_3 : temp_3.reverse(),
      temp_4 : temp_4.reverse(),
      temp_5 : temp_5.reverse(),
      temp_6 : temp_6.reverse(),
      temp_7 : temp_7.reverse(),
      temp_8 : temp_8.reverse(),
      temp_9 : temp_9.reverse(),
      label : date_label.reverse()
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

// GCAC 1

router.get('/GCAC_1', function (req, res, next) {
  // if (!req.session.userid) res.redirect('/login');

  res.render('dashboard/GCAC_1/GCAC_1', { title: title, header: 'GCAC_1', page: req.query.page });
});

// END GCAC 1

// HELIUM BRS

router.get('/HeliumBRS', function (req, res, next) {
  // if (!req.session.userid) res.redirect('/login');

  res.render('dashboard/HeliumBRS/HeliumBRS', { title: title, header: 'HeliumBRS', page: req.query.page });
});

// END HELIUM BRS

// MPOC

router.get('/MPOC', function (req, res, next) {
  // if (!req.session.userid) res.redirect('/login');

  res.render('dashboard/MPOC/MPOC', { title: title, header: 'MPOC', page: req.query.page });
});

// END MPOC

// HLOC

router.get('/HLOC', function (req, res, next) {
  // if (!req.session.userid) res.redirect('/login');

  res.render('dashboard/HLOC/HLOC', { title: title, header: 'HLOC', page: req.query.page });
});

// END HLOC

// BrazingGIC2

router.get('/BrazingGIC2', function (req, res, next) {
  // if (!req.session.userid) res.redirect('/login');

  res.render('dashboard/BrazingGIC_2/BrazingGIC_2', { title: title, header: 'BrazingGIC 2', page: req.query.page });
});

// END BrazingGIC2

// BrazingGIC2

router.get('/WCAC', function (req, res, next) {
  // if (!req.session.userid) res.redirect('/login');

  res.render('dashboard/WCAC/WCAC', { title: title, header: 'WCAC', page: req.query.page });
});

// END BrazingGIC2

// BrazingBRS

router.get('/BrazingBRS', function (req, res, next) {
  // if (!req.session.userid) res.redirect('/login');

  res.render('dashboard/BrazingBRS/BrazingBRS', { title: title, header: 'BrazingBRS', page: req.query.page });
});

// END BrazingGIC2

// BrazingBRS

router.get('/BrazingOIL', function (req, res, next) {
  // if (!req.session.userid) res.redirect('/login');

  res.render('dashboard/BrazingOIL/BrazingOIL', { title: title, header: 'BrazingOIL', page: req.query.page });
});

// END BrazingGIC2

// BrazingBRS

router.get('/Injection', function (req, res, next) {
  // if (!req.session.userid) res.redirect('/login');

  res.render('dashboard/Injection/Injection', { title: title, header: 'Injection',inj : req.query.inj , page: req.query.page });
});

// END BrazingGIC2

// IF-BRS-2

router.get('/IF-BRS-2', function (req, res, next) {

  res.render('dashboard/IF_BRS_2/IF_BRS_2', { title: title, header: 'IF-BRS-2' , mc_name : 'I/F BRS 2' , page: req.query.page });
});

// END IF-BRS-2

// IF-BRS-3

router.get('/IF-BRS-3', function (req, res, next) {

  res.render('dashboard/IF_BRS_3/IF_BRS_3', { title: title, header: 'IF-BRS-3' , mc_name : 'I/F BRS 3' , page: req.query.page });
});

// END IF-BRS-3

// IF-GIC-1

router.get('/IF-GIC-1', function (req, res, next) {

  res.render('dashboard/IF_GIC_1/IF_GIC_1', { title: title, header: 'IF-GIC-1' , mc_name : 'I/F GIC 1' , page: req.query.page });
});

// END IF-GIC-1

// IF-GIC-2

router.get('/IF-GIC-2', function (req, res, next) {

  res.render('dashboard/IF_GIC_2/IF_GIC_2', { title: title, header: 'IF-GIC-2' , mc_name : 'I/F GIC 2' , page: req.query.page });
});

// END IF-GIC-2


module.exports = router;
