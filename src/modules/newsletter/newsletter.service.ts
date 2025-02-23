import { HTTPException } from 'hono/http-exception';
import { NewsletterRepository } from './newsletter.repository';
import { NewsletterInterface } from './interfaces/newsletter.interface';
import { EnvInterface } from '../../shared/interfaces/env.interface';

export class NewsletterService {
  private readonly repository: NewsletterRepository;

  constructor(private env: EnvInterface) {
    this.repository = new NewsletterRepository(env);
  }

  async findOneLastNewsletterInsertion(userId: number): Promise<NewsletterInterface | null> {
    try {
      return await this.repository.findOneLastNewsletterInsertion(userId);
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, { message: 'Não foi possivel criar o usuário' });
    }
  }

  async createNewslatter(
    userId: number,
    newletterId: string,
    openedDate: Date
  ): Promise<NewsletterInterface> {
    try {
      return await this.repository.createNewsletter(userId, newletterId, openedDate);
    } catch (error) {
      throw new HTTPException(500, {
        message: 'Não foi possivel vincular usuário com a newletter.',
      });
    }
  }

  async getAllNewsletter(userId: number): Promise<NewsletterInterface[]> {
    try {
      return await this.repository.getAllNewsletter(userId);
    } catch (error) {
      throw new HTTPException(500, {
        message: 'Não foi possivel buscar Newsletters abertas.',
      });
    }
  }
}
