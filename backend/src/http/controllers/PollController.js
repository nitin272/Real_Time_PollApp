import { pollService } from '../../services/PollService.js';

export class PollController {
  async createPoll(req, res) {
    try {
      const { question, options } = req.body;
      const poll = await pollService.createPoll(question, options);
      
      res.status(201).json({
        id: poll.id,
        shareUrl: `/poll/${poll.id}`,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPoll(req, res) {
    try {
      const { id } = req.params;
      const poll = await pollService.getPollWithResults(id);
      
      res.status(200).json(poll);
    } catch (error) {
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  }
}

export const pollController = new PollController();
