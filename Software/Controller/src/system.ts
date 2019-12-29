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

    constructor() {
        this._home.push(new Room('Cucina', true, true, false, false));
        this._home.push(new Room('Salotto', true, true, true, false));
        this._home.push(new Room('Corridoio', true, false, false, false));
        this._home.push(new Room('Bagno1', true, false, false, false));
        this._home.push(new Room('Bagno2', true, false, false, false));
        this._home.push(new Room('Camera1', true, false, false, false));
        this._home.push(new Room('Camera2', true, true, false, false));
        this._home.push(new Room('Camera3', true, false, false, false));
        this._home.push(new Room('Giroscale', true, false, false, false));
        this._home.push(new Room('UfficioTorretta', true, true, false, false));

        this._workshop = new Room('Falegnameria', true, false, false, false);
        this._office = new Room('UfficioFalegnameria', false, false, false, true);
        this._wc = new Room('BagnoFalegnameria', false, false, false, true);

        this._pumps.push(new Pump('Casa'));
        this._pumps.push(new Pump('Falegnameria'));
        this._pumps.push(new Pump('UfficioFalegnameria'));
        this._pumps.push(new Pump('BagnoFalegnameria'));

        this._mixValves.push(new MixValve('Casa'));
        this._mixValves.push(new MixValve('Falegnameria'));
    }

}
