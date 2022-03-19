import { IChannel } from '../../Interfaces/IChannel';
import Channel from '../../Models/Channel';

export class ChannelsRepositoryInMemory implements IChannel.Repository {
  public channels: Channel[] = [];

  public async store({ description, name, user_id }: IChannel.DTO.Store): Promise<Channel> {
    const channel = new Channel();

    Object.assign(channel, { description, name, userId: user_id, id: this.channels.length + 1 });

    this.channels.push(channel);

    return channel;
  }

  public async update(channel: Channel, payload: IChannel.DTO.Update): Promise<Channel> {
    const index = this.channels.indexOf(channel);

    Object.assign(channel, payload);

    this.channels.splice(index, 1, channel);

    return channel;
  }

  public async findByUserAndChannel(userId: number, channelId: number): Promise<Channel | null> {
    const channel = this.channels.find((channel) => {
      return channel.id === channelId && channel.userId === userId;
    });

    if (!channel) return null;

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
