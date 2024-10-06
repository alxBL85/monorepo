import { Injectable } from '@nestjs/common';
import { BaseRecord, Status, validateDTO } from 'core';

@Injectable()
export class AppService {
  getHello(): any {
    const baseObject: BaseRecord = {
      id: 1,
      name: 'Test',
      payload: {
        operation: 'Testing',
      },
      status: Status.SUCCESS,
    };

    return validateDTO(baseObject);
  }
}
