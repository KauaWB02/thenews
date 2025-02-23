import { HTTPException } from 'hono/http-exception';

export class WebHookRepository {
  private database: D1Database;

  constructor(private env: any) {
    if (!env.DB) {
      throw new HTTPException(500, { message: 'Banco de dados D1 não encontrado no ambiente' });
    }
    this.database = env.DB;
  }
}
