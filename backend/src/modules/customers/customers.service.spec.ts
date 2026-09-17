import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomersService } from './customers.service';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerQueryDto, CustomerSortBy, SortOrder } from './dto/customer-query.dto';
import { OrgContext } from '../../common/decorators/org-context.interface';

const mockOrgContext: OrgContext = {
  organizationId: 'org-1',
  userId: 'user-1',
  role: 'agent',
  restrictedToOwnRecords: false,
};

const mockCustomer: Customer = {
  id: 'cust-1',
  organizationId: 'org-1',
  name: 'Test Customer',
  phone: '+201012345678',
  email: 'test@example.com',
  searchVector: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

type MockRepo = {
  create: jest.Mock;
  save: jest.Mock;
  findOne: jest.Mock;
  remove: jest.Mock;
  createQueryBuilder: jest.Mock;
};

describe('CustomersService', () => {
  let service: CustomersService;
  let repo: MockRepo;

  beforeEach(async () => {
    const repoMock: MockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: getRepositoryToken(Customer), useValue: repoMock },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    repo = (service as any).repo;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateCustomerDto = {
      name: 'New Customer',
      phone: '+201012345678',
      email: 'new@example.com',
    };

    it('should create and save customer', async () => {
      const createdCustomer = { ...mockCustomer, id: 'new-id', ...createDto };
      repo.create.mockReturnValue(createdCustomer);
      repo.save.mockResolvedValue(createdCustomer);

      const result = await service.create(createDto, mockOrgContext);
      expect(result).toEqual(createdCustomer);
      expect(repo.create).toHaveBeenCalledWith({ ...createDto, organizationId: 'org-1' });
      expect(repo.save).toHaveBeenCalledWith(createdCustomer);
    });
  });

  describe('findAll', () => {
    const query: CustomerQueryDto = {
      page: 1,
      limit: 20,
      sortBy: CustomerSortBy.CREATED_AT,
      sortOrder: SortOrder.DESC,
      search: undefined,
    };

    it('should return paginated customers', async () => {
      repo.createQueryBuilder().getManyAndCount.mockResolvedValue([[mockCustomer], 1]);

      const result = await service.findAll(query, mockOrgContext);

      expect(result).toEqual({
        data: [mockCustomer],
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
      expect(repo.createQueryBuilder).toHaveBeenCalled();
      expect(repo.createQueryBuilder().where).toHaveBeenCalledWith(
        'customer.organizationId = :orgId',
        { orgId: 'org-1' },
      );
    });

    it('should apply search filter when provided', async () => {
      const queryWithSearch: CustomerQueryDto = { ...query, search: 'Ahmed' };
      repo.createQueryBuilder().getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAll(queryWithSearch, mockOrgContext);

      expect(repo.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        { search: '%Ahmed%' },
      );
    });

    it('should apply custom sorting', async () => {
      const queryWithSort: CustomerQueryDto = {
        ...query,
        sortBy: CustomerSortBy.NAME,
        sortOrder: SortOrder.ASC,
      };
      repo.createQueryBuilder().getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAll(queryWithSort, mockOrgContext);

      expect(repo.createQueryBuilder().orderBy).toHaveBeenCalledWith('customer.name', 'ASC');
    });
  });

  describe('findById', () => {
    it('should return customer when found', async () => {
      repo.findOne.mockResolvedValue(mockCustomer);
      const result = await service.findById('cust-1', mockOrgContext);
      expect(result).toEqual(mockCustomer);
    });

    it('should throw NotFoundException when not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findById('missing', mockOrgContext)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateCustomerDto = { name: 'Updated Name' };

    it('should update and return customer', async () => {
      const updatedCustomer = { ...mockCustomer, ...updateDto };
      repo.findOne.mockResolvedValue(mockCustomer);
      repo.save.mockResolvedValue(updatedCustomer);

      const result = await service.update('cust-1', updateDto, mockOrgContext);
      expect(result).toEqual(updatedCustomer);
    });

    it('should throw NotFoundException when customer not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update('missing', updateDto, mockOrgContext)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete customer', async () => {
      repo.findOne.mockResolvedValue(mockCustomer);
      repo.remove.mockResolvedValue(undefined);

      await service.delete('cust-1', mockOrgContext);
      expect(repo.remove).toHaveBeenCalledWith(mockCustomer);
    });

    it('should throw NotFoundException when customer not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.delete('missing', mockOrgContext)).rejects.toThrow(NotFoundException);
    });
  });
});