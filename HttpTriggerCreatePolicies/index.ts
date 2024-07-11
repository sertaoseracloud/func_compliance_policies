import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ServicePrincipal } from "../src/service/ServicePrincipal";
import { CompliancePolicyStrategy, OutputCompliancePolicy } from "../src/strategies/CompliancePolicyStrategy";
import { PoliciesContext } from "../src/service/PoliciesContext";

/**
 * HTTP trigger function for processing compliance policy assignments.
 * 
 * @param {Context} context - The context object for the Azure Function.
 * @param {HttpRequest} req - The HTTP request object.
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 */
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        context.log('HTTP trigger function processed a request.');

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

        // Initialize CompliancePolicies instance with request parameters
        const compliancePolicyStrategy = new CompliancePolicyStrategy();
        const policyContext = new PoliciesContext<OutputCompliancePolicy>(
            this.name,
            this.description,
            compliancePolicyStrategy
        );
        context.log('Initialized CompliancePolicies with name:', req.body.name, 'and description:', req.body.description);

        // Check if complianceid is provided; if not, create a new compliance policy
        let complianceid: string;
        if (!req.body.complianceid) {
            context.log('No complianceid provided, creating a new compliance policy');
            const compliancePolicy = await policyContext.postPolicy(accessToken);
            complianceid = compliancePolicy.body.id;
            context.log('Created compliance policy with id:', complianceid);
        } else {
            complianceid = req.body.complianceid;
            context.log('Using provided complianceid:', complianceid);
        }

        // Assign the policy to the specified group
        context.log('Assigning policy with complianceid:', complianceid, 'to groupId:', req.body.groupId);
        const response = await policyContext.assignPolicy(
            complianceid,
            req.body.groupId,
            accessToken
        );

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
            body: { message: 'Internal Server Error' }
        };
    }
};

export default httpTrigger;
