import {CustomCspViolation, CustomReportType, CustomViolationType, ReportType} from "../schemas/csp-violations";
import {blockedUrlNonUrlValues, urlProtocolRequiringPath} from "../constants/csp-violations";
import {SimplifiedReport, SimplifiedReportIdentifierKeys} from "../reports/simplified-report";

export function toSimplifiedReport(report: CustomViolationType,
                                   policy: string,
                                   time: number): SimplifiedReport {
    return {
        blockedUrl: transformBlockedUrl(report.blockedURL),
        origin: report.origin,
        path: report.path,
        directive: report.effectiveDirective,
        policy: policy,
        lastSeen: time
    }
}

export function getSimplifiedReportKey(report: Array<any>) {
    return report.filter((val, index) => index < SimplifiedReportIdentifierKeys.length)
        .join('|');
}

function transformBlockedUrl(url: string) {
    if (blockedUrlNonUrlValues.includes(url)) {
        return url;
    }

    try {
        const urlObj = new URL(url);
        if (urlProtocolRequiringPath.includes(urlObj.protocol)) {
            return urlObj.origin + urlObj.pathname;
        } else {
            return urlObj.protocol;
        }
    } catch {
        return url;
    }
}
