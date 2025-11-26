// app/api/ai/route.js
export async function POST(request) {
  const body = await request.json();

  // In the future, call a real AI API here using `body.prompt`.
  // For now, just return a friendly static message.
  const message =
    "Here's a simple career tip: focus on building small projects consistently. ";

  return Response.json({ message });
}
