import { Context, HonoRequest, Next } from 'hono';
import { verify } from 'hono/jwt';

export const AuthMiddleware = async (request: Context, next: Next) => {
  try {
    const authHeader = request.req.header('Authorization');
    if (typeof authHeader !== 'string' || !authHeader) {
      return request.json({ message: 'Token não informado.' }, 401);
    }

    const token = (authHeader as string).split(' ')[1];

    if (!token) {
      return request.json({ message: 'Token invalido.' }, 401);
    }

    const secretKey = request.env.JWT_SECRET;
    const payload = await verify(token, secretKey);

    if (!payload) {
      return request.json({ message: 'Token invalido.' }, 401);
    }

    request.set('user', { ...payload, exp: payload.exp });

    await next();
  } catch (error: any) {
    return request.json({ message: 'Erro na autenticação', error: error.message }, 401);
  }
};
