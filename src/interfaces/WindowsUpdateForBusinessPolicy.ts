/**
 * Represents a Windows Update for Business Policy.
 */
export interface WindowsUpdateForBusinessPolicy {
    /** The OData type of the policy. */
    "@odata.type": string;
    /** Indicates if Windows 11 upgrade is allowed. */
    allowWindows11Upgrade: boolean;
    /** The automatic update mode. */
    automaticUpdateMode: string;
    /** The auto-restart notification dismissal setting. */
    autoRestartNotificationDismissal: string;
    /** The business-ready updates setting. */
    businessReadyUpdatesOnly: string;
    /** The deadline for feature updates in days. */
    deadlineForFeatureUpdatesInDays: number;
    /** The deadline for quality updates in days. */
    deadlineForQualityUpdatesInDays: number;
    /** The grace period for deadlines in days. */
    deadlineGracePeriodInDays: number;
    /** The description of the policy. */
    description: string;
    /** The display name of the policy. */
    displayName: string;
    /** Indicates if drivers are excluded from updates. */
    driversExcluded: boolean;
    /** The engaged restart deadline in days. */
    engagedRestartDeadlineInDays: number | null;
    /** The engaged restart snooze schedule for feature updates in days. */
    engagedRestartSnoozeScheduleForFeatureUpdatesInDays: number | null;
    /** The engaged restart snooze schedule in days. */
    engagedRestartSnoozeScheduleInDays: number | null;
    /** The engaged restart transition schedule for feature updates in days. */
    engagedRestartTransitionScheduleForFeatureUpdatesInDays: number | null;
    /** The engaged restart transition schedule in days. */
    engagedRestartTransitionScheduleInDays: number | null;
    /** The deferral period for feature updates in days. */
    featureUpdatesDeferralPeriodInDays: number;
    /** Indicates if feature updates are paused. */
    featureUpdatesPaused: boolean;
    /** The rollback window for feature updates in days. */
    featureUpdatesRollbackWindowInDays: number;
    /** The installation schedule. */
    installationSchedule: WindowsUpdateActiveHoursInstall;
    /** Indicates if the Microsoft Update service is allowed. */
    microsoftUpdateServiceAllowed: boolean;
    /** Indicates if reboot is postponed until after the deadline. */
    postponeRebootUntilAfterDeadline: boolean;
    /** The deferral period for quality updates in days. */
    qualityUpdatesDeferralPeriodInDays: number;
    /** Indicates if quality updates are paused. */
    qualityUpdatesPaused: boolean;
    /** The role scope tag IDs. */
    roleScopeTagIds: string[];
    /** The schedule for imminent restart warning in minutes. */
    scheduleImminentRestartWarningInMinutes: number | null;
    /** The schedule for restart warning in hours. */
    scheduleRestartWarningInHours: number | null;
    /** Indicates if checks before restart are skipped. */
    skipChecksBeforeRestart: boolean;
    /** The update notification level. */
    updateNotificationLevel: string;
    /** The update weeks. */
    updateWeeks: number | null;
    /** Indicates if user pause access is enabled. */
    userPauseAccess: string;
    /** Indicates if user Windows Update scan access is enabled. */
    userWindowsUpdateScanAccess: string;
}

/**
 * Represents the installation schedule for Windows Update Active Hours.
 */
interface WindowsUpdateActiveHoursInstall {
    /** The OData type of the installation schedule. */
    "@odata.type": string;
    /** The end time of the active hours for installation. */
    activeHoursEnd: string;
    /** The start time of the active hours for installation. */
    activeHoursStart: string;
}