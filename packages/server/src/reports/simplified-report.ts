export const SimplifiedReportIdentifierKeys =  ['blockedUrl', 'origin', 'path', 'directive', 'policy'] as const
export const SimplifiedReportKeys = [...SimplifiedReportIdentifierKeys, 'lastSeen'] as const;
const NumberKeys = ['lastSeen'] as const;

export type SimplifiedReport = {
    [K in typeof SimplifiedReportKeys[number]]: K extends typeof NumberKeys[number] ? number : string;
}

