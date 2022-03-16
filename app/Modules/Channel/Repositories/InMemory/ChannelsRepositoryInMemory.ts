import { IChannel } from '../../Interfaces/IChannel';
import Channel from '../../Models/Channel';

export class ChannelsRepositoryInMemory implements IChannel.Repository {
  public channels: Channel[] = [];

  public async store({ description, title, user_id }: IChannel.DTO.Store): Promise<Channel> {
    const channel = new Channel();

    Object.assign(channel, { description, title, user_id, id: this.channels.length + 1 });

    this.channels.push(channel);

    return channel;
  }

  public async findBy(key: string, value: any): Promise<Channel | null> {
    const channel = this.channels.find((channel) => channel[key] === value);

    if (!channel) return null;

    return channel;
  }

  public async show(channelId: number): Promise<Channel | null> {
    const channel = this.channels.find((channel) => channel.id === channelId);

    if (!channel) return null;

    return channel;
  }
}
