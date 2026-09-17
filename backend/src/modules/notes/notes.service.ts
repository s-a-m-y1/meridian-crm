import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Note } from './note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteQueryDto } from './dto/note-query.dto';
import { PaginatedNotesDto } from './dto/paginated-notes.dto';
import { OrgContext } from '../../common/decorators/org-context.interface';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly repo: Repository<Note>,
  ) {}

  async create(dto: CreateNoteDto, orgContext: OrgContext): Promise<Note> {
    const note = this.repo.create({
      ...dto,
      organizationId: orgContext.organizationId,
      userId: orgContext.userId,
    });
    return this.repo.save(note);
  }

  async findAll(query: NoteQueryDto, orgContext: OrgContext): Promise<PaginatedNotesDto> {
    const qb = this.buildBaseQuery(orgContext);
    this.applyFilters(qb, query);
    this.applySorting(qb, query);
    return this.paginate(qb, query);
  }

  async findById(id: string, orgContext: OrgContext): Promise<Note> {
    const note = await this.repo.findOne({
      where: { id, organizationId: orgContext.organizationId },
    });
    if (!note) throw new NotFoundException('Note not found');
    this.checkAccess(note, orgContext);
    return note;
  }

  async update(id: string, dto: UpdateNoteDto, orgContext: OrgContext): Promise<Note> {
    const note = await this.findById(id, orgContext);
    this.checkAccess(note, orgContext);
    Object.assign(note, dto);
    return this.repo.save(note);
  }

  async delete(id: string, orgContext: OrgContext): Promise<void> {
    const note = await this.findById(id, orgContext);
    this.checkAccess(note, orgContext);
    await this.repo.remove(note);
  }

  private buildBaseQuery(orgContext: OrgContext): SelectQueryBuilder<Note> {
    return this.repo
      .createQueryBuilder('note')
      .where('note.organizationId = :orgId', { orgId: orgContext.organizationId });
  }

  private applyFilters(qb: SelectQueryBuilder<Note>, query: NoteQueryDto): void {
    if (query.leadId) {
      qb.andWhere('note.leadId = :leadId', { leadId: query.leadId });
    }
  }

  private applySorting(qb: SelectQueryBuilder<Note>, query: NoteQueryDto): void {
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = (query.sortOrder ?? 'DESC') as 'ASC' | 'DESC';
    qb.orderBy(`note.${sortBy}`, sortOrder);
  }

  private async paginate(
    qb: SelectQueryBuilder<Note>,
    query: NoteQueryDto,
  ): Promise<PaginatedNotesDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  private checkAccess(note: Note, orgContext: OrgContext): void {
    if (orgContext.restrictedToOwnRecords && note.userId !== orgContext.userId) {
      throw new ForbiddenException('Access denied to this note');
    }
  }
}