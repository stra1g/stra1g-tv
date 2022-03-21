import BaseSchema from '@ioc:Adonis/Lucid/Schema';

import defaultAdminAclSettings from 'App/Modules/ACL/Defaults/Admin';
import defaultCommonUserAclSettings from 'App/Modules/ACL/Defaults/CommonUser';
import Permission from 'App/Modules/ACL/Models/Permission';
import Role from 'App/Modules/ACL/Models/Role';

export default class CreateDefaultAclSettings extends BaseSchema {
  public async up() {
    /**
     * Admin role and permissions
     */
    const adminRole = await Role.create(defaultAdminAclSettings.role);
    const adminPermissionIds = (
      await Permission.createMany(defaultAdminAclSettings.permissions)
    ).map((permission) => permission.id);

    await adminRole.related('permissions').sync(adminPermissionIds);

    /**
     * Common user role
     */
    await Role.create(defaultCommonUserAclSettings.role);
  }

  public async down() {}
}
