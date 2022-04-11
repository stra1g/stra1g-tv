import { IChannel } from 'App/Modules/Channel/Interfaces/IChannel';
import { IStreaming } from 'App/Modules/Channel/Interfaces/IStreaming';
import Channel from 'App/Modules/Channel/Models/Channel';
import Streaming from 'App/Modules/Channel/Models/Streaming';
import { IUser } from 'App/Modules/User/Interfaces/IUser';
import User from 'App/Modules/User/Models/User';
import { inject, injectable } from 'tsyringe';

type GetUserByStreamingKeyResponse = {
  user: User;
  channel: Channel;
  streaming: Streaming;
};

@injectable()
export class GetUserByStreamingKeyUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUser.Repository,
    @inject('ChannelsRepository')
    private channelsRepository: IChannel.Repository,
    @inject('StreamingsRepository')
    private streamingsRepository: IStreaming.Repository
  ) {}

  public async execute(
    username: string,
    streamKey: string
  ): Promise<GetUserByStreamingKeyResponse | null> {
    const user = await this.usersRepository.findBy('username', username);

    if (!user) return null;

    const channel = await this.channelsRepository.findBy('user_id', user.id);

    if (!channel) return null;

    if (channel.stream_key !== streamKey) return null;

    const streaming = await this.streamingsRepository.getCurrentStreamingByUser(user.id);

    if (!streaming) return null;

    return { user, channel, streaming };
  }
}
