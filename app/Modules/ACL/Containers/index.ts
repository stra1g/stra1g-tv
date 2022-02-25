import { container } from 'tsyringe';
import { IPermission } from '../Interfaces/IPermission';
import { IRole } from '../Interfaces/IRole';
import { PermissionsRepository } from '../Repositories/PermissionsRepository';
import { RolesRepository } from '../Repositories/RolesRepository';

container.registerSingleton<IPermission.Repository>('PermissionsRepository', PermissionsRepository);
container.registerSingleton<IRole.Repository>('RolesRepository', RolesRepository);
