import { Hono } from 'hono';
import { cors } from 'hono/cors';
import WebhookController from './modules/webhook/webhook.controller';
import AuthenticationController from './modules/authentication/authentication.controller';
import UserController from './modules/user/user.controller';
import StreakController from './modules/streak/streak.controller';
import DashboardController from './modules/dashboard/dashboard.controller';

const app = new Hono();

app.use(
  cors({
    origin: '*',
    allowHeaders: ['Authorization', 'Content-Type'], // Permite o header Authorization
  })
);

app.route('', WebhookController);

app.route('/streak', StreakController);
app.route('/authentication', AuthenticationController);
app.route('/user', UserController);
app.route('/dashboard', DashboardController);

export default app;
