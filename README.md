# MQTT host server for sensor nodes
> [!CAUTION]
> This is private project, working under the specific environment.


## :rocket: Mysql Install
##### Install
```
brew install mysql
brew services start mysql
mysql_secure_installation
brew services restart mysql

Enter password for user root: thermal1215@R
Disallow root login remotely? [Y/n] n
Reload privilege tables now? [Y/n] y
```
##### Create database and tables
```
> mysql -u root -p
Enter password:🔑thermal1215@R

mysql> CREATE DATABASE thermaldb;
mysql> USE thermaldb;
mysql> CREATE TABLE IF NOT EXISTS `temp_data` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `date_time` DATETIME NULL DEFAULT NULL,
  `measured_temp` FLOAT DEFAULT NULL,
  PRIMARY KEY (`id`)
) CHARSET=utf8;
mysql> CREATE TABLE IF NOT EXISTS `humi_data` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `date_time` DATETIME NULL DEFAULT NULL,
  `measured_humi` FLOAT DEFAULT NULL,
  PRIMARY KEY (`id`)
) CHARSET=utf8;
mysql> CREATE TABLE IF NOT EXISTS `co2_data` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `date_time` DATETIME NULL DEFAULT NULL,
  `measured_co2` FLOAT DEFAULT NULL,
  PRIMARY KEY (`id`)
) CHARSET=utf8;
mysql> CREATE TABLE IF NOT EXISTS `dust_data` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `date_time` DATETIME NULL DEFAULT NULL,
  `measured_dust` FLOAT DEFAULT NULL,
  `PM1_0` FLOAT DEFAULT NULL,
  `PM2_5` FLOAT DEFAULT NULL,
  `PM10_0` FLOAT DEFAULT NULL,
  `PM1_0_ATM` FLOAT DEFAULT NULL,
  `PM2_5_ATM` FLOAT DEFAULT NULL,
  `PM10_0_ATM` FLOAT DEFAULT NULL,
  `PCNT_0_3` FLOAT DEFAULT NULL,
  `PCNT_0_5` FLOAT DEFAULT NULL,
  `PCNT_1_0` FLOAT DEFAULT NULL,
  `PCNT_2_5` FLOAT DEFAULT NULL,
  `PCNT_5_0` FLOAT DEFAULT NULL,
  `PCNT_10_0` FLOAT DEFAULT NULL,
  PRIMARY KEY (`id`)
) CHARSET=utf8;
mysql> CREATE TABLE IF NOT EXISTS `pres_data` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `date_time` DATETIME NULL DEFAULT NULL,
  `measured_pres` FLOAT DEFAULT NULL,
  PRIMARY KEY (`id`)
) CHARSET=utf8;
mysql> SHOW TABLES;
mysql> DESC temp_data;
mysql> CREATE USER 'root'@'%' IDENTIFIED BY 'thermal1215@R';
mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'thermal1215@R';
mysql> ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'thermal1215@R';
mysql> FLUSH PRIVILEGES;
mysql> QUIT
```
## :rocket: Install Mosquitto MQTT broker
#####  Install
```
brew install mosquitto

//현재폴더에 passwd.secret 파일명으로 유저 mqtt_user , 패스워드 pass1234 설정파일 생성
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



##### Mosquitto 실행관련 명령어
```
brew services start mosquitto
brew services stop mosquitto
brew services restart mosquitto
```
#####  Pub/Sub 예시
```
MQTT_HOST=192.168.0.101
MQTT_PORT=1883
SUB_TOPIC=data/sensor
PUB_TOPIC=cmd/actuator
MQTT_USER=mqtt_user
MQTT_PASSWORD=pass1234
mosquitto_sub -h $MQTT_HOST -p $MQTT_PORT -t $SUB_TOPIC -u $MQTT_USER -P $MQTT_PASSWORD
mosquitto_pub -h $MQTT_HOST -p $MQTT_PORT -t $PUB_TOPIC -u $MQTT_USER -P $MQTT_PASSWORD
```

## :rocket: 서버 다운로드 및 실행
#### 설정파일 수정
```
기기 설정파일  : src/config.json
MQTT 설정파일 : src/config_mqtt.js
MYSQL설정파일 : src/config_mysql.js
```
> [src/config.json](src/config.json) 파일은 기기 설정 파일로 전원 ON시 자동으로 기기로 다운로드 됩니다.
서버 http://192.168.0.101/src/config.json 로 접근가능합니다.

#### Git clone
```
git clone https://github.com/sam0910/kmong-sensor-host
cd kmong-sensor-host
npm install
brew services restart mosquitto
brew services restart mysql
npm start
```

## :rocket: Actuator Control
> 지정한 방향(direction)으로 지정한 시간(duration-밀리초)동안 작동하고 정지
```
direction : forward|backward|stop, default: stop
duration  : miliseconds, default: 0
limit     : nc|no, default: nc
       nc : 리밋스위치 NC 일때 정지
       no : 리밋스위치 NO 일때 정지
