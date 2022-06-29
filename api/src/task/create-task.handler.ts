import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateTaskCommand } from './create-task.command';
import { TaskDTO } from './task.dto';
import { CreateTaskService } from './services/create-task';
import { CreatedTaskFailureEvent } from './created-task-failure.event';
import { CreatedTaskSuccessEvent } from './created-task-success.event';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    private readonly createTaskService: CreateTaskService,
    private readonly eventBus: EventBus,
  ) {}
  async execute(command: CreateTaskCommand): Promise<TaskDTO> {
    try {
      const task = await this.createTaskService.create(command.task);
      this.eventBus.publish<CreatedTaskSuccessEvent>(
        new CreatedTaskSuccessEvent(command, task),
      );

      return task;
    } catch (error) {
      this.eventBus.publish<CreatedTaskFailureEvent>(
        new CreatedTaskFailureEvent(command, error as Error),
      );
      throw error;
    }
  }
}
