"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CustomerAnswersModal } from "@/components/admin/CustomerAnswersModal";
import { INITIAL_ORDERS, OrderData } from "@/lib/store";
import { ClipboardCheck, CheckCircle2, ShieldCheck, Save, Loader2, ArrowRight, ClipboardList } from "lucide-react";

function getAdminToken() {
  if (typeof window === "undefined") return "tok_admin_master_session";
  try {
    const saved = JSON.parse(localStorage.getItem("cashall_admin_session") || "{}");
    return saved?.token || "tok_admin_master_session";
  } catch {
    return "tok_admin_master_session";
  }
}

function AdminInspectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdParam = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [allOrders, setAllOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  const [imei, setImei] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [screenFinding, setScreenFinding] = useState("Flawless Screen");
  const [bodyFinding, setBodyFinding] = useState("Flawless Body");
  const [revisedPrice, setRevisedPrice] = useState<string | number>("");
  const [reason, setReason] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let initialList: OrderData[] = [];
    if (typeof window !== "undefined") {
      try {
        const rawLocal = JSON.parse(localStorage.getItem("cashall_all_orders") || "[]");
        if (Array.isArray(rawLocal) && rawLocal.length > 0) {
          initialList = rawLocal;
        }
      } catch (e) {}
    }

    if (initialList.length === 0) {
      initialList = INITIAL_ORDERS;
    }

    setAllOrders(initialList);
    setLoading(false);

    if (orderIdParam) {
      const match = initialList.find((o) => o.orderNumber === orderIdParam || o.id === orderIdParam);
      if (match) {
        setOrder(match);
        setRevisedPrice(match.revisedPrice || match.estimatedPrice || "");
        setImei(match.imeiNumber || "");
        setCustomerEmail(match.customerEmail || "");
      }
    } else if (initialList.length > 0 && !order) {
      setOrder(initialList[0]);
      setRevisedPrice(initialList[0].revisedPrice || initialList[0].estimatedPrice || "");
      setImei(initialList[0].imeiNumber || "");
      setCustomerEmail(initialList[0].customerEmail || "");
    }

    // Background fetch real orders from DB
    const token = getAdminToken();
    fetch(`/api/v1/admin/orders?limit=40`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const dbOrders = data.data?.orders || data.orders;
        if (Array.isArray(dbOrders) && dbOrders.length > 0) {
          const mapped: OrderData[] = dbOrders.map((d: any) => ({
            id: d.id,
            orderNumber: d.orderNumber,
            quoteId: d.quoteId || d.quote?.id || "",
            userId: d.userId || d.user?.id || "",
            pincode: d.pincode || d.address?.pincode || "—",
            pickupDate: d.pickupDate || "—",
            pickupTimeSlot: d.pickupTimeSlot || "10 AM - 1 PM",
            customerName: d.user?.name || d.customerName || "Customer",
            customerPhone: d.user?.phone || d.customerPhone || "—",
            customerEmail: d.user?.email || d.customerEmail || "",
            deviceName: d.deviceName || "Mobile Device",
            estimatedPrice: d.quotedPrice || d.estimatedPrice || 0,
            revisedPrice: d.requotedPrice || d.revisedPrice || d.quotedPrice || 0,
            status: d.status || "PICKUP_SCHEDULED",
            imeiNumber: d.imeiNumber || d.imeiRecords?.[0]?.code || "",
            selectedAnswersJson: d.selectedAnswersJson || d.quote?.selectedAnswersJson,
            breakdownJson: d.breakdownJson || d.quote?.breakdownJson,
            priceDifferenceReason: d.priceDifferenceReason,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt,
          }));
          setAllOrders(mapped);
          if (orderIdParam) {
            const matchDb = mapped.find((o) => o.orderNumber === orderIdParam || o.id === orderIdParam);
            if (matchDb) {
              setOrder(matchDb);
              setRevisedPrice(matchDb.revisedPrice || matchDb.estimatedPrice || "");
              setImei(matchDb.imeiNumber || "");
              setCustomerEmail(matchDb.customerEmail || "");
            }
          }
        }
      })
      .catch((e) => console.warn("Background order sync warning:", e));
  }, [orderIdParam]);

  const handleSelectOrder = (selectedOrd: OrderData) => {
    setOrder(selectedOrd);
    setRevisedPrice(selectedOrd.revisedPrice || selectedOrd.estimatedPrice || "");
    setImei(selectedOrd.imeiNumber || "");
    setCustomerEmail(selectedOrd.customerEmail || "");
    setSaved(false);
    router.push(`/admin/inspections?orderId=${selectedOrd.orderNumber}`);
  };

  const handleSaveInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setSaving(true);
    const token = getAdminToken();
    const finalValuation = Number(revisedPrice) || 0;

    try {
      const res = await fetch(`/api/v1/admin/orders/${order.orderNumber}/inspection`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          imei: imei.trim(),
          screenFinding,
          bodyFinding,
          revisedPrice: finalValuation,
          reason,
          customerEmail: customerEmail.trim(),
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        console.warn("API inspection save warn:", errorJson);
      }

      const updatedOrder: OrderData = {
        ...order,
        imeiNumber: imei.trim(),
        customerEmail: customerEmail.trim(),
        revisedPrice: finalValuation,
        priceDifferenceReason: reason,
        status: "INSPECTION_COMPLETED",
        updatedAt: new Date().toISOString(),
      };

      setOrder(updatedOrder);
      setAllOrders((prev) => prev.map((o) => (o.id === order.id || o.orderNumber === order.orderNumber ? updatedOrder : o)));

      if (typeof window !== "undefined") {
        localStorage.setItem(`cashall_order_${order.id}`, JSON.stringify(updatedOrder));
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      alert(`Error saving inspection: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Physical Inspection Console" />

        <main className="flex-1 w-full max-w-full p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {/* HEADER TOOLBAR */}
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Physical Inspections
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Device diagnosis, IMEI verification &amp; price revisions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVE INSPECTION FORM */}
          {order ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-3">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Selected Device for Inspection</div>
                  <div className="text-xl font-black text-slate-900 flex items-center gap-2 mt-0.5">
                    <span>#{order.orderNumber}</span>
                    <span className="text-amber-700">• {order.deviceName}</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Customer: <strong className="text-slate-900">{order.customerName}</strong> ({order.customerPhone})
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div>
                    <div className="text-xs text-slate-500">Initial Estimated Payout</div>
                    <div className="text-2xl font-black text-emerald-700 font-price">
                      ₹{(order.estimatedPrice || 0).toLocaleString("en-IN")}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAuditModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-amber-950 text-xs font-black rounded-xl hover:bg-amber-500 border border-amber-500 transition shadow-2xs"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>View Customer Answers (QC)</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveInspection} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* IMEI & HARDWARE VERIFICATION */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                    <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>1. Hardware & IMEI Verification</span>
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        15-Digit Device IMEI / Serial Number *
                      </label>
                      <input
                        type="text"
                        value={imei}
                        onChange={(e) => setImei(e.target.value)}
                        required
                        placeholder="e.g. 867500123456789"
                        className="w-full px-4 py-2.5 text-xs font-mono font-bold bg-white text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Customer Email Address (for Bill & Tax Invoice)
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="e.g. customer@gmail.com"
                        className="w-full px-4 py-2.5 text-xs font-bold bg-white text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Display Condition</label>
                        <select
                          value={screenFinding}
                          onChange={(e) => setScreenFinding(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400"
                        >
                          <option value="Flawless Screen">Flawless Screen</option>
                          <option value="Minor Scratches">Minor Scratches</option>
                          <option value="Heavy Scratches">Heavy Scratches</option>
                          <option value="Cracked Screen / Display Glass">Cracked Screen / Display Glass</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Body Condition</label>
                        <select
                          value={bodyFinding}
                          onChange={(e) => setBodyFinding(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400"
                        >
                          <option value="Flawless Body">Flawless Body</option>
                          <option value="Minor Dents / Scratches">Minor Dents / Scratches</option>
                          <option value="Heavy Dents / Bent Frame">Heavy Dents / Bent Frame</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* PRICE REVISION & FINAL OFFER */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                    <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-amber-600" />
                      <span>2. Rate Revision & Settled Payout</span>
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Final Agreed Purchase Price Payout (₹) *
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 25000"
                        value={revisedPrice}
                        onChange={(e) => setRevisedPrice(e.target.value)}
                        required
                        min={0}
                        className="w-full px-4 py-2.5 text-lg font-black text-emerald-700 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 font-price placeholder-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Reason for Price Revision (Optional)
                      </label>
                      <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g. Minor body scratch found during doorstep inspection"
                        className="w-full px-3 py-2 text-xs bg-white text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* SAVE BUTTON & ALERT */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {saved ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-4 py-2 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Inspection Report Saved & Payout Locked at ₹{Number(revisedPrice).toLocaleString("en-IN")}!</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">
                      Submitting locks the final payout price and marks inspection completed.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 text-xs font-black text-amber-950 bg-amber-400 hover:bg-amber-500 px-6 py-2.5 rounded-xl border border-amber-500 transition shadow-xs disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>SAVE PHYSICAL INSPECTION</span>
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          {/* ALL ORDERS CARDS FOR QUICK INSPECTION SELECTION */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Doorstep Physical Inspection Log ({allOrders.length} Orders)
              </h2>
            </div>

            <div className="space-y-3">
              {allOrders.map((ord) => (
                <div
                  key={ord.id}
                  className={`border rounded-xl p-4 transition shadow-2xs space-y-3 ${
                    order?.id === ord.id ? "border-amber-400 bg-amber-50/40" : "bg-slate-50 border-slate-200 hover:border-amber-300 hover:bg-white"
                  }`}
                >
                  {/* TOP ROW: ID + STATUS */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-black text-amber-800 text-sm">
                      #{ord.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                        ["COMPLETED", "INSPECTION_COMPLETED"].includes(ord.status)
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-amber-100 text-amber-900 border-amber-300"
                      }`}
                    >
                      {ord.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* DEVICE & PAYOUT ROW */}
                  <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl p-3">
                    <div className="min-w-0">
                      <span className="text-[11px] text-slate-500 block font-semibold">Device</span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm truncate block">
                        {ord.deviceName}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-500 block font-semibold">Settled Payout</span>
                      <span className="font-black text-emerald-700 font-price text-sm sm:text-base">
                        ₹{(ord.revisedPrice || ord.estimatedPrice || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* CUSTOMER & ACTION */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">{ord.customerName}</div>
                      {ord.customerPhone && (
                        <a
                          href={`tel:${ord.customerPhone}`}
                          className="text-[11px] text-slate-500 hover:text-amber-800 font-mono transition"
                        >
                          {ord.customerPhone}
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => handleSelectOrder(ord)}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950 bg-amber-400 hover:bg-amber-500 px-4 py-2 rounded-xl border border-amber-500 transition shadow-2xs shrink-0"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CUSTOMER ANSWERS AUDIT MODAL */}
          <CustomerAnswersModal
            isOpen={showAuditModal}
            onClose={() => setShowAuditModal(false)}
            orderOrQuote={order}
          />
        </main>
      </div>
    </div>
  );
}

export default function AdminInspectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        </div>
      }
    >
      <AdminInspectionsContent />
    </Suspense>
  );
}
