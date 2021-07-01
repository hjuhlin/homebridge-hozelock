import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { ObjectResult } from './types/ObjectResult';
import { HttpRequest } from './utils/httprequest';
import { ValveAccessory } from './accessories/ValveAccessory';

export class HozelockHomebridgePlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  public readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.debug('Finished initializing platform:', this.config.name);

    this.api.on('didFinishLaunching', () => {
      log.debug('Executed didFinishLaunching callback');
      this.discoverDevices();
    });

    setInterval(() => {
      this.updateDeviceStatus();
    }, (this.config['UpdateTime'] as number) * 1000);
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);

    this.accessories.push(accessory);
  }

  updateDeviceStatus() {
    const httpRequest = new HttpRequest(this.config, this.log);

    httpRequest.Status((this.config['HubId'] as string)).then((results)=> {

      if (results!==undefined) {
        const device = <ObjectResult>results;

        const controller = device.hub.controllers[0];

        const valveObject = this.getAccessory(device, 'valve');
        const valveService = valveObject.accessory.getService(this.Service.Valve);

        if (valveService!==undefined) {
          if (this.config['Debug'] as boolean) {
            this.log.info('Update isWatering for ' + device.hub.name + ': '+controller.isWatering);

            valveService.updateCharacteristic(this.Characteristic.InUse, controller.isWatering);
          }

          // if (controller.currentWateringEvent!==null) {
          //   valveService.updateCharacteristic(this.Characteristic.Active, true);

          //   if (this.config['Debug'] as boolean) {
          //     this.log.info('Update isActive for ' + device.hub.name + ': '+true);
          //   }
          // } else {
          valveService.updateCharacteristic(this.Characteristic.Active, controller.hasWaterNowEvent);

          if (this.config['Debug'] as boolean) {
            this.log.info('Update isActive for ' + device.hub.name + ': '+controller.hasWaterNowEvent);
          }
          // }
        }
      }
    });
  }

  discoverDevices() {
    const httpRequest = new HttpRequest(this.config, this.log);

    httpRequest.Status((this.config['HubId'] as string)).then((results)=> {

      if (results!==undefined) {
        const device = <ObjectResult>results;
        const valveObject = this.getAccessory(device, 'valve');

        new ValveAccessory(this, valveObject.accessory, device, this.config, this.log, 'valve');
        this.addOrRestorAccessory(valveObject.accessory, device.hub.hubID, 'valve', valveObject.exists);
      } else {
        this.log.error('Error getting data!');
      }
    }).catch((error) => {
      this.log.error(error);
    });
  }

  public getAccessory(device: ObjectResult, type: string) {
    const existingAccessory = this.accessories.find(accessory => accessory.UUID === this.localIdForType(device, type));

    if (existingAccessory!==undefined) {
      existingAccessory.displayName = device.hub.hubID;

      return {accessory : existingAccessory, exists : true};
    }

    const accessory = new this.api.platformAccessory(device.hub.hubID, this.localIdForType(device, type));
    accessory.context.device = device;

    return {accessory : accessory, exists : false};
  }

  public addOrRestorAccessory(accessory: PlatformAccessory<Record<string, unknown>>, name: string, type: string, exists: boolean ) {
    if (exists) {
      this.log.info('Restoring existing accessory:', name +' ('+type+')');
      this.api.updatePlatformAccessories([accessory]);
    } else {
      this.log.info('Adding new accessory:', name +' ('+type+')');
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    }
  }

  localIdForType(device:ObjectResult, type:string):string {
    return this.api.hap.uuid.generate(device.hub.hubID.toString()+'_'+type);
  }

}
