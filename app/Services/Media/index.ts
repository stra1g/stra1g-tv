import { container } from 'tsyringe';
import { MediaDriver } from '../../../providers/MediaDriver';
import { PreConnectEvent } from './events/PreConnectEvent';

const mediaDriverInstance = MediaDriver.getInstance();

mediaDriverInstance.run();

const preConnectEvent = container.resolve(PreConnectEvent);

mediaDriverInstance.on('preConnect', (id: string, streamPath: any, args: object) => {
  preConnectEvent.execute(id, streamPath, args);
});

export { mediaDriverInstance };
