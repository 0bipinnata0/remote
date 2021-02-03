// 该版本废除
// TODO 主要遇到的问题是在执行Findmyjobs时，on('data',function(data){}) 方法被执行了多次，
// TODO 目前没有发现最后一次执行的标志，
// TODO 所以引入了一个全局变量存储所有变量，在on('close')再执行相关的数据筛选操作
// TODO 主要使用 gengzi.js

// TODO 解决方法，执行多个语句

const { Client } = require('ssh2');

var reg = /\s+/g;

function createArr(remoteStr) {
  console.log(remoteStr);
  const squeueArr = remoteStr.split('\n');
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

const conn = new Client();
conn
  .on('ready', () => {
    conn.exec('squeue', (err, stream) => {
      if (err) throw err;
      stream
        .on('close', (code, signal) => {
          console.log(
            'Stream :: close :: code: ' + code + ', signal: ' + signal
          );
          conn.end();
        })
        .on('data', (data) => {
          const outside = createArr('' + data);
          console.log('outside', outside);
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