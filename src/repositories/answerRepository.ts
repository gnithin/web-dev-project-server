import { EntityRepository, Repository } from 'typeorm';
import { Answer } from '../entities/answer';


@EntityRepository(Answer)
export class AnswerRepository extends Repository<Answer> {

}
