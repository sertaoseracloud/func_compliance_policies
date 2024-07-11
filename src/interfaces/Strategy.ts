// CreatePolicyStrategy.ts
export interface CreatePolicyStrategy<T> {
    createPolicy(accessToken: string, name: string, description: string): Promise<{ status: number; body: T; }>;
}

// AssignPolicyStrategy.ts
export interface AssignPolicyStrategy {
    assignPolicy(policyId: string, groupId: string, accessToken: string): Promise<{ status: number; body: { ok: boolean }; }>;
}
