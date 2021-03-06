#include "LGAircon.h"

LGAircon::LGAircon(uint16_t IRSendPin, bool inverted, bool useModulation) : _irsend(IRSendPin, inverted, useModulation)
{
}

LGAircon::~LGAircon()
{
}

void LGAircon::begin()
{
    _irsend.begin();

    _on = false;

    _mode = Mode::Ventilation;
    _fanSpeed = FanSpeed::Low;

    setVSwing(VerticalSwing::Auto);
    setHSwing(HorizontalSwing::Auto);

    setEnergyControl(EnergyControl::Off);

    _autoClean = false;
    _silent = false;
}

void LGAircon::set(boolean on, const char *mode, uint8_t temperature, const char *fanSpeed)
{
    _on = on;
    setMode(mode);
    setTemperature(temperature);
    setFanSpeed(fanSpeed);

    uint32_t code;

    if (_on)
    {
        code = createCode(0, static_cast<uint8_t>(_mode), _temperature, static_cast<uint8_t>(_fanSpeed));
    }
    else
    {
        code = createCode(0xC, 0, 0, 5);
    }

    sendLG(code);
}

void LGAircon::setMode(const char *mode)
{
    if (strcmp(mode, "cool") == 0)
        _mode = Mode::Cooling;
    else if (strcmp(mode, "heat") == 0)
        _mode = Mode::Heating;
    else if (strcmp(mode, "dehum") == 0)
        _mode = Mode::Dehumidification;
    else if (strcmp(mode, "vent") == 0)
        _mode = Mode::Ventilation;

    if (_mode == Mode::Cooling)
    {
        _temperature = 22 - 15;
    }
    else if (_mode == Mode::Heating)
    {
        _temperature = 20 - 15;
    }
    else if (_mode == Mode::Dehumidification)
    {
        _temperature = 9;
    }
    else if (_mode == Mode::Ventilation)
    {
        _temperature = 3;
    }
}

void LGAircon::setTemperature(uint8_t temperature)
{
    if (_mode == Mode::Dehumidification || _mode == Mode::Ventilation)
    {
        return;
    }

    if (_mode == Mode::Cooling && temperature < 18)
    {
        temperature = 18;
    }
    else if (temperature < 16)
    {
        temperature = 16;
    }
    else if (temperature > 30)
    {
        temperature = 30;
    }

    _temperature = temperature - 15;
}

void LGAircon::setFanSpeed(const char *fanSpeed)
{
    if (strcmp(fanSpeed, "low") == 0)
        _fanSpeed = FanSpeed::Low;
    else if (strcmp(fanSpeed, "midlow") == 0)
        _fanSpeed = FanSpeed::MidLow;
    else if (strcmp(fanSpeed, "mid") == 0)
        _fanSpeed = FanSpeed::Mid;
    else if (strcmp(fanSpeed, "midhigh") == 0)
        _fanSpeed = FanSpeed::MidHigh;
    else if (strcmp(fanSpeed, "high") == 0)
        _fanSpeed = FanSpeed::High;
    else if (strcmp(fanSpeed, "naturalwind") == 0)
        _fanSpeed = FanSpeed::NaturalWind;
}

void LGAircon::setVSwing(VerticalSwing vSwing)
{
    _vSwing = vSwing;

    uint32_t code = createCode(1, 3, (static_cast<uint8_t>(_vSwing) & B11110000) >> 4, static_cast<uint8_t>(_vSwing) & B00001111);

    sendLG(code);
}

void LGAircon::setHSwing(HorizontalSwing hSwing)
{
    _hSwing = hSwing;

    uint32_t code = createCode(1, 3, (static_cast<uint8_t>(_hSwing) & B11110000) >> 4, static_cast<uint8_t>(_hSwing) & B00001111);

    sendLG(code);
}

void LGAircon::setEnergyControl(EnergyControl energyControl)
{
    _energyControl = energyControl;

    uint32_t code = createCode(0xC, 0, (static_cast<uint8_t>(_energyControl) & B11110000) >> 4, static_cast<uint8_t>(_energyControl) & B00001111);

    sendLG(code);
}

void LGAircon::setAutoClean(boolean autoClean)
{
    _autoClean = autoClean;

    uint32_t code;

    if (_autoClean == true)
    {
        code = createCode(0xC, 0, 0, 0xB);
    }
    else
    {
        code = createCode(0xC, 0, 0, 0xC);
    }

    sendLG(code);
}

void LGAircon::setSilent(boolean silent)
{
    _silent = silent;

    uint32_t code;

    if (_silent == true)
    {
        code = createCode(0xC, 0, 0xA, 6);
    }
    else
    {
        code = createCode(0xC, 0, 0xA, 7);
    }

    sendLG(code);
}

void LGAircon::showKW()
{
    uint32_t code = createCode(0xC, 0, 4, 6);

    sendLG(code);
}

void LGAircon::jet()
{
    uint32_t code = createCode(1, 0, 0, 8);

    sendLG(code);
}

void LGAircon::light()
{
    uint32_t code = createCode(0xC, 0, 0, 0xA);

    sendLG(code);
}

void LGAircon::print()
{
    Serial.print("_on: ");
    Serial.println(_on);
    Serial.print("_temperature: ");
    Serial.println(_temperature);
    Serial.print("_mode: ");
    Serial.println(static_cast<uint8_t>(_mode));
    Serial.print("_fanSpeed: ");
    Serial.println(static_cast<uint8_t>(_fanSpeed));
    Serial.println();
}

void LGAircon::sendLG(uint32_t code)
{
    Serial.print("Code: ");
    Serial.println(code, HEX);
    _irsend.sendLG2(code, 28);
}

uint32_t LGAircon::createCode(uint8_t msbits3, uint8_t msbits4, uint8_t msbits5, uint8_t msbits6)
{
    uint8_t msbits1 = 8;
    uint8_t msbits2 = 8;

    uint8_t msbits7 = (msbits3 + msbits4 + msbits5 + msbits6) & B00001111;

    uint32_t code = msbits1 << 4;
    code = (code + msbits2) << 4;
    code = (code + msbits3) << 4;
    code = (code + msbits4) << 4;
    code = (code + msbits5) << 4;
    code = (code + msbits6) << 4;
    code = (code + msbits7);

    return code;
}
