import mediaConfig from 'Config/media';
import NodeMediaServer from 'node-media-server';

interface MediaServerContract {
  run(): void;
  on(eventName: string, listener: (id: string, StreamPath: string, args: object) => void): void;
  stop(): void;
  getSession(id: string): Map<string, unknown>;
}

export class MediaServer implements MediaServerContract {
  private mediaServer: NodeMediaServer;

  constructor() {
    this.mediaServer = new NodeMediaServer(mediaConfig);
  }

  public run(): void {
    this.mediaServer.run();
  }

  public on(
    eventName: string,
    listener: (id: string, StreamPath: string, args: object) => void
  ): void {
    this.mediaServer.on(eventName, listener);
  }

  public stop(): void {
    this.mediaServer.stop();
  }

  public getSession(id: string): Map<string, unknown> {
    const session = this.mediaServer.getSession(id);

    return session;
  }
}
