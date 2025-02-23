import { HTTPException } from 'hono/http-exception';
import { MenuInterface } from './interfaces/menu.interface';
import { UserInterface } from '../user/interfaces/user.interface';
export default class AuthenticationRepository {
  private database: D1Database;

  constructor(private env: any) {
    this.database = env.DB;
  }

  async userAndPermissions(email: string): Promise<UserInterface | null> {
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

      if (!user) {
        return null;
      }

      const userlinkedMenus = await this.database
        .prepare(`SELECT menu_id as menuId FROM users_linked_menus WHERE user_id = ?`)
        .bind(user.id)
        .all();

      const menusIds = userlinkedMenus.results.map((userlinkedMenus) => userlinkedMenus.menuId);
      const placeholders = menusIds.map(() => '?').join(', ');

      const menus = await this.database
        .prepare(
          `SELECT 
          name,
          route,
          permission_key as permissionKey,
          icon
          FROM menus WHERE id IN(${placeholders})`
        )
        .bind(...menusIds)
        .all();

      return {
        ...user,
        menus: menus.results as unknown as MenuInterface[],
        permissionsKeys: menus.results.map((menus) => menus.permissionKey) as Array<string>,
      };
    } catch (error) {
      throw new HTTPException(500, { message: 'Não foi possivel buscar usuário' });
    }
  }
}
