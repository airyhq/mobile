import {HttpClient} from '@airyhq/http-client';

export const HttpClientInstance = new HttpClient(
  'http://airy.core',
  (error: Error) => {
    console.error(error);
    //   if (location.href != loginUrl) {
    //     location.replace(loginUrl);
    //   }
  },
);
