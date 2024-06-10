import { InfluxDB } from '@influxdata/influxdb-client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import { Subject } from 'rxjs';
import { Fields } from './DTO';

@Injectable()
export class SensorService {
    private dateFrom: Date;
    private dateTo: Date;
    private currDate: Date;
    private client: InfluxDB
    constructor(
        private config: ConfigService,
    ) {
        const token: string = this.config.get("INFLUX_API_TOKEN");
        const url: string = this.config.get("INFLUX_URL");
        this.client = new InfluxDB({ url, token });
        this.dateFrom = new Date(this.config.get("READ_FROM"));
        this.dateTo = new Date(this.config.get("READ_TO"));
        this.currDate = new Date(this.dateFrom);
    }

    public getNextValue(): Promise<Fields> {
        const query = `
                from(bucket: "${this.config.get("BUCKET")}")
                |> range(start: ${new Date(this.currDate.getTime() - 10).toISOString()}, stop:${new Date(this.currDate.getTime() + 10).toISOString()})
                |> filter(fn: (r) => r._measurement == "${this.config.get("MEASUREMENT")}")
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")`;
        const queryClient = this.client.getQueryApi(this.config.get("ORGANIZATION"));

        return new Promise<Fields>((resolve, reject) => {
            let data: Fields;
            queryClient.queryRows(query, {
                next: (row, tableMeta) => {
                    const tableObject = tableMeta.toObject(row);
                    data = {
                        measurement: tableObject._measurement,
                        time: new Date(Date.now()),
                        globalActivePower: tableObject.Global_active_power,
                        globalIntensity: tableObject.Global_intensity,
                        globalReactivePower: tableObject.Global_reactive_power,
                        subMetering_1: tableObject.Sub_metering_1,
                        subMetering_2: tableObject.Sub_metering_2,
                        subMetering_3: tableObject.Sub_metering_3,
                        voltage: tableObject.Voltage
                    }
                },
                error: (error) => {
                    reject(error);
                },
                complete: () => {
                    this.currDate.setMinutes(this.currDate.getMinutes() + 1);
                    if (this.currDate > this.dateTo) {
                        this.currDate = this.dateFrom;
                    }
                    resolve(data);
                },
            });
        });
    }
    // public getAllFieldsSensor(subject: Subject<Fields>) {
    //     const dateFrom = new Date(this.config.get('READ_FROM'));
    //     const dateTo = new Date(this.config.get('READ_TO'));
    //     console.log(dateFrom);
    //     console.log(dateTo);
    //     const query = `
    //         from(bucket: "${this.config.get("BUCKET")}")
    //         |> range(start: ${dateFrom.toISOString()}, stop:${dateTo.toISOString()})
    //         |> filter(fn: (r) => r._measurement == "${this.config.get("MEASUREMENT")}")
    //         |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")`;

    //     const queryClient = this.client.getQueryApi(this.config.get("ORGANIZATION"));

    //     return new Promise<any>((resolve, reject) => {

    //         queryClient.queryRows(query, {
    //             next: async (row, tableMeta) => {
    //                 console.log(row)
    //                 console.log('test')
    //                 const tableObject = tableMeta.toObject(row);
    //                 await setTimeout(() => {
    //                     subject.next({
    //                         measurement: tableObject._measurement,
    //                         time: new Date(Date.now()),
    //                         globalActivePower: tableObject.Global_active_power,
    //                         globalIntensity: tableObject.Global_intensity,
    //                         globalReactivePower: tableObject.Global_reactive_power,
    //                         subMetering_1: tableObject.Sub_metering_1,
    //                         subMetering_2: tableObject.Sub_metering_2,
    //                         subMetering_3: tableObject.Sub_metering_3,
    //                         voltage: tableObject.Voltage
    //                     })
    //                 }, this.config.get('READ_PERIOD_MS'))

    //             },
    //             error: (error) => {
    //                 reject(error);
    //             },
    //             complete: () => {
    //                 subject.complete();
    //                 resolve('done');
    //             },
    //         });
    //     });
    // }
}
