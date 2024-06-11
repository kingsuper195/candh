const metadata = require('../server/metadata.js');
const { loadMetadataFromServer } = require('../server/load-from-server.js');

const fs = require('fs');

async function run() {
  const startDate = new Date(1985, 10, 18); // 18 Nov 1985
  const endDate = new Date(1995, 11, 31); // 31 Dec 1995

  for(let dateIterator = new Date(startDate); dateIterator <= endDate; dateIterator.setDate(dateIterator.getDate()+1)) {
    const date = dateIterator.getFullYear() + '/' + (dateIterator.getMonth()+1).toString().padStart(2, '0') + '/' + dateIterator.getDate().toString().padStart(2, '0');

    let md = metadata.get(date);
    if(!md) {
      console.log(date);

      md = await loadMetadataFromServer(date);
      if(!md) {
        console.error(`ERROR: ${date} failed to retrieve from server`);
      }
      metadata.save(date, md);
    }
  }
}

run();