# MQTT host server for sensor nodes
This is private project.

## IP addresses
```
Server(host)                 : 192.168.0.30
Sensor Board                 : 192.168.0.101
Actuator(Fan/Linear) Board   : 192.168.0.102
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
