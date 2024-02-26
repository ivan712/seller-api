import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ThirdPartyApiRepository } from './third-party-api.repository';
import { IThirdPartyApiRepository } from './interfaces/third-party-token-repository.interface';
import { API_INFO_NOT_FOUND } from '../messages.constant';
import { Organisation } from '../organisation/organisation.entity';

@Injectable()
export class ThirdPartyApiService {
  constructor(
    private httpService: HttpService,
    @Inject(ThirdPartyApiRepository)
    private thirdPartyApiRepository: IThirdPartyApiRepository,
  ) {}

  async getOrgInfoFromDadata(inn: string): Promise<Organisation> {
    const apiData = await this.thirdPartyApiRepository.getByKey('dadata');
    if (!apiData) throw new InternalServerErrorException(API_INFO_NOT_FOUND);

    const { data } = await firstValueFrom(
      this.httpService.post(
        apiData.url,
        { query: inn },
        {
          headers: {
            Authorization: apiData.token,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      ),
    );
    const orgInfo = data.suggestions[0];

    return new Organisation({ apiDoc: orgInfo });
  }
}
