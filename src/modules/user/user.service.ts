import { HTTPException } from 'hono/http-exception';
import { UserInterface } from './interfaces/user.interface';
import { UserRepository } from './user.repository';
import { ParametersQueryInterface } from '../webhook/interfaces/parameters-query.interface';
import { StreakTypeEnum } from '../../shared/enums/streak-type.enum';
import { EnvInterface } from '../../shared/interfaces/env.interface';

export class UserService {
  private readonly repository: UserRepository;

  constructor(private env: EnvInterface) {
    this.repository = new UserRepository(env);
  }

  async findOneUserByEmail(email: string): Promise<UserInterface | null> {
    try {
      const user = await this.repository.findOneUserByEmail(email);
      return user;
    } catch (error) {
      throw new HTTPException(500, { message: 'Usuário não encontrado' });
    }
  }

  async existUserByEmail(email: string): Promise<boolean> {
    try {
      return await this.repository.existUserByEmail(email);
    } catch (error) {

      throw new HTTPException(500, { message: 'Usuário com esse e-mail não encontrado' });
    }
  }

  async createUser(body: ParametersQueryInterface): Promise<UserInterface> {
    try {
      const user = await this.repository.createUser(body);
      await this.repository.linkUserToMenu(user.id, 2);
      return user;
    } catch (error) {
      throw new HTTPException(500, { message: 'Não foi possivel criar usuário' });
    }
  }

  async updateStreakUser(userId: number, streak: number): Promise<UserInterface> {
    try {
      const someStreak = streak + 1;
      const streakType =
        someStreak <= 2
          ? StreakTypeEnum.Casual
          : someStreak <= 7
          ? StreakTypeEnum.Regular
          : StreakTypeEnum.Daily;

      return await this.repository.updateStreakUser(userId, someStreak, streakType);
    } catch (error) {
      throw new HTTPException(500, { message: 'Não foi possivel atualizar usuário' });
    }
  }
}
