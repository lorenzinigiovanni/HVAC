import mqtt from 'mqtt';

import { Radiant } from "./actuators/radiant";
import { Aircon } from "./actuators/aircon";
import { PelletStove } from "./actuators/pelletStove";
import { AmbientSensor } from './sensors/ambientSensor';
import { Fancoil } from './actuators/fancoil';
import { AmbientTemperatureController } from './controllers/ambientTemperatureController';

export class Room {
    private _name: string;

    private _topic: string;
    private _client: mqtt.MqttClient;

    private _radiant?: Radiant;
    private _aircon?: Aircon;
    private _pelletStove?: PelletStove;
    private _fancoil?: Fancoil;

    private _roomSensor: AmbientSensor;

    private _ambientTemperatureController: AmbientTemperatureController;

    constructor(name: string, client: mqtt.MqttClient, hasRadiant: boolean, hasAircon: boolean, hasPelletStove: boolean, hasFancoil: boolean) {
        this._name = name;

        this._topic = 'room/' + this._name;
        this._client = client;

        if (hasRadiant) {
            this._radiant = new Radiant(this._client, this._topic);
        }
        if (hasAircon) {
            this._aircon = new Aircon(this._client, this._topic);
        }
        if (hasPelletStove) {
            this._pelletStove = new PelletStove(this._client, this._topic);
        }
        if (hasFancoil) {
            this._fancoil = new Fancoil(this._client, this._topic);
        }

        this._roomSensor = new AmbientSensor(this._client, this._topic);

        this._ambientTemperatureController = new AmbientTemperatureController();
        this._ambientTemperatureController.powerChanged = this._powerChanged;
    }

    private _powerChanged(val: number) {

    }

}
