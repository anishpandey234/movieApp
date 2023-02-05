
const csv = require('csv-parser');
const fs = require('fs');

const top100 = () => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream('output.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

module.exports = top100;
