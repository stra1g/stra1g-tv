import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.group(() => {
    Route.put('roles/:id/attach/permissions', 'Admin/RolesController.attachPermissions')
      .middleware(['can:store_role_permissions'])
      .where('id', /^[0-9]+$/);

    Route.post('roles', 'Admin/RolesController.store').middleware(['can:store_role']);

    Route.post('permissions', 'Admin/PermissionsController.store').middleware([
      'can:store_permission',
    ]);
  })
    .middleware(['auth', 'is:admin'])
    .prefix('admin');
}).namespace('App/Modules/ACL/Controllers/Http');
