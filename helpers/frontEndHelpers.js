import Immutable from 'Immutable';

export function msToTime(s) {
  // Pad to 2 or 3 digits, default is 2
  function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  var returnString = ''
  if(hrs){
    returnString += `${hrs} ${hrs>1 ? 'hours ' : 'hour '}`;
  }
  if(mins){
    returnString += `${mins} ${mins>1 ? 'minutes ' : 'minute '}`;
  }
  if(secs){
    returnString += `${secs} ${secs>1 ? 'seconds ' : 'second '}`;
  }
  if(ms){
    returnString += `${ms} ms`;
  }
  return returnString;
}

export function translateServerStrokesToFrontEnd(serverStrokes){
  let returnList = new Immutable.List();

  if(!serverStrokes){
    return returnList;
  }
  serverStrokes.forEach((serverStroke) => {
    const pointsArray = serverStroke.lineData.split(';');
    let pointsList = new Immutable.List();
    pointsArray.forEach((points) => {
      const [x, y] = points.split(',');
      pointsList = pointsList.push(new Immutable.Map({x,y}));
    });
    returnList = returnList.push({points: pointsList, color: serverStroke.strokeColor, width: serverStroke.strokeWidth});
  });
  return returnList;
}
