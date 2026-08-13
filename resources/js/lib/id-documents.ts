/**
 * Client-side wrapper for the ID document endpoints.
 * Replaces the original TanStack Start server functions (id-documents.functions.ts).
 * Real storage/validation/audit-logging logic lives in Laravel —
 * see app/Http/Controllers/IdDocumentController.php.
 */

export type IdDocKind = "tenant_id" | "tenant_proof_of_income" | "landlord_id" | "landlord_ownership_proof";

export type IdDocumentRecord = {
  id: string;
  owner_id: string;
  owner: { full_name: string | null; email: string } | null;
  kind: IdDocKind;
  slot: string;
  file_name: string;
  size_bytes: number;
  mime_type: string;
  sha256: string;
  status: "pending" | "approved" | "rejected";
  review_notes: string | null;
  created_at: string;
};

export type IdDocumentLogEntry = {
  id: string;
  action: "upload" | "view" | "download" | "review_approve" | "review_reject" | "delete";
  actor_id: string;
  actor_role: string;
  actor: { full_name: string | null; email: string } | null;
  ip_address: string | null;
  notes: string | null;
  created_at: string;
};

function getCsrfTokenFromCookie(): string {
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": getCsrfTokenFromCookie(),
      Accept: "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  return res.json();
}

export async function uploadIdDocument(input: {
  data: { kind: IdDocKind; slot: string; fileName: string; mimeType: string; dataBase64: string };
}): Promise<{ id: string; fileName: string; size: number; mimeType: string; sha256: string }> {
  return apiFetch("/id-documents", { method: "POST", body: JSON.stringify(input.data) });
}

export async function listAllIdDocuments(input: {
  data: { status?: string };
}): Promise<IdDocumentRecord[]> {
  const qs = input.data.status ? `?status=${encodeURIComponent(input.data.status)}` : "";
  return apiFetch(`/id-documents${qs}`, { method: "GET" });
}

export async function reviewIdDocument(input: {
  data: { id: string; decision: "approved" | "rejected"; notes?: string };
}): Promise<{ status: string }> {
  return apiFetch(`/id-documents/${input.data.id}/review`, {
    method: "POST",
    body: JSON.stringify({ decision: input.data.decision, notes: input.data.notes }),
  });
}

export async function getIdDocumentSignedUrl(input: {
  data: { id: string; asDownload?: boolean };
}): Promise<{ url: string }> {
  return apiFetch(`/id-documents/${input.data.id}/signed-url`, {
    method: "POST",
    body: JSON.stringify({ asDownload: input.data.asDownload ?? false }),
  });
}

export async function getDocumentAccessLog(input: {
  data: { documentId: string };
}): Promise<IdDocumentLogEntry[]> {
  return apiFetch(`/id-documents/${input.data.documentId}/access-log`, { method: "GET" });
}

export async function getMyAccessRole(): Promise<{ role: string }> {
  return apiFetch("/id-documents/my-role", { method: "GET" });
}
