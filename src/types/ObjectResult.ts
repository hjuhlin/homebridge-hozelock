
export interface Location {
        city: string;
        country: string;
        localTime: number;
        timezone: string;
    }

export interface WateringEvent {
        startTime: number;
        endTime: number;
        duration: number;
        enabled: boolean;
    }

export interface Monday {
        dayOfWeek: string;
        wateringEvents: WateringEvent[];
    }

export interface WateringEvent2 {
        startTime: number;
        endTime: number;
        duration: number;
        enabled: boolean;
    }

export interface Thursday {
        dayOfWeek: string;
        wateringEvents: WateringEvent2[];
    }

export interface WateringEvent3 {
        startTime: number;
        endTime: number;
        duration: number;
        enabled: boolean;
    }

export interface Friday {
        dayOfWeek: string;
        wateringEvents: WateringEvent3[];
    }

export interface WateringEvent4 {
        startTime: number;
        endTime: number;
        duration: number;
        enabled: boolean;
    }

export interface Sunday {
        dayOfWeek: string;
        wateringEvents: WateringEvent4[];
    }

export interface WateringEvent5 {
        startTime: number;
        endTime: number;
        duration: number;
        enabled: boolean;
    }

export interface Wednesday {
        dayOfWeek: string;
        wateringEvents: WateringEvent5[];
    }

export interface WateringEvent6 {
        startTime: number;
        endTime: number;
        duration: number;
        enabled: boolean;
    }

export interface Tuesday {
        dayOfWeek: string;
        wateringEvents: WateringEvent6[];
    }

export interface WateringEvent7 {
        startTime: number;
        endTime: number;
        duration: number;
        enabled: boolean;
    }

export interface Saturday {
        dayOfWeek: string;
        wateringEvents: WateringEvent7[];
    }

export interface ScheduleDays {
        Monday: Monday;
        Thursday: Thursday;
        Friday: Friday;
        Sunday: Sunday;
        Wednesday: Wednesday;
        Tuesday: Tuesday;
        Saturday: Saturday;
    }

export interface Schedule {
        scheduleID: string;
        name: string;
        description?: any;
        scheduleDays: ScheduleDays;
    }

export interface WaterNowEvent {
        startTime: number;
        endTime: number;
        duration: number;
    }

export interface NextWateringEvent {
        startTime: number;
        endTime: number;
        duration: number;
    }

export interface Controller {
        name: string;
        image?: any;
        controllerID: string;
        scheduleID?: any;
        schedule?: any;
        hasWaterNowEvent: boolean;
        pause?: any;
        adjustment?: any;
        waterNowEvent: WaterNowEvent;
        currentWateringEvent?: any;
        nextWateringEvent: NextWateringEvent;
        lastCommunicationWithServer: number;
        nextCommunicationWithServer: number;
        batteryStatus: string;
        signalStrength: string;
        overrideScheduleDuration?: any;
        isChildlockEnabled: boolean;
        isWatering: boolean;
        isPanelRemoved: boolean;
        isScheduleUpToDate: boolean;
        isPaused: boolean;
        isTested: boolean;
        isAdjusted: boolean;
    }

export interface Hub {
        hubID: string;
        name: string;
        mode: string;
        location: Location;
        schedules: Schedule[];
        controllers: Controller[];
        inPairingMode: boolean;
        lastServerContactDate: number;
        hubResetRequired: boolean;
        controllerResetRequired: boolean;
        isUresponsive: boolean;
    }

export interface ObjectResult {
        errorCode: number;
        hub: Hub;
    }
