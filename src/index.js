const version = "0.9.0";
const os = require('os');
const fs = require('fs');
const express = require("express");
const app = express();
const mqtt = require("mqtt");
const cors = require('cors');
const port = 8080;
const mysql = require('mysql');
const dbconfig = require('../config/config_mysql.js');
const mqtt_config = require('../config/config_mqtt.js');
const connection = mysql.createConnection(dbconfig);
const moment = require('moment-timezone');

connection.connect();
app.use(cors());

const ifaces = os.networkInterfaces();
let ip_address = '';
Object.keys(ifaces).forEach(function (ifname) {
    let alias = 0;
    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            return;
        }
        if (alias >= 1) {
            ip_address = iface.address;
        } else {
            ip_address = iface.address;
        }
        ++alias;
    });
});

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('*** MySQL  connected: true, ', results[0].solution);
});

app.listen(port, () => {
    console.log(`*** Server listening: http://${ip_address}:${port} (v${version})`);
});

// load src/config.json file



app.get("/", (req, res) => {
    res.send(`
        <h3>Server IP:${ip_address}:${port}, v${version}</h3>
    `);
});

app.get("/actuator", async (req, res) => {
    const direction = req.query.direction || "stop";
    const duration = req.query.duration || 0;
    const limit = req.query.limit || "nc";

    client.publish(mqtt_config.topic_actuator, `direction=${direction}&duration=${duration}&limit=${limit}`);

    res.send(`
        <h1>Actuator</h1>
        <p>Direction: ${direction}</p>
        <p>Duration: ${duration}</p>
        <p>Limit: ${limit}</p>
    `);
});

app.get("/fan", async (req, res) => {
    const power = req.query.power || "off";
    const speed = req.query.speed || 0;
    client.publish(mqtt_config.topic_fan, `power=${power}&speed=${speed}`);
    res.send(`
        <h1>Fan</h1>
        <p>Power: ${power}</p>
        <p>Speed: ${speed}</p>
    `);
});

app.use('/src', express.static('src'))

const client = mqtt.connect("mqtt://" + mqtt_config.mqtt_host, {
    username: mqtt_config.mqtt_username,
    password: mqtt_config.mqtt_password,
    port: mqtt_config.mqtt_port,
    keepalive: 1200,
});

client.on("connect", () => {
    console.log(`*** MQTT   connected: ${client.connected}, ${mqtt_config.mqtt_host}:${mqtt_config.mqtt_port} `);
    if (client.connected === true) {
    }
    client.subscribe(mqtt_config.topic_actuator);
    client.subscribe(mqtt_config.topic_fan);
    client.subscribe(mqtt_config.topic_sensor);

    const config = JSON.parse(fs.readFileSync('src/config.json', 'utf8'));
    if (config.connection.config_file != `http://${ip_address}:${port}/src/config.json`) {
        console.log("!!! Check device config file address on 'src/config.json' ");
    }
});


function save_to_db(type, data, raw = undefined) {
    // { "value": { "PM2_5": 20, "PM1_0_ATM": 9, "PM10_0_ATM": 23, "VERSION": 18, "ERROR": 0, "CHECKSUM": 598, "PM1_0": 9, "PM10_0": 23, "PM2_5_ATM": 20, "PCNT_0_5": 704, "PCNT_5_0": 0, "FRAME_LENGTH": 28, "PCNT_2_5": 0, "PCNT_1_0": 97, "PCNT_10_0": 0, "PCNT_0_3": 779 }, "type": "dust" }

    if (type == undefined || data == undefined) {
        console.log('[ERROR] save_to_db: type or data is undefined');
        return;
    }

    const datetime = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
    let sql = "";
    if (type == "dust") {
        const pms = JSON.parse(raw);
        const columns = Object.keys(pms).join(",");
        const values = Object.values(pms).map(value => typeof value === "string" ? `'${value}'` : value).join(",");
        sql = `INSERT INTO ${type}_data (${columns},date_time, measured_${type}) VALUES (${values},"${datetime}",${data})`;
    } else {
        sql = `INSERT INTO ${type}_data (date_time, measured_${type}) VALUES ("${datetime}",${data})`;
    }
    console.log(`SQL : ${type}_data -> ${data}`);
    connection.query(sql, data, (error, results, fields) => {
        if (error) throw error;
    });
}


client.on("message", async (topic, message) => {
    try {
        const topicStr = topic.toString();
        let msgStr = message.toString();
        // console.log(`- MQTT message: ${topicStr},${msgStr}`);
        if (topicStr == mqtt_config.topic_sensor) {
            const json = JSON.parse(msgStr);
            const type = json.type;
            const value = json.value;

            if (json.hasOwnProperty("raw")) {
                const raw = json.raw;
                save_to_db(type, value, raw);
            } else {
                save_to_db(type, value);
            }
        }
    } catch (error) {
        console.error("[ERROR] client.on.message");
        console.error(error);
    } finally {
        // console.error("finally");
    }
    return;
});

client.on("error", (error) => {
    console.error(error);
});