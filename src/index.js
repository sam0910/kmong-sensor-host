const sub_topic = "sub/kmong";
const pub_topic = "pub/kmong";
const express = require("express");
const app = express();
const mqtt = require("mqtt");
const cors = require('cors');
const port = 8080;
app.use(cors());

TOPIC_ACTUATOR = "cmd/actuator";
TOPIC_FAN = "cmd/fan";


app.listen(port, () => {
    console.log(`Example app listening on port ${port} `);
});

app.get("/", (req, res) => {
    res.send(`
        <h1>Control panel</h1>
    `);
});

app.get("/actuator", async (req, res) => {
    // http://localhost:8080/actuator?direction=forward&duration=987&limit=nc
    const direction = req.query.direction || "stop"; // forward, backward, stop
    const duration = req.query.duration || 0;
    const limit = req.query.limit || "nc"; //

    // Publishing MQTT message with extracted values
    client.publish(TOPIC_ACTUATOR, `direction=${direction}&duration=${duration}&limit=${limit}`);

    // Sending HTML response
    res.send(`
        <h1>Actuator</h1>
        <p>Direction: ${direction}</p>
        <p>Duration: ${duration}</p>
        <p>Limit: ${limit}</p>
    `);
});

app.get("/fan", async (req, res) => {
    // power=on.off
    // speed=1,2,3,4,5
    const power = req.query.power || "off";
    const speed = req.query.speed || 0;
    client.publish(TOPIC_FAN, `power=${power}&speed=${speed}`);
    res.send(`
        <h1>Fan</h1>
        <p>Power: ${power}</p>
        <p>Speed: ${speed}</p>
    `);
});

// client.publish(`ping`, "server@" + moment().format("YYYY-MM-DDTHH:mm"));

const client = mqtt.connect("mqtt://sam0910.iptime.org", {
    username: "acespa",
    password: "10293847",
    port: 1883,
    keepalive: 1200,
});


client.on("connect", () => {
    console.log(`- MQTT connected: ${client.connected} `);
    if (client.connected === true) {
    }
    client.subscribe(TOPIC_ACTUATOR);
    client.subscribe(TOPIC_FAN);
});

client.on("message", async (topic, message) => {
    try {
        const topicStr = topic.toString();
        const msgStr = message.toString();
        console.log(`- MQTT message: ${topicStr} ${msgStr}`);
        // const msg = JSON.parse(msgStr);
        // msgStr.startsWith("dummy@")
    } catch (error) {
        console.error("[!!!] FATAL, TRY!", error);
    } finally {
        // console.error("finally");
    }
    return
});

client.on("error", (error) => {
    console.error(error);
});