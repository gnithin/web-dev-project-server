import { ReputationPoint } from './../entities/reputation';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ReputationPoint)
export class ReputationPointRepository extends Repository<ReputationPoint> {

}