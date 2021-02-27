import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';
import { UserRepository } from '../repositories/UserRepository';

class UserController {
    async create(req: Request, res: Response) {
        const { name, email } = req.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        });

        // if (!(await schema.isValid(req.body))) {
        //     return res.status(400).json({
        //         error: "Validation failed!"
        //     });
        // }

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (err) {
            throw new AppError(err);
        }

        const userRepository = getCustomRepository(UserRepository);

        const userAlreadyExists = await userRepository.findOne({
            email
        });

        if (userAlreadyExists) {
            throw new AppError("User already exists!");
        }

        const user = userRepository.create({
            name,
            email
        });

        await userRepository.save(user);

        return res.status(201).json(user);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;

        const userRepository = getCustomRepository(UserRepository);

        const user = await userRepository.findOne({
            id
        });

        if (!user) {
            throw new AppError("User does not exist!", 404);
        }

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        });

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (err) {
            throw new AppError(err);
        }

        const { name, email } = req.body;

        const newUser = {
            name,
            email
        };

        await userRepository.update(id, newUser);

        return res.status(200).json(newUser);
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const userRepository = getCustomRepository(UserRepository);

        const user = await userRepository.findOne({
            id
        });

        if (!user) {
            throw new AppError("User does not exist!", 404);
        }

        await userRepository.delete(id);

        return res.status(200).json({
            message: "User deleted successfully!"
        });
    }

    async getUser(req: Request, res: Response) {
        const { id } = req.params;

        const userRepository = getCustomRepository(UserRepository);

        const user = await userRepository.findOne({
            id
        });

        if (!user) {
            throw new AppError("User does not exist!", 404);
        }

        return res.status(200).json(user);
    }

    async getAllUsers(req: Request, res: Response) {
        const userRepository = getCustomRepository(UserRepository);

        const users = await userRepository.find();

        if (!users) {
            throw new AppError("There are no users!", 404);
        }

        return res.status(200).json(users);
    }
}

export { UserController };
