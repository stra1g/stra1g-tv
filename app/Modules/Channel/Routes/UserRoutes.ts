import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  /**
   * Public Routes
   */
  Route.group(() => {});

  /**
   * User routes
   */
  Route.group(() => {
    Route.post('channels', 'User/ChannelsController.store');
  }).middleware('auth');
}).namespace('App/Modules/Channel/Controllers/Http');
