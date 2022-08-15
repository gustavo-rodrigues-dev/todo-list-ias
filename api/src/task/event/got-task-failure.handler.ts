import { EventsHandler } from '@nestjs/cqrs';
import { GotTaskFailureEvent } from './got-task-failure.event';

@EventsHandler(GotTaskFailureEvent)
export class GotTaskFailureHandler {
  handle(event: GotTaskFailureEvent) {
    console.error(
      `Error on get task ${event.query.taskId}: ${event.error.toString()}`,
    );
  }
}
