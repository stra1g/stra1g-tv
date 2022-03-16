import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  /**
   * Public Routes
   */
  Route.group(() => {
    Route.get('channels/:id', 'User/ChannelsController.show');
  });

  /**
   * User routes
   */
  Route.group(() => {
    Route.post('channels', 'User/ChannelsController.store');
  }).middleware('auth');
}).namespace('App/Modules/Channel/Controllers/Http');
