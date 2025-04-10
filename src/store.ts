import {CustomReport, CustomReportType, ReportsType, ReportType} from "./schemas/csp-violations.js";
import {Dictionaries} from "./utils/Dictionaries.js";
import {
    SimplifiedReport,
    SimplifiedReportIdentifierKeys,
    SimplifiedReportKeys,
} from "./reports/simplified-report.js";
import {getSimplifiedReportKey, toSimplifiedReport} from "./utils/csp-violation.utils.js";

const HOUR = 60 * 60 * 1000;

export class CspStore {

    private baseTime: number;

    private lightWeightReports: Map<string, Array<any>>
        = new Map();

    private readonly dictionaries: Dictionaries<typeof SimplifiedReportKeys, typeof SimplifiedReportIdentifierKeys, SimplifiedReport>;

    constructor() {
        this.dictionaries = new Dictionaries(
            SimplifiedReportKeys, SimplifiedReportIdentifierKeys
        );
        this.baseTime = Math.round(Date.now() / (24 * HOUR));
    }

    public clear() {
        this.lightWeightReports.clear();
        this.dictionaries.clear();
    }

    public addReport(reports: ReportsType): void {
        ['enforce', 'dispose'].forEach(diposition => {
                const report = reports[diposition];
                const policy = report.policy;
                const time = Math.round(Date.now() / (24 * HOUR)) - this.baseTime;
                report.reports.map(r => {
                    const simplifiedReport: SimplifiedReport = toSimplifiedReport(r, policy, time);
                    const dictReport = this.dictionaries.getLightWeightObject(simplifiedReport);
                    const key = getSimplifiedReportKey(dictReport);
                    this.lightWeightReports.set(key, dictReport)
                })
            }
        )

    }

    public getRevivedReport() {
        const reports: SimplifiedReport[] = [];
        for (let report of this.lightWeightReports.values()) {
            reports.push(this.dictionaries.reviveLightWeightObject(report));
        }
        return {reports};
    }

    public getLightWeightReports() {
        return {
            baseTime: this.baseTime,
            dict: this.dictionaries.getDictionary(),
            reports: Array.from(this.lightWeightReports.values()),
        };
    }
}
