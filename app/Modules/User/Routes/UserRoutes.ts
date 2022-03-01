import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  /**
   * Public Routes
   */
  Route.group(() => {
    Route.post('users', 'User/UsersController.store').middleware([]);

    Route.post('sessions', 'User/SessionController.store');

    Route.post('refresh_token', 'User/SessionController.refreshToken');

    Route.post('password/forgot', 'User/ForgotPasswordController.store');

    Route.post('password/reset', 'User/ForgotPasswordController.resetPassword');
  });

  /**
   * User routes
   */
  Route.group(() => {
    Route.get('users/:id', 'User/UsersController.show');
  }).middleware('auth');
}).namespace('App/Modules/User/Controllers/Http');
