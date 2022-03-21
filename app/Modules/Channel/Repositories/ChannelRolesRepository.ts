import { IChannelRole } from '../Interfaces/IChannelRole';
import ChannelRole from '../Models/ChannelRole';

export class ChannelRolesRepository implements IChannelRole.Repository {
  public async store(payload: IChannelRole.DTO.Store): Promise<ChannelRole> {
    const channelRole = await ChannelRole.create(payload);

    return channelRole;
  }

  public async findBy(key: string, value: any): Promise<ChannelRole | null> {
    const channelRole = await ChannelRole.findBy(key, value);

    return channelRole;
  }
}
