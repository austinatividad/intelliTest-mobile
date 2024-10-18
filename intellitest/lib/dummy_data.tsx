const dummy = [
    {
        id: 0,
        examName: "MOBDEVE - Data Driven Views",
        examStatus: "Completed"
    },

    {
        id: 1,
        examName: "CSOPESY - Process Scheduling",
        examStatus: "Not Yet Answered"
    },

    {
        id: 2,
        examName: "MOBDEVE - Android Development",
        examStatus: "70/70 - Attempt 1"
    }
];

type ItemData = {
    id: number;
    examName: string;
    examStatus: string;
};
export {dummy, ItemData};