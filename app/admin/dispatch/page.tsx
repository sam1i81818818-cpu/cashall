"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Navigation,
  Radio,
  MapPin,
  Clock,
  PhoneCall,
  Zap,
  RotateCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  Compass,
  Battery,
  Wifi,
  Layers,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  DollarSign,
  Shield,
  Bike,
  Activity,
  Warehouse,
} from "lucide-react";

interface TechnicianRun {
  id: string;
  name: string;
  phone: string;
  code: string;
  role: string;
  status: "AT_DOORSTEP" | "IN_TRANSIT" | "IDLE" | "ALERT";
  currentOrder?: {
    orderNumber: string;
    device: string;
    grade: string;
    address: string;
    customerPhone: string;
  };
  hub: string;
  remainingFloat: number;
  batteryPercent: number;
  speedKmH: number;
  slaStatus: string;
  completedStops: number;
  totalStops: number;
  nextStopLocation: string;
}

const INITIAL_TECHNICIANS: TechnicianRun[] = [
  {
    id: "tech-1",
    name: "Hyder Ali",
    phone: "9874063573",
    code: "#TECH-CCU-084",
    role: "L3 Apple & Flagship Master",
    status: "AT_DOORSTEP",
    currentOrder: {
      orderNumber: "ORD-8842",
      device: "iPhone 14 Pro Max (128GB)",
      grade: "Grade A",
      address: "Park Street, Kolkata Central",
      customerPhone: "98300 44211",
    },
    hub: "CCU-01 Central Hub",
    remainingFloat: 140200,
    batteryPercent: 84,
    speedKmH: 0,
    slaStatus: "+8m Ahead SLA",
    completedStops: 4,
    totalStops: 6,
    nextStopLocation: "ORD-8851 (Salt Lake Sector 5)",
  },
  {
    id: "tech-2",
    name: "Md. Arshad",
    phone: "9062775880",
    code: "#TECH-CCU-019",
    role: "MacBook & Laptop Specialist",
    status: "IN_TRANSIT",
    currentOrder: {
      orderNumber: "ORD-8849",
      device: "MacBook Air M2 (Midnight 512GB)",
      grade: "Grade A+",
      address: "New Town Action Area 1",
      customerPhone: "98741 22901",
    },
    hub: "CCU-01 Central Hub",
    remainingFloat: 85000,
    batteryPercent: 68,
    speedKmH: 34,
    slaStatus: "ETA 11m (3.8 km)",
    completedStops: 3,
    totalStops: 5,
    nextStopLocation: "ORD-8860 (Rajarhat Expressway)",
  },
  {
    id: "tech-3",
    name: "Gulrez Naushad",
    phone: "9361433238",
    code: "#TECH-DEL-032",
    role: "Multi-Category Certified",
    status: "IDLE",
    hub: "DEL-02 Central Hub",
    remainingFloat: 180000,
    batteryPercent: 95,
    speedKmH: 0,
    slaStatus: "Standby at Depot",
    completedStops: 0,
    totalStops: 4,
    nextStopLocation: "Ready for Smart Allocation",
  },
  {
    id: "tech-4",
    name: "Shakti Thakur",
    phone: "9118770223",
    code: "#TECH-DEL-055",
    role: "Senior Field Evaluator",
    status: "IN_TRANSIT",
    currentOrder: {
      orderNumber: "ORD-8864",
      device: "Samsung Galaxy S24 Ultra (256GB)",
      grade: "Grade A",
      address: "Connaught Place Radial 3",
      customerPhone: "98112 00921",
    },
    hub: "DEL-02 Central Hub",
    remainingFloat: 120500,
    batteryPercent: 72,
    speedKmH: 28,
    slaStatus: "ETA 15m (4.2 km)",
    completedStops: 2,
    totalStops: 5,
    nextStopLocation: "ORD-8871 (Karol Bagh Metro)",
  },
  {
    id: "tech-5",
    name: "Sk. Wasim",
    phone: "8981436450",
    code: "#TECH-BLR-041",
    role: "Smart Tech Evaluator",
    status: "ALERT",
    currentOrder: {
      orderNumber: "ORD-8870",
      device: "Google Pixel 8 Pro (128GB)",
      grade: "Grade B",
      address: "Whitefield Railway Buffer",
      customerPhone: "94481 02931",
    },
    hub: "BLR-01 Mother Hub",
    remainingFloat: 65000,
    batteryPercent: 42,
    speedKmH: 12,
    slaStatus: "Boundary Alert: Zone R-4",
    completedStops: 3,
    totalStops: 6,
    nextStopLocation: "ORD-8878 (Marathahalli Bridge)",
  },
];

