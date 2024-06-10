import { Controller, Inject, OnApplicationBootstrap, Post } from '@nestjs/common';
import { ClientProxy, Ctx, EventPattern, MessagePattern, MqttContext, MqttRecordBuilder, Payload } from '@nestjs/microservices';
import { SensorService } from './sensor.service';
import { Fields } from './DTO';
import { Interval } from '@nestjs/schedule';

@Controller('sensor')
export class SensorController implements OnApplicationBootstrap {
    constructor(
        @Inject('SENSOR_SERVICE') private client: ClientProxy,
        private readonly sensorService: SensorService,
    ) { }

    async onApplicationBootstrap() {
        console.log("on application bootstrap")
        try {

            await this.client.connect();
        }
        catch (e) {
            console.log("Error on bootstrap", e)
        }
    }


    // @MessagePattern('api:To')
    // sub(@Payload() data, @Ctx() context: MqttContext) {
    //     console.log(data);
    // }
   

    async test() {
        try {
            const userProperties = { 'x-version': '1.0.0' };
            const record = new MqttRecordBuilder(':test:')
                .setProperties({ userProperties })
                .setQoS(2)
                .build();
            await this.client.send('test', record).subscribe();
        }
        catch (e) {
            console.log("Failed to send ", e)
        }
    }

    @Interval(5000)
    async sensorStream() {
        try {
            const userProperties = { 'x-version': '1.0.0' };
            const data = await this.sensorService.getNextValue();
            const record = new MqttRecordBuilder(data)
                .setProperties({ userProperties })
                .setQoS(2)
                .build();
            await this.client.send('sensor', record).subscribe();
        }
        catch (e) {
            console.log('Failed to send ',e);
        }
    }

}
