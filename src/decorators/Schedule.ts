import { ScheduleOptions } from "node-cron";
import { getMetadataArgsStorage } from "../index";

export function Schedule(
    name: string,
    cronExpression: string,
    options: ScheduleOptions = {
        scheduled: true,
    }
): ClassDecorator {
    return (target: Function) => {
        getMetadataArgsStorage().addScheduleMetadata({
            target: target,
            name,
            cronExpression,
            options,
        });
    };
}
