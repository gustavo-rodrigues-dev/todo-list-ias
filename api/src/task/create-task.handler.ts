import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTaskCommand } from './create-task.command';
import { TaskDTO } from './task.dto';
import { CreateTaskService } from './services/create-task';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(private createTaskService: CreateTaskService) {}
  execute(command: CreateTaskCommand): Promise<TaskDTO> {
    return this.createTaskService.create(command.task);
  }
}
