import { Service, PlatformAccessory, Logger, PlatformConfig, CharacteristicValue } from 'homebridge';

import { HozelockHomebridgePlatform } from '../platform';
import { ObjectResult } from '../types/ObjectResult';
import { HttpRequest } from '../utils/httprequest';

export class ValveAccessory {
  private service: Service;

  constructor(
    private readonly platform: HozelockHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
    private readonly device: ObjectResult,
    public readonly config: PlatformConfig,
    public readonly log: Logger,
    private readonly SubName: string,
  ) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Hozelock')
      .setCharacteristic(this.platform.Characteristic.Model, 'HozelockCloudController')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, device.hub.hubID);

    this.service = this.accessory.getService(this.platform.Service.Valve) ||
    this.accessory.addService(this.platform.Service.Valve);

    this.service.setCharacteristic(this.platform.Characteristic.Name, device.hub.name);

    this.service.getCharacteristic(this.platform.Characteristic.Active)
      .onSet(this.handleActiveSet.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.InUse);

    this.service.getCharacteristic(this.platform.Characteristic.ValveType)
      .onGet(this.handleValveTypeGet.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.SetDuration).onSet(this.setDuration.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.RemainingDuration).onGet(this.getRemainingDuration.bind(this));

    this.service.addOptionalCharacteristic(this.platform.customCharacteristic.characteristic.KeepInFastMood);
  }

  handleActiveSet(value) {

    const httpRequest = new HttpRequest(this.config, this.log);

    if (value===0) {
      value = false;
    }

    if (value===1) {
      value = true;
    }

    if (value === true) {
      const standardDuration = this.config['StandardDuration'] as number;

      httpRequest.WaterNow(this.accessory.context.device.hub.hubID, 0, standardDuration*60000).then(()=> {
        this.log.debug('Triggered SET Active:', value);
      });
    } else {
      httpRequest.StopWatering(this.accessory.context.device.hub.hubID, 0).then(()=> {
        this.log.debug('Triggered SET Active:', value);
      });
    }
  }

  setDuration(value: CharacteristicValue) {
    const httpRequest = new HttpRequest(this.config, this.log);

    const durarion = value as number;

    httpRequest.WaterNow(this.accessory.context.device.hub.hubID, 0, durarion*60000).then(()=> {
      this.log.debug('Triggered SET Duration:', value);
    });
  }

  getRemainingDuration() {
    return this.config['StandardDuration'] as number;
  }

  handleValveTypeGet() {
    return this.platform.Characteristic.ValveType.IRRIGATION;
  }
}
