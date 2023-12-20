# MQTT host server for sensor nodes
This is private project.
작업중 입니다.
Actuator Control, Fan Control 방법 검토 바랍니다.

## Install repository
```
git clone https://github.com/sam0910/kmong-sensor-host
cd kmong-sensor-host
npm install
npm run start
```
## IP addresses setting
```
Server(host)               : 192.168.0.30
Sensor Board               : 192.168.0.101
Actuator Board(Fan/Linear) : 192.168.0.102
```

## 1. Actuator Control
```
direction: forward|backward|stop, default: stop
duration : miliseconds, default: 0
limit    : nc|no, default: nc
       nc: 리밋스위치 NC 일때 정지
       no: 리밋스위치 NO 일때 정지
```
#### HTTP로 명령 전송시
```
URL: http://$SERVER_HOST_IP:8080/actuator
GET: direction=forward&duration=1200&limit=nc
예시: http://$SERVER_HOST_IP:8080/actuator?direction=forward&duration=1200&limit=nc
```
#### MQTT로 명령 전송시
```
TOPIC  : cmd/actuator
PAYLOAD: direction=forward&duration=1200&limit=nc
```
## 2. Fan Control
```
power: on|off, default: off
speed: 1|2|3|4|5, default: 0
```
#### HTTP로 명령 전송시
```
URL: http://$SERVER_HOST_IP:8080/fan
GET: power=on&speed=2
예시: http://$SERVER_HOST_IP:8080/fan?power=on&speed=2
```
#### MQTT로 명령 전송시
```
TOPIC: cmd/fan
PAYLOAD: power=on&speed=2
```


## 3. Mosquitto MQTT broker
### Install
```
brew install mosquitto
mosquitto_passwd -c passwd.secret mqtt_user
brew services stop mosquitto
killall mosquitto
code $HOMEBREW_PREFIX/etc/mosquitto/mosquitto.conf
```
mosquitto.conf 파일 열어서 아래 내용 추가
(패스워드 파일 경로는 위에서 생성한 파일의 경로로 수정)
```
allow_anonymous false
password_file /Users/$USER/...../kmong-sensor-host/passwd.secret
```
Mosquitto 실행
```
brew services start mosquitto
brew services stop mosquitto
brew services restart mosquitto
```
### Pub/Sub 예시
```
MQTT_HOST=192.168.0.30
MQTT_PORT=1883
SUB_TOPIC=ping/actuator
PUB_TOPIC=cmd/actuator
MQTT_USER=mqtt_user
MQTT_PASSWORD=1234
mosquitto_sub -h $MQTT_HOST -p $MQTT_PORT -t $SUB_TOPIC -u $MQTT_USER -P $MQTT_PASSWORD
mosquitto_pub -h $MQTT_HOST -p $MQTT_PORT -t $PUB_TOPIC -u $MQTT_USER -P $MQTT_PASSWORD
```

## 4. Config file
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


