import { Schedule } from "../../lib/decorators/Schedule";
import { IScheduledTask } from "../../lib/type/IScheduledTask";

@Schedule("SampleJob", "* * * * * *")
export class SampleJob implements IScheduledTask {
    public execute(): void {
        console.log("running a task every minute");
    }
}
