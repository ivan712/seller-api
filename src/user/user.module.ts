import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './user.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserRepository, UserService],
})
export class UserModule {}
