import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import AppException from 'App/Shared/Exceptions/AppException';
import { container } from 'tsyringe';
import { CreateUserUseCase } from '../../../UseCases/CreateUserUseCase/CreateUserUseCase';

export default class UsersController {
  public async store({ response, request }: HttpContextContract): Promise<void> {
    const { name, username, email, password } = request.body();

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute({ name, username, email, password });

    return response.json(user);
  }

  public async index() {
    return {
      oi: 'ta',
    };
  }
}
