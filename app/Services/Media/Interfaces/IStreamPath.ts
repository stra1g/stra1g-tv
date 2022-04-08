export interface StreamPath {
  app: string;
  type?: string;
  supportsGoAway?: boolean;
  flashVer?: string;
  swfUrl?: string;
  tcUrl?: string;
  query?: {
    [key: string]: string;
  };
}
