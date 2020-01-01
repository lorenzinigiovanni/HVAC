import { Room } from "./places/room";
import { Pump } from './actuators/pump';
import { MixValve } from './actuators/mixValve';
import { Outdoors } from "./places/outdoors";
import { Climatic } from "./controllers/climatic";

export class System {

    private _home: Room[] = [];
    private _workshop: Room;
    private _office: Room;
    private _wc: Room;
    private _warehouse: Room;
    private _boilerroom: Room;

    private _outdoors: Outdoors;

    private _pumps: Pump[] = [];
    private _mixValves: MixValve[] = [];
    private _climatics: Climatic[] = [];

    constructor() {
        this._home.push(new Room('Cucina', true, true, false, false));
        this._home.push(new Room('Salotto', true, true, true, false));
        this._home.push(new Room('Corridoio', true, false, false, false));
        this._home.push(new Room('Bagno 1', true, false, false, false));
        this._home.push(new Room('Bagno 2', true, false, false, false));
        this._home.push(new Room('Camera 1', true, false, false, false));
        this._home.push(new Room('Camera 2', true, true, false, false));
        this._home.push(new Room('Camera 3', true, false, false, false));
        this._home.push(new Room('Giroscale', true, false, false, false));
        this._home.push(new Room('Ufficio Torretta', true, true, false, false));

        this._workshop = new Room('Falegnameria', true, false, false, false);
        this._office = new Room('Ufficio Falegnameria', false, false, false, true);
        this._wc = new Room('Bagno Falegnameria', false, false, false, true);
        this._warehouse = new Room('Magazzino', false, false, false, false);
        this._boilerroom = new Room('Locale Caldaia', false, false, false, false);

        this._outdoors = new Outdoors('Esterno');

        this._pumps.push(new Pump('Casa'));
        this._pumps.push(new Pump('Falegnameria'));
        this._pumps.push(new Pump('Ufficio Falegnameria'));
        this._pumps.push(new Pump('Bagno Falegnameria'));

        this._mixValves.push(new MixValve('Casa'));
        this._mixValves.push(new MixValve('Falegnameria'));

        this._climatics.push(new Climatic());
        this._climatics.push(new Climatic());

    }

}
