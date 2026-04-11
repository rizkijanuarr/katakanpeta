export class DateUtil {
    public static DATE_PATTERN_1 = "dd-MM-yyyy";
    public static DATE_PATTERN_2 = "yyyy-MM-dd";
    public static DATE_PATTERN_3 = "yyyy-MM";
    public static DATE_PATTERN_4 = "dd MMMM";
    public static DATE_PATTERN_5 = "dd MMM yyyy";
    public static DATE_PATTERN_6 = "EEEE, dd MM yyyy";
    public static DATE_PATTERN_7 = "EEE, dd MMM yyyy";
    public static DATE_PATTERN_8 = "dd/MM/yyyy";
    public static DATE_PATTERN_9 = "MMMM yyyy";
    public static DATE_PATTERN_10 = "yyyy";

    public static TIME_PATTERN_1 = "HH:mm";
    public static TIME_PATTERN_2 = "HH:mm:ss";
    public static TIME_PATTERN_3 = "hh:mm a";
    public static TIME_PATTERN_4 = "HH:mm:ss z";
    public static TIME_PATTERN_5 = "HH:mm:ss Z";
    public static TIME_PATTERN_6 = "HH:mm:ss.SSS";

    private static UTC_OFFSET_IN_HOURS = 7;

    private static convertUTCToWIB(date: Date): Date {
        const offsetMs = DateUtil.UTC_OFFSET_IN_HOURS * 60 * 60 * 1000;
        return new Date(date.getTime() + offsetMs);
    }

    public static convertDateToString(date: Date | null, pattern: string): string | null {
        if (!date) return null;

        const wibDate = this.convertUTCToWIB(date);

        const year = wibDate.getUTCFullYear().toString();
        const month = String(wibDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(wibDate.getUTCDate()).padStart(2, '0');
        const hours = String(wibDate.getUTCHours()).padStart(2, '0');
        const minutes = String(wibDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(wibDate.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(wibDate.getUTCMilliseconds()).padStart(3, '0');

        const options = { timeZone: 'Asia/Jakarta' as const };
        const shortDayName = wibDate.toLocaleDateString('id-ID', { weekday: 'short', ...options });
        const longDayName = wibDate.toLocaleDateString('id-ID', { weekday: 'long', ...options });
        const shortMonth = wibDate.toLocaleDateString('id-ID', { month: 'short', ...options });
        const longMonth = wibDate.toLocaleDateString('id-ID', { month: 'long', ...options });

        let result = pattern;

        result = result.replace(/yyyy/g, year);
        result = result.replace(/MM/g, month);
        result = result.replace(/dd/g, day);
        result = result.replace(/HH/g, hours);
        result = result.replace(/mm/g, minutes);
        result = result.replace(/ss/g, seconds);
        result = result.replace(/SSS/g, milliseconds);
        result = result.replace(/EEEE/g, longDayName);
        result = result.replace(/EEE/g, shortDayName);
        result = result.replace(/MMMM/g, longMonth);
        result = result.replace(/MMM/g, shortMonth);

        if (result.includes('a')) {
            const h = wibDate.getUTCHours();
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = String(h % 12 || 12).padStart(2, '0');
            result = result.replace(/hh/g, h12);
            result = result.replace(/a/g, ampm);
        }

        result = result.replace(/z/g, 'WIB');
        result = result.replace(/Z/g, '+0700');

        return result;
    }

    public static formatShortDate(date: Date | null): string | null {
        return this.convertDateToString(date, this.DATE_PATTERN_1);
    }

    public static formatLongDateTime(date: Date | null): string | null {
        return this.convertDateToString(date, this.DATE_PATTERN_6);
    }

    public static formatWithTime(date: Date | null): string | null {
        return this.convertDateToString(date, `${this.DATE_PATTERN_2} ${this.TIME_PATTERN_1}`);
    }

    public static format(input: string | Date | null, pattern: string = this.DATE_PATTERN_8): string {
        if (!input) return "";
        const date = input instanceof Date ? input : new Date(input);
        return this.convertDateToString(date, pattern) || "";
    }
}
