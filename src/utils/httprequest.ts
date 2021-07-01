const request = require('request');

import { PlatformConfig, Logger } from 'homebridge';

export class HttpRequest {

  readonly urlStatus = 'https://hoz3.com/restful/support/hubs/{HubId}';
  readonly urlWaterNow = 'https://hoz3.com/restful/support/hubs/{HubId}/controllers/actions/waterNow';
  readonly urlstopWatering = 'https://hoz3.com/restful/support/hubs/{HubId}/controllers/actions/stopWatering';

  constructor(
    public readonly config: PlatformConfig,
    public readonly log: Logger,
  ) {}

  createInstance() {
    return {};
  }

  Status(hubId: string) {
    return new Promise((resolve, reject) => {

      request(
        {
          url: this.urlStatus.replace('{HubId}', hubId),
          method: 'GET',
          json: true,
        }, (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        });
    });
  }

  WaterNow(hubId: string, controlerId: number, duration: number) {
    return new Promise((resolve, reject) => {
      request(
        {
          url: this.urlWaterNow.replace('{HubId}', hubId),
          method: 'POST',
          body: {
            'controllerIDs':[controlerId, controlerId],
            'duration':duration,
          },
          json: true,
        }, (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        });
    });
  }

  StopWatering(hubId: string, controlerId: number) {
    return new Promise((resolve, reject) => {
      request(
        {
          url: this.urlstopWatering.replace('{HubId}', hubId),
          method: 'POST',
          body: {
            'controllerIDs':[controlerId, controlerId],
          },
          json: true,
        }, (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        });
    });
  }
}