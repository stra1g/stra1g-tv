import Env from '@ioc:Adonis/Core/Env';

type SslConfig = {
  key: string;
  cert: string;
  port?: number;
};

type RtmpConfig = {
  port?: number;
  ssl?: SslConfig;
  chunk_size?: number;
  gop_cache?: boolean;
  ping?: number;
  ping_timeout?: number;
};

type HttpConfig = {
  mediaroot: string;
  port?: number;
  allow_origin?: string;
};

type MediaConfig = {
  rtmp: RtmpConfig;
  http: HttpConfig;
};

const mediaConfig: MediaConfig = {
  rtmp: {
    port: Env.get('MEDIA_RTMP_PORT'),
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    mediaroot: './media',
    port: Env.get('MEDIA_HTTP_PORT'),
    allow_origin: '*',
  },
};

export default mediaConfig;
