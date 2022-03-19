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
    Route.put('channels/:id', 'User/ChannelsController.update');

    Route.post('streamings', 'User/StreamingsController.store');
    Route.patch('streamings/:id/finish', 'User/StreamingsController.finishStreaming');
  }).middleware('auth');
}).namespace('App/Modules/Channel/Controllers/Http');
