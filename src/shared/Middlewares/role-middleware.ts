import { Context, Next } from 'hono';

export const roleMiddleware = (allowedRoles: string[]) => {
  return async (context: Context, next: Next) => {
    const user = context.get('user');

    if (!user || !Array.isArray(user.permissionsKeys)) {
      return context.json({ message: 'Acesso negado' }, 403);
    }

    const hasPermission = user.permissionsKeys.some((permissionsKey: string) =>
      allowedRoles.includes(permissionsKey)
    );

    if (!hasPermission) {
      return context.json({ message: 'Acesso negado' }, 403);
    }

    await next();
  };
};
