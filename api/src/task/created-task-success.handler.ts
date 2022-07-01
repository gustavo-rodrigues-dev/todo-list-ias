import { EventsHandler } from '@nestjs/cqrs';
import { CreatedTaskSuccessEvent } from './created-task-success.event';

@EventsHandler(CreatedTaskSuccessEvent)
export class CreatedTaskSuccessHandler {
  handle(event: CreatedTaskSuccessEvent) {
    console.info(`Created task ${event.result.id}`);
  }
}
