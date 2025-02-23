import { Hono } from 'hono';
import { ParametersQueryInterface } from './interfaces/parameters-query.interface';
import { WebHookService } from './webhook.service';
import { EnvInterface } from '../../shared/interfaces/env.interface';

const WebhookController = new Hono<{ Bindings: EnvInterface }>();

WebhookController.get('', async (parameters) => {
  try {
    const service = new WebHookService(parameters.env);

    const params: ParametersQueryInterface =
      parameters.req.query() as unknown as ParametersQueryInterface;

    if (!params.id || !params.email) {
      return parameters.json({ message: 'Precisamos do id da nesletter e e-mail' }, 400);
    }

    const newletterIdDate = new Date(params.id.split('_')[1]);
    const currentDate = new Date();

    currentDate.setUTCHours(0, 0, 0, 0);
    console.log(newletterIdDate, currentDate);

    if (newletterIdDate.getTime() === currentDate.getTime()) {
      await service.createUser(params);
    }

    return parameters.json({ received: true, message: 'Processamento concluido.' });
  } catch (error: any) {
    return parameters.json({ error: error.message }, error.status);
  }
});

export default WebhookController;
