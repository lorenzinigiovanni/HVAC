#include <Arduino.h>
#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>

byte mac[] = {0xDE, 0xED, 0xBA, 0xFF, 0xFE, 0xED};
IPAddress server(192, 168, 69, 220);

EthernetClient ethClient;
PubSubClient client(ethClient);

void callback(char *topic, byte *payload, unsigned int length);
void reconnect();

void setup()
{
  Serial.begin(9600);

  client.setServer(server, 1883);
  client.setCallback(callback);

  Ethernet.begin(mac);
  Serial.println("DHCP assigned IP");
  Serial.println(Ethernet.localIP());

  pinMode(8, OUTPUT);
  digitalWrite(8, HIGH);

  delay(1500);
}

void loop()
{
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();
}

void callback(char *topic, byte *payload, unsigned int length)
{
  String str = topic;

  Serial.println(str);

  if (str == "relay/1")
  {
    digitalWrite(8, 0);
  }
  else if (str == "relay/0")
  {
    digitalWrite(8, 1);
  }
}

void reconnect()
{
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("arduinoClient"))
    {
      Serial.println("connected");
      client.subscribe("relay/#");
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
