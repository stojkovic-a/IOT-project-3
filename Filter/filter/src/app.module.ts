import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilterModule } from './filter/filter.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [FilterModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
