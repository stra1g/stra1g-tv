import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { CreateChannelUseCase } from 'App/Modules/Channel/UseCases/Channel/CreateChannelUseCase/CreateChannelUseCase';
import { ShowChannelUseCase } from 'App/Modules/Channel/UseCases/Channel/ShowChannelUseCase/ShowChannelUseCase';
import { ChannelValidator } from 'App/Modules/Channel/Validators/Channel';
import { container } from 'tsyringe';

export default class ChannelsController {
  public async store(ctx: HttpContextContract): Promise<void> {
    const { request, response, auth } = ctx;
    const { user } = auth;

    const validator = await new ChannelValidator.Store(ctx).createSchema();
    const channelData = await request.validate(validator);

    const createChannelUseCase = container.resolve(CreateChannelUseCase);

    if (user) {
      const channel = await createChannelUseCase.execute({ ...channelData, user_id: user.id });

      return response.json(channel);
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const { id } = params;

    const showChannelUseCase = container.resolve(ShowChannelUseCase);
    const channel = await showChannelUseCase.execute(id);

    return response.json(channel);
  }
}
