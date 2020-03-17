import { EntityRepository, Repository } from 'typeorm';
import { Question } from '../entities/question';

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {

}