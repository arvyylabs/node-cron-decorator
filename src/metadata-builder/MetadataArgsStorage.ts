import { IScheduledTaskMetadataArgs } from "../metadata/IScheduledTaskMetadataArgs";

export class MetadataArgsStorage {
    private scheduledTasks: IScheduledTaskMetadataArgs[] = [];

    get scheduledTaskMetadata(): IScheduledTaskMetadataArgs[] {
        return this.scheduledTasks;
    }

    public addScheduleMetadata(metadata: IScheduledTaskMetadataArgs): void {
        if (this.scheduledTasks.filter(c => c.name === metadata.name).length <= 0) {
            this.scheduledTasks.push(metadata);
        } else {
            console.warn(`Schedule '${metadata.name}' could not be mounted, a schedule job with the same name already exists.`);
        }
    }

    public filterSchedulerTasksWithTarget(classes: Function[]): IScheduledTaskMetadataArgs[] {
        return this.scheduledTasks.filter(ctrl => {
            return classes.filter(cls => ctrl.target === cls).length > 0;
        });
    }

    public reset(): void {
        this.scheduledTasks = [];
    }
}
