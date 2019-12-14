#include <Arduino.h>
#include <Adafruit_BME280.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <LGAircon.h>

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

#define baseTopic "cameraGiovanni"
#define AC

AsyncMqttClient mqttClient;
TimerHandle_t mqttReconnectTimer;
TimerHandle_t wifiReconnectTimer;
TimerHandle_t sensorReadTimer;

Adafruit_BME280 bme;

#ifdef AC
LGAircon ac(25, true);
#endif

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

  ac.begin();

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

  char result[8];
  char topic[50];

  snprintf(topic, 50, "%s/temperature", baseTopic);
  dtostrf(t, 6, 2, result);
  mqttClient.publish(topic, 0, true, result);

  snprintf(topic, 50, "%s/humidity", baseTopic);
  dtostrf(h, 6, 2, result);
  mqttClient.publish(topic, 0, true, result);

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
  xTimerStart(sensorReadTimer, 0);
#ifdef AC
  char topic[50];
  snprintf(topic, 50, "%s/ac/+", baseTopic);
  mqttClient.subscribe(topic, 0);
#endif
}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason)
{
  Serial.println("Disconnected from MQTT.");

  if (WiFi.isConnected())
  {
    xTimerStart(mqttReconnectTimer, 0);
  }
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

#ifdef AC
  if (strstr(topic, "ac/set") != NULL)
  {
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, payload);

    if (error)
    {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.c_str());
      return;
    }

    boolean on = doc["on"];
    const char *mode = doc["mode"];
    uint8_t temperature = doc["temperature"];
    const char *fanSpeed = doc["fanSpeed"];

    Serial.print("JSON on: ");
    Serial.print(on);
    Serial.print(" mode: ");
    Serial.print(mode);
    Serial.print(" temperature: ");
    Serial.print(temperature);
    Serial.print(" fanSpeed: ");
    Serial.println(fanSpeed);

    ac.set(on, mode, temperature, fanSpeed);
  }

  if (strstr(topic, "ac/vswing") != NULL)
  {
    if (strstr(payload, "auto") != NULL)
      ac.setVSwing(VerticalSwing::Auto);
    else if (strstr(payload, "step1") != NULL)
      ac.setVSwing(VerticalSwing::Step1);
    else if (strstr(payload, "step2") != NULL)
      ac.setVSwing(VerticalSwing::Step2);
    else if (strstr(payload, "step3") != NULL)
      ac.setVSwing(VerticalSwing::Step3);
    else if (strstr(payload, "step4") != NULL)
      ac.setVSwing(VerticalSwing::Step4);
    else if (strstr(payload, "step5") != NULL)
      ac.setVSwing(VerticalSwing::Step5);
    else if (strstr(payload, "step6") != NULL)
      ac.setVSwing(VerticalSwing::Step6);
    else if (strstr(payload, "swing") != NULL)
      ac.setVSwing(VerticalSwing::Swing);
  }
  else if (strstr(topic, "ac/hswing") != NULL)
  {
    if (strstr(payload, "auto") != NULL)
      ac.setHSwing(HorizontalSwing::Auto);
    else if (strstr(payload, "step1") != NULL)
      ac.setHSwing(HorizontalSwing::Step1);
    else if (strstr(payload, "step2") != NULL)
      ac.setHSwing(HorizontalSwing::Step2);
    else if (strstr(payload, "step3") != NULL)
      ac.setHSwing(HorizontalSwing::Step3);
    else if (strstr(payload, "step4") != NULL)
      ac.setHSwing(HorizontalSwing::Step4);
    else if (strstr(payload, "step5") != NULL)
      ac.setHSwing(HorizontalSwing::Step5);
    else if (strstr(payload, "swing") != NULL)
      ac.setHSwing(HorizontalSwing::Swing);
    else if (strstr(payload, "swingleft") != NULL)
      ac.setHSwing(HorizontalSwing::SwingLeft);
    else if (strstr(payload, "swingright") != NULL)
      ac.setHSwing(HorizontalSwing::SwingRight);
  }
  else if (strstr(topic, "ac/autoclean") != NULL)
  {
    if (strstr(payload, "1") != NULL)
      ac.setAutoClean(true);
    else if (strstr(payload, "0") != NULL)
      ac.setAutoClean(false);
  }
  else if (strstr(topic, "ac/silent") != NULL)
  {
    if (strstr(payload, "1") != NULL)
      ac.setSilent(true);
    else if (strstr(payload, "0") != NULL)
      ac.setSilent(false);
  }
  else if (strstr(topic, "ac/energy") != NULL)
  {
    if (strstr(payload, "0") != NULL)
      ac.setEnergyControl(EnergyControl::Off);
    else if (strstr(payload, "20") != NULL)
      ac.setEnergyControl(EnergyControl::Minus20);
    else if (strstr(payload, "40") != NULL)
      ac.setEnergyControl(EnergyControl::Minus40);
    else if (strstr(payload, "60") != NULL)
      ac.setEnergyControl(EnergyControl::Minus60);
  }
  else if (strstr(topic, "ac/showkw") != NULL)
  {
    ac.showKW();
  }
  else if (strstr(topic, "ac/jet") != NULL)
  {
    ac.jet();
  }
  else if (strstr(topic, "ac/light") != NULL)
  {
    ac.light();
  }

  ac.print();
#endif
}
