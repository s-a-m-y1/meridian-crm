import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteQueryDto } from './dto/note-query.dto';
import { PaginatedNotesDto } from './dto/paginated-notes.dto';
import { Note } from './note.entity';
import { AuthGuard } from '../../common/guards/auth.guard';
import { OrganizationMemberGuard } from '../../common/guards/organization-member.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentOrg } from '../../common/decorators/current-org.decorator';
import { OrgContext } from '../../common/decorators/org-context.interface';

@ApiTags('notes')
@Controller('notes')
@UseGuards(AuthGuard, OrganizationMemberGuard, RolesGuard)
@ApiBearerAuth()
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Post()
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Create a new note' })
  async create(
    @Body() dto: CreateNoteDto,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<Note> {
    return this.service.create(dto, orgContext);
  }

  @Get()
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'List notes with pagination, filtering' })
  async findAll(
    @Query() query: NoteQueryDto,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<PaginatedNotesDto> {
    return this.service.findAll(query, orgContext);
  }

  @Get(':id')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Get a note by ID' })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<Note> {
    return this.service.findById(id, orgContext);
  }

  @Patch(':id')
  @Roles('owner', 'admin', 'manager', 'agent')
  @ApiOperation({ summary: 'Update a note' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNoteDto,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<Note> {
    return this.service.update(id, dto, orgContext);
  }

  @Delete(':id')
  @Roles('owner', 'admin', 'manager')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a note' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentOrg() orgContext: OrgContext,
  ): Promise<void> {
    return this.service.delete(id, orgContext);
  }
}