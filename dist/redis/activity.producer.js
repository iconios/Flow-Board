import { activityQueue } from "./activity.queue.js";
export const produceActivity = async (activityData) => {
    try {
        console.log(`Producing activity log for user: ${activityData.userId}, activity type: ${activityData.activityType}`);
        await activityQueue.add("activityJob", activityData, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        });
    }
    catch (error) {
        console.error("Error producing activity log", error);
    }
};
//# sourceMappingURL=activity.producer.js.map