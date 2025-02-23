import { Hono } from 'hono';
import { AuthMiddleware } from '../../shared/Middlewares/auth-middleware';
import { PayloadJwtInterface } from '../authentication/interfaces/payload-jwt.interface';

const UserController = new Hono<{ Variables: { user: PayloadJwtInterface } }>();

UserController.use('*', AuthMiddleware);

export default UserController;
