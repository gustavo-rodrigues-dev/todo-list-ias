import { EventsHandler } from '@nestjs/cqrs';
import { UpdatedTaskFailureEvent } from './updated-task-failure.event';

@EventsHandler(UpdatedTaskFailureEvent)
export class UpdatedTaskFailureHandler {
  handle(event: UpdatedTaskFailureEvent) {
    console.error(
      `Error on update task ${
        event.command.task.id
      }: ${event.error.toString()}`,
    );
  }
}
