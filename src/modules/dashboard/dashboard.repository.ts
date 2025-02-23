import { HTTPException } from 'hono/http-exception';
import { DashboardMonthlyMetricsInterface } from './interfaces/dashboard-monthly-metrics.interface';
import { DashboardDayAndHoursArrayInterface } from './interfaces/dashboard-day-and-hours-arrays.interface';
import { DashboardEngagementByStreakStatusInterface } from './interfaces/dashboard-engagement-by-streak-status.interface';
import { RankingOfTheMostEngagedReadersInterface } from './interfaces/dashboard-ranking-of-the-most-engaged-readers.interface';
import { EngagementTrendInterface } from './interfaces/dashboard-engagement-trend';

export class DashboardRepository {
  private database: D1Database;

  constructor(private env: any) {
    if (!env.DB) {
      throw new HTTPException(500, { message: 'Banco de dados D1 não encontrado no ambiente' });
    }
    this.database = env.DB;
  }

  async getNumberOfNewslettersOpenedForEachMonth(
    startDate: string,
    endDate: string,
    streakStatus?: string 
  ): Promise<DashboardMonthlyMetricsInterface[]> {
    try {
      let query = `
        SELECT 
            strftime('%m', n.opened_date) AS month, 
            COUNT(*) AS totalOpenings
        FROM newsLetter_openings n
        JOIN users u ON n.user_id = u.id
        WHERE n.deleted_at IS NULL
        AND (n.opened_date BETWEEN ? AND ?)
      `;

      const params: string[] = [startDate, endDate];

      if (streakStatus) {
        query += ` AND u.streak = ?`;
        params.push(streakStatus);
      }

      query += ` GROUP BY month ORDER BY month;`;

      const newslettersOpenedMonth = await this.database
        .prepare(query)
        .bind(...params)
        .all();

      const opened = newslettersOpenedMonth.results.map((result) => ({
        month: result.month,
        totalOpenings: result.totalOpenings,
      })) as DashboardMonthlyMetricsInterface[];

      return opened;
    } catch (error) {
      throw new HTTPException(500, {
        message:
          'Não foi possível executar query para buscar todas as newsletters abertas por mês.',
      });
    }
  }

  async getDayAndHourArrays(
    startDate: string,
    endDate: string,
    streakStatus?: string // Parâmetro opcional para filtrar por streak
  ): Promise<DashboardDayAndHoursArrayInterface[]> {
    try {
      let query = `
        SELECT 
            strftime('%Y-%m-%d', n.opened_date) AS day,
            strftime('%H', n.opened_date) AS hour,
            COUNT(*) AS totalOpenings
        FROM newsLetter_openings n
        JOIN users u ON n.user_id = u.id
        WHERE n.deleted_at IS NULL
        AND (n.opened_date BETWEEN ? AND ?)
      `;

      const params: string[] = [startDate, endDate];

      if (streakStatus) {
        query += ` AND u.streak = ?`;
        params.push(streakStatus);
      }

      query += ` GROUP BY day, hour ORDER BY day, hour;`;

      const newslettersOpenedHours = await this.database
        .prepare(query)
        .bind(...params)
        .all();

      const opened = newslettersOpenedHours.results.map((result) => ({
        day: result.day,
        hour: result.hour,
        totalOpenings: result.totalOpenings,
      })) as DashboardDayAndHoursArrayInterface[];

      return opened;
    } catch (error) {
      throw new HTTPException(500, {
        message:
          'Não foi possível executar query para buscar métricas de dia e hora em que newsletters foram abertas.',
      });
    }
  }

  async findEngagementByStreakStatus(
    startDate: string,
    endDate: string,
    streakStatus?: string
  ): Promise<DashboardEngagementByStreakStatusInterface[]> {
    try {
      let query = `
      SELECT u.streak, COUNT(n.id) AS totalOpenings
      FROM users u
      LEFT JOIN newsLetter_openings n ON u.id = n.user_id
      WHERE (n.opened_date BETWEEN ? AND ? OR n.opened_date IS NULL)
    `;

      const params: string[] = [startDate, endDate];

      // Se o usuário passar um status de streak, adicionamos à query
      if (streakStatus) {
        query += ` AND u.streak = ?`;
        params.push(streakStatus);
      }

      query += ` GROUP BY u.streak;`;

      const newslettersOpenedByStreakStatus = await this.database
        .prepare(query)
        .bind(...params)
        .all();

      const opened = newslettersOpenedByStreakStatus.results.map((result) => ({
        streak: result.streak,
        totalOpenings: result.totalOpenings,
      })) as DashboardEngagementByStreakStatusInterface[];

      return opened;
    } catch (error) {
      throw new HTTPException(500, {
        message: 'Não foi possivel executar query para buscar matricas de aberturas por status.',
      });
    }
  }

  async findForUsersWithTheMostStreak(
  ): Promise<RankingOfTheMostEngagedReadersInterface[]> {
    try {
      let query = `
        SELECT u.streak_days as streakDays, u.email
        FROM users u
        ORDER BY u.streak_days DESC;
      `;

      const rankingOfTheMostEngagedReaders = (
        await this.database
          .prepare(query)
          .all()
      ).results as unknown as RankingOfTheMostEngagedReadersInterface[];

      return rankingOfTheMostEngagedReaders;
    } catch (error) {
      console.log(error)
      throw new HTTPException(500, {
        message:
          'Não foi possível executar query para buscar métricas de Ranking dos leitores mais engajados.',
      });
    }
  }

  async engagementTrend(
    startDate: string,
    endDate: string,
    streakStatus: string
  ): Promise<EngagementTrendInterface[]> {
    try {
      let query = `
      SELECT DATE(n.opened_date) as day, COUNT(*) as totalOpenings
      FROM newsLetter_openings n
      JOIN users u ON n.user_id = u.id
      WHERE DATE(n.opened_date) BETWEEN ? AND ?
    `;

      const params: string[] = [startDate, endDate];

      if (streakStatus) {
        query += ` AND u.streak = ?`;
        params.push(streakStatus);
      }

      query += ` GROUP BY day ORDER BY day;`;

      const engagementTrends = (
        await this.database
          .prepare(query)
          .bind(...params)
          .all()
      ).results as unknown as EngagementTrendInterface[];

      return engagementTrends;
    } catch (error) {
      throw new HTTPException(500, {
        message:
          'Não foi possivel executar query para buscar matricas de newsletter abertas no dia.',
      });
    }
  }
}
