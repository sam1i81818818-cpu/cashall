import http from "http";
import https from "https";
import { URLSearchParams } from "url";


export interface ExotelConfig {
  accountSid: string;
  apiKey: string;
  apiToken: string;
  subdomain: string;
  callerId: string;
  appName?: string;
  businessNumber?: string;
  webhookSecret?: string;
  lowCreditThreshold: number;
}

export interface ConnectCallParams {
  from: string; // First leg (Agent phone)
  to: string; // Second leg (Customer phone)
  callerId?: string; // Virtual number / ExoPhone
  customField?: string; // Internal call ID / metadata
  record?: boolean; // Enable two-way recording
  statusCallback?: string; // Callback URL
  timeLimit?: number; // Max duration in seconds
  timeOut?: number; // Ring timeout in seconds
}

export interface ExotelCallResponse {
  sid: string;
  parentCallSid?: string;
  dateCreated: string;
  dateUpdated: string;
  accountSid: string;
  to: string;
  from: string;
  phoneNumberSid?: string;
  status: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  price?: number;
  direction: string;
  answeredBy?: string;
  forwardedFrom?: string;
  callerName?: string;
  uri?: string;
  recordingUrl?: string;
}

export interface ExotelBalanceResponse {
  amount: number;
  currency: string;
  isLowBalance: boolean;
  threshold: number;
  raw: any;
}

export interface ExotelAccountDetails {
  sid: string;
  friendlyName: string;
  type: string;
  status: string;
  billingType: string;
  kycStatus: string;
  dateCreated: string;
}

export class ExotelService {
  private config: ExotelConfig;

  constructor(customConfig?: Partial<ExotelConfig>) {
    this.config = {
      accountSid: customConfig?.accountSid || process.env.EXOTEL_ACCOUNT_SID || "",
      apiKey: customConfig?.apiKey || process.env.EXOTEL_API_KEY || "",
      apiToken: customConfig?.apiToken || process.env.EXOTEL_API_TOKEN || "",
      subdomain: customConfig?.subdomain || process.env.EXOTEL_SUBDOMAIN || "api.exotel.com",
      callerId: customConfig?.callerId || process.env.EXOTEL_CALLER_ID || "09513886363",
      appName: customConfig?.appName || process.env.EXOTEL_APP_NAME || "aarnaenterprise1 Landing Flow",
      businessNumber: customConfig?.businessNumber || process.env.EXOTEL_BUSINESS_NUMBER || "7604096333",
      webhookSecret: customConfig?.webhookSecret || process.env.EXOTEL_WEBHOOK_SECRET || "cashall_exotel_wh_sec_2026_9823",
      lowCreditThreshold: Number(customConfig?.lowCreditThreshold || process.env.EXOTEL_LOW_CREDIT_THRESHOLD || 50),
    };
  }

  private getResolvedConfig(): ExotelConfig {
    return {
      accountSid: this.config.accountSid || process.env.EXOTEL_ACCOUNT_SID || "",
      apiKey: this.config.apiKey || process.env.EXOTEL_API_KEY || "",
      apiToken: this.config.apiToken || process.env.EXOTEL_API_TOKEN || "",
      subdomain: this.config.subdomain || process.env.EXOTEL_SUBDOMAIN || "api.exotel.com",
      callerId: this.config.callerId || process.env.EXOTEL_CALLER_ID || "09513886363",
      appName: this.config.appName || process.env.EXOTEL_APP_NAME || "aarnaenterprise1 Landing Flow",
      businessNumber: this.config.businessNumber || process.env.EXOTEL_BUSINESS_NUMBER || "7604096333",
      webhookSecret: this.config.webhookSecret || process.env.EXOTEL_WEBHOOK_SECRET || "cashall_exotel_wh_sec_2026_9823",
      lowCreditThreshold: Number(this.config.lowCreditThreshold || process.env.EXOTEL_LOW_CREDIT_THRESHOLD || 50),
    };
  }

  /**
   * Safe status check without leaking any secret keys
   */
  public getConfigStatus() {
    const cfg = this.getResolvedConfig();
    return {
      isConfigured: Boolean(cfg.accountSid && cfg.apiKey && cfg.apiToken),
      accountSid: cfg.accountSid,
      subdomain: cfg.subdomain,
      callerId: cfg.callerId,
      appName: cfg.appName,
      businessNumber: cfg.businessNumber,
      lowCreditThreshold: cfg.lowCreditThreshold,
      hasWebhookSecret: Boolean(cfg.webhookSecret),
    };
  }

