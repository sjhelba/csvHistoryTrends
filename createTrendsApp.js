'use strict';

const fs = require('fs');
const moment = require('moment')
const {prompt} = require('./prompts');
const getRandomValue = (min, max) => Math.random() * (max - min + 1) + min;

const deviceLevelRoundUps = [ //needs prompts                           
  '_OptHr', //sum
  '_StdHr', //sum //calculated based on _OptHr
  '_MsKw'   //sum
];
const chillerDeviceLevelRoundUps = [  //needs prompts                    
  '_MsTr',  //sum
  '_MsEff'  //avg
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
  '_BlKwHm' //based off of '_MsKwHm' //sum
];
const reducedSystemLevelRoundUps = [                                    
  'System_MsKw', //sum
  'System_OptHr', //sum
  'System_StdHr', //sum
];
const reducedChillerSystemLevelRoundUps = [                             
  'System_MsTr' //reduced from chillers' devices round ups  //sum
];
const calculatedSystemLevelRoundUps = [ //needs prompts                  
  'System_MsEff', //reduced from chillers eq level round up plus some extra amount for 'Auxillary Equipment'  //avg
  'System_oacDryBulb' //non-reduced round-up  //avg
];
const systemLevelCalculatedTrends = [                              
  'System_Bur',   //COV   //needs prompt  
  'System_CorporateCurrencyExchange',    //COV    //needs prompt
  'System_BlEffHm',  //based off of 'System_MsEffHm'  //avg
  'System_PrEffHm',	  //based off of 'System_MsEffHm' //avg
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
deviceLevelRoundUps.filter((trend, trendIndex) => trendIndex !== 1).forEach(trend => {  //g     //ignoring stdHr
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
    deviceLevelRoundUps.filter((trend, trendIndex) => trendIndex !== 1).forEach(trend => {  //ignoring stdHr
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
    // EXAMPLE:
    // trends.push({
    //   name: trendNAME,
    //   data: trendDATA,
    //   avgOrSum: trendReductionMethod (if applicable)
    // });

    /* CREATE ALL HH TRENDS */
    const reducedEqLevelRoundUpData = {};
    const reducedChillerEqLevelRoundUpData = {};
    const reducedSystemLevelRoundUpData = {};
    const reducedChillerSystemLevelRoundUpData = {};

    // get deviceLevelRoundUps Hh
    reducedEqLevelRoundUpData._OptHr = {};
    reducedEqLevelRoundUpData._StdHr = {};
    reducedSystemLevelRoundUpDatareducedEqLevelRoundUpData._OptHr = {};
    reducedSystemLevelRoundUpDatareducedEqLevelRoundUpData._StdHr = {};
    eqGroups.forEach(eqGroup => {
      reducedEqLevelRoundUpData._OptHr[eqGroup] = [];
      reducedEqLevelRoundUpData._StdHr[eqGroup] = [];
      devicesByGroup[eqGroup].forEach(device => {
        const optTrendObj = {name: device + '_OptHrHh', avgOrSum: 'sum'};
        const stdTrendObj = {name: device + '_StdHrHh', avgOrSum: 'sum', data: []};
        optTrendObj.data = msHhDateRows.map((hourlyStamp, stampIndex) => {
          const info = trendsInforeducedEqLevelRoundUpData._OptHr[eqGroup][hourlyStamp.format('MMM')];
          const optValue = getRandomValue(info.min, info.max);
          const stdValue = 1 - optValue;
          const date = hourlyStamp.format('x');
          //std
          if (!reducedEqLevelRoundUpData._StdHr[eqGroup][stampIndex]) reducedEqLevelRoundUpData._StdHr[eqGroup][stampIndex] = {sum: 0, date, avgOrSum: 'sum'};
          reducedEqLevelRoundUpData._StdHr[eqGroup][stampIndex].sum += stdValue;
          if (!reducedSystemLevelRoundUpDatareducedEqLevelRoundUpData._StdHr[stampIndex]) reducedSystemLevelRoundUpDatareducedEqLevelRoundUpData._StdHr[stampIndex] = {sum: 0, date, avgOrSum: 'sum'};
          reducedSystemLevelRoundUpDatareducedEqLevelRoundUpData._StdHr[stampIndex].sum += stdValue;
          stdTrendObj.data.push(date + ',' + stdValue);
          //opt
          if (!reducedEqLevelRoundUpData._OptHr[eqGroup][stampIndex]) reducedEqLevelRoundUpData._OptHr[eqGroup][stampIndex] = {sum: 0, date, avgOrSum: 'sum'};
          reducedEqLevelRoundUpData._OptHr[eqGroup][stampIndex].sum += optValue;
          if (!reducedSystemLevelRoundUpDatareducedEqLevelRoundUpData._OptHr[stampIndex]) reducedSystemLevelRoundUpDatareducedEqLevelRoundUpData._OptHr[stampIndex] = {sum: 0, date, avgOrSum: 'sum'};
          reducedSystemLevelRoundUpDatareducedEqLevelRoundUpData._OptHr[stampIndex].sum += optValue;
          return date + ',' + optValue;
        });
        trends.push(optTrendObj);
        trends.push(stdTrendObj);
      });
    });

    reducedEqLevelRoundUpData._MsKw = {};
    reducedSystemLevelRoundUpDatareducedEqLevelRoundUpData._MsKw = {};
    eqGroups.forEach(eqGroup => {
      reducedEqLevelRoundUpData._MsKw[eqGroup] = [];
      devicesByGroup[eqGroup].forEach(device => {
        const trendObj = {name: device + '_MsKwHh', avgOrSum: 'sum'};
        trendObj.data = msHhDateRows.map((hourlyStamp, stampIndex) => {
          const info = trendsInforeducedEqLevelRoundUpData._MsKw[eqGroup][hourlyStamp.format('MMM')];
          const value = getRandomValue(info.min, info.max);
          const date = hourlyStamp.format('x');
          if (!reducedEqLevelRoundUpData._MsKw[eqGroup][stampIndex]) reducedEqLevelRoundUpData._MsKw[eqGroup][stampIndex] = {sum: 0, date, avgOrSum: 'sum'};
          reducedEqLevelRoundUpData._MsKw[eqGroup][stampIndex].sum += value;
          if (!reducedSystemLevelRoundUpDatareducedEqLevelRoundUpData._MsKw[stampIndex]) reducedSystemLevelRoundUpDatareducedEqLevelRoundUpData._MsKw[stampIndex] = {sum: 0, date, avgOrSum: 'sum'};
          reducedSystemLevelRoundUpDatareducedEqLevelRoundUpData._MsKw[stampIndex].sum += value;
          return date + ',' + value;
        });
        trends.push(trendObj);
      });
    });



    // get chillerDeviceLevelRoundUps Hh
    chillerDeviceLevelRoundUps.forEach(partialTrendName => {
      const avgOrSum = partialTrendName === '_MsTr' ? 'sum' : 'avg';
      reducedChillerEqLevelRoundUpData[partialTrendName] = {};
      reducedChillerSystemLevelRoundUpData[partialTrendName] = {};

      devicesByGroup.Chillers.forEach(device => {
        const trendObj = {name: device + partialTrendName + 'Hh', avgOrSum};
        trendObj.data = msHhDateRows.map((hourlyStamp, stampIndex) => {
          const info = trendsInfo[partialTrendName][hourlyStamp.format('MMM')];
          const value = getRandomValue(info.min, info.max);
          const date = hourlyStamp.format('x');
          //avgs for eq level (eff)
          if (!reducedChillerEqLevelRoundUpData[partialTrendName][stampIndex]) reducedChillerEqLevelRoundUpData[partialTrendName][stampIndex] = {sum: 0, count: 0, date, avgOrSum: 'avg'};
          reducedChillerEqLevelRoundUpData[partialTrendName][stampIndex].count++;
          reducedChillerEqLevelRoundUpData[partialTrendName][stampIndex].sum += value;
          //sums for system level (tR)
          if (!reducedChillerSystemLevelRoundUpData[partialTrendName][stampIndex]) reducedChillerSystemLevelRoundUpData[partialTrendName][stampIndex] = {sum: 0, date, avgOrSum: 'sum'};
          reducedChillerSystemLevelRoundUpData[partialTrendName][stampIndex].sum += value;

          return date + ',' + value;
        });
        trends.push(trendObj);
      });
    });

    
    //get reducedEqLevelRoundUps (sums)
    reducedEqLevelRoundUps.forEach(partialTrendName => {
      eqGroups.forEach(eqGroup => {
        trends.push({
          name: eqGroup + partialTrendName + 'Hh',
          data: reducedEqLevelRoundUpData[partialTrendName][eqGroup].map(hourlyData => hourlyData.date + ',' + hourlyData.sum),
          avgOrSum: 'sum'
        });
      });
    });

    //get reducedChillerEqLevelRoundUps (avgs)
    reducedChillerEqLevelRoundUps.forEach(partialTrendName => {
      eqGroups.forEach(eqGroup => {
        trends.push({
          name: eqGroup + partialTrendName + 'Hh',
          data: reducedChillerEqLevelRoundUpData[partialTrendName].map(hourlyData => hourlyData.date + ',' + (hourlyData.sum / hourlyData.count)),
          avgOrSum: 'avg'
        });
      });
    });
    
    // get reducedSystemLevelRoundUps (sums)
    reducedSystemLevelRoundUps.forEach(partialTrendName => {
      trends.push({
        name: 'System' + partialTrendName + 'Hh',
        data: reducedSystemLevelRoundUpData[partialTrendName].map(hourlyData => hourlyData.date + ',' + hourlyData.sum),
        avgOrSum: 'sum'
      });
    });

    // get reducedChillerSystemLevelRoundUps (sums)
    reducedChillerSystemLevelRoundUps.forEach(partialTrendName => {
      trends.push({
        name: 'System' + partialTrendName + 'Hh',
        data: reducedChillerSystemLevelRoundUpData[partialTrendName].map(hourlyData => hourlyData.date + ',' + hourlyData.sum),
        avgOrSum: 'sum'
      });
    });

    //get calculatedSystemLevelRoundUps (avgs) Hh
    const sysEffTrendObj = {name: 'System_MsEff' + 'Hh', avgOrSum: 'avg'};
    sysEffTrendObj.data = msHhDateRows.map((hourlyStamp, stampIndex) => {
      const auxInfo = trendsInfo.System_MsEff[hourlyStamp.format('MMM')];
      const chillerInfo = reducedChillerEqLevelRoundUpData._MsEff[stampIndex]
      const value = (getRandomValue(auxInfo.min, auxInfo.max) + (chillerInfo.sum / chillerInfo.count)) / 2; //avg of aux and chiller avgs for hour
      const date = hourlyStamp.format('x');
      return date + ',' + value;
    });
    trends.push(sysEffTrendObj);

    const sysOacDryBulbTrendObj = {name: 'System_oacDryBulb' + 'Hh', avgOrSum: 'avg'};
    sysOacDryBulbTrendObj.data = msHhDateRows.map((hourlyStamp, stampIndex) => {
      const info = trendsInfo.System_oacDryBulb[hourlyStamp.format('MMM')]
      const value = getRandomValue(info.min, info.max);
      const date = hourlyStamp.format('x');
      return date + ',' + value;
    });
    trends.push(sysOacDryBulbTrendObj);


    /* GATHER ROUND UP TRENDS FOR INTERVALS ABOVE HOURLY */
    const dailyReductionData = {};
    const monthlyReductionData = {};
    const yearlyReductionData = {};
    trends.forEach(trend => {
      const partialTrendName = trend.name.slice(0, -1);
      const dailyTrendName = partialTrendName + 'd';
      const monthlyTrendName = partialTrendName + 'm';
      const yearlyTrendName = partialTrendName + 'y';

      const dailyTrend = {name: dailyTrendName};  //data prop populated below
      const monthlyTrend = {name: monthlyTrendName};  //data prop populated below
      const yearlyTrend = {name: yearlyTrendName};  //data prop populated below

      dailyReductionData[dailyTrendName] = msHdDateRows.map(date => ( { date, data: {sum: 0, count: 0, reduction: undefined} } ));
      monthlyReductionData[monthlyTrendName] = msHmDateRows.map(date => ( { date, data: {sum: 0, count: 0, reduction: undefined} } ));
      yearlyReductionData[yearlyTrendName] = msHyDateRows.map(date => ( {date, data: {sum: 0, count: 0, reduction: undefined} } ));

      let lastDay = msHhDateRows[0].subtract(1, 'hour').day();
      let lastMonth = msHhDateRows[0].subtract(1, 'hour').month();
      let lastYear = msHhDateRows[0].subtract(1, 'hour').year();
      let dailyIndex = 0;
      let monthlyIndex = 0;
      let yearlyIndex = 0;
      msHhDateRows.forEach((hourlyStamp, stampIndex) => {
        const currentDay = hourlyStamp.day();
        const currentMonth = hourlyStamp.month();
        const currentYear = hourlyStamp.year();
        if (currentDay !== lastDay) {
          const lastDateObj = dailyReductionData[dailyTrendName][dailyIndex];
          lastDateObj.reduction = trend.avgOrSum === 'avg' ? lastDateObj.sum / lastDateObj.count || 0 : lastDateObj.sum;
          dailyIndex++;
        }
        if (currentMonth !== lastMonth) {
          const lastDateObj = monthlyReductionData[monthlyTrendName][monthlyIndex];
          lastDateObj.reduction = trend.avgOrSum === 'avg' ? lastDateObj.sum / lastDateObj.count || 0 : lastDateObj.sum;
          monthlyIndex++;
        }
        if (currentYear !== lastYear) {
          const lastDateObj = yearlyReductionData[yearlyTrendName][yearlyIndex];
          lastDateObj.reduction = trend.avgOrSum === 'avg' ? lastDateObj.sum / lastDateObj.count || 0 : lastDateObj.sum;
          yearlyIndex++;
        }
        const currentDailyObj = dailyReductionData[dailyTrendName][dailyIndex];
        currentDailyObj.sum += VALUE;
        currentDailyObj.count++;
        const currentMonthlyObj = monthlyReductionData[monthlyTrendName][monthlyIndex];
        currentMonthlyObj.sum += VALUE;
        currentMonthlyObj.count++;
        const currentYearlyObj = yearlyReductionData[yearlyTrendName][yearlyIndex];
        currentYearlyObj.sum += VALUE;
        currentYearlyObj.count++;

      });
      //final reductions
      const lastDailyObj = dailyReductionData[dailyTrendName][msHdDateRows.length - 1];
      const lastMonthlyObj = monthlyReductionData[monthlyTrendName][msHdDateRows.length - 1];
      const lastYearlyObj = yearlyReductionData[yearlyTrendName][msHdDateRows.length - 1];
      lastDailyObj.reduction = trend.avgOrSum === 'avg' ? lastDailyObj.sum / lastDailyObj.count || 0 : lastDailyObj.sum;
      lastMonthlyObj.reduction = trend.avgOrSum === 'avg' ? lastMonthlyObj.sum / lastMonthlyObj.count || 0 : lastMonthlyObj.sum;
      lastYearlyObj.reduction = trend.avgOrSum === 'avg' ? lastYearlyObj.sum / lastYearlyObj.count || 0 : lastYearlyObj.sum;

      dailyTrend.data = dailyReductionData[dailyTrendName].map(dailyObj => dailyObj.date.format('x') + ',' + dailyObj.reduction);
      monthlyTrend.data = monthlyReductionData[monthlyTrendName].map(monthlyObj => monthlyObj.date.format('x') + ',' + monthlyObj.reduction);
      yearlyTrend.data = yearlyReductionData[yearlyTrendName].map(yearlyObj => yearlyObj.date.format('x') + ',' + yearlyObj.reduction);
      trends.push(dailyTrend, monthlyTrend, yearlyTrend);
    });














    /* GATHER BASELINE, PROJECTED, & COV TRENDS */
    // get calculatedSystemLevelRoundUps
    eqGroups.forEach(eqGroup => {
      const baselineTrend = {name: eqGroup + '_BlKwHm'};
      baselineTrend.data = monthlyReductionData[eqGroup + '_MsKwHm'].slice(0, 12).map(msData => {
        const minToAdd = msData.reduction * 0; // 0.05 is expected, but testing at 0
        const maxToAdd = msData.reduction * 0.1;
        const monthlyValue = msData.reduction + getRandomValue(minToAdd, maxToAdd);
        const baselineDate = blDateRows[msData.date.get('month')].format('x');
        return baselineDate + ',' + monthlyValue;
      });
      trends.push(baselineTrend);
    });

    //get systemLevelCalculatedTrends
    trends.push({
      name: 'System_Bur',
      data: [singleRow.format('x') + ',' + trendsInfo.System_Bur]
    });
    trends.push({
      name: 'System_CorporateCurrencyExchange',
      data: [singleRow.format('x') + ',' + trendsInfo.System_CorporateCurrencyExchange]
    });

    const baselineEffTrend = {name: 'System_BlEffHm'};
    baselineEffTrend.data = monthlyReductionData['System_MsEffHm'].slice(0, 12).map(msData => {
      const minToAdd = msData.reduction * 0; // 0.05 is expected, but testing at 0
      const maxToAdd = msData.reduction * 0.1;
      const monthlyValue = msData.reduction + getRandomValue(minToAdd, maxToAdd);
      const baselineDate = blDateRows[msData.date.get('month')].format('x');
      return baselineDate + ',' + monthlyValue;
    });
    trends.push(baselineEffTrend);
    const projectedEffTrend = {name: 'System_PrEffHm'};
    projectedEffTrend.data = monthlyReductionData['System_MsEffHm'].slice(0, 12).map(msData => {
      const minToAdd = msData.reduction * 0; // 0.05 is expected, but testing at 0
      const maxToAdd = msData.reduction * 0.05;
      const monthlyValue = msData.reduction + getRandomValue(minToAdd, maxToAdd);
      const projectedDate = blDateRows[msData.date.get('month')].format('x');
      return projectedDate + ',' + monthlyValue;
    });
    trends.push(projectedEffTrend);
























    //TODO: MAKE TRENDS INTO CSVs :) #14
    //MAKE CSVs
    trends.forEach(trend => {
      //WRITE A CSV FILE WITH NAME AS TITLE AND DATA AS CONTENT
      console.log(trend);
    })






  });
