import { AssignPolicyStrategy, CreatePolicyStrategy } from "../interfaces/Strategy";
import { AssignPolicyToGroupStrategy } from "../strategies/AssignPolicyToGroupStrategy";

export class PoliciesContext<T> {
    private assignPolicyStrategy: AssignPolicyStrategy;

    constructor(
        private readonly name: string,
        private readonly description: string,
        private createPolicyStrategy: CreatePolicyStrategy<T>
    ) {
        this.assignPolicyStrategy = new AssignPolicyToGroupStrategy();
    }

    async postPolicy(accessToken: string): Promise<{ status: number; body: T; }> {
        return this.createPolicyStrategy.createPolicy(accessToken, this.name, this.description);
    }

    async assignPolicy(policyId: string, groupId: string, accessToken: string): Promise<{ status: number; body: { ok: boolean }; }> {
        return this.assignPolicyStrategy.assignPolicy(policyId, groupId, accessToken);
    }
}
