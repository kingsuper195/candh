const express = require('express');
const he = require('he');
const app = express();


app.get('/strip', async (request, response) => {
  console.dir(request.query);
  const { day, month, year } = request.query;
  
  const url = 'https://www.gocomics.com/calvinandhobbes/'+year+'/'+month.padStart(2, '0')+'/'+day.padStart(2, '0');
  const result = await fetch(url);
  const text = await result.text();
  const strip = text.match(/<meta property="og:image" content="([^"]+)"/);
  const dialog = text.match(/<meta property="og:description" content="([^"]+)"/);  
  if(strip) {
    const img = strip[1];
    response.write(img);
    const text = he.decode(dialog[1]);
    console.dir(strip[1])
    console.dir(text)
  } else {
    response.status(500);
    response.write('ERROR');
  }
  response.end();
});

app.use('/', express.static('../public'));

const port = 9876;
console.log(`Starting app listening on ${port}`);
const server = app.listen(port);
