cat routerMap.json |grep :|cut -d: -f2-|cut -d"," -f1|tr -s '"' ' '|while read api;do echo $api;done|while read apipath;do echo $apipath && echo curl -vsk $apipath && curl -vsk $apipath && echo -e "\n";done
