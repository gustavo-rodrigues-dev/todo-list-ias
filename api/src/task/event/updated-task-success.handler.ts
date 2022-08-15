import { EventsHandler } from '@nestjs/cqrs';
import { UpdatedTaskSuccessEvent } from './updated-task-success.event';

@EventsHandler(UpdatedTaskSuccessEvent)
export class UpdatedTaskSuccessHandler {
  handle(event: UpdatedTaskSuccessEvent) {
    console.info(`Updated task ${event.result.id}`, event.result);
  }
}
