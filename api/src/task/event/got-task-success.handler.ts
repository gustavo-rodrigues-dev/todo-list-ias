import { EventsHandler } from '@nestjs/cqrs';
import { GotTaskSuccessEvent } from './got-task-success.event';

@EventsHandler(GotTaskSuccessEvent)
export class GotTaskSuccessHandler {
  handle(event: GotTaskSuccessEvent) {
    console.info(`Get task ${event.query.taskId}`, event.result);
  }
}
