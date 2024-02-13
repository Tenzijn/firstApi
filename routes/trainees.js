import express from 'express';

import {
  getAllTrainees,
  getTrainee,
  addTrainee,
  updateTrainee,
  deleteTrainee,
  traineeLogin,
} from '../controllers/traineesController.js';

const traineesRouter = express.Router();

traineesRouter.get('/', getAllTrainees);
traineesRouter.post('/', addTrainee);
traineesRouter.get('/:id', getTrainee);
traineesRouter.put('/:id', updateTrainee);
traineesRouter.delete('/:id', deleteTrainee);
traineesRouter.post('/login', traineeLogin);

export default traineesRouter;
