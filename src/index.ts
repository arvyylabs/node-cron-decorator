import * as path from "path";
import { CronManager, ICronJob } from "./CronManager";
import { MetadataArgsStorage } from "./metadata-builder/MetadataArgsStorage";

export * from "./container";
export * from "./decorators/Schedule";
export * from "./type/IScheduledTask";

function importClassesFromDirectories(directories: string[], formats = [".js", ".ts"]): Function[] {
    const loadFileClasses = function(exported: any, allLoaded: Function[]) {
        if (exported instanceof Function) {
            allLoaded.push(exported);
        } else if (exported instanceof Array) {
            exported.forEach((i: any) => loadFileClasses(i, allLoaded));
        } else if (exported instanceof Object || typeof exported === "object") {
            Object.keys(exported).forEach(key => loadFileClasses(exported[key], allLoaded));
        }

        return allLoaded;
    };

    const allFiles = directories.reduce((allDirs, dir) => {
        return allDirs.concat(require("glob").sync(path.normalize(dir)));
    }, [] as string[]);

    const dirs = allFiles
        .filter(file => {
            const dtsExtension = file.substring(file.length - 5, file.length);
            return formats.indexOf(path.extname(file)) !== -1 && dtsExtension !== ".d.ts";
        })
        .map(file => {
            return require(file);
        });

    return loadFileClasses(dirs, []);
}

export function registerTask(jobs: Function[] | string[]): void {
    let jobClasses: Function[];
    if (jobs && jobs.length) {
        jobClasses = (jobs as any[]).filter(schedule => schedule instanceof Function);
        const handlerDirs = (jobs as any[]).filter(controller => typeof controller === "string");
        jobClasses.push(...importClassesFromDirectories(handlerDirs));
        CronManager.registerScheduledTasks(jobClasses);
    }
}

export function startCron(name: string): boolean {
    return CronManager.startTask(name);
}

export function stopCron(name: string): boolean {
    return CronManager.stopTask(name);
}

export function getCron(name: string): ICronJob | undefined {
    return CronManager.getScheduledTask(name);
}

export function getCrons(): Map<string, ICronJob> {
    return CronManager.getScheduledTasks();
}

export function getMetadataArgsStorage(): MetadataArgsStorage {
    if (!(global as any).cronControllerMetadataArgsStorage) (global as any).cronControllerMetadataArgsStorage = new MetadataArgsStorage();

    return (global as any).cronControllerMetadataArgsStorage;
}
