cat /etc/slurm/slurm.conf | grep 'NodeName'

NodeName=hn[1-8] CPUs=36 State=UNKNOWN
NodeName=sf[1-4] CPUs=56 State=UNKNOWN
NodeName=hq1 CPUs=52 State=UNKNOWN

sinfo -s
PARTITION AVAIL  TIMELIMIT   NODES(A/I/O/T) NODELIST 
2697*        up   infinite          7/1/0/8 hn[1-8] 
8176         up   infinite          4/0/0/4 sf[1-4] 
8172         up   infinite          1/0/0/1 hq1 

sinfo -s |sed -n '3p' | awk '{print $4}'  | sed 's/^.*\///g'


let length=$(sinfo -s | wc -l)
for k in $(seq 2 $length); do
  echo $(sinfo -s |sed -n $k'p' | awk '{print $4}'  | sed 's/^.*\///g')
done