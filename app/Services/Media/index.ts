import { MediaDriver } from '../../../providers/MediaDriver';

const mediaDriverInstance = MediaDriver.getInstance();

mediaDriverInstance.run();

mediaDriverInstance.on('preConnect', (id: string, args: string) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
  mediaDriverInstance.getSession(id);
});

export { mediaDriverInstance };
