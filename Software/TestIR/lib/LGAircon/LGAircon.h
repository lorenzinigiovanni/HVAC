#ifndef _LGAIRCON_H_
#define _LGAIRCON_H_

#include <Arduino.h>
#include <IRremoteESP8266.h>
#include <IRsend.h>

enum class Mode : uint8_t
{
    Cooling = 0x0,
    Dehumidification = 0x1,
    Ventilation = 0x2,
    Heating = 0x4
};

enum class FanSpeed : uint8_t
{
    Low = 0x0,
    MidLow = 0x9,
    Mid = 0x2,
    MidHigh = 0xA,
    High = 0x4,
    NaturalWind = 0x5
};

enum class VerticalSwing : uint8_t
{
    Auto = 0x15,
    Step1 = 0x04,
    Step2 = 0x05,
    Step3 = 0x06,
    Step4 = 0x07,
    Step5 = 0x08,
    Step6 = 0x09,
    Swing = 0x14
};

enum class HorizontalSwing : uint8_t
{
    Auto = 0x17,
    Step1 = 0x0B,
    Step2 = 0x0C,
    Step3 = 0x0D,
    Step4 = 0x0E,
    Step5 = 0x0F,
    Swing = 0x16,
    SwingLeft = 0x10,
    SwingRight = 0x11
};

enum class EnergyControl : uint8_t
{
    Off = 0x7F,
    Minus20 = 0x7D,
    Minus40 = 0x7E,
    Minus60 = 0x80
};

class LGAircon
{
private:
    IRsend _irsend;

    boolean _on;

    Mode _mode;
    uint8_t _temperature;
    FanSpeed _fanSpeed;

    VerticalSwing _vSwing;
    HorizontalSwing _hSwing;

    EnergyControl _energyControl;
    boolean _autoClean;
    boolean _silent;

    void setMode(const char *mode);
    void setTemperature(uint8_t temperature);
    void setFanSpeed(const char *fanSpeed);
    uint32_t createCode(uint8_t msbits3, uint8_t msbits4, uint8_t msbits5, uint8_t msbits6);
    void sendLG(uint32_t code);

public:
    LGAircon(uint16_t IRSendPin, bool inverted = false, bool useModulation = true);
    ~LGAircon();

    void begin();
    void set(boolean on, const char *mode, uint8_t temperature, const char *fanSpeed);
    void setVSwing(VerticalSwing vSwing);
    void setHSwing(HorizontalSwing hSwing);
    void setEnergyControl(EnergyControl energyControl);
    void setAutoClean(boolean autoClean);
    void setSilent(boolean silent);
    void showKW();
    void jet();
    void light();

    void print();
};

#endif
