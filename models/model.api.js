const fs = require('fs/promises');

exports.fetchAPIEndpoints = () => {
  return fs.readFile(`${__dirname}/../data/endpoints.json`, 'utf-8').then((data) => {
    const parsedData = JSON.parse(data);
    return parsedData;
  });
};
