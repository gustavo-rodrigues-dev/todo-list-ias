export interface TaskKey {
  id: string;
}

export interface TaskModel extends TaskKey {
  title: string;
  description: string;
  attachments: [string];
  createdAt: string;
  updatedAt?: string;
}
