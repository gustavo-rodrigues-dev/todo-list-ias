import { EventsHandler } from '@nestjs/cqrs';
import { CreatedTaskFailureEvent } from './created-task-failure.event';

@EventsHandler(CreatedTaskFailureEvent)
export class CreatedTaskFailureHandler {
  handle(event: CreatedTaskFailureEvent): void {
    console.error(
      `Error on process task ${
        event.command.task.title
      }, ${event.error.toString()}`,
    );
  }
}
