import {CustomReport, CustomReportType, ReportsType, ReportType} from "@sym-csp-logger/common";
import {Dictionaries} from "@sym-csp-logger/common";
import {
    SimplifiedReport,
    SimplifiedReportIdentifierKeys,
    SimplifiedReportKeys,
} from "@sym-csp-logger/common";
import {getSimplifiedReportKey, toSimplifiedReport} from "@sym-csp-logger/common";

const HOUR = 60 * 60 * 1000;

export class CspStore {

    private baseTime!: number;

    private lightWeightReports: Map<string, Array<any>>
        = new Map();

    private readonly dictionaries: Dictionaries<typeof SimplifiedReportKeys, typeof SimplifiedReportIdentifierKeys, SimplifiedReport>;

    constructor() {
        this.dictionaries = new Dictionaries(
            SimplifiedReportKeys, SimplifiedReportIdentifierKeys
        );
        this.resetBaseTime();
    }

    public clear() {
        this.lightWeightReports.clear();
        this.dictionaries.clear();
        this.resetBaseTime();
    }

    public addReport(reports: ReportsType): void {
        ['enforce', 'report'].forEach(disposition => {
                const report = reports[disposition] as CustomReportType;
                const policy = report.policy?.replace(/'nonce-(.*)'/g, `'nonce'`) || '';
                const time = Math.round(Date.now() / (24 * HOUR)) - this.baseTime;
                report.reports.forEach(r => {
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

    private resetBaseTime() {
        this.baseTime = Math.round(Date.now() / (24 * HOUR));
    }
}
