import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { FinishStreamingUseCase } from 'App/Modules/Channel/UseCases/Streaming/FinishStreamingUseCase/FinishStreamingUseCase';
import { StoreStreamingUseCase } from 'App/Modules/Channel/UseCases/Streaming/StoreStreamingUseCase/StoreStreamingUseCase';
import { StreamingValidator } from 'App/Modules/Channel/Validators/Streaming';
import { container } from 'tsyringe';

export default class StreamingsController {
  public async store(ctx: HttpContextContract) {
    const { request, response } = ctx;

    const validator = await new StreamingValidator.Store(ctx).createSchema();
    const streamingDTO = await request.validate(validator);

    const storeStreamingUseCase = container.resolve(StoreStreamingUseCase);
    const streaming = await storeStreamingUseCase.execute(streamingDTO);

    return response.status(201).json(streaming);
  }

  public async finishStreaming({ params, response, i18n }: HttpContextContract) {
    const { id } = params;

    const finishStreamingUseCase = container.resolve(FinishStreamingUseCase);

    await finishStreamingUseCase.execute(id);

    return response.json({
      message: i18n.formatMessage('messages.success.streaming_finished_successfully'),
    });
  }
}
