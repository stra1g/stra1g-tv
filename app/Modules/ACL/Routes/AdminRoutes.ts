import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.group(() => {
    Route.post('roles', 'Admin/RolesController.store').middleware(['can:store_role']);

    Route.post('permissions', 'Admin/PermissionsController.store').middleware([
      'can:store_permission',
    ]);
  }).middleware('auth');
}).namespace('App/Modules/ACL/Controllers/Http');
