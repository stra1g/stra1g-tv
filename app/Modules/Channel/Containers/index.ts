import { container } from 'tsyringe';
import { IChannel } from '../Interfaces/IChannel';
import { IStreaming } from '../Interfaces/IStreaming';
import { ChannelsRepository } from '../Repositories/ChannelsRepository';
import { StreamingsRepository } from '../Repositories/StreamingsRepository';

container.registerSingleton<IChannel.Repository>('ChannelsRepository', ChannelsRepository);
container.register<IStreaming.Repository>('StreamingsRepository', StreamingsRepository);
