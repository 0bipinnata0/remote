const { Client } = require('ssh2');
const reg = /\s+/g;
const keyArr = [1, 2, 3, 4];
const nameArr = ['Total', 'Running', 'Free', 'Error'];
const numberArr = [0, 0, 0, 0];
const nodes = [];

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
let globalData = '';

const conn = new Client();
conn
  .on('ready', () => {
    conn.exec('sinfo', (err, stream) => {
      if (err) throw err;
      stream
        .on('close', (code, signal) => {
          let sinfoArr = createArr(globalData);
          console.log(sinfoArr);
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
          keyArr.forEach((_, index) => {
            const obj = {
              key: keyArr[index],
              name: nameArr[index],
              number: numberArr[index],
            };
            nodes.push(obj);
          });
          console.log('nodes', nodes);

          conn.end();
        })
        .on('data', (data) => {
          globalData = ('' + data).trim();
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
