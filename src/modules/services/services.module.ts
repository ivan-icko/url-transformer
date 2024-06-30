import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VercelTestService } from './vercel-test/vercel-test.service';

@Module({
  imports: [HttpModule],
  providers: [VercelTestService],
  exports: [VercelTestService],
})
export class ServicesModule {}
