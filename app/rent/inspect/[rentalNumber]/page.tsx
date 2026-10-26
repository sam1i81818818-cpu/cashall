"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Save,
  Video,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";

export default function Ps5InspectionFormPage() {
  const params = useParams();
  const rentalNumber = String(params.rentalNumber || "");

  const [rental, setRental] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Hardware Details
  const [consoleSerial, setConsoleSerial] = useState("");
  const [controller1Serial, setController1Serial] = useState("");
  const [controller2Serial, setController2Serial] = useState("");

  // Accessories Checklist
  const [powerCable, setPowerCable] = useState(true);
  const [hdmiCable, setHdmiCable] = useState(true);
  const [typecCable, setTypecCable] = useState(true);
  const [baseStand, setBaseStand] = useState(true);
  const [carryingCase, setCarryingCase] = useState(true);

  // Video Inspection Checklist
  const [outerBodyOk, setOuterBodyOk] = useState(true);
  const [portsOk, setPortsOk] = useState(true);
  const [sealIntact, setSealIntact] = useState(true);
  const [buttonsTested, setButtonsTested] = useState(true);
  const [stickDriftChecked, setStickDriftChecked] = useState(true);
  const [videoRecorded, setVideoRecorded] = useState(true);

  // Video URL & Agent Info
  const [videoUrl, setVideoUrl] = useState("");
  const [agentName, setAgentName] = useState("");

  // Signatures (Base64 data URLs)
  const [customerSig, setCustomerSig] = useState<string>("");
  const [agentSig, setAgentSig] = useState<string>("");

  const customerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const agentCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawingCustomer, setIsDrawingCustomer] = useState(false);
  const [isDrawingAgent, setIsDrawingAgent] = useState(false);

  const fetchRental = useCallback(async () => {
    if (!rentalNumber) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/rentals/${rentalNumber}?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && data.rental) {
        const r = data.rental;
        setRental(r);
        setConsoleSerial(r.consoleSerialNumber || "");
        setController1Serial(r.controller1SerialNumber || "");
        setController2Serial(r.controller2SerialNumber || "");
        setVideoUrl(r.preDeliveryVideoUrl || "");
        setAgentName(r.assignedAgentName || "");
        if (r.customerSignature) setCustomerSig(r.customerSignature);
        if (r.agentSignature) setAgentSig(r.agentSignature);

        if (r.accessoriesDelivered) {
          setPowerCable(Boolean(r.accessoriesDelivered.powerCable));
          setHdmiCable(Boolean(r.accessoriesDelivered.hdmiCable));
          setTypecCable(Boolean(r.accessoriesDelivered.typecCable));
          setBaseStand(Boolean(r.accessoriesDelivered.baseStand));
          setCarryingCase(Boolean(r.accessoriesDelivered.carryingCase));
        }

        if (r.inspectionChecklist) {
          setOuterBodyOk(Boolean(r.inspectionChecklist.outerBodyIntact));
          setPortsOk(Boolean(r.inspectionChecklist.portsOk));
          setSealIntact(Boolean(r.inspectionChecklist.sealIntact));
          setButtonsTested(Boolean(r.inspectionChecklist.buttonsTested));
          setStickDriftChecked(Boolean(r.inspectionChecklist.stickDriftChecked));
          setVideoRecorded(Boolean(r.inspectionChecklist.videoRecorded));
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load rental details");
    } finally {
      setLoading(false);
    }
  }, [rentalNumber]);

  useEffect(() => {
    fetchRental();
  }, [fetchRental]);

  // Canvas drawing handlers
  const startDrawing = (e: any, isCustomer: boolean) => {
    const canvas = isCustomer ? customerCanvasRef.current : agentCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    if (isCustomer) setIsDrawingCustomer(true);
    else setIsDrawingAgent(true);
  };

  const draw = (e: any, isCustomer: boolean) => {
    if (isCustomer && !isDrawingCustomer) return;
    if (!isCustomer && !isDrawingAgent) return;
    const canvas = isCustomer ? customerCanvasRef.current : agentCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (isCustomer: boolean) => {
    const canvas = isCustomer ? customerCanvasRef.current : agentCanvasRef.current;
    if (!canvas) return;
    if (isCustomer) {
      setIsDrawingCustomer(false);
      setCustomerSig(canvas.toDataURL());
    } else {
      setIsDrawingAgent(false);
      setAgentSig(canvas.toDataURL());
    }
  };

  const clearCanvas = (isCustomer: boolean) => {
    const canvas = isCustomer ? customerCanvasRef.current : agentCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isCustomer) setCustomerSig("");
    else setAgentSig("");
  };

  const handleSaveForm = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`/api/v1/rentals/${rentalNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "inspection",
          consoleSerialNumber: consoleSerial,
          controller1SerialNumber: controller1Serial,
          controller2SerialNumber: controller2Serial,
          accessoriesDelivered: {
            powerCable,
            hdmiCable,
            typecCable,
            baseStand,
            carryingCase,
          },
          inspectionChecklist: {
            outerBodyIntact: outerBodyOk,
            portsOk,
            sealIntact,
            buttonsTested,
            stickDriftChecked,
            videoRecorded,
          },
          preDeliveryVideoUrl: videoUrl,
          assignedAgentName: agentName,
          customerSignature: customerSig,
          agentSignature: agentSig,
          paymentStatus: "PAID",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Handover Form & Undertaking successfully saved and signed!");
      } else {
        setError(data.error || "Failed to save form.");
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4">
        <div className="w-10 h-10 border-2 border-brand-yellow border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4">
        Rental booking not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans p-4 sm:p-8 print:p-0 print:bg-white">
      {/* SCREEN-ONLY TOP ACTION BAR */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/rent/track/${rental.rentalNumber}`}
          className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-black bg-white px-3.5 py-2 rounded-xl border border-gray-300 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tracking</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-xs font-bold text-gray-800 hover:text-black bg-white px-4 py-2 rounded-xl border border-gray-300 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4 text-brand-black" />
            <span>Print Form (PDF)</span>
          </button>

          <button
            onClick={handleSaveForm}
            disabled={saving}
            className="flex items-center gap-2 text-xs font-black text-black bg-brand-yellow hover:bg-yellow-400 px-5 py-2 rounded-xl shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save & Sign Off"}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="max-w-4xl mx-auto mb-4 p-3 rounded-xl bg-green-100 border border-green-300 text-green-800 text-xs font-bold flex items-center gap-2 print:hidden">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="max-w-4xl mx-auto mb-4 p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs font-bold flex items-center gap-2 print:hidden">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* PRINTABLE OFFICIAL FORM CONTAINER */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-2xl shadow-xl p-8 sm:p-12 space-y-8 print:shadow-none print:border-none print:p-4">
        {/* HEADER */}
        <div className="border-b-2 border-blue-900 pb-4 text-center space-y-1">
          <div className="text-xl font-black text-blue-900 tracking-wider">CASHALL</div>
          <div className="text-xs text-gray-600 font-semibold">(Aarna Enterprises)</div>
          <h1 className="text-base sm:text-lg font-black bg-blue-900 text-white py-1.5 px-4 rounded mt-2 uppercase tracking-wide">
            PS5 Rental Delivery & Inspection Form
          </h1>
        </div>

        {/* SECTION 1: DELIVERY & CUSTOMER DETAILS */}
        <div className="border border-gray-300 rounded-xl overflow-hidden">
          <div className="bg-blue-50 px-4 py-2 border-b border-gray-300 font-black text-xs text-blue-950 uppercase">
            1. Delivery & Customer Details (Agent to fill on spot)
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-gray-600">Order / Receipt ID:</span>{" "}
              <strong className="font-mono text-black text-sm">{rental.rentalNumber}</strong>
            </div>
            <div>
              <span className="font-bold text-gray-600">Govt ID Type & No:</span>{" "}
              <strong>{rental.govtIdType || "Aadhaar"} - {rental.govtIdNumber || "Verified on Spot"}</strong>
            </div>
            <div>
              <span className="font-bold text-gray-600">Delivery Date:</span> {rental.startDate}
            </div>
            <div>
              <span className="font-bold text-gray-600">Expected Return Date:</span>{" "}
              <strong className="text-blue-900">{rental.endDate}</strong>
            </div>
            <div>
              <span className="font-bold text-gray-600">Customer Full Name:</span>{" "}
              <strong className="text-black">{rental.customerName}</strong>
            </div>
            <div>
              <span className="font-bold text-gray-600">Customer Mobile No:</span> {rental.customerPhone}
            </div>
            <div className="sm:col-span-2">
              <span className="font-bold text-gray-600">Delivery Address:</span>{" "}
              {rental.deliveryAddress}, PIN: {rental.pincode}
            </div>
          </div>
        </div>

        {/* SECTION 2: HARDWARE & EQUIPMENT DETAILS */}
        <div className="border border-gray-300 rounded-xl overflow-hidden">
          <div className="bg-blue-50 px-4 py-2 border-b border-gray-300 font-black text-xs text-blue-950 uppercase">
            2. Hardware & Equipment Details
          </div>
          <div className="p-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-gray-700 block mb-1">A. PlayStation 5 Console Unit:</span>
                <div className="text-gray-800 mb-2 font-semibold">Model: {rental.consoleModel}</div>
                <label className="text-[11px] font-bold text-gray-600 block">Console Serial Number (S/N):</label>
                <input
                  type="text"
                  value={consoleSerial}
                  onChange={(e) => setConsoleSerial(e.target.value)}
                  placeholder="e.g. S01-F12345678-PS5"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs font-mono mt-0.5 focus:border-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <span className="font-bold text-gray-700 block mb-1">B. DualSense Wireless Controllers:</span>
                <label className="text-[11px] font-bold text-gray-600 block">Controller 1 S/N:</label>
                <input
                  type="text"
                  value={controller1Serial}
                  onChange={(e) => setController1Serial(e.target.value)}
                  placeholder="Controller 1 Serial No."
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs font-mono mt-0.5 mb-2 focus:border-blue-900 focus:outline-none"
                />

                <label className="text-[11px] font-bold text-gray-600 block">Controller 2 S/N (If rented):</label>
                <input
                  type="text"
                  value={controller2Serial}
                  onChange={(e) => setController2Serial(e.target.value)}
                  placeholder="Controller 2 Serial No."
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs font-mono mt-0.5 focus:border-blue-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <span className="font-bold text-gray-700 block mb-2">C. Accessories Provided (Tick items delivered):</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={powerCable}
                    onChange={(e) => setPowerCable(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-900"
                  />
                  <span>Power Cable</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hdmiCable}
                    onChange={(e) => setHdmiCable(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-900"
                  />
                  <span>HDMI 2.1 Cable</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={typecCable}
                    onChange={(e) => setTypecCable(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-900"
                  />
                  <span>Type-C Cable</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={baseStand}
                    onChange={(e) => setBaseStand(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-900"
                  />
                  <span>Console Base Stand</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={carryingCase}
                    onChange={(e) => setCarryingCase(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-900"
                  />
                  <span>Carrying Case / Bag</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: VIDEO INSPECTION & REPAIR LIABILITY UNDERTAKING */}
        <div className="border border-red-300 bg-red-50/40 rounded-xl overflow-hidden">
          <div className="bg-red-800 text-white px-4 py-2 font-black text-xs uppercase tracking-wide">
            3. Mandatory Video Inspection & Repair Liability Undertaking
          </div>

          <div className="p-4 space-y-4 text-xs leading-relaxed text-gray-800">
            <div>
              <strong className="text-red-950">1. Pre-Delivery Video Proof & Recording:</strong>
              <p className="mt-0.5 text-gray-700">
                The delivery agent records a detailed live video showing physical condition, ports, warranty seals, and working status of the PS5 Console and DualSense Controller(s) prior to handover.
              </p>
            </div>

            <div>
              <strong className="text-red-950">2. Return Verification & Physical Matching:</strong>
              <p className="mt-0.5 text-gray-700">
                At return, the PS5 Console and Controller(s) are inspected again. The returned equipment <strong>MUST MATCH EXACTLY</strong> with the pre-delivery video recording in terms of physical condition, working status, body seal, and serial numbers.
              </p>
            </div>

            <div>
              <strong className="text-red-950">3. Damage & Repair Expense Liability:</strong>
              <p className="mt-0.5 text-gray-700">
                If physical damage, body cracks, deep scratches, liquid spills, stick drift due to impact, port damage, or internal hardware/seal tampering is found upon return:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-700">
                <li>
                  <strong>100% Repair Cost:</strong> Customer undertakes to pay ALL EXPENSES incurred for official inspection, spare parts replacement, and repair.
                </li>
                <li>
                  <strong>Full Replacement Value:</strong> If rendered unrepairable or hardware/serial numbers do not match, customer agrees to pay full market replacement value.
                </li>
              </ul>
            </div>

            {/* VIDEO INSPECTION CHECKLIST */}
            <div className="pt-2 border-t border-red-200">
              <span className="font-bold text-red-950 block mb-2">Video Inspection Checklist (Jointly verified on spot):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={outerBodyOk}
                    onChange={(e) => setOuterBodyOk(e.target.checked)}
                    className="w-4 h-4 rounded text-red-700"
                  />
                  <span>[ ✓ ] PS5 Outer Body & Shell Intact</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={portsOk}
                    onChange={(e) => setPortsOk(e.target.checked)}
                    className="w-4 h-4 rounded text-red-700"
                  />
                  <span>[ ✓ ] HDMI, Power & USB Ports OK</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sealIntact}
                    onChange={(e) => setSealIntact(e.target.checked)}
                    className="w-4 h-4 rounded text-red-700"
                  />
                  <span>[ ✓ ] Warranty / Body Seal Intact</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={buttonsTested}
                    onChange={(e) => setButtonsTested(e.target.checked)}
                    className="w-4 h-4 rounded text-red-700"
                  />
                  <span>[ ✓ ] DualSense Buttons Tested</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stickDriftChecked}
                    onChange={(e) => setStickDriftChecked(e.target.checked)}
                    className="w-4 h-4 rounded text-red-700"
                  />
                  <span>[ ✓ ] Stick Drift Checked (No Drift)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={videoRecorded}
                    onChange={(e) => setVideoRecorded(e.target.checked)}
                    className="w-4 h-4 rounded text-red-700"
                  />
                  <span>[ ✓ ] Live Video Recorded & Uploaded</span>
                </label>
              </div>
            </div>

            {/* Video Proof URL Input */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                Recorded Video Proof Link / Storage URL:
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://drive.google.com/... or cloud video link"
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-mono focus:border-red-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: DIGITAL SIGNATURES */}
        <div className="border border-gray-300 rounded-xl overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-black text-xs text-gray-900 uppercase">
            4. Joint Handover Sign-Off & Acceptance
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Customer Sign-off */}
            <div className="space-y-2">
              <span className="font-black text-gray-900 block">CUSTOMER SIGN-OFF:</span>
              <p className="text-[10px] text-gray-500 italic">
                “I have received the PS5 in good condition and agree to all inspection & liability terms above.”
              </p>

              <div className="border border-gray-300 rounded-xl p-2 bg-white relative">
                {customerSig ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={customerSig} alt="Customer Signature" className="h-24 mx-auto object-contain" />
                    <button
                      type="button"
                      onClick={() => clearCanvas(true)}
                      className="absolute top-1 right-1 text-[10px] bg-gray-200 px-2 py-0.5 rounded text-gray-700 hover:bg-gray-300 print:hidden"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div>
                    <canvas
                      ref={customerCanvasRef}
                      width={320}
                      height={96}
                      className="w-full h-24 border border-dashed border-gray-300 rounded touch-none cursor-crosshair"
                      onMouseDown={(e) => startDrawing(e, true)}
                      onMouseMove={(e) => draw(e, true)}
                      onMouseUp={() => stopDrawing(true)}
                      onTouchStart={(e) => startDrawing(e, true)}
                      onTouchMove={(e) => draw(e, true)}
                      onTouchEnd={() => stopDrawing(true)}
                    />
                    <div className="text-[10px] text-gray-400 text-center mt-1 print:hidden">
                      Sign above with finger or mouse
                    </div>
                  </div>
                )}
              </div>

              <div className="text-gray-700 text-xs">
                <strong>Name:</strong> {rental.customerName}
              </div>
            </div>

            {/* Delivery Agent Sign-off */}
            <div className="space-y-2">
              <span className="font-black text-gray-900 block">DELIVERY AGENT VERIFICATION:</span>
              <p className="text-[10px] text-gray-500 italic">
                “I have tested and verified working condition and recorded pre-delivery video proof.”
              </p>

              <div className="border border-gray-300 rounded-xl p-2 bg-white relative">
                {agentSig ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={agentSig} alt="Agent Signature" className="h-24 mx-auto object-contain" />
                    <button
                      type="button"
                      onClick={() => clearCanvas(false)}
                      className="absolute top-1 right-1 text-[10px] bg-gray-200 px-2 py-0.5 rounded text-gray-700 hover:bg-gray-300 print:hidden"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div>
                    <canvas
                      ref={agentCanvasRef}
                      width={320}
                      height={96}
                      className="w-full h-24 border border-dashed border-gray-300 rounded touch-none cursor-crosshair"
                      onMouseDown={(e) => startDrawing(e, false)}
                      onMouseMove={(e) => draw(e, false)}
                      onMouseUp={() => stopDrawing(false)}
                      onTouchStart={(e) => startDrawing(e, false)}
                      onTouchMove={(e) => draw(e, false)}
                      onTouchEnd={() => stopDrawing(false)}
                    />
                    <div className="text-[10px] text-gray-400 text-center mt-1 print:hidden">
                      Agent signs above
                    </div>
                  </div>
                )}
              </div>

              <div className="text-gray-700 text-xs">
                <strong>Agent Name / ID:</strong>{" "}
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g. Vikram (Agent #A-102)"
                  className="px-2 py-0.5 border border-gray-300 rounded text-xs ml-1 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-[10px] text-gray-500 pt-4 border-t border-gray-200">
          CashALL (Aarna Enterprises) • PS5 Rental Services • Support: support@cashall.in • All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
