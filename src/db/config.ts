import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const getPostgresConfig = async (
  configService: ConfigService,
): Promise<SequelizeModuleOptions> => {
  return {
    synchronize: true,
    uri: getPostgresString(configService),
    autoLoadModels: true,
  };
};

const getPostgresString = (configService: ConfigService) =>
  'postgresql://' +
  configService.get('PG_USERNAME') +
  ':' +
  configService.get('PG_PASSWORD') +
  '@' +
  configService.get('PG_HOST') +
  ':' +
  configService.get('PG_PORT') +
  '/' +
  configService.get('PG_DBNAME');
