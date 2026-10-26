/**
 * CashALL Official Customer Email Templates
 * Branded, responsive, legal-grade communications for buyback & logistics operations.
 */

export interface EmailOrderDetails {
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  deviceName: string;
  imeiNumber?: string;
  totalAgreedPrice: number;
  initialPaidAmount?: number;
  balanceAmount?: number;
  pendingItem?: string; // e.g. "Original Device Box", "Original 65W Fast Charger"
  promisedDate?: string; // e.g. "4th October 2026"
  utrNumber?: string;
  agentName?: string;
  newPickupTime?: string;
  reason?: string;
  customMessage?: string;
}

export type CustomerEmailScenario =
  | "PARTIAL_PAYMENT_PENDING_BOX"
  | "BALANCE_PAYMENT_SETTLED"
  | "DOORSTEP_REQUOTE_ACCEPTED"
  | "FULL_PAYMENT_UTR_CONFIRMATION"
  | "BANK_DELAY_ASSURANCE"
  | "PICKUP_RESCHEDULED"
  | "EXECUTIVE_DELAY_NOTICE"
  | "DEAL_CANCELLED_FREE_POLICY"
  | "POLICY_SECURITY_REJECTION"
  | "BENEFICIARY_CHANGE_CONSENT"
  | "RENTAL_DEPOSIT_REFUND";

/**
 * Base layout with CashALL branding, gold accent styling, and legal compliance footer
 */
