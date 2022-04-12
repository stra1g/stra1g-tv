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

    Route.group(() => {
      Route.get('channels/:id/user/roles', 'User/ChannelRolesController.listUserChannelRoles');

      Route.post('channels/user/roles', 'User/ChannelRolesController.storeUserChannelRole');

      Route.put('channels/user/roles', 'User/ChannelRolesController.updateUserChannelRole');

      Route.delete(
        'channels/:id/user/:user_id/roles',
        'User/ChannelRolesController.destroyUserChannelRole'
      );

      Route.get('channels/:id/stream_key', 'User/ChannelsController.getStreamKeyByChannel');
      Route.put('channels/:id/stream_key', 'User/ChannelsController.generateStreamKeyByChannel');
    }).middleware('channelRole:owner');

    Route.post('streamings', 'User/StreamingsController.store').middleware('channelRole:owner');
  }).middleware('auth');
}).namespace('App/Modules/Channel/Controllers/Http');
