import { HTTPException } from 'hono/http-exception';
import { NewsletterInterface } from './interfaces/newsletter.interface';

export class NewsletterRepository {
  private database: D1Database;

  constructor(private env: any) {
    if (!env.DB) {
      throw new HTTPException(500, { message: 'Banco de dados D1 não encontrado no ambiente' });
    }
    this.database = env.DB;
  }

  async findOneLastNewsletterInsertion(userId: number): Promise<NewsletterInterface | null> {
    try {
      const newsletter: NewsletterInterface | null = await this.database
        .prepare(
          `SELECT 
                id,
                user_id as userId,
                newsletter_id as newsletterId,
                opened_date as openedDate,
                created_at as createdAt,
                updated_at as updatedAt,
                deleted_at as deletedAt 
           FROM newsLetter_openings WHERE user_id = ? ORDER BY id DESC`
        )
        .bind(userId)
        .first();

      return newsletter;
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, { message: 'Não foi possivel criar o usuário' });
    }
  }

  async createNewsletter(
    userId: number,
    newsletterId: string,
    openedDate: Date
  ): Promise<NewsletterInterface> {
    try {
      const opened = openedDate.toISOString().slice(0, 19).replace('T', ' ');
      const newletterInsert = await this.database
        .prepare(
          `INSERT INTO  NEWSLETTER_OPENINGS
                (user_id,
                newsletter_id, 
                opened_date) 
           VALUES(?,?,?);`
        )
        .bind(userId, newsletterId, opened)
        .run();

      if (!newletterInsert.success)
        throw new HTTPException(500, {
          message: 'Não foi possivel inserir newsletter',
        });

      const newsletter = (await this.database
        .prepare(
          `SELECT 
                id,
                user_id as userId,
                newsletter_id as newsletterId,
                opened_date as openedDate,
                created_at as createdAt,
                updated_at as updatedAt,
                deleted_at as deletedAt 
           FROM newsLetter_openings WHERE user_id = ? ORDER BY id DESC`
        )
        .bind(userId)
        .first()) as NewsletterInterface;

      return newsletter;
    } catch (error) {
      throw new HTTPException(500, {
        message: 'Não foi possivel executar query para inserir nova newletter',
      });
    }
  }

  async getAllNewsletter(userId: number): Promise<NewsletterInterface[]> {
    try {
      const newsletters = await this.database
        .prepare(
          `SELECT 
                id,
                user_id as userId,
                newsletter_id as newsletterId,
                opened_date as openedDate,
                created_at as createdAt,
                updated_at as updatedAt,
                deleted_at as deletedAt 
           FROM newsLetter_openings WHERE user_id = ?`
        )
        .bind(userId)
        .all();

      return newsletters.results as unknown as NewsletterInterface[];
    } catch (error) {
      throw new HTTPException(500, {
        message: 'Não foi possivel executar query para buscar todas as Newletters',
      });
    }
  }
}
