import { EventsHandler } from '@nestjs/cqrs';
import { ListedAllTasksFailureEvent } from './listed-all-tasks-failure.event';

@EventsHandler(ListedAllTasksFailureEvent)
export class ListedAllTasksFailureHandler {
  handle(event: ListedAllTasksFailureEvent) {
    console.error(`Error on get all tasks: ${event.error.toString()}`);
  }
}
