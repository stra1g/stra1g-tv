import { container } from 'tsyringe';
import { IPermission } from '../Interfaces/IPermission';
import { PermissionsRepository } from '../Repositories/PermissionsRepository';

container.registerSingleton<IPermission.Repository>('PermissionsRepository', PermissionsRepository);
