const MS_PER_DAY = 1000 * 60 * 60 * 24;

const toUtcMidnight = (d: Date) =>
    new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

export const today = (now = new Date()) =>
    toUtcMidnight(now).toISOString().slice(0, 10);

export const daysUntil = (target: string, now = new Date()) => {
    const targetDate = new Date(target);

    // A date that doesn't exist, such as 2024-02-31, rolls over into the next
    // month, so check that it converts back to the same string
    if (
        Number.isNaN(targetDate.getTime()) ||
        targetDate.toISOString().slice(0, 10) !== target
    )
        throw new RangeError(`Invalid date: ${target}`);

    return (targetDate.getTime() - toUtcMidnight(now).getTime()) / MS_PER_DAY;
};
