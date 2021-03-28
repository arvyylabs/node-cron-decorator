import { ScheduleOptions } from "node-cron";

export interface IScheduledTaskMetadataArgs {
    name: string;
    target: Function;
    cronExpression: string;
    options: ScheduleOptions;
}
