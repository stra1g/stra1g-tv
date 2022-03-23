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

    Route.get(
      'channels/:id/user/roles',
      'User/ChannelRolesController.listUserChannelRoles'
    ).middleware('channelRole:owner');
    Route.post(
      'channels/user/roles',
      'User/ChannelRolesController.storeUserChannelRole'
    ).middleware('channelRole:owner');

    Route.post('streamings', 'User/StreamingsController.store').middleware('channelRole:owner');
    Route.patch('streamings/:id/finish', 'User/StreamingsController.finishStreaming');
  }).middleware('auth');
}).namespace('App/Modules/Channel/Controllers/Http');
