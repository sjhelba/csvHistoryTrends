'use strict';

const fs = require('fs');
const moment = require('moment')
const {prompt} = require('./prompts');
const getRandomValue = (min, max) => Math.random() * (max - min + 1) + min;

const deviceLevelRoundUps = [ //need prompts
  '_OptHr', 
  '_StdHr', 
  '_MsKw'
];
const chillerDeviceLevelRoundUps = [  //need prompts
  '_MsTr',
  '_MsEff'
];
const reducedEqLevelRoundUps = [
  '_MsKw',  //sum
  '_OptHr', //sum
  '_StdHr'  //sum
];
const reducedChillerEqLevelRoundUps = [
  '_MsEff'  //avg
];
const eqLevelCalculatedTrends = [
  '_BlKwHm' //based off of '_MsKwHm'
];
const reducedSystemLevelRoundUps = [
  'System_MsKw', //sum
  'System_OptHr', //sum
  'System_StdHr', //sum
];
const reducedChillerSystemLevelRoundUps = [
  'System_MsTr' //reduced from chillers' devices round ups  //sum
];
const calculatedSystemLevelRoundUps = [ //need prompts
  'System_MsEff', //reduced from chillers eq level round up plus some extra amount for 'Auxillary Equipment'  //avg
  'System_oacDryBulb' //non-reduced round-up
];
const systemLevelCalculatedTrends = [
  'System_Bur',   //COV   //need prompt
  'System_CorporateCurrencyExchange',    //COV    //need prompt
  'System_BlEffHm',  //based off of 'System_MsEffHm'
  'System_PrEffHm',	  //based off of 'System_MsEffHm'
];




