import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TaskDTO } from '../task.dto';
import { ListAllTasksQuery } from './list-all-tasks.query';
import { ListAllTasksService } from '../services/list-all-tasks';
import { ListedAllTasksSuccessEvent } from '../event/listed-all-tasks-success.event';
import { ListedAllTasksFailureEvent } from '../event/listed-all-tasks-failure.event';

@QueryHandler(ListAllTasksQuery)
export class ListAllTasksHandler implements IQueryHandler<ListAllTasksQuery> {
  constructor(
    private readonly listAllService: ListAllTasksService,
    private readonly eventBus: EventBus,
  ) {}
  async execute(query: ListAllTasksQuery): Promise<TaskDTO[]> {
    try {
      const tasks = await this.listAllService.get();
      this.eventBus.publish<ListedAllTasksSuccessEvent>(
        new ListedAllTasksSuccessEvent(query, tasks),
      );

      return tasks;
    } catch (error) {
      this.eventBus.publish<ListedAllTasksFailureEvent>(
        new ListedAllTasksFailureEvent(query, error as Error),
      );
      throw error;
    }
  }
}
