import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.group(() => {
    Route.put('roles/:id/sync/permissions', 'Admin/RolesController.syncPermissions')
      .middleware(['can:store_role_permissions'])
      .where('id', /^[0-9]+$/);

    Route.post('roles', 'Admin/RolesController.store').middleware(['can:store_role']);

    Route.get('roles', 'Admin/RolesController.index').middleware(['can:index_roles']);

    Route.post('permissions', 'Admin/PermissionsController.store').middleware([
      'can:store_permission',
    ]);

    Route.get('permissions', 'Admin/PermissionsController.index').middleware([
      'can:index_permissions',
    ]);
  })
    .middleware(['auth', 'is:admin'])
    .prefix('admin');
}).namespace('App/Modules/ACL/Controllers/Http');
