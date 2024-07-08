/**
 * Represents a compliance policy.
 */
export interface CompliancePolicy {
    /** The OData type of the policy. */
    "@odata.type": string;
    /** Indicates if an active firewall is required. */
    activeFirewallRequired: boolean;
    /** Indicates if anti-spyware is required. */
    antiSpywareRequired: boolean;
    /** Indicates if antivirus is required. */
    antivirusRequired: boolean;
    /** Indicates if BitLocker is enabled. */
    bitLockerEnabled: boolean;
    /** Indicates if code integrity is enabled. */
    codeIntegrityEnabled: boolean;
    /** Indicates if Windows Defender is enabled. */
    defenderEnabled: boolean;
    /** The description of the compliance policy. */
    description: string;
    /** Indicates if device threat protection is enabled. */
    deviceThreatProtectionEnabled: boolean;
    /** The required security level for device threat protection. */
    deviceThreatProtectionRequiredSecurityLevel: string;
    /** The display name of the compliance policy. */
    displayName: string;
    /** The required password type. */
    passwordRequiredType: string;
    /** The role scope tag IDs. */
    roleScopeTagIds: string[];
    /** Indicates if real-time protection is enabled. */
    rtpEnabled: boolean;
    /** The scheduled actions for the rule. */
    scheduledActionsForRule: ScheduledActionForRule[];
    /** Indicates if secure boot is enabled. */
    secureBootEnabled: boolean;
    /** Indicates if the signature is out of date. */
    signatureOutOfDate: boolean;
    /** Indicates if TPM is required. */
    tpmRequired: boolean;
}

/**
 * Represents a scheduled action for a rule.
 */
interface ScheduledActionForRule {
    /** The name of the rule. */
    ruleName: string;
    /** The scheduled action configurations for the rule. */
    scheduledActionConfigurations: ScheduledActionConfiguration[];
}

/**
 * Represents a scheduled action configuration.
 */
interface ScheduledActionConfiguration {
    /** The type of action. */
    actionType: string;
    /** The grace period in hours for the action. */
    gracePeriodHours: number;
    /** The list of email addresses to be CC'd in the notification message. */
    notificationMessageCCList: string[];
    /** The ID of the notification template. */
    notificationTemplateId: string;
}
