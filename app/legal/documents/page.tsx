"use client";

import React, { useEffect, useState } from "react";

interface LegalDocument {
  id: string;
  documentType: string;
  title: string;
  version: string;
  status: string;
  content: string;
  contentHash: string;
  effectiveDate: string;
  publishedAt: string;
}

const DOC_ORDER = [
  "SELLER_PURCHASE_AGREEMENT",
  "SELLER_TERMS",
  "PRIVACY_POLICY",
  "WEBSITE_TERMS",
  "INSPECTION_REVISION_POLICY",
  "PICKUP_POLICY",
  "CANCELLATION_POLICY",
  "GRIEVANCE_POLICY",
  "COOKIE_POLICY",
  "AGENT_ENGAGEMENT_AGREEMENT",
  "AGENT_PICKUP_SOP",
];

function parseMarkdown(md: string): string {
  // Group consecutive <li> elements into <ul> blocks without using /s flag
  function groupListItems(html: string): string {
    const lines = html.split("\n");
    const result: string[] = [];
    let inList = false;
    for (const line of lines) {
      if (line.startsWith("<li>")) {
        if (!inList) { result.push("<ul>"); inList = true; }
        result.push(line);
      } else {
        if (inList) { result.push("</ul>"); inList = false; }
        result.push(line);
      }
    }
    if (inList) result.push("</ul>");
    return result.join("\n");
  }

  const processed = md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^---$/gm, "<hr/>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[huplodice])(.*)/gm, (m) =>
      m.trim() ? `<p>${m}</p>` : ""
    );
  return groupListItems(processed);
}


