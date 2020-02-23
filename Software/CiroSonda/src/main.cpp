#include <Arduino.h>
#include <Adafruit_BME280.h>
#include <WiFi.h>

#include <AsyncMqttClient.h>

#define uS_TO_S_FACTOR 1000000
#define TIME_TO_SLEEP 60

#define WIFI_SSID "Lorenzini"
#define WIFI_PASSWORD "2444666668888888"

#define MQTT_HOST IPAddress(192, 168, 69, 220)
#define MQTT_PORT 1883

#define baseTopic "camera2"

AsyncMqttClient mqttClient;
TimerHandle_t mqttReconnectTimer;
TimerHandle_t wifiReconnectTimer;
TimerHandle_t sensorReadTimer;

Adafruit_BME280 bme;

void readSensor();
void connectToWifi();
void connectToMqtt();
void WiFiEvent(WiFiEvent_t event);
void onMqttConnect(bool sessionPresent);
void onMqttDisconnect(AsyncMqttClientDisconnectReason reason);
void onMqttMessage(char *topic, char *payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total);

void setup()
{
  Serial.begin(9600);

  if (!bme.begin(&Wire))
  {
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    sleep();
  }

  bme.setSampling(Adafruit_BME280::MODE_FORCED,
                  Adafruit_BME280::SAMPLING_X1,   // temperature
                  Adafruit_BME280::SAMPLING_NONE, // pressure
                  Adafruit_BME280::SAMPLING_X1,   // humidity
                  Adafruit_BME280::FILTER_OFF);

  bme.takeForcedMeasurement();

  WiFi.onEvent(WiFiEvent);

  mqttClient.onConnect(onMqttConnect);
  mqttClient.onDisconnect(onMqttDisconnect);
  mqttClient.onMessage(onMqttMessage);
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);

  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void loop()
{
}

void sleep()
{
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);
  esp_deep_sleep_start();
}

void readSensor()
{
  float h = bme.readHumidity();
  float t = bme.readTemperature();

  char result[8];
  char topic[50];

  snprintf(topic, 50, "room/%s/ambientsensor/temperature", baseTopic);
  dtostrf(t, 6, 2, result);
  mqttClient.publish(topic, 0, false, result);

  snprintf(topic, 50, "room/%s/ambientsensor/humidity", baseTopic);
  dtostrf(h, 6, 2, result);
  mqttClient.publish(topic, 0, false, result);

  sleep();
}

void WiFiEvent(WiFiEvent_t event)
{
  Serial.printf("[WiFi-event] event: %d\n", event);
  switch (event)
  {
  case SYSTEM_EVENT_STA_GOT_IP:
    Serial.println("WiFi connected");

    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    Serial.println("Connecting to MQTT...");
    mqttClient.connect();
    break;

  case SYSTEM_EVENT_STA_DISCONNECTED:
    Serial.println("WiFi lost connection");
    sleep();
    break;
  }
}

void onMqttConnect(bool sessionPresent)
{
  Serial.println("MQTT connected");
  readSensor();
}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason)
{
  Serial.println("Disconnected from MQTT.");
  sleep();
}

void onMqttMessage(char *topic, char *payloadO, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total)
{
  char payload[len + 1];
  strncpy(payload, payloadO, len);
  payload[len] = 0;

  Serial.print("Topic: ");
  Serial.print(topic);
  Serial.print(" Payload: ");
  Serial.println(payload);
}