const trendsInfo = {};
deviceLevelRoundUps.forEach(trend => {
  trendsInfo[trend] = {
    name: trend,
    Chillers: {
      Jan: {min: 0, max: 1},
      Feb: {min: 0, max: 1},
      Mar: {min: 0, max: 1},
      Apr: {min: 0, max: 1},
      May: {min: 0, max: 1},
      Jun: {min: 0, max: 1},
      Jul: {min: 0, max: 1},
      Aug: {min: 0, max: 1},
      Sep: {min: 0, max: 1},
      Oct: {min: 0, max: 1},
      Nov: {min: 0, max: 1},
      Dec: {min: 0, max: 1}
    },
    Towers: {
      Jan: {min: 0, max: 1},
      Feb: {min: 0, max: 1},
      Mar: {min: 0, max: 1},
      Apr: {min: 0, max: 1},
      May: {min: 0, max: 1},
      Jun: {min: 0, max: 1},
      Jul: {min: 0, max: 1},
      Aug: {min: 0, max: 1},
      Sep: {min: 0, max: 1},
      Oct: {min: 0, max: 1},
      Nov: {min: 0, max: 1},
      Dec: {min: 0, max: 1}
    },
    Pcwps: {
      Jan: {min: 0, max: 1},
      Feb: {min: 0, max: 1},
      Mar: {min: 0, max: 1},
      Apr: {min: 0, max: 1},
      May: {min: 0, max: 1},
      Jun: {min: 0, max: 1},
      Jul: {min: 0, max: 1},
      Aug: {min: 0, max: 1},
      Sep: {min: 0, max: 1},
      Oct: {min: 0, max: 1},
      Nov: {min: 0, max: 1},
      Dec: {min: 0, max: 1}
    },
    Scwps: {
      Jan: {min: 0, max: 1},
      Feb: {min: 0, max: 1},
      Mar: {min: 0, max: 1},
      Apr: {min: 0, max: 1},
      May: {min: 0, max: 1},
      Jun: {min: 0, max: 1},
      Jul: {min: 0, max: 1},
      Aug: {min: 0, max: 1},
      Sep: {min: 0, max: 1},
      Oct: {min: 0, max: 1},
      Nov: {min: 0, max: 1},
      Dec: {min: 0, max: 1}
    },
    Twps: {
      Jan: {min: 0, max: 1},
      Feb: {min: 0, max: 1},
      Mar: {min: 0, max: 1},
      Apr: {min: 0, max: 1},
      May: {min: 0, max: 1},
      Jun: {min: 0, max: 1},
      Jul: {min: 0, max: 1},
      Aug: {min: 0, max: 1},
      Sep: {min: 0, max: 1},
      Oct: {min: 0, max: 1},
      Nov: {min: 0, max: 1},
      Dec: {min: 0, max: 1}
    }
  };
});
chillerDeviceLevelRoundUps.forEach(trend => {
  trendsInfo[trend] = {
    name: trend,
    Jan: {min: 0, max: 1},
    Feb: {min: 0, max: 1},
    Mar: {min: 0, max: 1},
    Apr: {min: 0, max: 1},
    May: {min: 0, max: 1},
    Jun: {min: 0, max: 1},
    Jul: {min: 0, max: 1},
    Aug: {min: 0, max: 1},
    Sep: {min: 0, max: 1},
    Oct: {min: 0, max: 1},
    Nov: {min: 0, max: 1},
    Dec: {min: 0, max: 1}
  };
});
trendsInfo.System_MsEff = {
  name: 'System_MsEff',
  auxillaryAvg : {
    Jan: {min: 0, max: 1},
    Feb: {min: 0, max: 1},
    Mar: {min: 0, max: 1},
    Apr: {min: 0, max: 1},
    May: {min: 0, max: 1},
    Jun: {min: 0, max: 1},
    Jul: {min: 0, max: 1},
    Aug: {min: 0, max: 1},
    Sep: {min: 0, max: 1},
    Oct: {min: 0, max: 1},
    Nov: {min: 0, max: 1},
    Dec: {min: 0, max: 1}
  }
};
trendsInfo.System_oacDryBulb = {
  name: 'System_oacDryBulb',
  Jan: {min: 0, max: 1},
  Feb: {min: 0, max: 1},
  Mar: {min: 0, max: 1},
  Apr: {min: 0, max: 1},
  May: {min: 0, max: 1},
  Jun: {min: 0, max: 1},
  Jul: {min: 0, max: 1},
  Aug: {min: 0, max: 1},
  Sep: {min: 0, max: 1},
  Oct: {min: 0, max: 1},
  Nov: {min: 0, max: 1},
  Dec: {min: 0, max: 1}
};
trendsInfo.System_Bur = {
  name: 'System_Bur',
  rate: 0.05
};
trendsInfo.System_CorporateCurrencyExchange = {
  name: 'System_CorporateCurrencyExchange',
  rate: 1
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const eqGroups = ['Chillers', 'Towers', 'Pcwps', 'Scwps', 'Twps'];
const questions = ['How many devices would you like to create per equipment group? ']; // 0
questions.push('What should the blended utility rate be? '); //1
questions.push('What should the currency exchange rate be? '); //2
months.forEach(month => {
  questions.push('What should the MIN efficiency for \"Auxillary Equipment\" (anything other than chillers) at the system level be for one hour in ' + month + '? ');  //a
  questions.push('What should the MAX efficiency for \"Auxillary Equipment\" (anything other than chillers) at the system level be for one hour in ' + month + '? ');  //b
});
months.forEach(month => {
  questions.push('What should the MIN System_oacDryBulbHh be for one hour in ' + month + '? ');  //c
  questions.push('What should the MAX System_oacDryBulbHh be for one hour in ' + month + '? ');  //d
});
deviceLevelRoundUps.forEach(trend => {  //g
  eqGroups.forEach(eqGroup => { //f
    const singularGroupName = eqGroup.slice(0, -1);
    months.forEach(month => { //e
      questions.push('What should the MIN ' + trend + ' be for a single ' + singularGroupName + ' device ' + ' for one hour in ' + month + '? ');  //0th trend, 0th group, 1st month ... 0th trend, 1st group, 0th month ...
      questions.push('What should the MAX ' + trend + ' be for a single ' + singularGroupName + ' device ' + ' for one hour in ' + month + '? ');
    });
  });
});
chillerDeviceLevelRoundUps.forEach(trend => { //i
  months.forEach(month => { //h
    questions.push('What should the MIN ' + trend + ' be for a single chiller device ' + ' for one hour in ' + month + '? ');
    questions.push('What should the MAX ' + trend + ' be for a single chiller device ' + ' for one hour in ' + month + '? ');
  });
});




console.log('Welcome to the Create Your Own History Trends App! \n I have a lot of questions for you. Take your time because you cannot go back! \n If you need to exit my program at any time, just press Ctrl + c \n Note: If you press backspace, the prompt will disappear but your answer can still be input for that question. \n Good Luck!')
prompt(questions)
  .then(responses => {
    console.log('Great! Thanks for all your help!')
    console.log('Calculating...')

    //responses
    const numOfDevicesPerEqGroup = +responses[0];
    trendsInfo.System_Bur = +responses[1];
    trendsInfo.System_CorporateCurrencyExchange = +responses[2];
    let index = 3
    months.forEach(month => {
      trendsInfo.System_MsEff.auxillaryAvg[month].min = +responses[index];
      index++;
      trendsInfo.System_MsEff.auxillaryAvg[month].max = +responses[index];
      index++;
    });
    months.forEach(month => {
      trendsInfo.System_oacDryBulb[month].min = +responses[index];
      index++;
      trendsInfo.System_oacDryBulb[month].max = +responses[index];
      index++;
    });
    deviceLevelRoundUps.forEach(trend => {
      eqGroups.forEach(eqGroup => {
        months.forEach(month => {
          trendsInfo[trend][eqGroup][month].min = +responses[index];
          index++;
          trendsInfo[trend][eqGroup][month].max = +responses[index];
          index++;
        });
      });
    });
    chillerDeviceLevelRoundUps.forEach(trend => { //i
      months.forEach(month => { //h
        trendsInfo[trend][month].min = +responses[index];
        index++;
        trendsInfo[trend][month].max = +responses[index];
        index++;
      });
    });

    
    //create devicesbyGroup
    const devicesByGroup = {};
    const allDevices = [];
    eqGroups.forEach(eqGroup => {
      devicesByGroup[eqGroup] = [];
      const singularGroupName = eqGroup.slice(0, -1)
      for(let i = 1; i <=numOfDevicesPerEqGroup; i++){
        const deviceName = singularGroupName + i;
        devicesByGroup[eqGroup].push(deviceName);
        allDevices.push(deviceName);
      }
    });
    

    //make rows with timestamps
    const firstBlDate = moment(2008, 'YYYY');
    const currentBlDate = moment(firstBlDate);
    const firstMsDate = moment(2009, 'YYYY');
    const lastMsDate = moment(firstMsDate).subtract(1, 'hours');
    const currentMsDate = moment(firstMsDate);

    const singleRow = firstBlDate;
    const blDateRows = [];
    const msHhDateRows = [];
    const msHdDateRows = [];
    const msHmDateRows = [];
    const msHyDateRows = [];
    while(currentBlDate.year() === firstBlDate.year()) {
      blDateRows.push(moment(currentBlDate));
      currentBlDate.add(1, 'months');
    }
    while(currentMsDate.year() <= 2018) {
      const dateToPush = moment(currentMsDate);
      msHhDateRows.push(dateToPush);
      if (currentMsDate.day() !== lastMsDate.day()) {
        msHdDateRows.push(dateToPush);
        if (currentMsDate.month() !== lastMsDate.month()) {
          msHmDateRows.push(dateToPush);
          if (currentMsDate.year() !== lastMsDate.year()) {
            msHyDateRows.push(dateToPush);
          }
        }
      }
      currentMsDate.add(1, 'hours');
      lastMsDate.add(1, 'hours');
    }



    //Make trend data
    const trends = [];
    // trends.push({
    //   name: trendNAME,
    //   data: trendDATA
    // });



    // get deviceLevelRoundUps Hh
    eqGroups.forEach(eqGroup => {
      devicesByGroup[eqGroup].forEach(device => {
        deviceLevelRoundUps.forEach(deviceLevelRoundUpTrend => {
          const trendObj = {name: device + deviceLevelRoundUpTrend};
          trendObj.data = msHhDateRows.map(hourlyStamp => {
            const info = trendsInfo[deviceLevelRoundUpTrend][eqGroup][hourlyStamp.format('MMM')];
            const value = getRandomValue(info.min, info.max);
            return hourlyStamp.format('x') + ',' + value;
          });
        });
      });
    });

    










    //MAKE CSVs
    trends.forEach(trend => {
      //WRITE A CSV FILE WITH NAME AS TITLE AND DATA AS CONTENT
    })






  });
