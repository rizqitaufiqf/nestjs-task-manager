import { TransformFnParams } from 'class-transformer';
import { MaybeType } from '../types/maybe.type';
export const LowerCaseTransformer = (
  params: TransformFnParams,
): MaybeType<string> => params.value?.toLowerCase().trim();
