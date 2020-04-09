import { UserRepository } from '../repositories/userRepository';
import { getConnection } from 'typeorm';
import { User } from '../entities/user';

const crypto = require('crypto');

export class UserService {
    private static instance: UserService;
    private userRepository: UserRepository;

    private constructor() {
        this.userRepository = getConnection().getCustomRepository(UserRepository);
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new UserService();
        }
        return this.instance;
    }

    public async registerUser(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    public async findUserForEmail(email: string): Promise<User> {
        return await this.userRepository.findOneOrFail({
            email
        })
    }

    public async findUserForId(id: number): Promise<User> {
        return await this.userRepository.findOneOrFail({
            id,
        });
    }
}
