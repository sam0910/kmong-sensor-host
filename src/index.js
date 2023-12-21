const express = require("express");
const app = express();
const mqtt = require("mqtt");
const cors = require('cors');
const port = 8080;
const mysql = require('mysql');
const dbconfig = require('./config_mysql.js');
const mqtt_config = require('./config_mqtt.js');
const connection = mysql.createConnection(dbconfig);
connection.connect();


app.use(cors());

app.listen(port, () => {
    console.log(`Sensor-host app listening on port ${port} `);
});

app.get("/", (req, res) => {
    res.send(`
        <h1>Control panel</h1>
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


const client = mqtt.connect(mqtt_config.mqtt_host, {
    username: mqtt_config.mqtt_username,
    password: mqtt_config.mqtt_password,
    port: mqtt_config.mqtt_port,
    keepalive: 1200,
});

client.on("connect", () => {
    console.log(`- MQTT connected: ${client.connected} `);
    if (client.connected === true) {
    }
    client.subscribe(mqtt_config.topic_actuator);
    client.subscribe(mqtt_config.topic_fan);
    client.subscribe(mqtt_config.topic_sensor);
});

function save_to_db(type, data) {
    if (type == undefined || data == undefined) {
        console.log('[ERROR] save_to_db: type or data is undefined');
        return;
    }
    datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = `INSERT INTO ${type}_data (date_time,measured_${type}) VALUE ("${datetime}",${data})`;
    console.log(" " + sql);
    connection.query(sql, data, (error, results, fields) => {
        if (error) throw error;
    });
}

client.on("message", async (topic, message) => {
    try {
        const topicStr = topic.toString();
        let msgStr = message.toString();
        console.log(`- MQTT message: ${topicStr},${msgStr}`);
        if (topicStr == mqtt_config.topic_sensor) {
            const json = JSON.parse(msgStr);
            const type = json.type;
            const value = json.value;
            save_to_db(type, value);
        }
    } catch (error) {
        console.error("[ERROR] client.on.message");
        console.error(error);
    } finally {
        // console.error("finally");
    }
    return
});

client.on("error", (error) => {
    console.error(error);
});