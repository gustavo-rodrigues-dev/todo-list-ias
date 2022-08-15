import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TaskDTO } from '../task.dto';
import { GetTaskQuery } from './get-task.query';
import { GetTaskService } from '../services/get-task';
import { GotTaskSuccessEvent } from '../event/got-task-success.event';
import { GotTaskFailureEvent } from '../event/got-task-failure.event';

@QueryHandler(GetTaskQuery)
export class GetTaskHandler implements IQueryHandler<GetTaskQuery> {
  constructor(
    private readonly getTaskService: GetTaskService,
    private readonly eventBus: EventBus,
  ) {}
  async execute(query: GetTaskQuery): Promise<TaskDTO> {
    try {
      const task = await this.getTaskService.get(query.taskId);
      this.eventBus.publish<GotTaskSuccessEvent>(
        new GotTaskSuccessEvent(query, task),
      );

      return task;
    } catch (error) {
      this.eventBus.publish<GotTaskFailureEvent>(
        new GotTaskFailureEvent(query, error as Error),
      );
      throw error;
    }
  }
}
