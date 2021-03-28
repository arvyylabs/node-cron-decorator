import * as cron from "node-cron";
import { MetadataBuilder } from "./metadata-builder/MetadataBuilder";
import { IScheduledTaskMetadataArgs } from "./metadata/IScheduledTaskMetadataArgs";

export interface ICronJob {
    task: cron.ScheduledTask;
    taskMetadata: IScheduledTaskMetadataArgs;
}

export class CronManager {
    private static scheduledTasks: Map<string, ICronJob> = new Map();

    public static registerScheduledTasks(classes: Function[]): void {
        const tasks = new MetadataBuilder().buildScheduledTaskMetadata(classes);
        tasks.forEach(task => {
            if (!cron.validate(task.cronExpression)) {
                throw new InvalidCronExpressionError(task.cronExpression);
            }

            try {
                const taskMetadata: IScheduledTaskMetadataArgs = {
                    name: task.name,
                    target: task.target,
                    options: task.options,
                    cronExpression: task.cronExpression,
                };

                const scheduledTask = cron.schedule(task.cronExpression, task.instance.execute, task.options);

                this.scheduledTasks.set(task.name, {
                    task: scheduledTask,
                    taskMetadata: taskMetadata,
                });
            } catch (error) {
                console.warn(`Could not initialize task '${task.name}':`, error.message);
            }
        });

        Array.from(this.scheduledTasks.values()).forEach(st => {
            try {
                st.task.start();
            } catch (error) {
                console.warn(`Could not start task '${st.taskMetadata.name}':`, error.message);
            }
        });
    }

    public static startTask(name: string): boolean {
        let result = false;

        const scheduledTask = this.scheduledTasks.get(name);
        if (scheduledTask) {
            try {
                scheduledTask.task.start();
                result = true;
            } catch {}
        }

        return result;
    }

    public static stopTask(name: string): boolean {
        let result = false;

        const scheduledTask = this.scheduledTasks.get(name);
        if (scheduledTask) {
            try {
                scheduledTask.task.stop();
                result = true;
            } catch {}
        }

        return result;
    }

    public static getScheduledTask(name: string): ICronJob | undefined {
        return this.scheduledTasks.get(name);
    }

    public static getScheduledTasks(name?: string): Map<string, ICronJob> {
        return this.scheduledTasks;
    }
}
