nowYear=$(date +%Y)'-01-01'
month=$(date +%Y-%m)'-01'
lastmonth=$(date -d last-month +%Y-%m)'-01'
for jobid in $(squeue | awk '!a[$4]++{print}' | awk '{print $1}' | sed 's/JOBID//g'); do
  user=$(scontrol show jobid $jobid | grep 'UserId=' | awk '{print $1}' | sed 's/UserId=//g' | sed 's/(.*$//g')
  used=$(sreport Cluster UserUtilizationByAccount user=$user start=$month end=now | sed -n '7p' | sed 's/^.*local//g' | awk '{print $1}')
  lastUsed=$(sreport Cluster UserUtilizationByAccount user=$user start=$lastmonth end=$month | sed -n '7p' | sed 's/^.*local//g' | awk '{print $1}')
  totalUsed=$(sreport Cluster UserUtilizationByAccount user=$user start=$nowYear end=now | sed -n '7p' | sed 's/^.*local//g' | awk '{print $1}')
  echo $user-$used-$lastUsed-$totalUsed
done
