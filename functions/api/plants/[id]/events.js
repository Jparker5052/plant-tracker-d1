export async function onRequestGet(context) {
  try {
    const id = context.params.id;
    
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM care_events WHERE plantId = ? ORDER BY performedAt DESC LIMIT 20"
    ).bind(id).all();
    
    return Response.json(results);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
