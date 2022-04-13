import { IChannel } from 'App/Modules/Channel/Interfaces/IChannel';
import { inject, injectable } from 'tsyringe';

type ListOnlineChannelsRequest = {
  page: number;
  perPage: number;
  search: string;
  online: boolean | null;
};

@injectable()
export class ListOnlineChannelsUseCase {
  constructor(
    @inject('ChannelsRepository')
    private channelsRepository: IChannel.Repository
  ) {}

  public async execute({ online, page, perPage, search }: ListOnlineChannelsRequest) {
    const channels = await this.channelsRepository.list(page, perPage, search, online);

    return channels;
  }
}
