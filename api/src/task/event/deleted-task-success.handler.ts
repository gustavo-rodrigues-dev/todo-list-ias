import { EventsHandler } from '@nestjs/cqrs';
import { DeletedTaskSuccessEvent } from './deleted-task-success.event';

@EventsHandler(DeletedTaskSuccessEvent)
export class DeletedTaskSuccessHandler {
  handle(event: DeletedTaskSuccessEvent) {
    console.info(`Deleted task ${event.command.taskId}`, event.result);
  }
}
