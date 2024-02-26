import { Module } from '@nestjs/common';
import { ThirdPartyApiService } from './third-party-api.service';
import { HttpModule } from '@nestjs/axios';
import { ThirdPartyApiRepository } from './third-party-api.repository';
import { PrismaService } from '../db/prisma.service';

@Module({
  imports: [HttpModule],
  providers: [ThirdPartyApiService, ThirdPartyApiRepository, PrismaService],
  exports: [ThirdPartyApiService],
})
export class ThirdPartyApiModule {}
