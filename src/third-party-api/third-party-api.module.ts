import { Module } from '@nestjs/common';
import { ThirdPartyApiService } from './third-party-api.service';
import { ThirdPartyApiController } from './third-party-api.controller';

@Module({
  providers: [ThirdPartyApiService],
  controllers: [ThirdPartyApiController],
})
export class ThirdPartyApiModule {}
