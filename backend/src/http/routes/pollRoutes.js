import { Router } from 'express';
import { pollController } from '../controllers/PollController.js';

export const pollRouter = Router();

pollRouter.post('/polls', (req, res) => pollController.createPoll(req, res));
pollRouter.get('/polls/:id', (req, res) => pollController.getPoll(req, res));
