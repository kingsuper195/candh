const express = require('express');
const app = express();
const fs = require('fs');

app.get('/strip', async (request, response) => {
  console.dir(request.query);
  const { day, month, year } = request.query;
  
  const url = 'https://www.gocomics.com/calvinandhobbes/'+year+'/'+month.padStart(2, '0')+'/'+day.padStart(2, '0');
  const result = await fetch(url);
  const text = await result.text();
  const re = text.match(/<meta property="og:image" content="([^"]+)"/);
  if(re) {
    const img = re[1];
    response.write(re[1]); //JSON.stringify(data));
  } else {
    response.status(500);
    response.write('ERROR');
  }
  response.end();
  // fs.writeFileSync('data.txt', text, 'utf-8');
});

app.use('/', express.static('../public'));

const port = 9876;
console.log(`Starting app listening on ${port}`);
const server = app.listen(port);