export default function AdminDispatchConsolePage() {
  const [technicians, setTechnicians] = useState<TechnicianRun[]>(INITIAL_TECHNICIANS);
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [selectedHub, setSelectedHub] = useState<string>("ALL");
  const [telemetrySeconds, setTelemetrySeconds] = useState(3);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetrySeconds((prev) => (prev <= 1 ? 4 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const filteredTechnicians = useMemo(() => {
    return technicians.filter((tech) => {
      if (selectedFilter !== "ALL" && tech.status !== selectedFilter) return false;
      if (selectedHub !== "ALL" && !tech.hub.includes(selectedHub)) return false;
      return true;
    });
  }, [technicians, selectedFilter, selectedHub]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row w-full max-w-full">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Operational Command Ribbon */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <Link href="/admin" className="hover:text-slate-800 transition">Admin</Link>
                <span>/</span>
                <span className="hover:text-slate-800 transition">Logistics</span>
                <span>/</span>
                <Link href="/admin/agents" className="hover:text-slate-800 transition">Agents</Link>
                <span>/</span>
                <span className="text-amber-600 font-extrabold">Live Route Dispatch</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Field Manifest & Live Route Dispatch
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  NODE SYNC: 1.2s LATENCY
                </span>
              </div>
            </div>

            {/* Quick Control Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <Clock className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                <span className="text-slate-500 mr-1">Telemetry:</span>
                <span className="font-mono font-bold text-slate-900">Live ({telemetrySeconds}s)</span>
              </div>

              <button
                onClick={() => showToast("Fleet broadcast transmitted to all active field agents.")}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-200 transition"
              >
                Fleet Broadcast
              </button>

              <button
                onClick={() => showToast("Recalculating dynamic travel corridors for active routes...")}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-200 transition"
              >
                Recalculate Corridors
              </button>

              <button
                onClick={() => showToast("Smart Auto-Dispatch Batch executed successfully!")}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-xl text-xs shadow-sm transition flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Smart Auto-Dispatch Batch</span>
              </button>
            </div>
          </div>

          {/* Filter Bar & Segment Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm items-center">
            {/* Hub Selector */}
            <div className="md:col-span-4 flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <Warehouse className="w-4 h-4 text-amber-600" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Dispatch Sector</div>
                <select
                  value={selectedHub}
                  onChange={(e) => setSelectedHub(e.target.value)}
                  className="bg-transparent font-bold text-xs text-slate-900 focus:outline-none w-full cursor-pointer"
                >
                  <option value="ALL">All Hub Sectors (NCR, CCU, BLR, BOM)</option>
                  <option value="CCU">CCU-01 (Kolkata Central Node)</option>
                  <option value="DEL">DEL-02 (Delhi NCR Central Node)</option>
                  <option value="BLR">BLR-01 (Bengaluru Mother Node)</option>
                </select>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="md:col-span-8 flex items-center gap-1.5 overflow-x-auto py-1">
              {[
                { label: "All Technicians", value: "ALL", count: technicians.length },
                { label: "In Transit", value: "IN_TRANSIT", count: technicians.filter((t) => t.status === "IN_TRANSIT").length },
                { label: "At Doorstep", value: "AT_DOORSTEP", count: technicians.filter((t) => t.status === "AT_DOORSTEP").length },
                { label: "Depot Idle", value: "IDLE", count: technicians.filter((t) => t.status === "IDLE").length },
                { label: "Boundary Alert", value: "ALERT", count: technicians.filter((t) => t.status === "ALERT").length },
              ].map((pill) => (
                <button
                  key={pill.value}
                  onClick={() => setSelectedFilter(pill.value)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition ${
                    selectedFilter === pill.value
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>{pill.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      selectedFilter === pill.value ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {pill.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 6 Live Telemetry KPI Metrics Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase">Scheduled</span>
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black text-slate-900">142</div>
                <div className="text-[10px] text-emerald-600 font-bold mt-0.5">+18% vs wk avg</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase">Completed</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black text-slate-900">88</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">61.9% Settled</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase">In-Flight Runs</span>
                <Bike className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black text-slate-900">36</div>
                <div className="text-[10px] text-amber-600 font-bold mt-0.5">22 active legs</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase">Pending Slot</span>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black text-rose-600">18</div>
                <div className="text-[10px] text-rose-500 font-bold mt-0.5">Needs Slot</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase">On-Time SLA</span>
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black text-slate-900">97.4%</div>
                <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Target: &gt;95%</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase">Float Transit</span>
                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="mt-2">
                <div className="text-xl font-black text-amber-600">₹14.80L</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">Cash + UPI</div>
              </div>
            </div>
          </div>

          {/* Split Stage: Spatial Topology Map (45%) & Technician Manifest (55%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT SIDE: Spatial Topology Map */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="font-extrabold text-xs text-slate-900">
                      Dynamic Corridor Mesh: Metro Grid
                    </div>
                    <div className="text-[11px] text-slate-400">
                      3 Corridors · 1 Geofence Warning · 24 Field Radii
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  LIVE GPS FEED
                </span>
              </div>

              {/* Spatial Canvas SVG */}
              <div className="relative w-full h-[480px] bg-slate-100 overflow-hidden select-none">
                <svg className="absolute inset-0 w-full h-full text-slate-200" height="100%" width="100%">
                  <defs>
                    <pattern id="grid-dispatch" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.6" />
                      <circle cx="0" cy="0" r="1.5" fill="#94a3b8" opacity="0.4" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-dispatch)" />

                  {/* Corridor 1 Path */}
                  <path
                    d="M 100 160 C 150 170, 190 260, 260 300"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                  />
                  {/* Corridor 2 Path */}
                  <path
                    d="M 140 70 C 150 130, 190 190, 220 250"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Buffer Corridor */}
                  <path
                    d="M 50 280 Q 120 350 250 400"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    strokeDasharray="2 3"
                    opacity="0.6"
                  />
                </svg>

                {/* Restricted Perimeter Warning Chip */}
                <div className="absolute top-4 right-4 bg-rose-100 border border-rose-300 text-rose-800 px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1.5 text-[11px] font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>RESTRICTED PERIMETER: ZONE R-4</span>
                </div>

                {/* Central Mother Hub */}
                <div className="absolute top-[150px] left-[90px] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shadow-lg border-2 border-white">
                    <Warehouse className="w-4 h-4" />
                  </div>
                  <span className="bg-slate-900 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                    Central Nodal Hub
                  </span>
                </div>

                {/* Tech 1 Marker */}
                <div className="absolute top-[290px] left-[250px] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                    HA
                  </div>
                  <span className="bg-white text-slate-800 font-bold text-[9px] px-2 py-0.5 rounded shadow border border-slate-200 mt-1 whitespace-nowrap">
                    Hyder Ali (At Doorstep)
                  </span>
                </div>

                {/* Tech 2 Marker */}
                <div className="absolute top-[240px] left-[210px] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center shadow-lg border-2 border-white">
                    MA
                  </div>
                  <span className="bg-white text-slate-800 font-bold text-[9px] px-2 py-0.5 rounded shadow border border-slate-200 mt-1 whitespace-nowrap">
                    Md. Arshad (In Transit)
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Technician Manifest Cards */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Active Technician Manifest
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
                    {filteredTechnicians.length} Roster Runs
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">Sorted by: SLA Priority & Drift</span>
              </div>

              {filteredTechnicians.map((tech) => (
                <div
                  key={tech.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-950 font-black flex items-center justify-center text-sm border border-amber-300">
                        {tech.name.split(" ").map((n) => n[0]).join("")}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{tech.name}</span>
                          <span className="text-slate-400 font-mono text-[11px]">{tech.code}</span>
                          <span className="px-2 py-0.2 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                            {tech.role}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <span
                            className={`font-bold flex items-center gap-1 ${
                              tech.status === "AT_DOORSTEP"
                                ? "text-amber-600"
                                : tech.status === "IN_TRANSIT"
                                ? "text-sky-600"
                                : tech.status === "ALERT"
                                ? "text-rose-600"
                                : "text-slate-500"
                            }`}
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            {tech.status === "AT_DOORSTEP"
                              ? "At Customer Doorstep"
                              : tech.status === "IN_TRANSIT"
                              ? "En Route in Transit"
                              : tech.status === "ALERT"
                              ? "Boundary Perimeter Warning"
                              : "Standby Idle at Depot"}
                          </span>
                          <span>•</span>
                          <span>{tech.hub}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          tech.status === "ALERT"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {tech.slaStatus}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Stop {tech.completedStops} of {tech.totalStops} (
                        {Math.round((tech.completedStops / Math.max(1, tech.totalStops)) * 100)}%)
                      </span>
                    </div>
                  </div>

                  {/* Job Details Micro-Strip */}
                  {tech.currentOrder && (
                    <div className="bg-slate-50 p-3 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border border-slate-100">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Device Order</div>
                        <div className="font-bold text-slate-900 truncate mt-0.5">
                          {tech.currentOrder.orderNumber}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{tech.currentOrder.device}</div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Float Left</div>
                        <div className="font-mono font-black text-amber-700 text-sm mt-0.5">
                          ₹{tech.remainingFloat.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-slate-400">Cash + Escrow</div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Telemetry</div>
                        <div className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                          <Battery className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{tech.batteryPercent}% Battery</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{tech.speedKmH} km/h GPS Speed</div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Customer</div>
                        <div className="font-mono font-bold text-slate-800 mt-0.5">
                          {tech.currentOrder.customerPhone}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-bold">Door OTP Verified</div>
                      </div>
                    </div>
                  )}

                  {/* Actions Toolbar */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500">
                      Next: <strong className="text-slate-800">{tech.nextStopLocation}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast(`Pinged ${tech.name} on Cashall Rider App`)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                      >
                        Ping
                      </button>

                      <a
                        href={`tel:${tech.phone}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Dial</span>
                      </a>

                      <button
                        onClick={() => showToast(`Top-up authorization token sent for ${tech.name}`)}
                        className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl text-xs shadow-xs transition"
                      >
                        Top-up Float
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom duration-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>{toastMessage}</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
