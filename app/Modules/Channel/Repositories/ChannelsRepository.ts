import { IChannel } from '../Interfaces/IChannel';
import Channel from '../Models/Channel';

export class ChannelsRepository implements IChannel.Repository {
  public repository: typeof Channel;

  constructor() {
    this.repository = Channel;
  }

  public async store(data: IChannel.DTO.Store): Promise<Channel> {
    const channel = await this.repository.create(data);

    return channel;
  }

  public async show(channelId: number): Promise<Channel | null> {
    const channel = await this.repository.query().where({ id: channelId }).preload('user').first();

    return channel;
  }

  public async update(channel: Channel, payload: IChannel.DTO.Update): Promise<Channel> {
    channel.merge(payload);

    await channel.save();

    return channel;
  }

  public async findByUserAndChannel(userId: number, channelId: number): Promise<Channel | null> {
    const channel = await this.repository.query().where({ user_id: userId, id: channelId }).first();

    return channel;
  }

  public async findBy(key: string, value: any): Promise<Channel | null> {
    const channel = await this.repository.findBy(key, value);

    return channel;
  }
}