export default function LegalDocumentsPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/legal/documents")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.documents) {
          const sorted = [...data.documents].sort((a: LegalDocument, b: LegalDocument) => {
            return DOC_ORDER.indexOf(a.documentType) - DOC_ORDER.indexOf(b.documentType);
          });
          setDocuments(sorted);
          if (sorted.length > 0) setActiveDoc(sorted[0].documentType);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const active = documents.find((d) => d.documentType === activeDoc);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-area {
            background: white !important;
            color: black !important;
            padding: 24px !important;
            font-size: 11pt;
            line-height: 1.6;
          }
          .print-area h1 { font-size: 16pt; margin-top: 24px; }
          .print-area h2 { font-size: 14pt; margin-top: 16px; }
          .print-area h3 { font-size: 12pt; margin-top: 12px; }
          .print-area p, .print-area li { font-size: 10pt; }
          .print-watermark { display: block !important; }
          .doc-page-break { page-break-before: always; }
        }
        .print-watermark { display: none; }
        .doc-content h1 { font-size: 1.2rem; font-weight: 900; margin-top: 1.5rem; color: #facc15; }
        .doc-content h2 { font-size: 1rem; font-weight: 800; margin-top: 1.2rem; color: #e5e7eb; }
        .doc-content h3 { font-size: 0.875rem; font-weight: 700; margin-top: 1rem; color: #d1d5db; }
        .doc-content p { font-size: 0.75rem; line-height: 1.7; color: #9ca3af; margin-top: 0.5rem; }
        .doc-content strong { color: #f9fafb; }
        .doc-content ul, .doc-content ol { padding-left: 1.2rem; margin-top: 0.5rem; }
        .doc-content li { font-size: 0.75rem; color: #9ca3af; line-height: 1.7; margin-bottom: 0.25rem; }
        .doc-content hr { border-color: #374151; margin: 1rem 0; }
      `}</style>

      <header className="no-print bg-neutral-900 border-b border-neutral-800 py-4 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-black text-white">CashALL Legal Documents</div>
            <div className="text-[11px] text-neutral-400">Aarna Enterprise — All Published Policies</div>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-yellow-400 text-black text-xs font-black px-4 py-2 rounded-xl hover:bg-yellow-300 transition shadow-lg"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download / Print PDF
        </button>
      </header>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-neutral-400">Loading legal documents...</p>
          </div>
        </div>
      ) : (
        <div className="flex">
          <aside className="no-print w-72 min-h-screen bg-neutral-900 border-r border-neutral-800 p-4 sticky top-16 overflow-y-auto max-h-[calc(100vh-4rem)]">
            <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3 px-1">
              Documents ({documents.length})
            </div>
            <div className="space-y-1">
              {documents.map((doc) => (
                <button
                  key={doc.documentType}
                  onClick={() => setActiveDoc(doc.documentType)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeDoc === doc.documentType
                      ? "bg-yellow-400/15 border border-yellow-400/30 text-yellow-300"
                      : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <div className="font-bold truncate">{doc.title}</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">v{doc.version} · {doc.status}</div>
                </button>
              ))}
            </div>
          </aside>

          <main className="flex-1 p-6 lg:p-10 max-w-4xl print-area">
            {/* Print header */}
            <div className="print-watermark mb-8 pb-6 border-b border-neutral-700">
              <div className="text-2xl font-black">CashALL — Legal Documents Portfolio</div>
              <div className="text-sm text-neutral-600 mt-1">Aarna Enterprise · Howrah / Kolkata, West Bengal, India</div>
              <div className="text-sm text-neutral-600">Generated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</div>
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                Some sections are marked [LAWYER REVIEW REQUIRED]. These sections are pending formal legal sign-off and should not be relied upon as final legal text.
              </div>
            </div>

            {/* Single doc view (browser) */}
            {active && (
              <div className="no-print">
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 lg:p-8 shadow-2xl mb-6">
                  <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
                    <div>
                      <div className="inline-block text-[10px] font-black text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-lg mb-2 uppercase tracking-wider">
                        {active.documentType.replace(/_/g, " ")}
                      </div>
                      <h1 className="text-lg font-black text-white leading-tight">{active.title}</h1>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-neutral-500">
                        <span>Version {active.version}</span>
                        <span>·</span>
                        <span className="text-emerald-400">{active.status}</span>
                        <span>·</span>
                        <span>Effective {new Date(active.effectiveDate).toLocaleDateString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  {active.content.includes("[LAWYER REVIEW REQUIRED") && (
                    <div className="bg-amber-950/40 border border-amber-700/50 text-amber-300 text-xs p-3.5 rounded-2xl flex items-start gap-2.5 mb-5">
                      <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>
                        This document contains sections marked <strong>[LAWYER REVIEW REQUIRED]</strong>. These sections are pending formal legal sign-off and represent draft placeholder language only.
                      </span>
                    </div>
                  )}

                  <div className="bg-neutral-950/80 border border-neutral-800 text-neutral-500 text-[10px] font-mono p-2.5 rounded-xl mb-5 flex items-center gap-2 overflow-hidden">
                    <span className="text-neutral-600 shrink-0">SHA-256:</span>
                    <span className="truncate">{active.contentHash}</span>
                  </div>

                  <div
                    className="doc-content"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(active.content) }}
                  />
                </div>

                <div className="flex justify-between">
                  {(() => {
                    const idx = documents.findIndex((d) => d.documentType === activeDoc);
                    const prev = idx > 0 ? documents[idx - 1] : null;
                    const next = idx < documents.length - 1 ? documents[idx + 1] : null;
                    return (
                      <>
                        {prev ? (
                          <button onClick={() => setActiveDoc(prev.documentType)} className="text-xs text-neutral-400 hover:text-yellow-400 flex items-center gap-1.5 transition">
                            ← {prev.title.substring(0, 40)}…
                          </button>
                        ) : <div />}
                        {next ? (
                          <button onClick={() => setActiveDoc(next.documentType)} className="text-xs text-neutral-400 hover:text-yellow-400 flex items-center gap-1.5 transition">
                            {next.title.substring(0, 40)}… →
                          </button>
                        ) : <div />}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Print view: all docs */}
            <div className="print-watermark">
              {documents.map((doc, idx) => (
                <div key={doc.documentType} className={idx > 0 ? "doc-page-break mt-12" : "mt-0"}>
                  <div className="border-b-2 border-black pb-2 mb-4">
                    <div className="text-[9pt] text-gray-500 uppercase font-bold tracking-widest">{doc.documentType.replace(/_/g, " ")}</div>
                    <h2 className="text-[14pt] font-black">{doc.title}</h2>
                    <div className="text-[9pt] text-gray-500">
                      Version {doc.version} · Effective {new Date(doc.effectiveDate).toLocaleDateString("en-IN")} · SHA-256: {doc.contentHash}
                    </div>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: parseMarkdown(doc.content) }} />
                </div>
              ))}
              <div className="mt-16 pt-8 border-t border-gray-300 text-[9pt] text-gray-500 text-center">
                <div>Aarna Enterprise (CashALL) · Kolkata, West Bengal, India</div>
                <div>Document Bundle Generated: {new Date().toLocaleString("en-IN")}</div>
                <div className="mt-1 italic">
                  All sections marked [LAWYER REVIEW REQUIRED] are pending formal legal review and should not be relied upon as final binding legal text.
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
