const fs = require('fs');

async function convertToCsv(request) {
  const newFileLocation = './CSVs/' + request.name + '.csv'
  const csvFormattedData = request.data.join('\n');
    fs.writeFile(newFileLocation, csvFormattedData, err => {
      if (err) throw err;
    });
}

function createCSVs(arrOfRequests) {
  return Promise.all(arrOfRequests.map(request => convertToCsv(request)));
}


module.exports = {
  createCSVs
}