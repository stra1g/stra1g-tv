import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm';
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

  public async list(
    page: number,
    perPage: number,
    _search: string,
    _online: boolean | null
  ): Promise<ModelPaginatorContract<Channel>> {
    const meta = {};
    const data: Channel[] = [];

    const total = this.channels.length;
    const lastPage = total / perPage;
    const nextPageUrl = page - lastPage === 0 ? null : `/?page=${page + 1}`;
    const previousPageUrl = page - 1 === 0 ? null : `/?page=${page - 1}`;

    Object.assign(meta, {
      total,
      per_page: perPage,
      current_page: page,
      last_page: lastPage,
      first_page: 1,
      first_page_url: '/?page=1',
      last_page_url: `/?page=${lastPage}`,
      next_page_url: nextPageUrl,
      previous_page_url: previousPageUrl,
    });

    for (let i = 0; i < perPage; i++) {
      data.push(this.channels[i]);
    }

    return {
      meta,
      data,
    } as any;
  }
}
