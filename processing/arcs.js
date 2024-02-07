let fs = require('fs');

const input = fs.readFileSync('story-arcs.txt', 'utf-8').split('\r\n');

let events = [];
let description = '';
let year = null;
let startDate, endDate;
let state = 'ignore';
for(const line of input) {
  // console.log(line);

  let yearMatch = line.match(/^==\s*(\d+)\s*==\s*$/);
  if(yearMatch) {
    year = yearMatch[1];
    console.log('*** '+ year + ' ***');
    state = 'ignore'
  }
  else if(line.startsWith('====')) {
    if(description != '') {
      addEvent(startDate, endDate, description);
    }
    // date line
    state = 'event';
    const res = line.match(/^\s*====\s*(.+?)\s*====\s*$/);
    if(!res) {
      throw new Error('could not parse ' + line)
    }
    const munge = res[1].trim().match(/\[\[.+\|(.+)\]\]:$/);
    const titleFull = munge ? munge[1] : res[1].trim().substring(0, res[1].length-1);

    const dateMatch = titleFull.match(/^([^-]+)-([^-]+)$/);
    if(!dateMatch)
      throw new Error('could not parse ' + titleFull);
    // console.log(dateMatch[1] + ' - ' + dateMatch[2]);
    const date1 = dateMatch[1].match(/^\s*([a-z]+)\s+(\d+)(?:\s+(\d+))?\s*$/i);
    if(!date1) 
      throw new Error('could not parse ' + dateMatch[1]);
    // console.log((date1[3] ?? year) + '-' + date1[1] + '-' + date1[2]);
    const date2 = dateMatch[2].match(/^\s*([a-z]+)?\s*(\d+)(?:\s+(\d+))?\s*$/i);
    if(!date2)
      throw new Error('could not parse ' + dateMatch[2]);

    // console.log(date2[3]+'-'+date2[1]+'-'+date2[2]);
    // const startDate = new Date()
    const startYear = (date1[3] ?? year);
    startDate = new Date(startYear + '/' + date1[1] + '/' + date1[2]);
    endDate = new Date((date2[3] ?? startYear) + '/' + (date2[1] ?? date1[1]) + '/' + date2[2]);

    // console.log(`${startDate} - ${endDate}   <<< ${titleFull}`);

    year = date2[3] ?? startYear;
    description = '';
  }
  else if(line.startsWith('===')) {
    state = 'ignore';
  }
  else if (line.trim().length && state == 'event') {
    description += line + ' ';
  }
}
// console.dir(input);

if(description != '') {
  addEvent(startDate, endDate, description);
}

function formatDate(date) {
  return date.getFullYear() + '-' + (date.getMonth()+1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2,'0');
}

function addEvent(startDate, endDate, description) {
  // console.log(`${startDate} - ${endDate}   <<< ${description}`);
  description = description.replaceAll(/\[\[[^\]\|]+\|([^\]]+)\]\]/g, '$1');
  description = description.replaceAll(/\[\[([^\]]+)\]\]/g, '$1');
  // console.log(description);
  // console.log();
  events.push({
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    title: description.trim()
  });
}

fs.writeFileSync('story-arcs.json', JSON.stringify(events, null, 2), 'utf-8'); //console.log(events)