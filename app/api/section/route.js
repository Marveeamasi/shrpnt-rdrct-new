// GET /api/key
export async function GET() {
  const type = process.env.TYPE;

  return Response.json({ type });
}