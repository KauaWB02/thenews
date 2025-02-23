import { Hono } from 'hono';
import { EnvInterface } from '../../shared/interfaces/env.interface';
import { PayloadJwtInterface } from '../authentication/interfaces/payload-jwt.interface';
import { AuthMiddleware } from '../../shared/Middlewares/auth-middleware';
import { StreakService } from './streak.service';
import { roleMiddleware } from '../../shared/Middlewares/role-middleware';

const StreakController = new Hono<{
  Bindings: EnvInterface;
  Variables: { user: PayloadJwtInterface };
}>();

StreakController.use('*', AuthMiddleware);

StreakController.get('', roleMiddleware(['STREAK-VIEW']), async (parameters) => {
  try {
    const service = new StreakService(parameters.env);
    const user = parameters.get('user');
    const openingHistory = await service.openingHistory(user);

    return parameters.json(openingHistory);
  } catch (error: any) {
    return parameters.json({ error: error.message }, error.status);
  }
});

export default StreakController;
