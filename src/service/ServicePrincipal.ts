import { ClientSecretCredential } from "@azure/identity";

/**
 * ServicePrincipal class to handle Azure AD authentication.
 */
export class ServicePrincipal {
    /** The resource URL for Azure management. */
    private readonly resource: string = "https://management.azure.com/.default";

    /**
     * Creates an instance of ServicePrincipal.
     * 
     * @param {string} tenantId - The Azure AD tenant ID.
     * @param {string} clientId - The client ID of the Azure AD app.
     * @param {string} clientSecret - The client secret of the Azure AD app.
     */
    constructor(
        private readonly tenantId: string, 
        private readonly clientId: string, 
        private readonly clientSecret: string
    ) {}

    /**
     * Retrieves an access token from Azure AD.
     * 
     * @returns {Promise<string>} - A promise that resolves to the access token.
     * @throws {Error} - Throws an error if the access token cannot be acquired.
     */
    public async getAccessToken(): Promise<string> {
        try {
            const credential = new ClientSecretCredential(this.tenantId, this.clientId, this.clientSecret);
            const tokenResponse = await credential.getToken(this.resource);

            if (!tokenResponse) {
                throw new Error("Failed to acquire access token");
            }

            return tokenResponse.token;
        } catch (error) {
            console.error("Error acquiring access token:", error);
            throw new Error("Failed to acquire access token");
        }
    }
}
