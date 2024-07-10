import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ServicePrincipal } from "../src/service/ServicePrincipal";
import { WindowsUpdateForBusinessConfigurationPolicies } from "../src/service/WindowsUpdateForBusinessConfigurationPolicies";

/**
 * HTTP trigger Azure Function to manage Windows Update for Business policies.
 * @param {Context} context - The context object for the Azure Function.
 * @param {HttpRequest} req - The HTTP request object.
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 */
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    try {
        // Validate request method
        if (req.method !== "POST") {
            context.res = {
                status: 405,
                body: "Method Not Allowed",
            };
            return;
        }

        // Extract environment variables
        const clientId: string = String(process.env.CLIENT_ID);
        const clientSecret: string = String(process.env.CLIENT_SECRET);
        const tenantId: string = String(process.env.TENANT_ID);

        // Initialize ServicePrincipal with Azure AD credentials
        context.log('Initializing ServicePrincipal with tenantId:', tenantId);
        const servicePrincipal = new ServicePrincipal(tenantId, clientId, clientSecret);
        
        // Request access token from Azure AD
        context.log('Requesting access token');
        const accessToken: string = await servicePrincipal.getAccessToken();
        context.log('Access token received');

        const windowsUpdateForBusinessPolicies = new WindowsUpdateForBusinessConfigurationPolicies(
            this.name,
            this.description
        );

        let policyId: string;

        // Determine policyId
        if (!req.body.policyId) {
            context.log('Creating new Windows Update policy');
            const windowsUpdatePolicy = await windowsUpdateForBusinessPolicies.postUpdateRingPolicy(accessToken);
            policyId = windowsUpdatePolicy.body.id;
            context.log('Policy created with ID:', policyId);
        } else {
            policyId = req.body.policyId;
            context.log('Using existing policy ID:', policyId);
        }

        // Assign the policy to the specified group
        context.log('Assigning policy to group with ID:', req.body.groupId);
        const response = await windowsUpdateForBusinessPolicies.assignPolicy(
            policyId,
            req.body.groupId,
            accessToken
        );
        context.log('Policy assignment response:', response);

        // Prepare and send the HTTP response
        context.res = {
            status: 201,
            body: response.body
        };
        context.log('Response sent');
    } catch (error) {
        context.log.error('Error processing request:', error.message);
        context.res = {
            status: 500,
            body: "Internal Server Error"
        };
    }
};

export default httpTrigger;
