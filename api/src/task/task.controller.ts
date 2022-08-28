import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
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

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async listAllTasks() {
    return await this.queryBus.execute(new ListAllTasksQuery());
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getTask(@Param('id') taskId: string) {
    const result = await this.queryBus.execute(new GetTaskQuery(taskId));

    if (!result) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateTask(@Param('id') _taskId: string, @Body() task: TaskDTO) {
    const result = await this.commandBus.execute(new UpdateTaskCommand(task));

    if (!result) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id') taskId: string) {
    return await this.commandBus.execute(new DeleteTaskCommand(taskId));
  }
}
