import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.post('users', 'User/UsersController.store').middleware([]);

  Route.post('sessions', 'User/SessionController.store');
}).namespace('App/Modules/User/Controllers/Http');
