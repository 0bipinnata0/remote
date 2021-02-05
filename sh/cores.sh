let length=$(sinfo -s | wc -l)
for k in $(seq 2 $length); do
  nodesArrB=$(sinfo -s | sed -n $k'p' | awk '{print $4}')
  nodesArr=${nodesArrB//// }
  runningNodeNum=$(echo $nodesArr | awk '{print $1}')
  freeNodeNum=$(echo $nodesArr | awk '{print $2}')
  errorNodeNum=$(echo $nodesArr | awk '{print $3}')
  totalNodeNum=$(echo $nodesArr | awk '{print $3}')
  nodelist=$(sinfo -s | sed -n $k'p' | awk '{print $5}')
  nodeName='NodeName='$nodelist
  nodeNameL=${nodeName//[/\\[}
  nodeNameR=${nodeNameL//]/\\]}
  cpus=$(cat /etc/slurm/slurm.conf | grep $nodeNameR | awk '{print $2}' | sed 's/CPUs=//g')
  echo $cpus $runningNodeNum $freeNodeNum $errorNodeNum $totalNodeNum
done
