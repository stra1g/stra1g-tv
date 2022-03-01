import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ShowUserProfileUseCase } from 'App/Modules/User/UseCases/User/ShowUserProfileUseCase/ShowUserProfileUseCase';
import { UserValidator } from 'App/Modules/User/Validators/User';
import { container } from 'tsyringe';
import { CreateUserUseCase } from '../../../UseCases/User/CreateUserUseCase/CreateUserUseCase';

export default class UsersController {
  public async store(ctx: HttpContextContract): Promise<void> {
    const { request, response } = ctx;

    const validator = await new UserValidator.Store(ctx).createSchema();
    const userData = await request.validate(validator);

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute(userData);

    return response.json(user);
  }

  public async show({ response, params }: HttpContextContract): Promise<void> {
    const { id } = params;

    const showUserProfileUseCase = container.resolve(ShowUserProfileUseCase);

    const foundUser = await showUserProfileUseCase.execute(id);

    return response.json(foundUser);
  }
}
