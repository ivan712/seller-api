import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OK_MESSAGE } from '../messages.constant';
import { PhoneNumberDto } from './dto/phone-number.dto';
import { validate } from 'class-validator';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            preregister: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should call authService.preregister with the correct parameters and return the expected message', async () => {
    const dto: PhoneNumberDto = { phoneNumber: '1234567890' };
    const expectedResponse = { message: OK_MESSAGE };

    const result = await controller.preregister(dto);

    expect(authService.preregister).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expectedResponse);
  });

  it('should fail validation when phoneNumber is empty', async () => {
    const dto = new PhoneNumberDto();
    dto.phoneNumber = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation when phoneNumber is not a valid phone number', async () => {
    const dto = new PhoneNumberDto();
    dto.phoneNumber = 'invalidPhoneNumber';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isPhoneNumber');
  });

  it('should pass validation when phoneNumber is valid', async () => {
    const dto = new PhoneNumberDto();
    dto.phoneNumber = '+79345678901';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
