import { AmbientTemperatureController, ISystemPower } from "./ambientTemperatureController";
import { Attutatore, TipoAttuatore } from "./attuatore";

export class Room extends AmbientTemperatureController {
    private _name: string;
    private _attutatore: Attutatore[] = [];

    constructor(name: string) {
        super();

        this._name = name;
        this.callback = this.changePID;
    }

    addAttuatore(topic: string, tipo: TipoAttuatore, isAux: boolean = false) {
        let att = new Attutatore();
        att.isAux = isAux;

        this._attutatore.push(att);
    }

    changeAux() {

    }

    changePID(values: ISystemPower) {
        console.log(values);
    }
}
