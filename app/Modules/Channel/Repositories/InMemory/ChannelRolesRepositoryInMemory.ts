import { IChannelRole } from '../../Interfaces/IChannelRole';
import ChannelRole from '../../Models/ChannelRole';

export class ChannelRolesRepositoryInMemory implements IChannelRole.Repository {
  public channelRoles: ChannelRole[] = [];

  public async store(payload: IChannelRole.DTO.Store): Promise<ChannelRole> {
    const channelRole = new ChannelRole();

    Object.assign(channelRole, { ...payload, id: this.channelRoles.length + 1 });

    this.channelRoles.push(channelRole);

    return channelRole;
  }

  public async findBy(key: string, value: any): Promise<ChannelRole | null> {
    const channelRole = this.channelRoles.find((channelRole) => channelRole[key] === value);

    if (!channelRole) return null;

    return channelRole;
  }
}
