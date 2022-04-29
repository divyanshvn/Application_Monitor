#!bin/bash
super="ERvf6TB2DWMVeuxR88aAFRJpIxtAAOyElGwZU6EwuOqkRFRZleI28uGraS3Oz_azMMSBlNIwZSlwUf40jWIewQ=="
influx config create --config-name tst2-config   --host-url http://localhost:8086   --org test2   --token ERvf6TB2DWMVeuxR88aAFRJpIxtAAOyElGwZU6EwuOqkRFRZleI28uGraS3Oz_azMMSBlNIwZSlwUf40jWIewQ==   --active
#python3 gen_conf.py
file_name="manual_config"
influx telegrafs create   -n $file_name   -d "First manual config with a docker container and output plugin included"   -f ./Desktop/test.conf | grep $file_name
telegraf --config ./Desktop/test.conf
