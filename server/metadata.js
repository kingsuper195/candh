const fs = require('fs');

const STRIP_METADATA_FILENAME = '../data/strip-metadata.json';

let data = {};

if(fs.existsSync(STRIP_METADATA_FILENAME)) {
  data = JSON.parse(fs.readFileSync(STRIP_METADATA_FILENAME, 'utf-8'));
}

function get(date) {
  return data[date];
}

function save(date, meta) {
  data[date] = meta;
  fs.writeFileSync(STRIP_METADATA_FILENAME, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
  get, save
}