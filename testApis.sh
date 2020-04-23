[ -z "$1" ] && mapFile="routerMap.json" || mapFile=routerMap_"$1".json
[ -z "$NODE_ENV" ] && mapFile="routerMap.json" || mapFile=routerMap_"$NODE_ENV".json
[ "$1" == "run" -o "$1" == "curl" -o "$1" == "1" ] && enableCurl="" || enableCurl="echo"
cat "$mapFile"|grep :|cut -d: -f2-|cut -d"," -f1|tr -s '"' ' '|while read api;do echo $api;done|while read apipath;do echo $apipath && echo curl -vsk $apipath && eval "$enableCurl" curl -vsk $apipath && echo -e "\n";done
# cat "$mapFile"|grep :|cut -d: -f2-|cut -d"," -f1|tr -s '"' ' '|while read api;do echo $api;done|while read apipath;do echo $apipath && echo curl -vsk $apipath && echo curl -vsk $apipath && echo -e "\n";done

