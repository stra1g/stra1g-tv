import { container } from 'tsyringe';
import { MediaDriver } from '../../../providers/MediaDriver';
import { DonePublishEvent } from './events/DonePublishEvent';
import { PrePublishEvent } from './events/PrePublishEvent';

const mediaDriverInstance = MediaDriver.getInstance();

mediaDriverInstance.run();

const prePublishEvent = container.resolve(PrePublishEvent);
const donePublishEvent = container.resolve(DonePublishEvent);

mediaDriverInstance.on('prePublish', (id: string, streamPath: any, args: object) => {
  prePublishEvent.execute(id, streamPath, args);
});

mediaDriverInstance.on('donePublish', (id: string, streamPath: any, args: object) => {
  donePublishEvent.execute(id, streamPath, args);
});

export { mediaDriverInstance };
