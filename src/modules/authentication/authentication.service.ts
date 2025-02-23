import { HTTPException } from 'hono/http-exception';
import AuthenticationRepository from './authentication.repository';
import { PayloadReturnInterface } from './interfaces/login-payload-return.interface';
import { SignJWT } from 'jose';
import { UserInterface } from '../user/interfaces/user.interface';

export class AuthenticationService {
  private env: any;

  constructor(env: any) {
    this.env = env;
  }

  async login(email: string): Promise<PayloadReturnInterface> {
    try {
      const database = new AuthenticationRepository(this.env);
      const user = await database.userAndPermissions(email.trim());

      if (!user) throw new HTTPException(400, { message: 'Usuário não encontrado' });

      const accessToken = await this.tokenJwtGenerator({
        email: user.email,
        id: user.id,
        permissionsKeys: user.permissionsKeys,
        status: user.status,
      });

      return { user, accessToken };
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, { message: 'Não foi possivel authenticar usuário' });
    }
  }

  async tokenJwtGenerator(user: Partial<UserInterface>): Promise<string> {
    try {
      const secret = new TextEncoder().encode(this.env.JWT_SECRET);

      const jwt = await new SignJWT(user)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secret);

      return jwt;
    } catch (error) {
      throw new HTTPException(500, {
        message: 'Erro critico, não foi possivel gerar token, entre em contato com suporte.',
      });
    }
  }
}
