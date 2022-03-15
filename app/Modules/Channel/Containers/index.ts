import { container } from 'tsyringe';
import { IChannel } from '../Interfaces/IChannel';
import { ChannelsRepository } from '../Repositories/ChannelsRepository';

container.registerSingleton<IChannel.Repository>('ChannelsRepository', ChannelsRepository);
