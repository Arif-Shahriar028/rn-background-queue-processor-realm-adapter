import realmdb from '../realmConfig';
import JobSchema from '../src/local-db/JobSchema';
import FailedJobSchema from '../src/local-db/FailedJobSchema';

/**
 * RealmAdapter class
 */
export default class RealmAdapter {
    /**
     * RealmAdapter constructor
     * @param jobPrototype
     */
    constructor(jobPrototype) {
        this.jobPrototype = jobPrototype
    }

    /**
     * get job instance
     *
     * @returns {any}
     */
    getJobInstance(data) {
        const object = Object.create(this.jobPrototype).constructor;
        return new object({
            id: data[0].id,
            name: data[0].name,
            param: data[0].param,
            priority: data[0].priority,
        });
    }
    /**
     * Method to get all items
     * @returns {[]|*[]}
     */
    getAllItems() {
        return realmdb.objects(JobSchema.NAME);
    }

    /**
     * remove topmost element
     *
     * @param jobId jib id to remove from db
     */
    remove(jobId) {
        const object = realmdb
            .objects(JobSchema.NAME)
            .filtered(`${JobSchema.COLUMN_ID} = '${jobId}'`);
        if (object) {
            realmdb.write(() => {
                realmdb.delete(object);
            });
        }
    }

    /**
     * Method to get top element
     * @returns {*}
     */
    getTopItem() {
        const sortedObject = realmdb
            .objects(JobSchema.NAME)
            .sorted(JobSchema.COLUMN_PRIORITY);
        const job = sortedObject.slice(0, 1);
        return this.getJobInstance(job);
    }

    /**
     * Method to get length
     * @returns {*}
     */
    getLength() {
        return realmdb.objects(JobSchema.NAME).length;
    }

    /**
     * Method to add failed item
     * @param item
     */
    addFailedItem(item) {
        const {job} = item;
        const {id} = job;
        const {name} = job;
        const param = JSON.stringify(job.param);
        const {priority} = job;
        const jobToBeCreated = {
            [FailedJobSchema.COLUMN_ID]: id,
            [FailedJobSchema.COLUMN_NAME]: name,
            [FailedJobSchema.COLUMN_PARAM]: param,
            [FailedJobSchema.COLUMN_PRIORITY]: priority,
        };
        realmdb.write(() => {
            realmdb.create(FailedJobSchema.NAME, jobToBeCreated);
        });
    }

    /**
     * Method to add item
     * @param item
     */
    addItem(item) {
        const {job} = item;
        const {id} = job;
        const {name} = job;
        const param = JSON.stringify(job.param);
        const {priority} = job;
        const jobToBeCreated = {
            [JobSchema.COLUMN_ID]: id,
            [JobSchema.COLUMN_NAME]: name,
            [JobSchema.COLUMN_PARAM]: param,
            [JobSchema.COLUMN_PRIORITY]: priority,
        };
        realmdb.write(() => {
            realmdb.create(JobSchema.NAME, jobToBeCreated);
        });
    }
}
