import {HttpClient} from '@airyhq/http-client';

export const HttpClientInstance = new HttpClient('http://airy.core', (error: any, loginUrl: any) => {
  console.error(error);
//   if (location.href != loginUrl) {
//     location.replace(loginUrl);
//   }
});


