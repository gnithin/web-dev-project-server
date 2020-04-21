import { Repository, EntityRepository } from 'typeorm';
import { QuestionReputationPoint } from './../entities/questionReputationPoint';

@EntityRepository(QuestionReputationPoint)
export class QuestionReputationPointRepository extends Repository<QuestionReputationPoint> {

}