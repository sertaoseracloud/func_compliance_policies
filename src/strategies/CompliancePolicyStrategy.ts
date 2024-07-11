import axios, { AxiosRequestConfig } from "axios";
import { CompliancePolicy } from "../interfaces/CompliancePolicy";
import { CreatePolicyStrategy } from "../interfaces/Strategy";

export interface OutputCompliancePolicy extends CompliancePolicy {
    id: string;
    createdDateTime: Date;
    lastModifiedDateTime: Date;
}

/**
 * Strategy for creating compliance policies using Microsoft Graph API.
 * @implements {CreatePolicyStrategy<OutputCompliancePolicy>}
 */
export class CompliancePolicyStrategy implements CreatePolicyStrategy<OutputCompliancePolicy> {
    private graphBaseUrl: string = "https://graph.microsoft.com/beta";

    /**
     * Creates a new compliance policy.
     * @param {string} accessToken - The access token for authenticating the request.
     * @param {string} name - The display name of the policy.
     * @param {string} description - The description of the policy.
     * @returns {Promise<{ status: number; body: OutputCompliancePolicy; }>} The HTTP status code and the created policy object.
     */
    async createPolicy(accessToken: string, name: string, description: string): Promise<{ status: number; body: OutputCompliancePolicy; }> {
        const url = `${this.graphBaseUrl}/deviceManagement/deviceCompliancePolicies`;
        const policy: CompliancePolicy = {
            "@odata.type": "#microsoft.graph.windows10CompliancePolicy",
            activeFirewallRequired: true,
            antiSpywareRequired: true,
            antivirusRequired: true,
            bitLockerEnabled: true,
            codeIntegrityEnabled: true,
            defenderEnabled: true,
            description: description,
            deviceThreatProtectionEnabled: false,
            deviceThreatProtectionRequiredSecurityLevel: "unavailable",
            displayName: name,
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
    }
}
