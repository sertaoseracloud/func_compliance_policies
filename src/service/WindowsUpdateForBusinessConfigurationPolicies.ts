import axios, { AxiosRequestConfig } from "axios";
import { WindowsUpdateForBusinessPolicy } from "../interfaces/WindowsUpdateForBusinessPolicy";

/**
 * Interface representing the output structure of Windows Update for Business Policy.
 */
interface OutputWindowsUpdateForBusinessPolicy extends WindowsUpdateForBusinessPolicy {
    id: string;
    createdDateTime: Date;
    lastModifiedDateTime: Date;
}

/**
 * Class to manage Windows Update for Business Configuration Policies.
 */
export class WindowsUpdateForBusinessConfigurationPolicies {
    private graphBaseUrl: string = "https://graph.microsoft.com/beta";

    /**
     * Constructor to initialize the policy name and description.
     * @param name - The name of the policy.
     * @param description - The description of the policy.
     */
    constructor(private readonly name: string, private readonly description: string) {}

    /**
     * Method to post a new Windows Update Ring Policy.
     * @param accessToken - The access token for Azure AD.
     * @returns A promise with the status and body of the created policy.
     */
    async postUpdateRingPolicy(accessToken: string): Promise<{ status: number; body: OutputWindowsUpdateForBusinessPolicy; }> {
        try {
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
                description: this.description,
                displayName: this.name,
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
        } catch (error) {
            console.error("Error creating windows update policy:", error);
            throw new Error("Failed to create windows update policy");
        }
    }

    /**
     * Method to assign a policy to a specific group.
     * @param policyId - The ID of the policy to be assigned.
     * @param groupId - The ID of the group to assign the policy to.
     * @param accessToken - The access token for Azure AD.
      * @returns {Promise<{status: number, body: { ok: boolean }}>} - A promise that resolves to the response of the assignment operation.
     * @throws {Error} - Throws an error if the HTTP request fails.
     */
    public async assignPolicy(policyId: string, groupId: string, accessToken: string): Promise<{ status: number; body: { ok: boolean }; }> {
        try {
            const url = `${this.graphBaseUrl}/deviceManagement/deviceCompliancePolicies/${policyId}/assign`;

            const assignment = {
                assignments: [
                    {
                        target: {
                            "@odata.type": "#microsoft.graph.groupAssignmentTarget",
                            groupId: groupId,
                        },
                    },
                ],
            };

            const config: AxiosRequestConfig = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            };

            await axios.post(url, assignment, config);

            return {
                status: 204,
                body: { ok: true },
            };
        } catch (error) {
            console.error("Error assigning windows update policy:", error);
            throw new Error("Failed to assign windows update policy");
        }
    }
}
