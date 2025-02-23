import { HTTPException } from 'hono/http-exception';
import { UserInterface } from './interfaces/user.interface';
import { ParametersQueryInterface } from '../webhook/interfaces/parameters-query.interface';
import { StatusTypeEnum } from '../../shared/enums/status-type.enum';
import { StreakTypeEnum } from '../../shared/enums/streak-type.enum';
import { EnvInterface } from '../../shared/interfaces/env.interface';

export class UserRepository {
  private database: D1Database;

  constructor(private env: EnvInterface) {
    if (!env.DB) {
      throw new HTTPException(500, { message: 'Banco de dados D1 não encontrado no ambiente' });
    }
    this.database = env.DB;
  }

  async findAllUser() {
    const users = await this.database.prepare(`SELECT * FROM users;`).all();

    return users;
  }

  async findOneUserByEmail(email: string): Promise<UserInterface | null> {
    try {
      const user: UserInterface | null = await this.database
        .prepare(
          `SELECT id,
                  email,
                  streak,
                  streak_days as streakDays,
                  last_access as lastAccess,
                  utm_source as utmSource,
                  utm_medium as utmMedium,
                  utm_campaign as utmCampaign,
                  utm_channel as utmChannel
            FROM users u WHERE u.email = ?;`
        )
        .bind(email)
        .first();

      return user;
    } catch (error) {
      console.log(error);
      throw new HTTPException(500, { message: 'Erro ao tentar buscar usuário' });
    }
  }

  async existUserByEmail(email: string): Promise<boolean> {
    try {
      const user: UserInterface | null = await this.database
        .prepare(
          `SELECT id,
                  email,
                  streak,
                  streak_days as streakDays,
                  last_access as lastAccess,
                  utm_source as utmSource,
                  utm_medium as utmMedium,
                  utm_campaign as utmCampaign,
                  utm_channel as utmChannel
            FROM users u WHERE u.email = ?;`
        )
        .bind(email)
        .first();
      return user ? true : false;
    } catch (error) {
      throw new HTTPException(500, { message: 'Erro ao tentar buscar usuário' });
    }
  }

  async createUser(body: ParametersQueryInterface): Promise<UserInterface> {
    try {
      const { email, utm_source, utm_campaign, utm_channel, utm_medium } = body;

      const insertUser = await this.database
        .prepare(
          `INSERT INTO USERS 
                (email,
                status, 
                streak, 
                streak_days, 
                last_access, 
                utm_source, 
                utm_medium, 
                utm_campaign, 
                utm_channel) 
            VALUES(?,?,?,?,?,?,?,?,?);`
        )
        .bind(
          email,
          StatusTypeEnum.ACTIVE,
          StreakTypeEnum.Casual,
          1,
          null,
          utm_source || null,
          utm_medium || null,
          utm_campaign || null,
          utm_channel || null
        )
        .run();

      if (!insertUser.success) {
        throw new HTTPException(500, { message: 'Algo deu errado ao tentar criar usuário' });
      }

      const user = (await this.database
        .prepare(
          `SELECT id,
                  email,
                  streak,
                  streak_days as streakDays,
                  last_access as lastAccess,
                  utm_source as utmSource,
                  utm_medium as utmMedium,
                  utm_campaign as utmCampaign,
                  utm_channel as utmChannel
            FROM users u WHERE u.email = ?;`
        )
        .bind(email)
        .first()) as UserInterface;

      return user;
    } catch (error) {
      throw new HTTPException(500, { message: 'Erro ao executar query de criar usuário' });
    }
  }
  async updateStreakUser(userId: number, streak: number, streakType: StreakTypeEnum): Promise<any> {
    try {
      const updatedUser = await this.database
        .prepare(
          `UPDATE USERS SET  
              streak = ?, 
              streak_days = ?
           WHERE id = ?;`
        )
        .bind(streakType, streak, userId)
        .run();
        
      if (!updatedUser.success) {
        throw new HTTPException(500, { message: 'Algo deu errado ao tentar atualizar usuário' });
      }

      const user = (await this.database
        .prepare(
          `SELECT id,
                  email,
                  streak,
                  streak_days as streakDays,
                  last_access as lastAccess,
                  utm_source as utmSource,
                  utm_medium as utmMedium,
                  utm_campaign as utmCampaign,
                  utm_channel as utmChannel
            FROM users u WHERE u.id = ?;`
        )
        .bind(userId)
        .first()) as UserInterface;

      return user;
    } catch (error) {
      throw new HTTPException(500, { message: 'Erro ao executar query de criar usuário' });
    }
  }

  async linkUserToMenu(userId: number, menuId: number): Promise<void> {
    try {
      await this.database
        .prepare(
          `INSERT INTO USERS_LINKED_MENUS 
                (user_id,menu_id) 
            VALUES(?,?);`
        )
        .bind(userId, menuId)
        .run();
    } catch (error) {
      throw new HTTPException(500, {
        message: 'Erro ao executar query de vincular usuário com menus',
      });
    }
  }
}
