import { Hono } from 'hono';
import { EnvInterface } from '../../shared/interfaces/env.interface';
import { DashboardService } from './dashboard.service';
import { AuthMiddleware } from '../../shared/Middlewares/auth-middleware';
import { roleMiddleware } from '../../shared/Middlewares/role-middleware';

const DashboardController = new Hono<{ Bindings: EnvInterface }>();

DashboardController.use('*', AuthMiddleware);

DashboardController.get(
  'newsletters-opened-for-month',
  roleMiddleware(['DASHBOARD-VIEW']),
  async (parameters) => {
    try {
      const { startDate, endDate, status } = parameters.req.query();

      const service = new DashboardService(parameters.env);

      const opened = await service.getNumberOfNewslettersOpenedForEachMonth(
        startDate,
        endDate,
        status
      );

      return parameters.json({ dashboard: opened });
    } catch (error: any) {
      return parameters.json({ error: error.message }, error.status);
    }
  }
);

DashboardController.get(
  'day-and-hour-arrays',
  roleMiddleware(['DASHBOARD-VIEW']),
  async (parameters) => {
    try {
      const { startDate, endDate, status } = parameters.req.query();

      const service = new DashboardService(parameters.env);

      const opened = await service.getDayAndHourArrays(startDate, endDate, status);

      return parameters.json({ dashboard: opened });
    } catch (error: any) {
      return parameters.json({ error: error.message }, error.status);
    }
  }
);

DashboardController.get(
  'engagement-by-streak-status',
  roleMiddleware(['DASHBOARD-VIEW']),
  async (parameters) => {
    try {
      const { startDate, endDate, status } = parameters.req.query();

      const service = new DashboardService(parameters.env);

      const opened = await service.findEngagementByStreakStatus(startDate, endDate, status);

      return parameters.json({ dashboard: opened });
    } catch (error: any) {
      return parameters.json({ error: error.message }, error.status);
    }
  }
);

DashboardController.get(
  'ranking-of-the-most-engaged-readers',
  roleMiddleware(['DASHBOARD-VIEW']),
  async (parameters) => {
    try {
      const service = new DashboardService(parameters.env);

      const opened = await service.findForUsersWithTheMostStreak();

      return parameters.json({ dashboard: opened });
    } catch (error: any) {
      return parameters.json({ error: error.message }, error.status);
    }
  }
);

DashboardController.get(
  'engagement-trend',
  roleMiddleware(['DASHBOARD-VIEW']),
  async (parameters) => {
    try {
      const { startDate, endDate, status } = parameters.req.query();

      const service = new DashboardService(parameters.env);

      const opened = await service.engagementTrend(startDate, endDate, status);

      return parameters.json({ dashboard: opened });
    } catch (error: any) {
      return parameters.json({ error: error.message }, error.status);
    }
  }
);

export default DashboardController;
