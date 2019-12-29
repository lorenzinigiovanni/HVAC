import mqtt from "mqtt";
import HAP from "hap-nodejs";

declare global {
    namespace NodeJS {
        interface Global {
            mqttClient: mqtt.MqttClient;
            homekitBridge: HAP.Bridge;
        }
    }
}
