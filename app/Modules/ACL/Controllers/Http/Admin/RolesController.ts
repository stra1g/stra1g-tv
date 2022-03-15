import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { container } from 'tsyringe';

import { CreateRoleUseCase } from 'App/Modules/ACL/UseCases/Role/CreateRoleUseCase/CreateRoleUseCase';
import { SyncPermissionsUseCase } from 'App/Modules/ACL/UseCases/Role/SyncPermissionsUseCase/SyncPermissionsUseCase';
import { RoleValidator } from 'App/Modules/ACL/Validators/Role';
import { IndexRolesUseCase } from 'App/Modules/ACL/UseCases/Role/IndexRolesUseCase/IndexRolesUseCase';

export default class RolesController {
  public async store(ctx: HttpContextContract): Promise<void> {
    const { response, request } = ctx;

    const validator = await new RoleValidator.Store(ctx).createSchema();
    const roleData = await request.validate(validator);

    const createRoleUseCase = container.resolve(CreateRoleUseCase);

    const role = await createRoleUseCase.execute(roleData);

    return response.json(role);
  }

  public async index(ctx: HttpContextContract) {
    const page = ctx.request.input('page', 1);
    const perPage = ctx.request.input('per_page', 20);

    const indexRolesUseCase = container.resolve(IndexRolesUseCase);
    const roles = await indexRolesUseCase.execute(page, perPage);

    return ctx.response.json(roles);
  }

  public async syncPermissions(ctx: HttpContextContract): Promise<void> {
    const { request, response, params } = ctx;
    const { id } = params;

    const validator = await new RoleValidator.SyncPermissions(ctx).createSchema();
    const { permission_ids: permissionIds } = await request.validate(validator);

    const syncPermissionsUseCase = container.resolve(SyncPermissionsUseCase);

    const role = await syncPermissionsUseCase.execute({ role_id: id, permissionIds });

    return response.json(role);
  }
}
