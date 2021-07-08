import {API, Characteristic, CharacteristicProps, Formats, Perms, WithUUID} from 'homebridge';

export class CustomCharacteristic {

  private api: API;
  public characteristic: { [key: string]: WithUUID< { new(): Characteristic }> } = {};

  constructor(api: API) {
    this.api = api;

    this.createCharacteristics('KeepInFastMood', 'dde98727-23b9-486b-81c1-92179d9c77bf', {
      format: Formats.BOOL,
      description: 'Keep in fast mood',
      perms: [Perms.NOTIFY, Perms.PAIRED_READ, Perms.PAIRED_WRITE],
    }, 'Keep in fast mood');
  }

  private createCharacteristics(key: string, uuid: string, props: CharacteristicProps, displayName: string = key) {
    this.characteristic[key] = class extends this.api.hap.Characteristic {
      static readonly UUID: string = uuid;

      constructor() {
        super(displayName, uuid, props);
        this.value = this.getDefaultValue();
      }
    };
  }
}