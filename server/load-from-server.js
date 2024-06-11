const he = require('he');
// const { request } = require('undici');

async function loadMetadataFromServer(date) {
  const url = 'https://www.gocomics.com/calvinandhobbes/'+date;
  const result = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36' }
  });
  const text = await result.text();
  const stripMatch = text.match(/<meta property="og:image" content="([^"]+)"/);
  const dialogMatch = text.match(/<meta property="og:description" content="([^"]+)"/);
  if(!stripMatch) {
    console.log('could not find strip');
    return null;
  }
  let dialog = '';
  if(!dialogMatch) {
    console.log('could not find dialog');
  } else {
    dialog = he.decode(dialogMatch[1]);
  }


  const strip = stripMatch[1];

  const md = { strip, dialog };
  // console.dir(md);
  return md;
}

module.exports = {
  loadMetadataFromServer
};
