import { Module } from '@nestjs/common';
import { ResultDemoModule } from './result-demo/result-demo.module';
import { TryCatchDemoModule } from './try-catch-demo/try-catch-demo.module';

@Module({
  imports: [TryCatchDemoModule, ResultDemoModule],
  controllers: [],
})
export class AppModule {}
