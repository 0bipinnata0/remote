const { Client } = require("ssh2");

var reg = /\s+/g;

function createScript() {
  let transfer = `
  nowYear=$(date +%Y)'-01-01'
  let length=$(squeue | awk '!a[$4]++{print}' | wc -l)
  month=$(date +%Y-%m)'-01'
  lastmonth=$(date -d last-month +%Y-%m)'-01'
  for k in $(seq 2 $length); do
      let jobid=$(squeue | awk '!a[$4]++{print}' | sed -n $k'p' | awk '{print $1}')
      user=$(scontrol show jobid $jobid | grep 'UserId=' | awk '{print $1}' | sed 's/UserId=//g' | sed 's/\(.*$//g')
      used=$(sreport Cluster UserUtilizationByAccount user=$user start=$month end=now | sed -n '7p' | sed 's/^.*local//g' | awk '{print $1}')
      lastUsed=$(sreport Cluster UserUtilizationByAccount user=$user start=$lastmonth end=$month | sed -n '7p' | sed 's/^.*local//g' | awk '{print $1}')
      totalUsed=$(sreport Cluster UserUtilizationByAccount user=$user start=$nowYear end=now | sed -n '7p' | sed 's/^.*local//g' | awk '{print $1}')
      echo $user $used $lastUsed $totalUsed
  done
  `;
  return transfer;
}
const globalData = []
const conn = new Client();
conn
  .on("ready", () => {
    conn.exec(createScript(), (err, stream) => {
      if (err) throw err;
      stream
        .on("close", (code, signal) => {
          const output = (globalData.map((item,index)=>({
            key:index,
            username: item[0],
            thismonth: item[1],
            lastmonth: item[2],
            total:item[3]
          })))
          console.log(output)
          conn.end();
        })
        .on("data", (data) => {
          data = data + "";
          globalData.push(data.trim().split(' '))
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
