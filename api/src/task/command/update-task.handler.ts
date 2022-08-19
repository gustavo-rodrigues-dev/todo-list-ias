import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TaskDTO } from '../task.dto';
import { UpdateTaskService } from '../services/update-task';
import { UpdatedTaskSuccessEvent } from '../event/updated-task-success.event';
import { UpdatedTaskFailureEvent } from '../event/updated-task-failure.event';
import { UpdateTaskCommand } from './update-task.command';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(
    private readonly updateTaskService: UpdateTaskService,
    private readonly eventBus: EventBus,
  ) {}
  async execute(command: UpdateTaskCommand): Promise<TaskDTO> {
    try {
      const task = await this.updateTaskService.update(command.task);
      this.eventBus.publish<UpdatedTaskSuccessEvent>(
        new UpdatedTaskSuccessEvent(command, task),
      );

      return task;
    } catch (error) {
      this.eventBus.publish<UpdatedTaskFailureEvent>(
        new UpdatedTaskFailureEvent(command, error as Error),
      );
      throw error;
    }
  }
}
