#include <Arduino.h>
#include <LGAircon.h>

LGAircon ac(25, true);

void setup()
{
  Serial.begin(9600);
  delay(1000);

  ac.begin();
}

void loop()
{
  ac.turnOn();
  ac.send();

  delay(1000);

  ac.turnOff();
  ac.send();

  delay(1000);
}
