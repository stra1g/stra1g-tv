import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.post('permissions', 'Admin/PermissionsController.store').middleware('auth');
}).namespace('App/Modules/ACL/Controllers/Http');
