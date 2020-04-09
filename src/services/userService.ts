import { UserRepository } from '../repositories/userRepository';
import { getConnection } from 'typeorm';
import { UserResponse } from '../models/UserResponse';
import { UserRequest } from '../models/UserRequest';

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

    public async registerUser(user: UserRequest): Promise<UserResponse> {
        console.log('SERVICE - ', user);
        return (user as any as UserResponse);
    }
}
