import { ReputationPoint } from '../entities/reputationPoint';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ReputationPoint)
export class ReputationPointRepository extends Repository<ReputationPoint> {

}