  /**
   * Normalizes Indian phone numbers for Exotel gateway
   * Accepts 10-digit number and prepends 0 if needed by Indian PSTN/Exotel
   */
  public normalizePhoneNumber(phone: string): string {
    if (!phone) return "";
    let cleaned = phone.replace(/[^0-9]/g, "");

    // Strip leading 91 if 12 digits
    if (cleaned.length === 12 && cleaned.startsWith("91")) {
      cleaned = cleaned.substring(2);
    }
    // Strip leading 0 if 11 digits
    if (cleaned.length === 11 && cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }

    // Exotel accepts standard 10-digit numbers or prefixed with 0
    // E.g. 09876543210 ensures reliable domestic routing
    if (cleaned.length === 10) {
      return `0${cleaned}`;
    }

    return cleaned;
  }

  /**
   * Masks phone number for UI privacy and audit logs
   * E.g. 9876543210 -> 98765*****
   */
  public maskPhoneNumber(phone?: string | null): string {
    if (!phone) return "—";
    const cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.length >= 10) {
      const core = cleaned.slice(-10);
      return `${core.slice(0, 5)}*****`;
    }
    return phone.slice(0, 3) + "*****";
  }

  private getAuthHeader(): string {
    const cfg = this.getResolvedConfig();
    return "Basic " + Buffer.from(`${cfg.apiKey}:${cfg.apiToken}`).toString("base64");
  }

  /**
   * Core HTTP request helper for Exotel REST API
   */
  private makeRequest<T>(
    method: "GET" | "POST",
    path: string,
    formData?: Record<string, string | number | boolean>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const cfg = this.getResolvedConfig();
      if (!cfg.accountSid || !cfg.apiKey || !cfg.apiToken) {
        return reject(new Error("Exotel credentials are not fully configured in environment"));
      }

      const postData = formData ? new URLSearchParams() : null;
      if (postData && formData) {
        Object.entries(formData).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            postData.append(k, String(v));
          }
        });
      }

      const bodyBuffer = postData ? Buffer.from(postData.toString()) : null;

      const headers: Record<string, string> = {
        Authorization: this.getAuthHeader(),
        Accept: "application/json",
      };

      if (bodyBuffer) {
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        headers["Content-Length"] = String(bodyBuffer.length);
      }

      const options: https.RequestOptions = {
        hostname: cfg.subdomain,
        port: 443,
        path,
        method,
        headers,
        timeout: 15000,
      };


      const req = https.request(options, (res) => {
        let responseBody = "";
        res.on("data", (chunk) => (responseBody += chunk));
        res.on("end", () => {
          try {
            const parsed = responseBody ? JSON.parse(responseBody) : {};
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed as T);
            } else {
              const errorMessage =
                parsed?.RestException?.Message ||
                parsed?.message ||
                `Exotel HTTP Error ${res.statusCode}: ${responseBody.slice(0, 200)}`;
              reject(new Error(errorMessage));
            }
          } catch (e: any) {
            reject(new Error(`Failed to parse Exotel response (${res.statusCode}): ${e.message}`));
          }
        });
      });

      req.on("error", (err) => reject(new Error(`Exotel request error: ${err.message}`)));
      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Exotel API request timed out after 15000ms"));
      });

      if (bodyBuffer) {
        req.write(bodyBuffer);
      }
      req.end();
    });
  }

  /**
   * Fetches Exotel Account Details (Status, KYC, Account Type)
   */
  public async getAccountDetails(): Promise<ExotelAccountDetails> {
    const cfg = this.getResolvedConfig();
    const data: any = await this.makeRequest("GET", `/v1/Accounts/${cfg.accountSid}.json`);
    const acc = data?.Account || {};
    return {
      sid: acc.Sid || cfg.accountSid,
      friendlyName: acc.FriendlyName || "",
      type: acc.Type || "Trial",
      status: acc.Status || "active",
      billingType: acc.BillingType || "prepaid",
      kycStatus: acc.KycStatus || "notstarted",
      dateCreated: acc.DateCreated || "",
    };
  }

  /**
   * Fetches Real-time Credit Balance from Exotel Official API
   */
  public async getCreditBalance(): Promise<ExotelBalanceResponse> {
    const cfg = this.getResolvedConfig();
    const data: any = await this.makeRequest("GET", `/v1/Accounts/${cfg.accountSid}/Balance.json`);
    const amount = Number(data?.Balance?.Amount ?? 0);
    const isLowBalance = amount <= cfg.lowCreditThreshold;
    return {
      amount,
      currency: "INR",
      isLowBalance,
      threshold: cfg.lowCreditThreshold,
      raw: data,
    };
  }

  /**
   * Initiates a Click-to-Call connection between Agent (From) and Customer (To)
   * via the provisioned ExoPhone (CallerId).
   */
  public async connectTwoNumbers(params: ConnectCallParams): Promise<ExotelCallResponse> {
    const cfg = this.getResolvedConfig();
    const normalizedFrom = this.normalizePhoneNumber(params.from);
    const normalizedTo = this.normalizePhoneNumber(params.to);
    const callerId = params.callerId || cfg.callerId;

    if (!normalizedFrom || normalizedFrom.length < 10) {
      throw new Error("Invalid Agent phone number specified for calling");
    }
    if (!normalizedTo || normalizedTo.length < 10) {
      throw new Error("Invalid Customer phone number specified for calling");
    }

    const payload: Record<string, string | number | boolean> = {
      From: normalizedFrom,
      To: normalizedTo,
      CallerId: callerId,
      CallType: "trans",
      Record: params.record !== false ? "true" : "false",
      TimeOut: params.timeOut || 30,
      TimeLimit: params.timeLimit || 1800,
    };

    if (params.customField) {
      payload.CustomField = params.customField;
    }

    if (params.statusCallback) {
      payload.StatusCallback = params.statusCallback;
      payload["StatusCallbackEvents[0]"] = "terminal";
    }

    const response: any = await this.makeRequest(
      "POST",
      `/v1/Accounts/${cfg.accountSid}/Calls/connect.json`,
      payload
    );

    const call = response?.Call || {};
    return {
      sid: call.Sid,
      parentCallSid: call.ParentCallSid,
      dateCreated: call.DateCreated,
      dateUpdated: call.DateUpdated,
      accountSid: call.AccountSid,
      to: call.To,
      from: call.From,
      phoneNumberSid: call.PhoneNumberSid,
      status: call.Status || "in-progress",
      startTime: call.StartTime,
      endTime: call.EndTime,
      duration: Number(call.Duration) || 0,
      price: call.Price ? Number(call.Price) : undefined,
      direction: call.Direction || "outbound-api",
      uri: call.Uri,
      recordingUrl: call.RecordingUrl,
    };
  }

  /**
   * Fetches detailed information for a specific Exotel Call SID
   */
  public async getCallDetails(callSid: string): Promise<ExotelCallResponse> {
    const cfg = this.getResolvedConfig();
    const data: any = await this.makeRequest("GET", `/v1/Accounts/${cfg.accountSid}/Calls/${callSid}.json`);
    const call = data?.Call || {};
    return {
      sid: call.Sid || callSid,
      parentCallSid: call.ParentCallSid,
      dateCreated: call.DateCreated,
      dateUpdated: call.DateUpdated,
      accountSid: call.AccountSid,
      to: call.To,
      from: call.From,
      phoneNumberSid: call.PhoneNumberSid,
      status: call.Status,
      startTime: call.StartTime,
      endTime: call.EndTime,
      duration: Number(call.Duration) || 0,
      price: call.Price ? Number(call.Price) : undefined,
      direction: call.Direction,
      uri: call.Uri,
      recordingUrl: call.RecordingUrl,
    };
  }


  /**
   * Safely proxies recording audio stream from Exotel to authorized client
   * without exposing API key/token or raw Exotel storage URLs to browser
   */
  public streamRecording(
    recordingUrl: string,
    onSuccess: (stream: http.IncomingMessage) => void,
    onError: (err: Error) => void
  ) {

    if (!recordingUrl) {
      return onError(new Error("Empty recording URL provided"));
    }

    try {
      const url = new URL(recordingUrl);
      const options: https.RequestOptions = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method: "GET",
        headers: {
          Authorization: this.getAuthHeader(),
          Accept: "audio/wav, audio/mpeg, audio/*",
        },
      };

      const req = https.request(options, (res) => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          onSuccess(res);
        } else if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
          // Follow redirect if Exotel redirects to S3 signed URL
          const location = res.headers.location;
          if (location) {
            https.get(location, (redirectRes) => {
              if (redirectRes.statusCode && redirectRes.statusCode >= 200 && redirectRes.statusCode < 300) {
                onSuccess(redirectRes);
              } else {
                onError(new Error(`Recording redirect failed with HTTP ${redirectRes.statusCode}`));
              }
            }).on("error", onError);
          } else {
            onError(new Error("Recording redirected without Location header"));
          }
        } else {
          onError(new Error(`Exotel recording stream failed with HTTP ${res.statusCode}`));
        }
      });

      req.on("error", onError);
      req.end();
    } catch (e: any) {
      onError(new Error(`Invalid recording URL: ${e.message}`));
    }
  }
}

// Singleton export
export const exotelService = new ExotelService();
