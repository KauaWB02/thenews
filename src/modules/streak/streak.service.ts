import { HTTPException } from 'hono/http-exception';
import { NewsletterService } from '../newsletter/newsletter.service';
import { EnvInterface } from '../../shared/interfaces/env.interface';
import { PayloadJwtInterface } from '../authentication/interfaces/payload-jwt.interface';

export class StreakService {
  private newsletterService: NewsletterService;

  constructor(private readonly env: EnvInterface) {
    this.newsletterService = new NewsletterService(env);
  }

  async openingHistory(user: PayloadJwtInterface): Promise<any> {
    try {
      const history = await this.newsletterService.getAllNewsletter(user.id);

      return history;
    } catch (error) {
      throw new HTTPException(500, { message: 'Streak do usuário não encontradas' });
    }
  }
}
