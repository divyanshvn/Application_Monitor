from datetime import datetime

from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
import csv

token = "pqcx-BmsRYF7h36WS13eQ9MhtLBP8krl6RiYUaQrKqSSNGAv3NqO6f1fB5g1hXNFLWP4zt64D47ILmlZ0TUuyA=="
org = "db_project"
bucket = "bucket_one"

with InfluxDBClient(url="http://localhost:8086", token=token, org=org) as client:
    write_api = client.write_api(write_options=SYNCHRONOUS)

    data = "mem,host=host1 used_percent=23.43234543"
    write_api.write(bucket, org, data)
