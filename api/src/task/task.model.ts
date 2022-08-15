export interface TaskKey {
  id: string;
}

export interface TaskModel extends TaskKey {
  title: string;
  description: string;
  attachments: [string];
  done: boolean;
  createdAt: string;
  updatedAt?: string;
}
