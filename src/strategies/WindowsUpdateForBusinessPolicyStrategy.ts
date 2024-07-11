// WindowsUpdateForBusinessPolicyStrategy.ts
import axios, { AxiosRequestConfig } from "axios";
import { WindowsUpdateForBusinessPolicy } from "../interfaces/WindowsUpdateForBusinessPolicy";
import { CreatePolicyStrategy } from "../interfaces/Strategy";

export interface OutputWindowsUpdateForBusinessPolicy extends WindowsUpdateForBusinessPolicy {
    id: string;
    createdDateTime: Date;
    lastModifiedDateTime: Date;
}

export class WindowsUpdateForBusinessPolicyStrategy implements CreatePolicyStrategy<OutputWindowsUpdateForBusinessPolicy> {
    private graphBaseUrl: string = "https://graph.microsoft.com/beta";

    async createPolicy(accessToken: string, name: string, description: string): Promise<{ status: number; body: OutputWindowsUpdateForBusinessPolicy; }> {
        const url = `${this.graphBaseUrl}/deviceManagement/deviceConfigurations`;
        const windowsUpdateConfig: WindowsUpdateForBusinessPolicy = {
            "@odata.type": "#microsoft.graph.windowsUpdateForBusinessConfiguration",
            allowWindows11Upgrade: true,
            automaticUpdateMode: "autoInstallAtMaintenanceTime",
            autoRestartNotificationDismissal: "notConfigured",
            businessReadyUpdatesOnly: "userDefined",
            deadlineForFeatureUpdatesInDays: 5,
            deadlineForQualityUpdatesInDays: 5,
            deadlineGracePeriodInDays: 3,
            description: description,
            displayName: name,
            driversExcluded: false,
            engagedRestartDeadlineInDays: null,
            engagedRestartSnoozeScheduleForFeatureUpdatesInDays: null,
            engagedRestartSnoozeScheduleInDays: null,
            engagedRestartTransitionScheduleForFeatureUpdatesInDays: null,
            engagedRestartTransitionScheduleInDays: null,
            featureUpdatesDeferralPeriodInDays: 0,
            featureUpdatesPaused: false,
            featureUpdatesRollbackWindowInDays: 10,
            installationSchedule: {
                "@odata.type": "#microsoft.graph.windowsUpdateActiveHoursInstall",
                activeHoursEnd: "17:00:00.0000000",
                activeHoursStart: "08:00:00.0000000"
            },
            microsoftUpdateServiceAllowed: true,
            postponeRebootUntilAfterDeadline: false,
            qualityUpdatesDeferralPeriodInDays: 10,
            qualityUpdatesPaused: false,
            roleScopeTagIds: [],
            scheduleImminentRestartWarningInMinutes: null,
            scheduleRestartWarningInHours: null,
            skipChecksBeforeRestart: false,
            updateNotificationLevel: "restartWarningsOnly",
            updateWeeks: null,
            userPauseAccess: "enabled",
            userWindowsUpdateScanAccess: "enabled"
        };

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        };

        const response = await axios.post<OutputWindowsUpdateForBusinessPolicy>(url, windowsUpdateConfig, config);
        return {
            status: 201,
            body: response.data,
        };
    }
}
