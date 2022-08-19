import { EventsHandler } from '@nestjs/cqrs';
import { ListedAllTasksSuccessEvent } from './listed-all-tasks-success.event';

@EventsHandler(ListedAllTasksSuccessEvent)
export class ListedAllTasksSuccessHandler {
  handle(event: ListedAllTasksSuccessEvent) {
    console.info('Get all tasks', event.result);
  }
}
