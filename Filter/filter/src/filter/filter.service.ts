import { Injectable } from '@nestjs/common';
import { Mutex } from 'async-mutex';
import { count } from 'console';
import { Fields, Window } from 'src/DTOs';

@Injectable()
export class FilterService {

    private counter: number;
    private windowValues: Window;
    private mutex: Mutex;

    constructor() {
        this.counter = 0;
        this.windowValues = {
            avgGlobalActivePower: 0,
            avgGlobalIntensity: 0,
            avgGlobalReactivePower: 0,
            avgSubMetering_1: 0,
            avgSubMetering_2: 0,
            avgSubMetering_3: 0,
            avgVoltage: 0,
            windowsTimestamp: null
        };
        this.mutex = new Mutex();
    }

    private updateValue(counter, oldValue, newValue) {
        return (oldValue * counter + newValue) / (counter + 1);
    }

    public async addDataToWindowAsync(data: Fields) {
        const release = await this.mutex.acquire();
        try {
            this.windowValues.avgGlobalActivePower = this.updateValue(
                this.counter,
                this.windowValues.avgGlobalActivePower,
                data.globalActivePower);
            this.windowValues.avgGlobalReactivePower = this.updateValue(
                this.counter,
                this.windowValues.avgGlobalReactivePower,
                data.globalReactivePower,
            );
            this.windowValues.avgGlobalIntensity = this.updateValue(
                this.counter,
                this.windowValues.avgGlobalIntensity,
                data.globalIntensity,
            );
            this.windowValues.avgVoltage = this.updateValue(
                this.counter,
                this.windowValues.avgVoltage,
                data.voltage,
            );
            this.windowValues.avgSubMetering_1 = this.updateValue(
                this.counter,
                this.windowValues.avgSubMetering_1,
                data.subMetering_1,
            );
            this.windowValues.avgSubMetering_2 = this.updateValue(
                this.counter,
                this.windowValues.avgSubMetering_2,
                data.subMetering_2,
            );
            this.windowValues.avgSubMetering_3 = this.updateValue(
                this.counter,
                this.windowValues.avgSubMetering_3,
                data.subMetering_3,
            );
            this.windowValues.windowsTimestamp = data.time;
            this.counter += 1;
        } catch (e) {
            console.error(e)
        }
        finally {
            release();
        }
    }

    public async getWindowDataAsync() {
        const release = await this.mutex.acquire();
        try {
            return this.windowValues;
        }
        catch (e) {
            console.error(e)
        }
        finally {
            this.counter = 0;
            this.windowValues = {
                avgGlobalActivePower: 0,
                avgGlobalIntensity: 0,
                avgGlobalReactivePower: 0,
                avgSubMetering_1: 0,
                avgSubMetering_2: 0,
                avgSubMetering_3: 0,
                avgVoltage: 0,
                windowsTimestamp: null
            };
            release();
        }
    }

}
