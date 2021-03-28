import "reflect-metadata";
import express from "express";
import { useContainer, registerTask, stopCron, startCron, getCrons } from "../lib/index";
import { Container } from "typedi";
import { ICronJob } from "../lib/CronManager";

useContainer(Container);
registerTask([__dirname + "/jobs/**/*.js"]);

const app = express();

app.get("/stop-job/:name", (req, res) => {
    stopCron(req.params.name);
    res.send(`Cron job ${req.params.name} stopped`);
});

app.get("/start-job/:name", (req, res) => {
    startCron(req.params.name);
    res.send(`Cron job ${req.params.name} stared`);
});

app.get("/jobs/:namespace?", (req, res) => {
    const crons: Map<string, ICronJob> = getCrons();

    const response: string[] = [];
    crons.forEach((v, k) => {
        try { 
            response.push(`Cron job '${k}' will run next on`);
        } catch {}
    });

    res.send(response);
});

app.listen(8080);
