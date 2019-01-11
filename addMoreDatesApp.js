'use strict';

console.log('Hello. Let\'s make some CSVs!')
const fs = require('fs');
const moment = require('moment')
const masterCSV = './Master.csv';
const updatedMasterCSV = './updatedMaster.csv';
const splitIntoRowsAndColumns = data => data.split('\n').map((row) => row.split(','));

const convertToCsv = data => {
  console.log('converting...')
  const csvFormattedData = data.map(row => row.join(',')).join('\n');
  fs.writeFile(updatedMasterCSV, csvFormattedData, err => {
    if (err) throw err;
    console.log('Check out updated master CSV!');
  });
};

const addNextYearOfHourlyDates = data => {
  const firstDate = moment(data[data.length - 1][0], 'MM/DD/YYYY HH:mm').add(1, 'hours');
  let mostRecentDate = moment(firstDate);
  while(mostRecentDate.year() === firstDate.year()) {
    data.push([
      mostRecentDate.format('MM/DD/YYYY HH:mm'),
      mostRecentDate.format('x')  //unix millisecond timestamp
    ]);
    mostRecentDate.add(1, 'hours');
  }
}

fs.readFile(masterCSV, 'utf8', (error, data) => {
  if (error) return console.error(error);
  let master = splitIntoRowsAndColumns(data);
  let masterFirstRow = master.splice(0, 1);
  //MAKE CHANGES HERE
  while(!master[master.length - 1][0]) master.pop();  // remove blank rows
  addNextYearOfHourlyDates(master);
  master.unshift(masterFirstRow);
  convertToCsv(master);
});

