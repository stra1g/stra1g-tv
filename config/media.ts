import Env from '@ioc:Adonis/Core/Env';

type AuthConfig = {
  play?: boolean;
  publish?: boolean;
  secret?: string;
};

type TransConfig = {
  ffmpeg: string;
  tasks: [TransTaskConfig];
};

type RelayConfig = {
  tasks: [RelayTaskConfig];
  ffmpeg: string;
};

type FissionConfig = {
  ffmpeg: string;
  tasks: [FissionTaskConfig];
};

type TransTaskConfig = {
  app: string;
  hls?: boolean;
  hlsFlags?: string;
  dash?: true;
  dashFlags?: string;
  vc?: string;
  vcParam?: [string];
  ac?: string;
  acParam?: [string];
  rtmp?: boolean;
  rtmpApp?: string;
  mp4?: boolean;
  mp4Flags?: string;
};

type RelayTaskConfig = {
  app: string;
  name?: string;
  mode: string;
  edge: string;
  rtsp_transport?: string;
};

type FissionTaskConfig = {
  rule: string;
  model: [FissionTaskModel];
};

type FissionTaskModel = {
  ab: string;
  vb: string;
  vs: string;
  vf: string;
};

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
  logType?: number;
  rtmp?: RtmpConfig;
  http?: HttpConfig;
  https?: SslConfig;
  trans?: TransConfig;
  relay?: RelayConfig;
  fission?: FissionConfig;
  auth?: AuthConfig;
};

const mediaConfig: MediaConfig = {
  logType: 3,
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
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        mp4: true,
        mp4Flags: '[movflags=frag_keyframe+empty_moov]',
      },
    ],
  },
};

export default mediaConfig;
