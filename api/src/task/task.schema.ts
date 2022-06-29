import { Schema } from 'dynamoose';

export const TaskSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    attachments: {
      type: Array,
      schema: [String],
    },
  },
  {
    timestamps: true,
  },
);
