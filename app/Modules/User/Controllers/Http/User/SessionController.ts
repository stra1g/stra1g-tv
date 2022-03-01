import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { RefreshTokenUseCase } from 'App/Modules/User/UseCases/Token/RefreshTokenUseCase/RefreshTokenUseCase';
import { CreateUserSessionUseCase } from 'App/Modules/User/UseCases/User/CreateUserSessionUseCase/CreateUserSessionUseCase';
import { container } from 'tsyringe';

export default class SessionController {
  public async store({ request, response, auth }: HttpContextContract): Promise<void> {
    const { email, password } = request.body();

    const createUserSessionUseCase = container.resolve(CreateUserSessionUseCase);

    const user = await createUserSessionUseCase.execute(email, password, auth);

    return response.json(user);
  }

  public async refreshToken({ request, auth, response }: HttpContextContract): Promise<void> {
    const { refresh_token: refreshToken } = request.body();

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

    const tokens = await refreshTokenUseCase.execute(refreshToken, auth);

    return response.json(tokens);
  }
}
