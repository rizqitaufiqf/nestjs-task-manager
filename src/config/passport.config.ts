import { IAuthModuleOptions } from '@nestjs/passport';

export const PassportConfig: IAuthModuleOptions = {
  defaultStrategy: 'jwt',
};
