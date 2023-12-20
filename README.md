# MQTT host server for sensor nodes
This is private project.

## IP addresses
```
Server(host)                 : 192.168.0.30
Sensor Board                 : 192.168.0.101
Actuator(Fan/Linear) Board   : 192.168.0.102
```
## Install Mosquitto
```
brew install mosquitto
mosquitto_passwd -c passwd.secret sensor
code $HOMEBREW_PREFIX/etc/mosquitto/mosquitto.conf
brew services restart mosquitto
brew services stop mosquitto

sudo lsof -iTCP -sTCP:LISTEN -n -P 
netstat -an | grep 1883
ps -ef | grep mosquitto
brew services restart mosquitto

mosquitto_sub -h localhost -p 1883 -t 'ping' -u sensor -P 1234
mosquitto_pub -h localhost -p 1883 -t 'ping' -u sensor -P 1234 -m ping_msg


netstat -anv | grep LISTEN 
sudo lsof -iTCP -sTCP:LISTEN -n -P 
ps -ef | grep mosquitto
killall mosquitto
```
## Config file
```
{
    "update_interval": {
        "dust": 60,
        "co2": 60,
        "barometer": 60,
        "temperature": 60,
        "humidity": 60
    },
    "connection": {
        "mqtt_host": "192.168.0.30",
        "mqtt_port": 1883,
        "mqtt_id": "sensor",
        "mqtt_password": "pass1234",
        "wlan_ssid": "Kmong",
        "wlan_password": "12345678",
        "config_file": "http://192.168.0.30/config.json"
    },
    "ip_address": {
        "host": {
            "ip": "192.168.0.30",
            "port": 5000
        },
        "sensor_board": {
            "ip": "192.168.0.101",
            "port": 5000
        },
        "actuator_board": {
            "ip": "192.168.0.102",
            "port": 5000
        }
    },
    "fan": {
        "speed_1": 1000,
        "speed_2": 5000,
        "speed_3": 10000,
    },
    "actuator": {
        "limit_close": "NC",
        "limit_open": "NO",
        "stroke_open": 130,
        "stroke_close": 0
    }
}
```


