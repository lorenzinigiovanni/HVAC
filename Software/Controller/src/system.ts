import mqtt from 'mqtt';

import { Room } from "./room";
import { Pump } from './actuators/pump';
import { MixValve } from './actuators/mixValve';

export class System {

    private _home: Room[] = [];
    private _workshop: Room;
    private _office: Room;
    private _wc: Room;

    private _pumps: Pump[] = [];
    private _mixValves: MixValve[] = [];

    private _client: mqtt.MqttClient;

    constructor(client: mqtt.MqttClient) {
        this._client = client;

        this._home.push(new Room('cucina', this._client, true, true, false, false));
        this._home.push(new Room('salotto', this._client, true, true, true, false));
        this._home.push(new Room('corridoio', this._client, true, false, false, false));
        this._home.push(new Room('bagno1', this._client, true, false, false, false));
        this._home.push(new Room('bagno2', this._client, true, false, false, false));
        this._home.push(new Room('camera1', this._client, true, false, false, false));
        this._home.push(new Room('camera2', this._client, true, true, false, false));
        this._home.push(new Room('camera3', this._client, true, false, false, false));
        this._home.push(new Room('giroscale', this._client, true, false, false, false));
        this._home.push(new Room('torretta', this._client, true, true, false, false));

        this._workshop = new Room('falegnameria', this._client, true, false, false, false);
        this._office = new Room('ufficio', this._client, false, false, false, true);
        this._wc = new Room('bagno', this._client, false, false, false, true);

        this._pumps.push(new Pump(this._client, 'casa'));
        this._pumps.push(new Pump(this._client, 'falegnameria'));
        this._pumps.push(new Pump(this._client, 'ufficio'));
        this._pumps.push(new Pump(this._client, 'bagno'));

        this._mixValves.push(new MixValve(this._client, 'casa'));
        this._mixValves.push(new MixValve(this._client, 'falegnameria'));
    }

}
