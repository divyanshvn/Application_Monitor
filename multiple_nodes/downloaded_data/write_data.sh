#!/bin/bash

while true
do
	wget -A csv -m -p -E -k -K -np -nH http://localhost:8080/
	wget -A csv -m -p -E -k -K -np -nH http://localhost:8080/

	sudo docker cp data.csv container_id:/
	sudo docker cp data1.csv container_id:/

	sudo docker exec container_id influx write -b bucket_1 -f data.csv
	sudo docker exec container_id influx write -b bucket_2 -f data.csv

	sleep 1
done

