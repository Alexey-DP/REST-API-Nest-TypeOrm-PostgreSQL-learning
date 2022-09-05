import { UserType } from './user.type';

export interface IUserResponce {
  user: UserType & { token: string };
}
