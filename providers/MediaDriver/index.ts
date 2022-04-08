import mediaConfig from 'Config/media';
import NodeMediaServer from 'node-media-server';

export interface MediaDriverContract {
  run(): void;
  on(eventName: string, listener: (id: string, StreamPath: any, args: object) => void): void;
  stop(): void;
  getSession(id: string): Map<string, unknown>;
}

export class MediaDriver implements MediaDriverContract {
  private nodeMediaServer: NodeMediaServer;
  private static instance: MediaDriver;

  constructor() {
    this.nodeMediaServer = new NodeMediaServer(mediaConfig);
  }

  public static getInstance(): MediaDriver {
    if (!MediaDriver.instance) {
      MediaDriver.instance = new MediaDriver();
    }

    return MediaDriver.instance;
  }

  public run(): void {
    this.nodeMediaServer.run();
  }

  public on(
    eventName: string,
    listener: (id: string, StreamPath: any, args: object) => void
  ): void {
    this.nodeMediaServer.on(eventName, listener);
  }

  public stop(): void {
    this.nodeMediaServer.stop();
  }

  public getSession(id: string): any {
    const session = this.nodeMediaServer.getSession(id);

    return session;
  }
}
