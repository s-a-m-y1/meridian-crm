import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email.toLowerCase() })
      .addSelect('user.passwordHash')
      .getOne();
  }

  async create(data: { email: string; name: string; passwordHash: string }): Promise<User> {
    const user = this.repo.create({
      email: data.email.toLowerCase(),
      name: data.name,
      passwordHash: data.passwordHash,
    });
    return this.repo.save(user);
  }

  async setEmailVerificationToken(userId: string, token: string): Promise<void> {
    const result = await this.repo.update(userId, { emailVerificationToken: token });
    if (result.affected === 0) throw new NotFoundException('User not found');
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.repo.findOne({ where: { emailVerificationToken: token } });
    if (!user) throw new NotFoundException('Invalid verification token');
    
    await this.repo.update(user.id, { 
      emailVerifiedAt: new Date(),
      emailVerificationToken: null 
    });
  }

  async verifyEmailById(id: string): Promise<void> {
    const result = await this.repo.update(id, { emailVerifiedAt: new Date() });
    if (result.affected === 0) throw new NotFoundException('User not found');
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    const result = await this.repo.update(id, { passwordHash });
    if (result.affected === 0) throw new NotFoundException('User not found');
  }
}
