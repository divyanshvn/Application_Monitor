from datetime import datetime
from time import sleep
from tkinter.tix import Tree

from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
import csv

token = "pqcx-BmsRYF7h36WS13eQ9MhtLBP8krl6RiYUaQrKqSSNGAv3NqO6f1fB5g1hXNFLWP4zt64D47ILmlZ0TUuyA=="
org = "db_project"
bucket = "bucket_0"

with InfluxDBClient(url="http://localhost:8086", token=token, org=org) as client:

    while True:
        query = 'from(bucket: "bucket_0") |> range(start: -1m)'
        csv_result = client.query_api().query_csv(query, org=org)

        writer = csv.writer(open("./generated_data/data.csv", 'w'))
        for row in csv_result:
            writer.writerow(row)

        sleep(5)
