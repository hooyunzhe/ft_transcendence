import { TypeORMError } from 'typeorm';

export class EntityAlreadyExistsError extends TypeORMError {
  constructor(entityName: string, criteria: string) {
    super();
    this.message = `Could not create entity of type ${entityName} matching: ${criteria} as it already exists`;
  }
}
