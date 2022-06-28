import { validateOrReject, ValidationError } from 'class-validator';
import { TaskDTO } from './task.dto';

describe(TaskDTO.name, () => {
  describe(`${TaskDTO.name}.constructor()`, () => {
    it('Should create TaskDTO success', async () => {
      const target = new TaskDTO();
      target.title = 'Hello';
      target.description = 'Hello world!';

      const useCase = await validateOrReject(target);
      expect(target).toBeInstanceOf(TaskDTO);
      expect(useCase).toBeUndefined();
    });

    it('Should create TaskDTO error', async () => {
      const target = new TaskDTO();
      let error!: ValidationError;
      target.title = 'He';
      target.description = 'He';
      try {
        await validateOrReject(target);
      } catch (err) {
        error = err as ValidationError;
      }
      expect(target).toBeInstanceOf(TaskDTO);
      expect(error.toString().replace(/\n|\r/g, '').trim().trim()).toBe(
        'An instance of TaskDTO has failed the validation:' +
          ' - property title has failed the following constraints: isLength' +
          ' ,An instance of TaskDTO has failed the validation:' +
          ' - property description has failed the following constraints: isLength',
      );
    });
  });
});
