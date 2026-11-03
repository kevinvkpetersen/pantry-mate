import { daysUntil, today } from './dates';

describe('today', () => {
    it('formats the date as YYYY-MM-DD, zero-padded', () => {
        expect(today(new Date(2024, 0, 5))).toBe('2024-01-05');
    });

    it('uses the local date, not the UTC date', () => {
        expect(today(new Date(2024, 11, 31, 23, 59))).toBe('2024-12-31');
        expect(today(new Date(2025, 0, 1, 0, 1))).toBe('2025-01-01');
    });

    it('defaults to the current date', () => {
        jest.useFakeTimers({ now: new Date(2024, 5, 15, 12) });
        expect(today()).toBe('2024-06-15');
    });
});

describe('daysUntil', () => {
    const now = new Date(2024, 5, 15, 12);

    it('returns 0 for today', () => {
        expect(daysUntil('2024-06-15', now)).toBe(0);
    });

    it('counts days into the future', () => {
        expect(daysUntil('2024-06-16', now)).toBe(1);
        expect(daysUntil('2024-06-22', now)).toBe(7);
    });

    it('returns negative days for past dates', () => {
        expect(daysUntil('2024-06-14', now)).toBe(-1);
    });

    it('ignores the time of day', () => {
        expect(daysUntil('2024-06-16', new Date(2024, 5, 15, 23, 59))).toBe(1);
        expect(daysUntil('2024-06-16', new Date(2024, 5, 15, 0, 1))).toBe(1);
    });

    it('counts across month and year boundaries', () => {
        expect(daysUntil('2024-07-01', new Date(2024, 5, 30))).toBe(1);
        expect(daysUntil('2025-01-01', new Date(2024, 11, 31))).toBe(1);
        expect(daysUntil('2024-03-01', new Date(2024, 1, 28))).toBe(2);
    });

    it('counts whole days across daylight saving changes', () => {
        expect(daysUntil('2024-03-11', new Date(2024, 2, 9))).toBe(2);
        expect(daysUntil('2024-11-04', new Date(2024, 10, 2))).toBe(2);
    });

    it('defaults to the current date', () => {
        jest.useFakeTimers({ now });
        expect(daysUntil('2024-06-20')).toBe(5);
    });

    it('throws for an invalid date string', () => {
        expect(() => daysUntil('not-a-date', now)).toThrow(
            'Invalid date: not-a-date'
        );
        expect(() => daysUntil('2024-13-01', now)).toThrow(RangeError);
    });
});

afterEach(() => {
    jest.useRealTimers();
});
