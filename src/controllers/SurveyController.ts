import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveyRepository } from "../repositories/SurveyRepository";

class SurveyController {
    async create(req: Request, res: Response) {
        const { title, description } = req.body

        const surveyRepository = getCustomRepository(SurveyRepository);

        const survey = surveyRepository.create({
            title,
            description
        });

        await surveyRepository.save(survey);

        return res.status(201).json(survey);
    }

    async show(req: Request, res: Response) {
        const surveyRepository = getCustomRepository(SurveyRepository);

        const all = await surveyRepository.find();

        if (!all) {
            throw new AppError("There are no surveys", 404);
        }

        return res.status(200).json(all);
    }
}

export { SurveyController }