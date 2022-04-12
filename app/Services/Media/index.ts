import Env from '@ioc:Adonis/Core/Env';
import { container } from 'tsyringe';

import { MediaDriver } from '../../../providers/MediaDriver';
import { DonePublishEvent } from './events/DonePublishEvent';
import { PrePublishEvent } from './events/PrePublishEvent';

const mediaDriverInstance = MediaDriver.getInstance();

const enviroment = Env.get('NODE_ENV');

if (enviroment !== 'testing') mediaDriverInstance.run();

const prePublishEvent = container.resolve(PrePublishEvent);
const donePublishEvent = container.resolve(DonePublishEvent);

mediaDriverInstance.on('prePublish', (id: string, streamPath: any, args: object) => {
  prePublishEvent.execute(id, streamPath, args);
});

mediaDriverInstance.on('donePublish', (id: string, streamPath: any, args: object) => {
  donePublishEvent.execute(id, streamPath, args);
});

export { mediaDriverInstance };
