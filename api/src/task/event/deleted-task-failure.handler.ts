import { EventsHandler } from '@nestjs/cqrs';
import { DeletedTaskFailureEvent } from './deleted-task-failure.event';

@EventsHandler(DeletedTaskFailureEvent)
export class DeletedTaskFailureHandler {
  handle(event: DeletedTaskFailureEvent) {
    console.error(
      `Error on delete task ${event.command.taskId}: ${event.error.toString()}`,
    );
  }
}
