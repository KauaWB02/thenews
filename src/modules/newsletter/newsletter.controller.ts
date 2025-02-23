import { Hono } from 'hono';
import { EnvInterface } from '../../shared/interfaces/env.interface';

const NewsLetterController = new Hono<{ Bindings: EnvInterface }>();

  

export default NewsLetterController;
