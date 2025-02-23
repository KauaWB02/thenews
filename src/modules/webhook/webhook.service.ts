import { HTTPException } from 'hono/http-exception';
import { WebHookRepository } from './webhook.repository';
import { ParametersQueryInterface } from './interfaces/parameters-query.interface';
import { UserService } from '../user/user.service';
import { NewsletterService } from '../newsletter/newsletter.service';
import { GetMidnightUTC, SharedService } from '../../shared/shared.service';
import { EnvInterface } from '../../shared/interfaces/env.interface';
import { FormatLocalDate, GetLocalDate } from '../../shared/utils/date-utils';

export class WebHookService {
  private userService: UserService;
  private newsletterService: NewsletterService;
  private sharedService: SharedService;
  constructor(private readonly env: EnvInterface) {
    this.userService = new UserService(env);
    this.newsletterService = new NewsletterService(env);
    this.sharedService = new SharedService();
  }

  async createUser(body: ParametersQueryInterface): Promise<void> {
    try {
      const existUser = await this.userService.findOneUserByEmail(body.email);
      if (existUser) {
        const newsletter = await this.newsletterService.findOneLastNewsletterInsertion(
          existUser.id
        );
        if (newsletter) {
          const currentDate = GetLocalDate();
          const openedDate = new Date(newsletter.openedDate);

          /**
           * Validando datas se são no mesmo dia se for faça algo.
           */
          openedDate.setUTCHours(0, 0, 0, 0);
          currentDate.setUTCHours(0, 0, 0, 0);
          if (openedDate.getTime() === currentDate.getTime()) {
            return;
          }

          if (this.sharedService.isExactlyOneDayBefore(openedDate, currentDate)) {
            console.log(
              'Entrou aqui e vai inserir uma newletter e contar +1 streak para o usuário ===>',
              {
                dataDeHoje: GetLocalDate(),
                dataParaCondições: currentDate,
                lastOpenedSemtratamento: newsletter.openedDate,
                dataDaUltimaAberturaDaNewLetterTratada: openedDate,
              }
            );
            const newOpenedDate = GetLocalDate();

            await this.updateUserAndCreateNewlatter(
              existUser.id,
              existUser.streakDays,
              body.id,
              newOpenedDate
            );
          } else {
            const newOpenedDate = GetLocalDate()

            await this.updateUserAndCreateNewlatter(existUser.id, 0, body.id, newOpenedDate);
          }
        }
      } else {
        const openedDate = GetLocalDate()
        const user = await this.userService.createUser(body);
        await this.newsletterService.createNewslatter(user.id, body.id, openedDate);
      }
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      throw new HTTPException(500, { message: 'Não foi possivel criar o usuário' });
    }
  }

  async updateUserAndCreateNewlatter(
    userId: number,
    streakDays: number,
    newletterId: string,
    openedDate: Date
  ) {
    try {
      await this.newsletterService.createNewslatter(userId, newletterId, openedDate);
      await this.userService.updateStreakUser(userId, streakDays);
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }
    }
  }
}
