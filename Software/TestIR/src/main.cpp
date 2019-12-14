#include <Arduino.h>
#include <LGAircon.h>
#include <WiFi.h>
#include <AsyncMqttClient.h>
#include <ArduinoJson.h>

#define WIFI_SSID "Lorenzini"
#define WIFI_PASSWORD "2444666668888888"

#define MQTT_HOST IPAddress(192, 168, 69, 220)
#define MQTT_PORT 1883

void WiFiEvent(WiFiEvent_t event);

AsyncMqttClient mqttClient;
void onMqttConnect(bool sessionPresent);
void onMqttMessage(char *topic, char *payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total);

LGAircon ac(25, true);

void setup()
{
  Serial.begin(9600);
  delay(1000);

  WiFi.onEvent(WiFiEvent);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  mqttClient.onConnect(onMqttConnect);
  mqttClient.onMessage(onMqttMessage);
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);

  ac.begin();
}

void loop()
{
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

  if (strcmp(topic, "ac/set") == 0)
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

  if (strcmp(topic, "ac/vswing") == 0)
  {
    if (strcmp(payload, "auto") == 0)
      ac.setVSwing(VerticalSwing::Auto);
    else if (strcmp(payload, "step1") == 0)
      ac.setVSwing(VerticalSwing::Step1);
    else if (strcmp(payload, "step2") == 0)
      ac.setVSwing(VerticalSwing::Step2);
    else if (strcmp(payload, "step3") == 0)
      ac.setVSwing(VerticalSwing::Step3);
    else if (strcmp(payload, "step4") == 0)
      ac.setVSwing(VerticalSwing::Step4);
    else if (strcmp(payload, "step5") == 0)
      ac.setVSwing(VerticalSwing::Step5);
    else if (strcmp(payload, "step6") == 0)
      ac.setVSwing(VerticalSwing::Step6);
    else if (strcmp(payload, "swing") == 0)
      ac.setVSwing(VerticalSwing::Swing);
  }
  else if (strcmp(topic, "ac/hswing") == 0)
  {
    if (strcmp(payload, "auto") == 0)
      ac.setHSwing(HorizontalSwing::Auto);
    else if (strcmp(payload, "step1") == 0)
      ac.setHSwing(HorizontalSwing::Step1);
    else if (strcmp(payload, "step2") == 0)
      ac.setHSwing(HorizontalSwing::Step2);
    else if (strcmp(payload, "step3") == 0)
      ac.setHSwing(HorizontalSwing::Step3);
    else if (strcmp(payload, "step4") == 0)
      ac.setHSwing(HorizontalSwing::Step4);
    else if (strcmp(payload, "step5") == 0)
      ac.setHSwing(HorizontalSwing::Step5);
    else if (strcmp(payload, "swing") == 0)
      ac.setHSwing(HorizontalSwing::Swing);
    else if (strcmp(payload, "swingleft") == 0)
      ac.setHSwing(HorizontalSwing::SwingLeft);
    else if (strcmp(payload, "swingright") == 0)
      ac.setHSwing(HorizontalSwing::SwingRight);
  }
  else if (strcmp(topic, "ac/autoclean") == 0)
  {
    if (strcmp(payload, "1") == 0)
      ac.setAutoClean(true);
    else if (strcmp(payload, "0") == 0)
      ac.setAutoClean(false);
  }
  else if (strcmp(topic, "ac/silent") == 0)
  {
    if (strcmp(payload, "1") == 0)
      ac.setSilent(true);
    else if (strcmp(payload, "0") == 0)
      ac.setSilent(false);
  }
  else if (strcmp(topic, "ac/energy") == 0)
  {
    if (strcmp(payload, "0") == 0)
      ac.setEnergyControl(EnergyControl::Off);
    else if (strcmp(payload, "20") == 0)
      ac.setEnergyControl(EnergyControl::Minus20);
    else if (strcmp(payload, "40") == 0)
      ac.setEnergyControl(EnergyControl::Minus40);
    else if (strcmp(payload, "60") == 0)
      ac.setEnergyControl(EnergyControl::Minus60);
  }
  else if (strcmp(topic, "ac/showkw") == 0)
  {
    ac.showKW();
  }
  else if (strcmp(topic, "ac/jet") == 0)
  {
    ac.jet();
  }
  else if (strcmp(topic, "ac/light") == 0)
  {
    ac.light();
  }

  ac.print();
}

void onMqttConnect(bool sessionPresent)
{
  Serial.println("MQTT connected");
  mqttClient.subscribe("ac/+", 0);
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
    mqttClient.connect();
    break;
  case SYSTEM_EVENT_STA_DISCONNECTED:
    Serial.println("WiFi lost connection");
    break;
  }
}
