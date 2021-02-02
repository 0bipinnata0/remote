const { Client } = require("ssh2");

var reg = /\s+/g;

function createArr(squeue) {
  console.log(squeue);
  const squeueArr = squeue.split("\n");
  const title = squeueArr.shift();
  const titleArr = [];
  title
    .replace(reg, " ")
    .split(" ")
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
      .replace(reg, " ")
      .split(" ")
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
  .on("ready", () => {
    conn.exec("squeue", (err, stream) => {
      if (err) throw err;
      stream
        .on("close", (code, signal) => {
          console.log(
            "Stream :: close :: code: " + code + ", signal: " + signal
          );
          conn.end();
        })
        .on("data", (data) => {
          const outside = createArr("" + data);
          console.log('outside', outside)
        })
        .stderr.on("data", (data) => {
          console.log("STDERR: " + data);
        });
    });
  })
  .connect({
    host: "192.168.173.1",
    port: 22,
    username: "gengzi",
    password: "gengzi456",
    //privateKey: require('fs').readFileSync('/home/admin/.ssh/id_dsa')
  });
