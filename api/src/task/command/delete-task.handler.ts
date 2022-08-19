import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTaskCommand } from './delete-task.command';
import { DeleteTaskService } from '../services/delete-task';
import { DeletedTaskSuccessEvent } from '../event/deleted-task-success.event';
import { DeletedTaskFailureEvent } from '../event/deleted-task-failure.event';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    private readonly deleteTaskService: DeleteTaskService,
    private readonly eventBus: EventBus,
  ) {}
  async execute(command: DeleteTaskCommand): Promise<void> {
    try {
      const task = await this.deleteTaskService.delete(command.taskId);
      this.eventBus.publish<DeletedTaskSuccessEvent>(
        new DeletedTaskSuccessEvent(command, task),
      );
    } catch (error) {
      this.eventBus.publish<DeletedTaskFailureEvent>(
        new DeletedTaskFailureEvent(command, error as Error),
      );
      throw error;
    }
  }
}
