import { Hono } from 'hono';
import { AuthenticationService } from './authentication.service';

const AuthenticationController = new Hono();

AuthenticationController.post('login', async (parameters) => {
  try {
    const { email } = await parameters.req.json();

    const service = new AuthenticationService(parameters.env);

    const users = await service.login(email);

    return parameters.json(users);
  } catch (error: any) {
    return parameters.json({ error: error.message }, error.status);
  }
});
export default AuthenticationController;
