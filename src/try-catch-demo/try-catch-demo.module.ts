import { Module } from '@nestjs/common';
import { TryCatchDemoService } from './try-catch-demo.service';

@Module({
  providers: [TryCatchDemoService],
})
export class TryCatchDemoModule {}
