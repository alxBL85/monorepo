import { z } from 'zod';

export type BaseRecord = Record<string, any>;

export enum Status {
  SUCCESS = 1,
  FAIL = 0,
  UNKNOW = -1,
  WAITING = 2,
}

export const BaseDTO = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  status: z.nativeEnum(Status),
  payload: z.record(z.any()).optional(),
});

export function validateDTO(o: any) {
  const result = BaseDTO.safeParse(o);
  return result;
}
