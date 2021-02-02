const fs = require('fs');

const sinfo = fs.readFileSync('./txt/sinfo.txt', 'utf-8');
const squeue = fs.readFileSync('./txt/squeue.txt', 'utf-8');

// TODO 1.nodes 构建

var reg = /\s+/g;

function createArr(squeue) {
  const squeueArr = squeue.split('\r\n');
  const title = squeueArr.shift();
  const titleArr = [];
  title
    .replace(reg, ' ')
    .split(' ')
    .forEach((item) => {
      if (item) {
        titleArr.push(item);
      }
    });
  const objArr = [];
  squeueArr.forEach((squeueItem) => {
    const objItem = {};
    let index = 0;
    squeueItem
      .replace(reg, ' ')
      .split(' ')
      .forEach((item) => {
        if (item) {
          objItem[titleArr[index++]] = item;
        }
      });
    objArr.push(objItem);
  });
  return objArr;
}

let sinfoArr = createArr(sinfo);

// console.log('sinfoArr', sinfoArr);

const keyArr = [1, 2, 3, 4];
const nameArr = ['Total', 'Running', 'Free', 'Error'];
const numberArr = [0, 0, 0, 0];

sinfoArr.forEach((item) => {
  const nodes = item.NODES * 1;
  numberArr[0] = numberArr[0] + nodes;
  switch (item.STATE) {
    case 'alloc':
      numberArr[1] = numberArr[1] + nodes;
      break;
    case 'idle':
      numberArr[2] = numberArr[2] + nodes;
      break;
    case 'down':
      numberArr[3] = numberArr[3] + nodes;
      break;
  }
});

const nodes = [];
keyArr.forEach((_, index) => {
  const obj = {
    key: keyArr[index],
    name: nameArr[index],
    number: numberArr[index],
  };
  nodes.push(obj);
});
console.log('nodes', nodes);
// TODO 1.nodes 构建

// TODO 2.running time构建
function getHours(times) {
  let hours = 0;
  times.forEach(({ TIME }) => {
    let seconds = 0;
    let timeArr = TIME.split('-');
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
    hours = hours + Math.ceil(seconds / 3600);
  });
  return hours;
}

let squeueArr = createArr(squeue);

console.log('----------');
console.log(squeueArr);

const times = getHours(squeueArr);
console.log(squeue);
console.log('***************');
console.log('times', times);
// TODO 2.running time构建

// TODO 3.
