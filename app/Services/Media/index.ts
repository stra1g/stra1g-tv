import { container } from 'tsyringe';
import { MediaDriver } from '../../../providers/MediaDriver';
import { DonePublishEvent } from './events/DonePublishEvent';
import { PreConnectEvent } from './events/PreConnectEvent';

const mediaDriverInstance = MediaDriver.getInstance();

mediaDriverInstance.run();

const preConnectEvent = container.resolve(PreConnectEvent);
const donePublishEvent = container.resolve(DonePublishEvent);

mediaDriverInstance.on('preConnect', (id: string, streamPath: any, args: object) => {
  preConnectEvent.execute(id, streamPath, args);
});

mediaDriverInstance.on('donePublish', (id: string, streamPath: any, args: object) => {
  donePublishEvent.execute(id, streamPath, args);
});

export { mediaDriverInstance };
