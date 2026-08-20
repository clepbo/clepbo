/** Pull readable text out of an uploaded document so Claude can use it as
 *  context. Images are not parsed here — they go to Claude as vision input. */

export const MAX_DOC_CHARS = 40_000;

export type Extracted = { text: string; pages?: number; truncated: boolean };

function clip(raw: string): Extracted {
  const text = raw.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return text.length > MAX_DOC_CHARS
    ? { text: text.slice(0, MAX_DOC_CHARS), truncated: true }
    : { text, truncated: false };
}

export async function extractText(buf: Buffer, mime: string, name: string): Promise<Extracted> {
  const ext = name.toLowerCase().split(".").pop() ?? "";

  if (mime === "application/pdf" || ext === "pdf") {
    const { extractText: pdfText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buf));
    const { text, totalPages } = await pdfText(pdf, { mergePages: true });
    return { ...clip(String(text)), pages: totalPages };
  }

  if (ext === "docx" || mime.includes("officedocument.wordprocessingml")) {
    const mammoth = await import("mammoth");
    const { value } = await mammoth.extractRawText({ buffer: buf });
    return clip(value);
  }

  // .txt, .md, .csv, .json and anything else that is plainly text
  return clip(buf.toString("utf8"));
}

export function isTextDoc(mime: string, name: string): boolean {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  return (
    mime === "application/pdf" ||
    mime.startsWith("text/") ||
    mime === "application/json" ||
    mime.includes("officedocument.wordprocessingml") ||
    ["pdf", "docx", "txt", "md", "markdown", "csv", "json"].includes(ext)
  );
}
