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
    t, datagroup, value = [int(i) for i in data.split()]
    if offset == 0 or time.time() > last+10:
        offset = int(time.time()*1000-t)
        last = time.time()
    message = {"time":t+offset,"val":value}
    print "ayy"
    if datagroup == 0:
        r.publish("waveform.bill", json.dumps(message))
        print("WAVEFORM")
    if datagroup == 1:
        r.publish("bpm.bill", json.dumps(message))
    if datagroup == 2:
        r.publish("bpm_slow.bill", json.dumps(message))
