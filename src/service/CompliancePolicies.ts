import axios, { AxiosRequestConfig } from "axios";
import { CompliancePolicy } from "../interfaces/CompliancePolicy";

/**
 * Interface extending CompliancePolicy to include additional properties.
 */
interface OutputCompliancePolicy extends CompliancePolicy {
    id: string;
    createdDateTime: Date;
    lastModifiedDateTime: Date;
}

/**
 * CompliancePolicies class to handle creating and assigning compliance policies.
 */
export class CompliancePolicies {
    /** The base URL for Microsoft Graph API. */
    private graphBaseUrl: string = "https://graph.microsoft.com/beta";

    /**
     * Creates an instance of CompliancePolicies.
     * 
     * @param {string} name - The display name of the compliance policy.
     * @param {string} description - The description of the compliance policy.
     */
    constructor(private readonly name: string, private readonly description: string) {}

    /**
     * Creates a new compliance policy in Microsoft Graph.
     * 
     * @param {string} accessToken - The access token for authentication.
     * @returns {Promise<{status: number, body: OutputCompliancePolicy}>} - A promise that resolves to the created compliance policy.
     * @throws {Error} - Throws an error if the HTTP request fails.
     */
    async postCompliancePolicy(accessToken: string): Promise<{ status: number; body: OutputCompliancePolicy; }> {
        try {
            const url = `${this.graphBaseUrl}/deviceManagement/deviceCompliancePolicies`;
            const policy: CompliancePolicy = {
                "@odata.type": "#microsoft.graph.windows10CompliancePolicy",
                activeFirewallRequired: true,
                antiSpywareRequired: true,
                antivirusRequired: true,
                bitLockerEnabled: true,
                codeIntegrityEnabled: true,
                defenderEnabled: true,
                description: this.description,
                deviceThreatProtectionEnabled: false,
                deviceThreatProtectionRequiredSecurityLevel: "unavailable",
                displayName: this.name,
                passwordRequiredType: "deviceDefault",
                roleScopeTagIds: ["0"],
                rtpEnabled: true,
                scheduledActionsForRule: [
                    {
                        ruleName: "PasswordRequired",
                        scheduledActionConfigurations: [
                            {
                                actionType: "block",
                                gracePeriodHours: 12,
                                notificationMessageCCList: [],
                                notificationTemplateId: "",
                            },
                            {
                                actionType: "retire",
                                gracePeriodHours: 4320,
                                notificationMessageCCList: [],
                                notificationTemplateId: "",
                            },
                        ],
                    },
                ],
                secureBootEnabled: true,
                signatureOutOfDate: true,
                tpmRequired: true,
            };

            const config: AxiosRequestConfig = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            };

            const response = await axios.post<OutputCompliancePolicy>(url, policy, config);

            return {
                status: 201,
                body: response.data,
            };
        } catch (error) {
            console.error("Error creating compliance policy:", error);
            throw new Error("Failed to create compliance policy");
        }
    }

    /**
     * Assigns a compliance policy to a group in Microsoft Graph.
     * 
     * @param {string} policyId - The ID of the compliance policy.
     * @param {string} groupId - The ID of the group to assign the policy to.
     * @param {string} accessToken - The access token for authentication.
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

            const response = await axios.post(url, assignment, config);

            return {
                status: 204,
                body: { ok: true },
            };
        } catch (error) {
            console.error("Error assigning compliance policy:", error);
            throw new Error("Failed to assign compliance policy");
        }
    }
}
