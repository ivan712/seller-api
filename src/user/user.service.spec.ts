import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { ICreateUser } from './interfaces/create-user.interface';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: DeepMocked<UserRepository>;

  const user = {} as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker(createMock)
      .compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
  });

  it('create', async () => {
    const userCreateData = {} as ICreateUser;
    userRepository.create.mockReturnValueOnce(Promise.resolve(user));
    expect(await userService.create(userCreateData)).toBe(user);
  });

  it('getByPhone', async () => {
    userRepository.getByPhone.mockReturnValueOnce(Promise.resolve(user));
    expect(await userService.getByPhone('')).toBe(user);
  });

  it('setPassword', async () => {
    userRepository.update.mockReturnValueOnce(Promise.resolve());
    expect(await userService.setPassword('', '')).toBeUndefined();
  });
});
