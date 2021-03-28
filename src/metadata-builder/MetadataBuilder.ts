import { getMetadataArgsStorage } from "../index";
import { ScheduledTaskMetadata } from "../metadata/ScheduledTaskMetadata";

export class MetadataBuilder {
    public buildScheduledTaskMetadata(classes?: Function[]): ScheduledTaskMetadata[] {
        return this.createScheduledTask(classes);
    }

    private createScheduledTask(classes?: Function[]): ScheduledTaskMetadata[] {
        const scheduledTasks = !classes ? getMetadataArgsStorage().scheduledTaskMetadata : getMetadataArgsStorage().filterSchedulerTasksWithTarget(classes);
        return scheduledTasks.map(controllerArgs => new ScheduledTaskMetadata(controllerArgs));
    }
}
