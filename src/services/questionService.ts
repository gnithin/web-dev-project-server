import { Question } from '../entities/question';
import { getConnection, getManager } from 'typeorm';
import { QuestionRepository } from '../repositories/questionRepository';
import { Answer } from '../entities/answer';

export class QuestionService {
    private static instance: QuestionService;
    private questionRepository: QuestionRepository;

    private constructor() {
        this.questionRepository = getConnection().getCustomRepository(QuestionRepository);
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new QuestionService();
        }
        return this.instance;
    }


    public async getAllQuestions(): Promise<Question[]> {
        try {
            return await this.questionRepository.find({
                relations: ['user']
            });
        } catch (e) {
            console.error(e);
            throw (e);
        }
    }

    public async getQuestionById(qId: number, includeAnswers: boolean = true): Promise<Question> {
        const relations: string[] = ['user'];
        if (includeAnswers) {
            relations.push('answers')
        }

        try {
            const question = await this.questionRepository.findOneOrFail(qId, {relations});
            for (const answer of question.answers) {
                const rep = await this.getAnswerReputation(answer.id);
                answer.totalReputation = rep;
            }
            return question;
        } catch (e) {
            console.error(e);
            throw (e);
        }

    }

    public async createNewQuestion(question: Question): Promise<Question> {
        console.log('Question - ', question);
        try {
            return await this.questionRepository.save(question);
        } catch (e) {
            console.error(e);
            throw (e);
        }
    }

    public async updateQuestion(qId: number, question: Question): Promise<Question> {
        console.log('Updating - ', qId);
        try {
            if (await this.questionRepository.findOne(qId) === undefined) {
                throw new Error('Entity does not exist');
            }
            question.id = qId;
            return await this.questionRepository.save(question);
        } catch (e) {
            console.error(e);
            throw (e);
        }
    }

    public async deleteQuestion(questionId: number): Promise<number> {
        console.log('Deleting - ', questionId);
        try {
            const res = await this.questionRepository.delete(questionId);
            return Number(res.affected);
        } catch (e) {
            console.error(e);
            throw (e);
        }
    }

    private async getAnswerReputation(answerId: number) : Promise<number> {
        const reps = await getManager()
        .createQueryBuilder(Answer, 'answer')
        .leftJoin('answer.reputations', 'reputation')
        .select('SUM(reputation.score)', 'sum')
        .whereInIds(answerId)
        .getRawOne();

        return reps.sum;
    }
}
