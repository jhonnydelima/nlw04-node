import { Router } from 'express';
import { AnswerController } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';
import { SendMailController } from './controllers/SendMailController';
import { SurveyController } from './controllers/SurveyController';
import { UserController } from './controllers/UserController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

// USER
router.post('/users', userController.create);

// SURVEY
router.post('/surveys', surveyController.create);
router.get('/surveys', surveyController.show);

// SEND EMAIL
router.post('/sendMail', sendMailController.execute);

// USER ANSWERS
router.get('/answers/:value', answerController.execute);

// NPS
router.get('/nps/:survey_id', npsController.execute);

export { router };