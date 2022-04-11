import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { CreateChannelUseCase } from 'App/Modules/Channel/UseCases/Channel/CreateChannelUseCase/CreateChannelUseCase';
import { GenerateStreamKeyByChannelUseCase } from 'App/Modules/Channel/UseCases/Channel/GenerateStreamKeyByChannelUseCase/GenerateStreamKeyByChannelUseCase';
import { GetStreamKeyByChannelUseCase } from 'App/Modules/Channel/UseCases/Channel/GetStreamKeyByChannelUseCase/GetStreamingKeyByChannelUseCase';
import { ShowChannelUseCase } from 'App/Modules/Channel/UseCases/Channel/ShowChannelUseCase/ShowChannelUseCase';
import { UpdateChannelUseCase } from 'App/Modules/Channel/UseCases/Channel/UpdateChannelUseCase/UpdateChannelUseCase';
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

  public async update(ctx: HttpContextContract) {
    const { request, response, auth, params } = ctx;
    const { id } = params;
    const { user } = auth;

    const validator = await new ChannelValidator.Update(ctx).createSchema();
    const channelData = await request.validate(validator);

    const updateChannelUseCase = container.resolve(UpdateChannelUseCase);

    if (user) {
      const channel = await updateChannelUseCase.execute({
        channelId: id,
        payload: channelData,
        userId: user.id,
      });

      return response.json(channel);
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const { id } = params;

    const showChannelUseCase = container.resolve(ShowChannelUseCase);
    const channel = await showChannelUseCase.execute(id);

    return response.json(channel);
  }

  public async getStreamKeyByChannel({ params, response }: HttpContextContract): Promise<void> {
    const { id: channelId } = params;

    const getStreamKeyByChannelUseCase = container.resolve(GetStreamKeyByChannelUseCase);
    const streamKey = await getStreamKeyByChannelUseCase.execute(channelId);

    return response.json(streamKey);
  }

  public async generateStreamKeyByChannel({
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const { id: channelId } = params;

    const generateStreamKeyByChannelUseCase = container.resolve(GenerateStreamKeyByChannelUseCase);
    const streamKey = await generateStreamKeyByChannelUseCase.execute(channelId);

    return response.json(streamKey);
  }
}
