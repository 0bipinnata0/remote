let length=$(sinfo -s | wc -l)
let total=0
let running=0
let free=0
for k in $(seq 2 $length); do
  nodesArrB=$(sinfo -s | sed -n $k'p' | awk '{print $4}')
  nodesArr=${nodesArrB//// }
  runningNodeNum=$(echo $nodesArr | awk '{print $1}')
  freeNodeNum=$(echo $nodesArr | awk '{print $2}')
  errorNodeNum=$(echo $nodesArr | awk '{print $3}')
  totalNodeNum=$(echo $nodesArr | awk '{print $4}')
  nodelist=$(sinfo -s | sed -n $k'p' | awk '{print $5}')
  nodeName='NodeName='$nodelist
  cpus=$(cat /etc/slurm/slurm.conf | grep -F $nodeName | awk '{print $2}' | sed 's/CPUs=//g')
  total=$((total + cpus * totalNodeNum))
  running=$((running + cpus * runningNodeNum))
  free=$((free + cpus * freeNodeNum))
done
let error=$((total - running - free))
echo -e 'Total Running Free Error\n' $total $running $free $error
