const { Client } = require('ssh2');

var reg = /\s+/g;

function createArr(squeue, split) {
  if (!split) split = '\n';
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
    let objItem = void 0;
    let index = 0;
    squeueItem
      .replace(reg, ' ')
      .split(' ')
      .forEach((item) => {
        if (item) {
          if (!objItem) objItem = {};
          objItem[titleArr[index++]] = item;
        }
      });
    objItem && objArr.push(objItem);
  });
  return objArr;
}

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

let changeButton = false;
const tasksArr = [];
let taskObj = void 0;

var STATUS = {
  R: '0',
  PD: '1',
  S: '2',
};

const conn = new Client();
conn
  .on('ready', () => {
    conn.exec("./Findmyjobs;echo '**********';squeue", (err, stream) => {
      if (err) throw err;
      stream
        .on('close', (code, signal) => {
          console.log(taskObj);
          conn.end();
        })
        .on('data', (data) => {
          data = data + '';
          if (data.includes('**********')) {
            changeButton = true;
          } else if (data) {
            if (changeButton) {
              const squeue = createArr(data);
              const squeueIdMap = {};
              squeue.forEach((item) => (squeueIdMap[item.JOBID] = item));
              const taskFormat = tasksArr.map((taskItem) => {
                // TODO 以下代码根据具体变更
                const tasks_pid = squeueIdMap[taskItem[0]];
                // TODO 以上代码根据具体变更
                return [
                  taskItem[0],
                  taskItem[1].split('=')[1],
                  tasks_pid.USER,
                  getHours([tasks_pid], 's'),
                  tasks_pid.ST,
                  taskItem[2].split('=')[1],
                ];
              });
              taskObj = taskFormat.map((item, index) => ({
                key: index,
                id: item[0],
                location: item[1],
                user: item[2],
                spend_time: item[3],
                status: STATUS[item[4]],
                create_time: item[5].includes('T')
                  ? item[5].replace('T', ' ')
                  : '',
              }));
            } else {
              // 原始逻辑
              let taskItem = data;
              let taskItemArr = void 0;
              if (taskItem) {
                taskItemArr = taskItem
                  .replace(reg, ' ')
                  .split(' ')
                  .filter((item) => item);
              }
              if (taskItemArr && taskItemArr.length > 2) {
                tasksArr.push(taskItemArr);
              }
            }
          }
          // const outside = createArr("" + data);
          // console.log('outside', outside)
        })
        .stderr.on('data', (data) => {
          console.log('STDERR: ' + data);
        });
    });
  })
  .connect({
    host: '192.168.173.1',
    port: 22,
    username: 'gengzi',
    password: 'gengzi456',
    //privateKey: require('fs').readFileSync('/home/admin/.ssh/id_dsa')
  });
