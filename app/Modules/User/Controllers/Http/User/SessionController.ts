import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { CreateUserSessionUseCase } from 'App/Modules/User/UseCases/CreateUserSessionUseCase/CreateUserSessionUseCase';
import { container } from 'tsyringe';

export default class SessionController {
  public async store({ request, response, auth }: HttpContextContract): Promise<void> {
    const { email, password } = request.body();

    const createUserSessionUseCase = container.resolve(CreateUserSessionUseCase);

    const user = await createUserSessionUseCase.execute(email, password, auth);

    return response.json(user);
  }
}
