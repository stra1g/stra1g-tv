import Route from '@ioc:Adonis/Core/Route';

// import UsersController from 'App/Modules/User/Controllers/Http/User/UsersController';

Route.group(() => {
  Route.post('users', 'User/UsersController.store').middleware([]);
}).namespace('App/Modules/User/Controllers/Http');
