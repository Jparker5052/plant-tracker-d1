export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM rooms ORDER BY orderIndex, id"
    ).all();
    
    return Response.json(results || []);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { name, orderIndex } = body;
    
    // Check if room already exists
    const existing = await context.env.DB.prepare(
      "SELECT id FROM rooms WHERE name = ?"
    ).bind(name).first();
    
    if (existing) {
      return Response.json({ error: "Room already exists" }, { status: 400 });
    }
    
    // Insert new room
    const order = orderIndex || 999;
    await context.env.DB.prepare(
      "INSERT INTO rooms (name, orderIndex) VALUES (?, ?)"
    ).bind(name, order).run();
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
