const { Client } = require('ssh2');
const fs = require('fs');

function createScript() {
  const transfer = fs.readFileSync('./sh/statistics.sh', 'utf-8');
  return transfer;
}

const globalData = [];
const conn = new Client();
conn
  .on('ready', () => {
    conn.exec(createScript(), (err, stream) => {
      if (err) throw err;
      stream
        .on('close', (code, signal) => {
          const output = globalData.map((item, index) => ({
            key: index,
            username: item[0],
            thismonth: item[1],
            lastmonth: item[2],
            total: item[3],
          }));
          console.log(output);
          conn.end();
        })
        .on('data', (data) => {
          data = data + '';
          globalData.push(data.trim().split('-'));
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
