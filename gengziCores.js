const { Client } = require('ssh2');
const fs = require('fs');
// head cores
function createScript() {
  const transfer = fs.readFileSync('./sh/cores.sh', 'utf-8');
  return transfer;
}
let globalData = [];
const conn = new Client();
conn
  .on('ready', () => {
    conn.exec(createScript(), (err, stream) => {
      if (err) throw err;
      stream
        .on('close', (code, signal) => {
          const output = new Array(globalData[0].length).fill(1);
          const result = output.map((_, index) => ({
            key: index,
            name: globalData[0][index],
            number: globalData[1][index],
          }));
          console.log(result);
          conn.end();
        })
        .on('data', (data) => {
          data = data + '';
          globalData = data
            .split('\n')
            .filter((item) => item)
            .map((item) => item.trim().split(' '));
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
