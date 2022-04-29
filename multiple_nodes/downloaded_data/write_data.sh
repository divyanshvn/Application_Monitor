#!/bin/bash

while true
do
	wget -A csv -m -p -E -k -K -np -nH http://localhost:8080/

	sudo docker cp data.csv 39597aa1232b:/

	sudo docker exec 39 influx write -b bucket5 -f data.csv

	sleep 1
done

