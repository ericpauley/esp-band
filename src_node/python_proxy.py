import socket
import time
import redis
import json

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
r = redis.Redis()
offset = 0
last = 0

s.bind(("0.0.0.0", 1337))
while True:
    data, addr = s.recvfrom(1024)
    datagroup, value = [int(i) for i in data.split()]
    message = {"time":int(time.time()*1000),"val":value}
    if datagroup == 0:
        if message['val'] > 1000:
            message['val'] = 1000
        r.publish("waveform.bill", json.dumps(message))
    if datagroup == 1:
        print value
        r.publish("bpm_slow.bill", json.dumps(message))
