// AssignPolicyToGroupStrategy.ts
import axios, { AxiosRequestConfig } from "axios";
import { AssignPolicyStrategy } from "../interfaces/Strategy";

export class AssignPolicyToGroupStrategy implements AssignPolicyStrategy {
    private graphBaseUrl: string = "https://graph.microsoft.com/beta";

    async assignPolicy(policyId: string, groupId: string, accessToken: string): Promise<{ status: number; body: { ok: boolean }; }> {
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
    }
}
