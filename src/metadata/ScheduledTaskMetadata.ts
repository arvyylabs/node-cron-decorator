import { getFromContainer } from "../container";
import { IScheduledTaskMetadataArgs } from "./IScheduledTaskMetadataArgs";
import { ScheduleOptions } from "node-cron";

export class ScheduledTaskMetadata {
    target: Function;

    name: string;

    cronExpression: string;

    options: ScheduleOptions;

    constructor(args: IScheduledTaskMetadataArgs) {
        this.target = args.target;
        this.name = args.name;
        this.options = args.options;
        this.cronExpression = args.cronExpression;
    }

    get instance(): any {
        return getFromContainer(this.target);
    }
}
