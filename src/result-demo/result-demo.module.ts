import { Module } from '@nestjs/common';
import { EntityParser } from './entity.parser';
import { ResultDemoService } from './result-demo.service';

@Module({
  providers: [ResultDemoService, EntityParser],
})
export class ResultDemoModule {}
