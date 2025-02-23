import { HTTPException } from 'hono/http-exception';
import { UserService } from './user.service';
import { EnvInterface } from '../../shared/interfaces/env.interface';
import { mockUserRepository } from '../../shared/mocks/mocks-user/mockUserRepository';
import { StreakTypeEnum } from '../../shared/enums/streak-type.enum';

describe('UserService - existUserByEmail', () => {
  let userService: UserService;

  beforeEach(() => {
    const env = { DB: mockUserRepository as any };
    userService = new UserService(env as EnvInterface);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  test('must return true if the user exists', async () => {
    const exists = await userService.existUserByEmail('teste@gmail.com');
    expect(exists).toBe(true);
  });

  test('should return false if the user does not exist', async () => {
    const notExists = await userService.existUserByEmail('naoexiste@gmail.com');
    expect(notExists).toBe(false);
  });
});

describe('UserService - findOneUserByEmail', () => {
  let userService: UserService;

  beforeEach(() => {
    const env = { DB: mockUserRepository as any };
    userService = new UserService(env as EnvInterface);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  test('should return a user object if it exists', async () => {
    const user = await userService.findOneUserByEmail('teste@gmail.com');
    expect(user).toMatchObject({
      id: 1,
      email: 'teste@gmail.com',
      streak: 'Casual',
      streakDays: 1,
    });
  });

  test('must return null if the user does not exist', async () => {
    const user = await userService.findOneUserByEmail('naoExiste@gmail.com');
    expect(user).toBeNull();
  });
});

describe('UserService - createUser', () => {
  const mockDatabase = {
    prepare: jest.fn().mockReturnThis(),
    bind: jest.fn().mockReturnThis(),
    run: jest.fn().mockResolvedValue({ success: true }),
    first: jest.fn().mockResolvedValue({
      id: 1,
      email: 'teste@example.com',
      streak: StreakTypeEnum.Casual,
      streakDays: 1,
      lastAccess: null,
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'promo',
      utmChannel: 'ads',
    }),
  };

  let userService: UserService;

  beforeEach(() => {
    const env = { DB: mockDatabase as any };
    userService = new UserService(env as EnvInterface);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  test('must return a user object if it is created', async () => {
    const user = await userService.createUser({
      email: 'teste@example.com',
      id: 'post_2025-02-23',
    });
    expect(user).toMatchObject({
      id: 1,
      email: 'teste@example.com',
      streak: 'Casual',
      streakDays: 1,
    });
  });

  it('should fail when trying to enter a user', async () => {
    mockDatabase.run.mockResolvedValueOnce({ success: false });

    const body = { email: 'falha@example.com', id: 'post_2025-02-23' };

    await expect(userService.createUser(body)).rejects.toThrow(
      new HTTPException(500, { message: 'Não foi possivel criar usuário' })
    );

    expect(mockDatabase.run).toHaveBeenCalled();
  });
});

describe('UserService - updateStreakUser', () => {
  const mockDatabase = {
    prepare: jest.fn().mockReturnThis(),
    bind: jest.fn().mockReturnThis(),
    run: jest.fn().mockResolvedValue({ success: true }),
    first: jest.fn().mockResolvedValue({
      id: 1,
      email: 'teste@example.com',
      streak: StreakTypeEnum.Casual,
      streakDays: 1,
      lastAccess: null,
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'promo',
      utmChannel: 'ads',
    }),
  };

  let userService: UserService;

  beforeEach(() => {
    const env = { DB: mockDatabase as any };
    userService = new UserService(env as EnvInterface);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  test('deve atualizar o streak do usuário corretamente', async () => {
    const userId = 1;
    const streak = 2;
    const expectedStreak = 3;
    const expectedStreakType = StreakTypeEnum.Regular; // Porque 3 <= 7

    const mockUpdatedUser = {
      id: userId,
      email: 'teste@example.com',
      streak: expectedStreakType,
      streakDays: expectedStreak,
      lastAccess: null,
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'promo',
      utmChannel: 'ads',
    };

    mockDatabase.run.mockResolvedValue({ success: true });

    mockDatabase.first.mockResolvedValue(mockUpdatedUser);

    const result = await userService.updateStreakUser(userId, streak);

    expect(mockDatabase.prepare).toHaveBeenCalled();
    expect(mockDatabase.run).toHaveBeenCalled();
    expect(mockDatabase.first).toHaveBeenCalled();
    expect(result).toEqual(mockUpdatedUser);
  });
});
