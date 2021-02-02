var Client = require('ssh2').Client;

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

var conn = new Client();
conn
  .on('ready', function () {
    conn.exec('ls', function (err, stream) {
      if (err) throw err;

      stream
        .on('close', function (code, signal) {
          console.log('code', code);
          console.log('signal', signal);
          conn.end();
        })
        .on('data', function (data) {
          console.log(data);
          console.log('-----------');
          console.log('data', createArr(data));
        })
        .stderr.on('data', function (data) {
          console.log('STDERR: ' + data);
        });
    });
  })
  .connect({
    host: '47.92.212.75',
    port: 22,
    username: 'root',
    password: 'T6W9DiumscCidXT',
    //privateKey: require('fs').readFileSync('/home/admin/.ssh/id_dsa')
  });
