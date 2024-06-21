import { Module } from '@nestjs/common';
import { FilterController } from './filter.controller';
import { FilterService } from './filter.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FILTER_MQTT',
        transport: Transport.MQTT,
        options: {
          // url: 'mqtt://localhost:1883',
          url: 'mqtt://mosquitto:1883',

        }
      },
      {
        name: 'FILTER_NATS',
        transport: Transport.NATS,
        options: {
          // servers: ['nats://localhost:4222']
          servers: ['nats://nats-main:4222']

        }
      }
    ]),
  ],
  controllers: [FilterController],
  providers: [FilterService]
})
export class FilterModule { }
