const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  if (!/^[0-9a-f-]{36}\.(jpg|png|webp)$/i.test(params.filename)) {
    return new Response("Image not found", { status: 404 });
  }

  try {
    const response = await fetch(
      `${API_URL}/api/inventory/images/${encodeURIComponent(params.filename)}`,
      { cache: "force-cache", next: { revalidate: 3600 } },
    );
    if (!response.ok) return new Response("Image unavailable", { status: response.status });
    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/octet-stream",
        "Cache-Control": response.headers.get("cache-control") || "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Image service unavailable", { status: 502 });
  }
}
