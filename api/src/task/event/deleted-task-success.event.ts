import { DeleteTaskCommand } from '../command/delete-task.command';

export class DeletedTaskSuccessEvent {
  constructor(
    public readonly command: DeleteTaskCommand,
    public readonly result: void,
  ) {}
}
