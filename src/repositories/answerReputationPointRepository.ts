import { AnswerReputationPoint } from '../entities/answerReputationPoint';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AnswerReputationPoint)
export class AnswerReputationPointRepository extends Repository<AnswerReputationPoint> {

}