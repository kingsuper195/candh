const express = require('express');
const app = express();
const metadata = require('./metadata.js');
const { loadMetadataFromServer } = require('./load-from-server.js');

app.get('/strip', async (request, response) => {
  console.dir(request.query);
  const { day, month, year } = request.query;
  const date = year+'/'+month.padStart(2, '0')+'/'+day.padStart(2, '0');

  let md = metadata.get(date);
  if(!md) {
    md = await loadMetadataFromServer(date);
    if(!md) {
      response.status(500);
      response.write('ERROR');
      response.end();
      return;
    }
    metadata.save(date, md);
  }
  response.write(md.strip);
  response.end();
});

app.use('/', express.static('../public'));

const port = 9876;
console.log(`Starting app listening on ${port}`);
const server = app.listen(port);