function wrapInCashAllLayout(title: string, bodyContent: string, actionButton?: { text: string; url: string }): string {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0c0d0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e5e7eb; }
    .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #141618; border: 1px solid #26292d; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #111215 0%, #1a1c23 100%); padding: 24px; text-align: center; border-bottom: 2px solid #eab308; }
    .logo-badge { display: inline-block; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; text-decoration: none; }
    .logo-accent { color: #eab308; }
    .content { padding: 32px 24px; }
    .h1 { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 16px; }
    .p { font-size: 14px; line-height: 1.6; color: #9ca3af; margin: 0 0 16px; }
    .card { background-color: #1b1e22; border: 1px solid #2e333b; border-radius: 8px; padding: 18px; margin: 20px 0; }
    .table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    .table td { padding: 8px 0; font-size: 13px; border-bottom: 1px solid #262b32; }
    .table tr:last-child td { border-bottom: none; }
    .label { color: #9ca3af; width: 42%; font-weight: 500; }
    .value { color: #f3f4f6; font-weight: 600; text-align: right; }
    .highlight { color: #eab308; font-weight: 700; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .badge-green { background-color: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
    .badge-yellow { background-color: rgba(234, 179, 8, 0.15); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.3); }
    .btn { display: inline-block; background-color: #eab308; color: #000000 !important; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 6px; text-decoration: none; margin-top: 16px; }
    .footer { background-color: #0f1012; padding: 24px; text-align: center; border-top: 1px solid #22252a; font-size: 12px; color: #6b7280; line-height: 1.5; }
    .footer a { color: #eab308; text-decoration: none; }
  </style>
</head>
<body>
  <div style="padding: 20px 10px;">
    <div class="wrapper">
      <div class="header">
        <a href="https://www.cashall.in" class="logo-badge">
          Cash<span class="logo-accent">ALL</span>
        </a>
        <div style="font-size: 11px; color: #9ca3af; margin-top: 4px; letter-spacing: 0.5px;">OFFICIAL ORDER & SETTLEMENT DESK</div>
      </div>
      <div class="content">
        ${bodyContent}
        ${
          actionButton
            ? `<div style="text-align: center; margin-top: 24px;">
                 <a href="${actionButton.url}" class="btn">${actionButton.text}</a>
               </div>`
            : ""
        }
      </div>
      <div class="footer">
        <p style="margin: 0 0 8px;"><strong>CashALL</strong> | AARNA ENTERPRISE • India's Trusted Doorstep Buyback Platform</p>
        <p style="margin: 0 0 8px;">Helpline: <a href="tel:+917604092333">+91 7604092333</a> • Support: <a href="mailto:support@cashall.in">support@cashall.in</a></p>
        <p style="margin: 0;">Official Website: <a href="https://www.cashall.in">www.cashall.in</a></p>
        <p style="margin: 12px 0 0; font-size: 10px; color: #4b5563;">This is a legally binding transactional notification issued by CashALL for Order ID confirmation.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generates subject and HTML content based on business scenario
 */
export function generateCustomerEmail(
  scenario: CustomerEmailScenario,
  data: EmailOrderDetails
): { subject: string; html: string; text: string } {
  const {
    orderNumber,
    customerName,
    deviceName,
    imeiNumber,
    totalAgreedPrice,
    initialPaidAmount = 0,
    balanceAmount = 0,
    pendingItem = "Original Box",
    promisedDate = "Next Business Day",
    utrNumber,
    agentName = "CashALL Executive",
    newPickupTime,
    reason,
  } = data;

  const formattedTotal = `₹${totalAgreedPrice.toLocaleString("en-IN")}`;
  const formattedPaid = `₹${initialPaidAmount.toLocaleString("en-IN")}`;
  const formattedBalance = `₹${balanceAmount.toLocaleString("en-IN")}`;

  switch (scenario) {
    // 1. Partial payment with pending accessory (e.g. Rajeev)
    case "PARTIAL_PAYMENT_PENDING_BOX": {
      const subject = `Official Confirmation: Order #${orderNumber} — Initial Payout (${formattedPaid}) & Balance (${formattedBalance}) on ${pendingItem} Handover | CashALL`;
      const body = `
        <h1 class="h1">Official Settlement Acknowledgement</h1>
        <p class="p">Dear <strong>${customerName}</strong>,</p>
        <p class="p">This official communication confirms the doorstep inspection and partial payout for your device order <strong>#${orderNumber}</strong>, completed today by executive <strong>${agentName}</strong>.</p>
        
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: #ffffff; font-size: 14px;">Order & Device Details</strong>
            <span class="badge badge-yellow">Partial Payout Completed</span>
          </div>
          <table class="table">
            <tr><td class="label">Order Number</td><td class="value">#${orderNumber}</td></tr>
            <tr><td class="label">Device Model</td><td class="value">${deviceName}</td></tr>
            ${imeiNumber ? `<tr><td class="label">IMEI / Serial</td><td class="value">${imeiNumber}</td></tr>` : ""}
            <tr><td class="label">Total Agreed Deal</td><td class="value highlight">${formattedTotal}</td></tr>
          </table>
        </div>

        <div class="card" style="border-left: 3px solid #eab308;">
          <strong style="color: #ffffff; font-size: 14px;">Payment & Balance Terms</strong>
          <table class="table">
            <tr><td class="label">Initial Transferred Today</td><td class="value" style="color: #4ade80;">${formattedPaid} (PAID)</td></tr>
            ${utrNumber ? `<tr><td class="label">Bank UTR / Transaction Ref</td><td class="value">${utrNumber}</td></tr>` : ""}
            <tr><td class="label">Pending Balance Amount</td><td class="value highlight">${formattedBalance}</td></tr>
            <tr><td class="label">Pending Item to Handover</td><td class="value">${pendingItem}</td></tr>
            <tr><td class="label">Scheduled Handover Date</td><td class="value">${promisedDate}</td></tr>
          </table>
        </div>

        <p class="p"><strong>Our Commitment:</strong> The interim bill for ${formattedPaid} has been dispatched. Upon our logistics executive collecting the <strong>${pendingItem}</strong> on <strong>${promisedDate}</strong>, the remaining balance of <strong>${formattedBalance}</strong> will be immediately credited to your bank account / UPI, and your updated final invoice will be released.</p>
        <p class="p">If you have any questions, our support team is available 24/7 on WhatsApp/Call at <strong>+91 7604092333</strong>.</p>
      `;
      return {
        subject,
        html: wrapInCashAllLayout(subject, body, { text: "View Order Status", url: `https://www.cashall.in/order/${orderNumber}` }),
        text: `Official Confirmation: Order #${orderNumber}\nTotal Agreed: ${formattedTotal}\nPaid Today: ${formattedPaid} (UTR: ${utrNumber || 'Completed'})\nBalance: ${formattedBalance} to be paid on ${promisedDate} upon handing over ${pendingItem}.`,
      };
    }

    // 2. Balance payment settled upon box/accessory receipt
    case "BALANCE_PAYMENT_SETTLED": {
      const subject = `Final Settlement Complete: Order #${orderNumber} — Balance ${formattedBalance} Disbursed | CashALL`;
      const body = `
        <h1 class="h1">Final Deal Settlement Successful</h1>
        <p class="p">Dear <strong>${customerName}</strong>,</p>
        <p class="p">We are pleased to inform you that our executive has collected the pending <strong>${pendingItem}</strong> for Order <strong>#${orderNumber}</strong>. The final balance payment of <strong>${formattedBalance}</strong> has been successfully credited to your account.</p>

        <div class="card">
          <table class="table">
            <tr><td class="label">Order Number</td><td class="value">#${orderNumber}</td></tr>
            <tr><td class="label">Device</td><td class="value">${deviceName}</td></tr>
            <tr><td class="label">Total Deal Value</td><td class="value highlight">${formattedTotal}</td></tr>
            <tr><td class="label">Initial Payout</td><td class="value">${formattedPaid}</td></tr>
            <tr><td class="label">Final Settlement Payout</td><td class="value" style="color: #4ade80;">${formattedBalance} (PAID)</td></tr>
            ${utrNumber ? `<tr><td class="label">Settlement UTR Ref</td><td class="value">${utrNumber}</td></tr>` : ""}
            <tr><td class="label">Deal Status</td><td class="value"><span class="badge badge-green">100% Fully Settled</span></td></tr>
          </table>
        </div>

        <p class="p">Your final updated purchase invoice is now accessible online. Device ownership has been formally transferred to CashALL with complete release of liability.</p>
        <p class="p">Thank you for placing your trust in CashALL!</p>
      `;
      return {
        subject,
        html: wrapInCashAllLayout(subject, body, { text: "Download Final Tax Invoice", url: `https://www.cashall.in/order/${orderNumber}/bill` }),
        text: `Final Settlement: Order #${orderNumber}\nBalance payment of ${formattedBalance} has been disbursed (UTR: ${utrNumber || 'Success'}). Total deal value: ${formattedTotal}.`,
      };
    }

    // 3. QC Re-quote agreed at doorstep
    case "DOORSTEP_REQUOTE_ACCEPTED": {
      const subject = `Valuation Accepted: Order #${orderNumber} (${deviceName}) — Final Payout ${formattedTotal} | CashALL`;
      const body = `
        <h1 class="h1">Doorstep Inspection & Valuation Agreed</h1>
        <p class="p">Dear <strong>${customerName}</strong>,</p>
        <p class="p">Thank you for facilitating the doorstep physical inspection of your <strong>${deviceName}</strong> under Order <strong>#${orderNumber}</strong> with our logistics partner <strong>${agentName}</strong>.</p>

        <div class="card">
          <table class="table">
            <tr><td class="label">Order Number</td><td class="value">#${orderNumber}</td></tr>
            <tr><td class="label">Device</td><td class="value">${deviceName}</td></tr>
            ${imeiNumber ? `<tr><td class="label">Verified IMEI</td><td class="value">${imeiNumber}</td></tr>` : ""}
            <tr><td class="label">Final Agreed Deal</td><td class="value highlight">${formattedTotal}</td></tr>
            ${reason ? `<tr><td class="label">QC Observation Note</td><td class="value">${reason}</td></tr>` : ""}
            <tr><td class="label">Payment Status</td><td class="value"><span class="badge badge-green">Disbursed via Instant UPI</span></td></tr>
            ${utrNumber ? `<tr><td class="label">UTR / Transaction ID</td><td class="value">${utrNumber}</td></tr>` : ""}
          </table>
        </div>

        <p class="p">The instant payout of <strong>${formattedTotal}</strong> has been transferred. Your official sale receipt and purchase tax invoice have been generated.</p>
      `;
      return {
        subject,
        html: wrapInCashAllLayout(subject, body, { text: "View Sale Invoice", url: `https://www.cashall.in/order/${orderNumber}/bill` }),
        text: `Order #${orderNumber} valuation of ${formattedTotal} accepted for ${deviceName}. Payment disbursed (UTR: ${utrNumber || 'Completed'}).`,
      };
    }

    // 4. Full payment UTR confirmation (standard flow)
    case "FULL_PAYMENT_UTR_CONFIRMATION": {
      const subject = `Payment Successful: ₹${totalAgreedPrice} Credited for Order #${orderNumber} | CashALL`;
      const body = `
        <h1 class="h1">Instant Payout Confirmation</h1>
        <p class="p">Dear <strong>${customerName}</strong>,</p>
        <p class="p">We are delighted to confirm that your instant payout for Order <strong>#${orderNumber}</strong> has been successfully credited.</p>

        <div class="card">
          <table class="table">
            <tr><td class="label">Amount Transferred</td><td class="value highlight" style="font-size: 16px;">${formattedTotal}</td></tr>
            <tr><td class="label">Order Number</td><td class="value">#${orderNumber}</td></tr>
            <tr><td class="label">Device Model</td><td class="value">${deviceName}</td></tr>
            <tr><td class="label">Transaction Reference (UTR)</td><td class="value" style="color: #4ade80;">${utrNumber || "Verified Instant IMPS"}</td></tr>
            <tr><td class="label">Verified Executive</td><td class="value">${agentName}</td></tr>
          </table>
        </div>

        <p class="p">The official GST purchase bill and receipt are now live on your account. Thank you for doing business with CashALL!</p>
      `;
      return {
        subject,
        html: wrapInCashAllLayout(subject, body, { text: "Download Tax Invoice", url: `https://www.cashall.in/order/${orderNumber}/bill` }),
        text: `Payment of ${formattedTotal} successfully credited for Order #${orderNumber} (UTR: ${utrNumber || 'Verified'}).`,
      };
    }

    // 5. Bank delay assurance
    case "BANK_DELAY_ASSURANCE": {
      const subject = `Urgent Assurance: Payout Initiated for Order #${orderNumber} — Bank Processing In Transit | CashALL`;
      const body = `
        <h1 class="h1">Payout In Transit Notification</h1>
        <p class="p">Dear <strong>${customerName}</strong>,</p>
        <p class="p">This is an official assurance notice regarding your payment of <strong>${formattedTotal}</strong> for Order <strong>#${orderNumber}</strong>.</p>
        <p class="p">The funds have been dispatched from CashALL's bank account. Due to intermittent inter-bank server clearing delays (IMPS/NPCI), your beneficiary bank is taking slightly longer than usual to reflect the credit.</p>

        <div class="card">
          <table class="table">
            <tr><td class="label">Amount In Transit</td><td class="value highlight">${formattedTotal}</td></tr>
            <tr><td class="label">Order Number</td><td class="value">#${orderNumber}</td></tr>
            <tr><td class="label">Device Received</td><td class="value">${deviceName}</td></tr>
            <tr><td class="label">Executive on Record</td><td class="value">${agentName}</td></tr>
            ${utrNumber ? `<tr><td class="label">Bank Transfer Ref</td><td class="value">${utrNumber}</td></tr>` : ""}
            <tr><td class="label">Status</td><td class="value"><span class="badge badge-yellow">Bank Processing</span></td></tr>
          </table>
        </div>

        <p class="p"><strong>100% Settlement Guarantee:</strong> You do not need to worry. If your account does not reflect the credit within 30 minutes, our finance operations desk will directly intervene or initiate an alternate instant transfer. You can directly call our Support Lead at <strong>+91 7604092333</strong>.</p>
      `;
      return {
        subject,
        html: wrapInCashAllLayout(subject, body),
        text: `Assurance: Payout of ${formattedTotal} for Order #${orderNumber} is processed from our end and clearing via bank. Call +91 7604092333 for immediate escalation.`,
      };
    }

    // 6. Pickup rescheduled
    case "PICKUP_RESCHEDULED": {
      const subject = `Pickup Rescheduled: Order #${orderNumber} (${deviceName}) | CashALL`;
      const body = `
        <h1 class="h1">Doorstep Pickup Rescheduled</h1>
        <p class="p">Dear <strong>${customerName}</strong>,</p>
        <p class="p">As per your request / operational arrangement, your doorstep pickup for <strong>${deviceName}</strong> (Order <strong>#${orderNumber}</strong>) has been successfully rescheduled.</p>

        <div class="card">
          <table class="table">
            <tr><td class="label">Order Number</td><td class="value">#${orderNumber}</td></tr>
            <tr><td class="label">Device</td><td class="value">${deviceName}</td></tr>
            <tr><td class="label">New Scheduled Slot</td><td class="value highlight">${newPickupTime || promisedDate}</td></tr>
            <tr><td class="label">Assigned Executive</td><td class="value">${agentName}</td></tr>
            <tr><td class="label">Price Guarantee</td><td class="value">Locked & Protected</td></tr>
          </table>
        </div>

        <p class="p">Please ensure your device is backed up and charged before our executive arrives. Zero charges apply for rescheduling.</p>
      `;
      return {
        subject,
        html: wrapInCashAllLayout(subject, body, { text: "Manage My Order", url: `https://www.cashall.in/order/${orderNumber}` }),
        text: `Order #${orderNumber} rescheduled to ${newPickupTime || promisedDate}. Executive: ${agentName}.`,
      };
    }

    // 7. Logistics executive delayed
    case "EXECUTIVE_DELAY_NOTICE": {
      const subject = `Running Late Notice: Order #${orderNumber} Doorstep Executive Delay | CashALL`;
      const body = `
        <h1 class="h1">Executive Running Slightly Late</h1>
        <p class="p">Dear <strong>${customerName}</strong>,</p>
        <p class="p">Our logistics executive, <strong>${agentName}</strong>, is on the way to your address for Order <strong>#${orderNumber}</strong> (${deviceName}), but is facing unexpected traffic / weather delays.</p>

        <div class="card">
          <table class="table">
            <tr><td class="label">Order Number</td><td class="value">#${orderNumber}</td></tr>
            <tr><td class="label">Estimated Arrival</td><td class="value highlight">${newPickupTime || "Within 30-45 minutes"}</td></tr>
            <tr><td class="label">Assigned Executive</td><td class="value">${agentName}</td></tr>
          </table>
        </div>

        <p class="p">We sincerely apologize for the inconvenience. If you would prefer to adjust the timing, simply inform the executive or contact our helpline at <strong>+91 7604092333</strong>.</p>
      `;
      return {
        subject,
        html: wrapInCashAllLayout(subject, body),
        text: `Executive ${agentName} is slightly delayed for Order #${orderNumber}. ETA: ${newPickupTime || '30-45 minutes'}.`,
      };
    }

    // 8. Order cancelled by customer (Zero fee policy)
    case "DEAL_CANCELLED_FREE_POLICY": {
      const subject = `Order Cancelled: Order #${orderNumber} — Zero Cancellation Fee | CashALL`;
      const body = `
        <h1 class="h1">Order Cancellation Confirmation</h1>
        <p class="p">Dear <strong>${customerName}</strong>,</p>
        <p class="p">Your buyback request for <strong>${deviceName}</strong> (Order <strong>#${orderNumber}</strong>) has been marked as cancelled as per your decision.</p>

        <div class="card">
          <table class="table">
            <tr><td class="label">Order Number</td><td class="value">#${orderNumber}</td></tr>
            <tr><td class="label">Device Handed Back</td><td class="value">${deviceName}</td></tr>
            <tr><td class="label">Cancellation Charge</td><td class="value" style="color: #4ade80;">₹0 (Free Evaluation)</td></tr>
          </table>
        </div>

        <p class="p">At CashALL, doorstep evaluation is always 100% free with no obligation to sell. Whenever you wish to sell your gadgets in the future, we would be delighted to serve you again!</p>
      `;
      return {
        subject,
        html: wrapInCashAllLayout(subject, body, { text: "Explore Other Device Values", url: `https://www.cashall.in/sell` }),
        text: `Order #${orderNumber} cancelled. Zero cancellation charges apply. Thank you for considering CashALL.`,
      };
    }

    // 9. Policy security rejection (iCloud lock / FRP / lack of ID)
    case "POLICY_SECURITY_REJECTION": {
      const subject = `Inspection Notice: Order #${orderNumber} Unable to Complete Due to Security Policy | CashALL`;
      const body = `
        <h1 class="h1">Transaction Ineligibility Notice</h1>
        <p class="p">Dear <strong>${customerName}</strong>,</p>
        <p class="p">During the doorstep verification for Order <strong>#${orderNumber}</strong> (${deviceName}), our logistics team was unable to complete the purchase due to compliance with second-hand consumer protection laws.</p>

        <div class="card">
          <table class="table">
            <tr><td class="label">Order Number</td><td class="value">#${orderNumber}</td></tr>
            <tr><td class="label">Reason for Non-Acceptance</td><td class="value" style="color: #f87171;">${reason || "Device account lock active (iCloud / Google FRP) or unverified ownership proof"}</td></tr>
          </table>
        </div>

        <p class="p">As per Indian regulatory guidelines and CashALL security protocol, devices with active security locks or unresolved ownership verification cannot be acquired. If you are able to resolve the account lock or produce purchase proof, feel free to book a fresh order anytime.</p>
      `;
      return {
        subject,
        html: wrapInCashAllLayout(subject, body),
        text: `Order #${orderNumber} could not be completed: ${reason || 'Active security lock or unverified ownership proof'}.`,
      };
    }

    // 10. Beneficiary account change consent
    case "BENEFICIARY_CHANGE_CONSENT": {
      const subject = `Consent Recorded: Order #${orderNumber} Payout Beneficiary Details | CashALL`;
      const body = `
        <h1 class="h1">Payout Beneficiary Acknowledged</h1>
        <p class="p">Dear <strong>${customerName}</strong>,</p>
        <p class="p">This notice confirms that as requested by you during doorstep settlement of Order <strong>#${orderNumber}</strong>, the payout of <strong>${formattedTotal}</strong> has been directed to your designated alternate account/UPI beneficiary.</p>

        <div class="card">
          <table class="table">
            <tr><td class="label">Order Number</td><td class="value">#${orderNumber}</td></tr>
            <tr><td class="label">Payout Amount</td><td class="value highlight">${formattedTotal}</td></tr>
            ${utrNumber ? `<tr><td class="label">Transaction Reference (UTR)</td><td class="value">${utrNumber}</td></tr>` : ""}
            <tr><td class="label">Authorization Basis</td><td class="value">Customer Doorstep Verbal & OTP Consent</td></tr>
          </table>
        </div>

        <p class="p">This email serves as an audit record for financial and tax reconciliation.</p>
      `;
      return {
        subject,
        html: wrapInCashAllLayout(subject, body),
        text: `Beneficiary payout consent recorded for Order #${orderNumber}. Amount: ${formattedTotal} (UTR: ${utrNumber || 'Success'}).`,
      };
    }

    // 11. Rental security deposit refund
    case "RENTAL_DEPOSIT_REFUND": {
      const subject = `Refund Processed: Order #${orderNumber} Security Deposit Refund | CashALL Rentals`;
      const body = `
        <h1 class="h1">Rental Deposit Refund Initiated</h1>
        <p class="p">Dear <strong>${customerName}</strong>,</p>
        <p class="p">We have received and inspected your rented console / device under Order <strong>#${orderNumber}</strong> in satisfactory condition. Your full security deposit has been refunded.</p>

        <div class="card">
          <table class="table">
            <tr><td class="label">Rental Order</td><td class="value">#${orderNumber}</td></tr>
            <tr><td class="label">Refund Amount</td><td class="value highlight">${formattedTotal}</td></tr>
            ${utrNumber ? `<tr><td class="label">Refund Reference (UTR)</td><td class="value">${utrNumber}</td></tr>` : ""}
            <tr><td class="label">Status</td><td class="value"><span class="badge badge-green">Refund Processed</span></td></tr>
          </table>
        </div>

        <p class="p">Thank you for gaming with CashALL Rentals! We hope to see you again soon.</p>
      `;
      return {
        subject,
        html: wrapInCashAllLayout(subject, body),
        text: `Refund of ${formattedTotal} security deposit for rental order #${orderNumber} has been processed.`,
      };
    }

    default:
      throw new Error(`Unsupported scenario: ${scenario}`);
  }
}
