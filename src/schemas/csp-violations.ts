import {Static, String, Type} from '@sinclair/typebox'

export const CspViolationReportBody = Type.Object({
    // type or url of the resource that was blocked
    blockedURL: Type.String(),
    // column number of the violation (null if sourceFile is null)
    columnNumber: Type.Optional(Type.Number({default: null})),
    // whether the policy is
    disposition: Type.Union([Type.Literal('enforce'), Type.Literal('report')]),
    // URL of the document or worker in which the violation was found
    documentURL: Type.String(),
    // effective CSP that was violated
    effectiveDirective: Type.String(),
    // line number of the violation (null if sourceFile is null)
    line: Type.Optional(Type.Number()),
    // CSP from HTTP Headers
    originalPolicy: Type.String(),
    // referrer of the resources whose policy was violated
    referrer: Type.String(),
    // first 40 characters of the inline script/style that caused the violation
    sample: Type.String(),
    // url of the script that caused the violation, if not applicable the value is null
    sourceFile: Type.Optional(Type.String()),
    // https status code of the document or worker in which the violation occurred
    statusCode: Type.Number(),
});

export const Report = Type.Object({
   age: Type.Number(),
   body: CspViolationReportBody,
   type: Type.String(),
   url: Type.String(),
   user_agent: Type.String()
});

export const CustomCspViolation = Type.Object({
    // type or url of the resource that was blocked
    blockedURL: Type.String(),
    // whether the policy is
    disposition: Type.Union([Type.Literal('enforce'), Type.Literal('report')]),
    // URL of the document or worker in which the violation was found
    origin: Type.String(),
    path: Type.String(),
    // effective CSP that was violated
    effectiveDirective: Type.String(),
})

export const CustomReport = Type.Object({
    reports: Type.Array(CustomCspViolation),
    policy: Type.String(),
})

export const Reports = Type.Object({
   enforce: CustomReport,
   report: CustomReport,
});

export type CustomReportType = Static<typeof CustomReport>;

export type ReportsType = Static<typeof Reports>;

export type CustomViolationType = Static<typeof CustomCspViolation>;

export type ReportType = Static<typeof Report>;
