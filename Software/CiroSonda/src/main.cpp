#include <Arduino.h>
#include <Adafruit_BME280.h>
#include <WiFi.h>

extern "C"
{
#include "freertos/FreeRTOS.h"
#include "freertos/timers.h"
}

#include <AsyncMqttClient.h>

#define WIFI_SSID "Lorenzini"
#define WIFI_PASSWORD "2444666668888888"

#define MQTT_HOST IPAddress(192, 168, 69, 220)
#define MQTT_PORT 1883

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

  bme.begin(&Wire);

  mqttReconnectTimer = xTimerCreate("mqttTimer", pdMS_TO_TICKS(10000), pdFALSE, (void *)0, reinterpret_cast<TimerCallbackFunction_t>(connectToMqtt));
  wifiReconnectTimer = xTimerCreate("wifiTimer", pdMS_TO_TICKS(10000), pdFALSE, (void *)0, reinterpret_cast<TimerCallbackFunction_t>(connectToWifi));
  sensorReadTimer = xTimerCreate("sensorTimer", pdMS_TO_TICKS(3000), pdFALSE, (void *)0, reinterpret_cast<TimerCallbackFunction_t>(readSensor));

  WiFi.onEvent(WiFiEvent);

  mqttClient.onConnect(onMqttConnect);
  mqttClient.onDisconnect(onMqttDisconnect);
  mqttClient.onMessage(onMqttMessage);
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);

  connectToWifi();
}

void loop()
{
}

void readSensor()
{
  float h = bme.readHumidity();
  float t = bme.readTemperature();

  Serial.println(t);

  char result[8];
  dtostrf(t, 6, 2, result);
  mqttClient.publish("ciro/munnezz/temperature", 0, true, result);

  dtostrf(h, 6, 2, result);
  mqttClient.publish("ciro/munnezz/humidity", 0, true, result);

  xTimerStart(sensorReadTimer, 0);
}

void connectToWifi()
{
  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void connectToMqtt()
{
  Serial.println("Connecting to MQTT...");
  mqttClient.connect();
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
    connectToMqtt();
    break;
  case SYSTEM_EVENT_STA_DISCONNECTED:
    Serial.println("WiFi lost connection");
    xTimerStop(mqttReconnectTimer, 0);
    xTimerStart(wifiReconnectTimer, 0);
    break;
  }
}

void onMqttConnect(bool sessionPresent)
{
  Serial.println("MQTT connected");
  mqttClient.subscribe("ciro/munnezz", 2);
  xTimerStart(sensorReadTimer, 0);
}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason)
{
  Serial.println("Disconnected from MQTT.");

  if (WiFi.isConnected())
  {
    xTimerStart(mqttReconnectTimer, 0);
  }
}

void onMqttMessage(char *topic, char *payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total)
{
  Serial.println("Publish received.");
  Serial.print("  topic: ");
  Serial.println(topic);
  Serial.print("  qos: ");
  Serial.println(properties.qos);
  Serial.print("  dup: ");
  Serial.println(properties.dup);
  Serial.print("  retain: ");
  Serial.println(properties.retain);
  Serial.print("  len: ");
  Serial.println(len);
  Serial.print("  index: ");
  Serial.println(index);
  Serial.print("  total: ");
  Serial.println(total);
}
