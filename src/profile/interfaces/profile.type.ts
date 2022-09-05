import { UserType } from './../../user/interfaces/user.type';

export type ProfileType = UserType & { following: boolean };
