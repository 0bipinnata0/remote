var a = [
  {
    time: '1-07:22:04',
  },
  {
    time: '4:45',
  },
  {
    time: '20:21:22',
  },
];

let hours = 0;
a.forEach(({ time }) => {
  let seconds = 0;
  let timeArr = time.split('-');
  if (timeArr.length > 1) {
    const days = timeArr.shift();
    seconds = days * 24 * 60 * 60;
  }
  timeArr = timeArr[0].split(':');
  let unit = 1;
  while (timeArr.length > 0) {
    const times = timeArr.pop();
    seconds = seconds + times * unit;
    unit = unit * 60;
  }
  console.log('------------');
  console.log(Math.ceil(seconds / 3600));
});
