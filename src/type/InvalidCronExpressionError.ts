class InvalidCronExpressionError extends Error {
    constructor(expression: string) {
        super(`Invalid Cron expression: ${expression}`);
    }
}
