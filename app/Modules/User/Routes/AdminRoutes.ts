import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  /**
   * Admin routes
   */
  Route.group(() => {
    Route.put('users/:id/attach/permissions', 'Admin/UsersController.attachPermissions')
      .middleware(['can:store_user_permissions'])
      .where('id', /^[0-9]+$/);
  })
    .middleware(['auth', 'is:admin'])
    .prefix('admin');
}).namespace('App/Modules/User/Controllers/Http');
