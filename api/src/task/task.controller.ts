import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTaskCommand } from './command/create-task.command';
import { TaskDTO } from './task.dto';

@Controller('/task')
export class TaskController {
  constructor(@Inject(CommandBus) private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() task: TaskDTO) {
    return await this.commandBus.execute(new CreateTaskCommand(task));
  }
}
