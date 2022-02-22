import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ShowUserProfileUseCase } from 'App/Modules/User/UseCases/ShowUserProfileUseCase/ShowUserProfileUseCase';
import { container } from 'tsyringe';
import { CreateUserUseCase } from '../../../UseCases/CreateUserUseCase/CreateUserUseCase';

export default class UsersController {
  public async store({ response, request }: HttpContextContract): Promise<void> {
    const { name, username, email, password } = request.body();

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute({ name, username, email, password });

    return response.json(user);
  }

  public async show({ response, params }: HttpContextContract): Promise<void> {
    const { id } = params;

    const showUserProfileUseCase = container.resolve(ShowUserProfileUseCase);

    const foundUser = await showUserProfileUseCase.execute(id);

    return response.json(foundUser);
  }
}
