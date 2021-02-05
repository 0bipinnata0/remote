const { Client } = require('ssh2');
const fs = require('fs');

function createScript() {
  const transfer = fs.readFileSync('./sh/cores.sh', 'utf-8');
  return transfer;
}
let globalData = '';
const conn = new Client();
conn
  .on('ready', () => {
    conn.exec(createScript(), (err, stream) => {
      if (err) throw err;
      stream
        .on('close', (code, signal) => {
          console.log(globalData);
          conn.end();
        })
        .on('data', (data) => {
          data = data + '';
          globalData = globalData + data;
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
