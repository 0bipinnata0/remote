const fs = require('fs');

const sinfo = fs.readFileSync('./txt/2sinfo.txt', 'utf-8');
const squeue = fs.readFileSync('./txt/2squeue.txt', 'utf-8');
const tasks = fs.readFileSync('./txt/2Findmyjobs.txt', 'utf-8');

// TODO 1.nodes 构建

var reg = /\s+/g;
var STATUS = {
  R: '0',
  PD: '1',
  S: '2',
};

function createArr(squeue, split) {
  if (!split) split = '\r\n';
  const squeueArr = squeue.split(split);
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
function getHours(times, pattern) {
  let hours = 0;
  let output = 0;
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
    output = output + seconds;
  });
  if (pattern === 's') {
    return output;
  }
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

console.log('3333333333333333333333333333333');
// TODO 3.Tasks list
console.log(tasks);

const tasksArr = [];
tasks.split('\r\n').forEach((taskItem) => {
  let taskItemArr = void 0;
  if (taskItem) {
    taskItemArr = taskItem.replace(reg, ' ').split(' ');
  }
  if (taskItemArr && taskItemArr.length > 2) {
    tasksArr.push(taskItemArr);
  }
});
// console.log(tasksArr);

// const tasks_pid = fs.readFileSync('./txt/2Findmyjobs.txt', 'utf-8');

const taskFormat = tasksArr.map((taskItem) => {
  // TODO 以下代码根据具体变更
  const tasks_pid = fs.readFileSync(
    './txt/2squeue_' + taskItem[0] + '.txt',
    'utf-8'
  );
  // TODO 以上代码根据具体变更
  const itemTmp = createArr(tasks_pid, '\n');
  return [
    taskItem[0],
    taskItem[1].split('=')[1],
    itemTmp[0].USER,
    getHours(itemTmp, 's'),
    itemTmp[0].ST,
    taskItem[2].split('=')[1],
  ];
});

const taskObj = taskFormat.map((item, index) => ({
  key: index,
  id: item[0],
  location: item[1],
  user: item[2],
  spend_time: item[3],
  status: STATUS[item[4]],
  create_time: item[5].includes('T') ? item[5].replace('T', ' ') : '',
}));
console.log('taskObj', taskObj);
