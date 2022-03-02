import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  /**
   * Admin routes
   */
  Route.group(() => {
    Route.put('users/:id/sync/permissions', 'Admin/UsersController.syncPermissions')
      .middleware(['can:store_user_permissions'])
      .where('id', /^[0-9]+$/);

    Route.put('users/:id/sync/roles', 'Admin/UsersController.syncRoles')
      .middleware(['can:store_user_role'])
      .where('id', /^[0-9]+$/);
  })
    .middleware(['auth', 'is:admin'])
    .prefix('admin');
}).namespace('App/Modules/User/Controllers/Http');
