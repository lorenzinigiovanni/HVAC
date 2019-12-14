#include <Arduino.h>
#include <LGAircon.h>
#include <WiFi.h>
#include <AsyncMqttClient.h>

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

  if (strcmp(topic, "ac/power") == 0)
  {
    if (strcmp(payload, "1") == 0)
      ac.turnOn();
    else if (strcmp(payload, "0") == 0)
      ac.turnOff();
  }
  else if (strcmp(topic, "ac/mode") == 0)
  {
    if (strcmp(payload, "cool") == 0)
      ac.setMode(Mode::Cooling);
    else if (strcmp(payload, "heat") == 0)
      ac.setMode(Mode::Heating);
    else if (strcmp(payload, "dehum") == 0)
      ac.setMode(Mode::Dehumidification);
    else if (strcmp(payload, "vent") == 0)
      ac.setMode(Mode::Ventilation);
  }
  else if (strcmp(topic, "ac/temp") == 0)
  {
    ac.setTemperature(atoi(payload));
  }
  else if (strcmp(topic, "ac/fan") == 0)
  {
    if (strcmp(payload, "low") == 0)
      ac.setFanSpeed(FanSpeed::Low);
    else if (strcmp(payload, "midlow") == 0)
      ac.setFanSpeed(FanSpeed::MidLow);
    else if (strcmp(payload, "mid") == 0)
      ac.setFanSpeed(FanSpeed::Mid);
    else if (strcmp(payload, "midhigh") == 0)
      ac.setFanSpeed(FanSpeed::MidHigh);
    else if (strcmp(payload, "high") == 0)
      ac.setFanSpeed(FanSpeed::High);
    else if (strcmp(payload, "naturalwind") == 0)
      ac.setFanSpeed(FanSpeed::NaturalWind);
  }
  else if (strcmp(topic, "ac/vswing") == 0)
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
    ac.sendVSwing();
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
    ac.sendHSwing();
  }
  else if (strcmp(topic, "ac/autoclean") == 0)
  {
    if (strcmp(payload, "1") == 0)
      ac.setAutoClean(true);
    else if (strcmp(payload, "0") == 0)
      ac.setAutoClean(false);
    ac.sendAutoClean();
  }
  else if (strcmp(topic, "ac/silent") == 0)
  {
    if (strcmp(payload, "1") == 0)
      ac.setSilent(true);
    else if (strcmp(payload, "0") == 0)
      ac.setSilent(false);
    ac.sendSilent();
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
    ac.sendEnergyControl();
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
  else if (strcmp(topic, "ac/send") == 0)
  {
    ac.send();
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
