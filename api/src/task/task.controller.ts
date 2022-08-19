import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTaskCommand } from './command/create-task.command';
import { DeleteTaskCommand } from './command/delete-task.command';
import { UpdateTaskCommand } from './command/update-task.command';
import { GetTaskQuery } from './query/get-task.query';
import { ListAllTasksQuery } from './query/list-all-tasks.query';
import { TaskDTO } from './task.dto';

@Controller('/task')
export class TaskController {
  constructor(
    @Inject(CommandBus) private readonly commandBus: CommandBus,
    @Inject(QueryBus) private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() task: TaskDTO) {
    return await this.commandBus.execute(new CreateTaskCommand(task));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async listAllTasks() {
    return await this.queryBus.execute(new ListAllTasksQuery());
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getTask(@Param('id') taskId: string) {
    return await this.queryBus.execute(new GetTaskQuery(taskId));
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateTask(@Param('id') _taskId: string, @Body() task: TaskDTO) {
    return await this.commandBus.execute(new UpdateTaskCommand(task));
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id') taskId: string) {
    return await this.commandBus.execute(new DeleteTaskCommand(taskId));
  }
}
