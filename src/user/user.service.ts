import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { IUserResponce } from './interfaces/user.responce.interface';
import { JWT_SECRET } from './../config';
import { UserEntity } from './entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {},
    };

    const сandidateEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (сandidateEmail) {
      errorResponse.errors['email'] = 'Email is taken';
      // throw new HttpException(
      //   'Email is taken',
      //   HttpStatus.UNPROCESSABLE_ENTITY,
      // );
    }
    const сandidateName = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (сandidateName) {
      errorResponse.errors['username'] = 'Username is taken';
      // throw new HttpException(
      //   'Username is taken',
      //   HttpStatus.UNPROCESSABLE_ENTITY,
      // );
    }

    if (сandidateEmail || сandidateName) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.usersRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {},
    };

    const user = await this.usersRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      errorResponse.errors['email'] = 'User not found';
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
      // throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isValidatePassword = await this.validateJwt(
      loginUserDto.password,
      user.password,
    );
    if (!isValidatePassword) {
      errorResponse.errors['password'] = 'Wrong password';
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
      // throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });
    delete user.password;
    return user;
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    await this.usersRepository.update(userId, updateUserDto);
    return await this.findUserById(userId);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  async validateJwt(
    loginPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await compare(loginPassword, hashPassword);
  }

  buildUserResponce(user: UserEntity): IUserResponce {
    delete user.password;
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
