import {HttpClient} from '@airyhq/http-client';

export const HttpClientInstance = new HttpClient('http://airy.core', (error: Error, loginUrl: any) => {
  console.error(error);
//   if (location.href != loginUrl) {
//     location.replace(loginUrl);
//   }
});


