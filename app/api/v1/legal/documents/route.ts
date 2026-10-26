import { NextRequest, NextResponse } from "next/server";
import { LegalDocumentService, DEFAULT_LEGAL_DOCUMENTS, LegalDocType } from "@/lib/services/legal-document.service";

export const revalidate = 86400; // Edge cached for 24 hours

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const typeParam = searchParams.get("type") as LegalDocType | null;

  try {
    if (typeParam && DEFAULT_LEGAL_DOCUMENTS[typeParam]) {
      const doc = await LegalDocumentService.getPublishedDocument(typeParam);
      return NextResponse.json({ success: true, document: doc });
    }

    // Return all documents
    const types = Object.keys(DEFAULT_LEGAL_DOCUMENTS) as LegalDocType[];
    const documents = await Promise.all(
      types.map((t) => LegalDocumentService.getPublishedDocument(t))
    );

    return NextResponse.json(
      { success: true, documents },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
    );
  } catch (err: any) {
    // Fallback to static definitions if DB fails
    const types = Object.keys(DEFAULT_LEGAL_DOCUMENTS) as LegalDocType[];
    const documents = types.map((t) => {
      const def = DEFAULT_LEGAL_DOCUMENTS[t];
      return {
        id: `static-${t.toLowerCase()}`,
        documentType: t,
        title: def.title,
        version: def.version,
        status: "PUBLISHED",
        content: def.content,
        contentHash: LegalDocumentService.computeHash(def.content),
        effectiveDate: new Date("2026-01-01"),
        publishedAt: new Date("2026-01-01"),
        summary: def.summary,
      };
    });

    return NextResponse.json({ success: true, documents });
  }
}