```
######  HTTP로 명령 전송시
```
URL: http://192.168.0.101:8080/actuator
GET: direction=forward&duration=1200&limit=nc
예시: http://192.168.0.101:8080/actuator?direction=forward&duration=1200&limit=nc
```
######  MQTT로 명령 전송시
```
TOPIC  : cmd/actuator
PAYLOAD: direction=forward&duration=1200&limit=nc
```
## :rocket: Fan Control
```
power: on|off, default: off
speed: 1|2|3|4|5, default: 0
```
#####  HTTP로 명령 전송시
```
URL: http://192.168.0.101:8080/fan
GET: power=on&speed=2
예시: http://192.168.0.101:8080/fan?power=on&speed=2
```
#####  MQTT로 명령 전송시
```
TOPIC: cmd/fan
PAYLOAD: power=on&speed=2
```
## :rocket: 센서값 단위
> 온도 : ℃
> 습도 : %
> 이산화탄소 : ppm
```
measured_dust 컬럼에 공기질지표 AQI 값이 저장됩니다.
Dictionary Key별 측정 데이터는 아래와 같습니다.

Key          | Description |                                               
:------------|:------------------------------------------------------------
measured_dust| Air Quality Index (좋음,나쁨 등)
PM1_0        | PM 1.0(1마이크로미터 입자) 농도 마이크로그램(μg)/m3 (공장세팅환경)           
PM2_5        | PM 2.5(2.5마이크로미터 입자) 농도 마이크로그램(μg)/m3 (공장세팅)             
PM10_0       | PM 10(10마이크로미터 입자) 농도 마이크로그램(μg)/m3 (공장세팅환경)            
PM1_0_ATM    | PM 1.0(1마이크로미터 입자) 농도 마이크로그램(μg)/m3 (일반대기 환경)       
PM2_5_ATM    | PM 2.5(2.5마이크로미터 입자) 농도 마이크로그램(μg)/m3 (일반대기 환경)       
PM10_0_ATM   | PM 10(10마이크로미터 입자) 농도 마이크로그램(μg)/m3 (일반대기 환경)        
PCNT_0_3     | 직경 0.3 마이크로 미터(μm) 이상 입자수, 0.1 리터 공기 당
PCNT_0_5     | 직경 0.5 마이크로 미터(μm) 이상 입자수, 0.1 리터 공기 당
PCNT_1_0     | 직경 1.0 마이크로 미터(μm) 이상 입자수, 0.1 리터 공기 당
PCNT_2_5     | 직경 2.5 마이크로 미터(μm) 이상 입자수, 0.1 리터 공기 당
PCNT_5_0     | 직경 5.0 마이크로 미터(μm) 이상 입자수, 0.1 리터 공기 당
PCNT_10_0    | 직경 10.0 마이크로 미터(μm) 이상 입자수, 0.1 리터 공기 당
```
공기질지표(Air Quality Index) 관련 자료는 [위키피디아 참조](https://en.wikipedia.org/wiki/Air_quality_index#Computing_the_AQI)
## :rocket: Config file
```
{
    // 센서값 업데이트 주기 (초)
    "update_interval": {
        "dust": 60,
        "co2": 60,
        "barometer": 60,
        "temperature": 60,
        "humidity": 60
    },
    // 기기연결정보
    "connection": {
        "mqtt_host": "192.168.0.101",
        "mqtt_port": 1883,
        "mqtt_id": "mqtt_user",
        "mqtt_password": "pass1234",
        "wifi_ssid": "thermal-AP",
        "wifi_password": "thermal1215",
        "config_file": "http://192.168.0.101/src/config.json"
    },
    // 팬 스피드 설정 (Hz)
    "fan": {
        "speed_1_freq": 1000,
        "speed_2_freq": 5000,
        "speed_3_freq": 10000,
        "speed_4_freq": 15000,
        "speed_5_freq": 20000
    },
    // 액추에이터 모터 회전속도 설정 (Hz)
    "actuator": {
        "max_freq": 1000
    }

}
```
## 디바이스(센서보드, 액츄에이터보드) 설정 방법
> [!NOTE]
> 
> * 디바이스는 전원ON시 지정된 설정파일(config.json)을 기기로 다운로드 합니다.
> * 커넥션에러(WiFi,MQTT) 또는 설정파일 다운로드 에러시에 디바이스는 자동으로 설정모드(AP)로 진입합니다.
> * 서버의 WiFi 리스트에 설정이 필요한 디바이스가 표시되며, 해당 WiFi로 연결시 자동으로 설정창이 나옵니다.
> * 설정 완료 후 Board Restart를 눌러 디바이스를 재시작하면 새로운 WiFi 및 설정파일이 적용 됩니다.

> [!TIP]
> 
> * 디바이스 설정시 열려있는 브라우져(사파리,크롬) 닫고 진행 하시면 좋습니다.
> * 설정창이 뜨지 않거나 닫힐경우, 다른 Wifi 접속후에 다시 해당 디바이스AP로 접속하시면 정상 작동 됩니다.
> * 스마트폰 에서도 설정 가능합니다.(스마트폰 와이파이 리스트에서 해당 디바이스 선택)
<img width="813" alt="setting" src="https://github.com/sam0910/kmong-sensor-host/assets/9714538/ffca0318-abd0-45e0-bcdb-43900c2f4f96">





