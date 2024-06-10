import { Module } from '@nestjs/common';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { AppModule } from 'src/app.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SENSOR_SERVICE',
        transport: Transport.MQTT,
        options: {
          // url: 'mqtt://localhost:1883',
          url: 'mqtt://mosquitto:1883',
          
        }
      }
    ]),
  ],
  controllers: [SensorController],
  providers: [SensorService]
})
export class SensorModule { }
