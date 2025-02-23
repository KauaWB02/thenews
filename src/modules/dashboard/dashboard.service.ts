import { HTTPException } from 'hono/http-exception';
import { EnvInterface } from '../../shared/interfaces/env.interface';
import { DashboardRepository } from './dashboard.repository';
import { DashboardMonthlyMetricsInterface } from './interfaces/dashboard-monthly-metrics.interface';
import { DashboardDayAndHoursArrayInterface } from './interfaces/dashboard-day-and-hours-arrays.interface';
import { DashboardEngagementByStreakStatusInterface } from './interfaces/dashboard-engagement-by-streak-status.interface';
import { RankingOfTheMostEngagedReadersInterface } from './interfaces/dashboard-ranking-of-the-most-engaged-readers.interface';
import { EngagementTrendInterface } from './interfaces/dashboard-engagement-trend';

export class DashboardService {
  private readonly repository: DashboardRepository;

  constructor(private env: EnvInterface) {
    this.repository = new DashboardRepository(env);
  }

  async getNumberOfNewslettersOpenedForEachMonth(
    startDate: string,
    endDate: string,
    streakStatus?: string
  ): Promise<DashboardMonthlyMetricsInterface[]> {
    try {
      return await this.repository.getNumberOfNewslettersOpenedForEachMonth(
        startDate,
        endDate,
        streakStatus
      );
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, {
        message: 'Não foi possivel buscar metricas dos meses do ano.',
      });
    }
  }
  async getDayAndHourArrays(
    startDate: string,
    endDate: string,
    streakStatus?: string
  ): Promise<DashboardDayAndHoursArrayInterface[]> {
    try {
      return await this.repository.getDayAndHourArrays(startDate, endDate, streakStatus);
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, {
        message: 'Não foi possivel buscar metricas do dia.',
      });
    }
  }

  async findEngagementByStreakStatus(
    startDate: string,
    endDate: string,
    streakStatus?: string
  ): Promise<DashboardEngagementByStreakStatusInterface[]> {
    try {
      return await this.repository.findEngagementByStreakStatus(startDate, endDate, streakStatus);
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, {
        message: 'Não foi possivel buscar metricas de aberturas por status.',
      });
    }
  }

  async findForUsersWithTheMostStreak(): Promise<RankingOfTheMostEngagedReadersInterface[]> {
    try {
      return await this.repository.findForUsersWithTheMostStreak();
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, {
        message: 'Não foi possivel buscar metricas de Ranking dos leitores mais engajados.',
      });
    }
  }

  async engagementTrend(
    startDate: string,
    endDate: string,
    status: string
  ): Promise<EngagementTrendInterface[]> {
    try {
      if (!startDate) {
        const now = new Date();
        endDate = now.toISOString().split('T')[0];
      }

      if (!endDate) {
        const now = new Date();
        now.setDate(now.getDate() - 30);
        startDate = now.toISOString().split('T')[0];
      }

      return await this.repository.engagementTrend(startDate, endDate, status);
    } catch (error) {
      throw new HTTPException(500, {
        message:
          'Não foi possivel executar query para buscar matricas de newsletter abertas no dia',
      });
    }
  }
}
