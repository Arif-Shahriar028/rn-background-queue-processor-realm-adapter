/**
 * Job mock class
 */
export default class Job {
    /**
     * Job constructor
     * @constructor
     */
    constructor(dbJob) {
        this.job = dbJob;
        this.job.id = dbJob.id;
        this.job.priority = dbJob.priority
            ? ( (dbJob.priority >= 1 && dbJob.priority <= 10) ? dbJob.priority : 10)
            : 10;
    }
}
