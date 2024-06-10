import { Controller, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, MqttContext, NatsContext, NatsRecordBuilder, Payload, Transport } from '@nestjs/microservices';
import { FilterService } from './filter.service';
import { Interval } from '@nestjs/schedule';
import * as nats from 'nats';

@Controller('filter')
export class FilterController implements OnApplicationBootstrap {
    constructor(
        @Inject('FILTER_MQTT') private clientMqtt: ClientProxy,
        @Inject('FILTER_NATS') private clientNATS: ClientProxy,
        private readonly filterService: FilterService
    ) { }


    async onApplicationBootstrap() {
        try {
            await this.clientMqtt.connect();
        } catch (e) {
            console.error("Error on boostrap", e)
        }
    }

    @MessagePattern('sensor', Transport.MQTT)
    async OnMessageFromSensorReceive(@Payload() data, @Ctx() context: MqttContext) {
        try {
            await this.filterService.addDataToWindowAsync(data)
        } catch (e) {
            console.error(e);
        }
    }

    @Interval(10000)
    async SendWindowAverage() {
        try {
            const avgData = await this.filterService.getWindowDataAsync();
            const headers = nats.headers();
            headers.set('x-version', '1.0.0')

            const record = new NatsRecordBuilder(avgData).setHeaders(headers).build();
            await this.clientNATS.emit('filter', record).subscribe();
        }
        catch (e) {
            console.error(e)
        }
    }



    // @MessagePattern('filter', Transport.NATS)
    // getNotifications(@Payload() data: number[], @Ctx() context: NatsContext) {
    //     console.log(data)
    // }
}
