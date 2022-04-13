import Database from '@ioc:Adonis/Lucid/Database';
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm';
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

  public async list(
    page: number,
    perPage: number,
    search: string,
    online: boolean | null
  ): Promise<ModelPaginatorContract<Channel>> {
    const whereClause: IChannel.ChannelModelAttributes = {};

    if (online !== null) whereClause.online = online;

    const channels = await this.repository
      .query()
      .select('channels.id', 'channels.name', 'channels.description', 'channels.online')
      .leftJoin('streamings', 'channels.id', 'streamings.channel_id')
      .preload('streamings', (streamingQuery) => {
        streamingQuery.where({ finished_at: null });
      })
      .where(whereClause)
      .whereRaw(`(channels.name ilike ? or streamings.title ilike ?)`, [
        `%${search}%`,
        `%${search}%`,
      ])
      .where((query) => {
        query.where({ 'streamings.finished_at': null }).orWhere({ 'streamings.id': null });
      })
      .paginate(page, perPage);

    return channels;
  }

  public async findBy(key: string, value: any): Promise<Channel | null> {
    const channel = await this.repository.findBy(key, value);

    return channel;
  }
}
