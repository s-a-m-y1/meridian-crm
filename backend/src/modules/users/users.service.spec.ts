import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';


const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  passwordHash: '$2a$04$hashedpassword',
  emailVerifiedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  beforeEach(async () => {
    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };

    repo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      (repo.createQueryBuilder() as any).getOne.mockResolvedValue(mockUser);
      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null when not found', async () => {
      (repo.createQueryBuilder() as any).getOne.mockResolvedValue(null);
      const result = await service.findByEmail('missing@example.com');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and save user', async () => {
      const userData = { email: 'new@example.com', name: 'New', passwordHash: 'hash' };
      const createdUser = { ...mockUser, id: 'new-id', email: userData.email, name: userData.name, passwordHash: userData.passwordHash };
      repo.create.mockReturnValue(createdUser);
      repo.save.mockResolvedValue(createdUser);

      const result = await service.create(userData);
      expect(result).toEqual(createdUser);
    });
  });
});