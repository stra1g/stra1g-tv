import { container } from 'tsyringe';
import { IChannel } from '../Interfaces/IChannel';
import { IChannelRole } from '../Interfaces/IChannelRole';
import { IStreaming } from '../Interfaces/IStreaming';
import { ChannelRolesRepository } from '../Repositories/ChannelRolesRepository';
import { ChannelsRepository } from '../Repositories/ChannelsRepository';
import { StreamingsRepository } from '../Repositories/StreamingsRepository';

container.registerSingleton<IChannel.Repository>('ChannelsRepository', ChannelsRepository);
container.register<IStreaming.Repository>('StreamingsRepository', StreamingsRepository);
container.registerSingleton<IChannelRole.Repository>(
  'ChannelRolesRepository',
  ChannelRolesRepository
);
