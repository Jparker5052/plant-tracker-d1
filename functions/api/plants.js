export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM plants ORDER BY species"
    ).all();
    
    return Response.json(results);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { species, nickname, roomId, lightLevel, waterIntervalDays, addedBy } = body;
    
    // Check plant count
    const { count } = await context.env.DB.prepare(
      "SELECT COUNT(*) as count FROM plants"
    ).first();
    
    if (count >= 50) {
      return Response.json({ error: "Maximum 50 plants allowed" }, { status: 400 });
    }
    
    // Insert plant
    await context.env.DB.prepare(
      `INSERT INTO plants (species, nickname, roomId, lightLevel, waterIntervalDays, addedBy) 
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(species, nickname, roomId, lightLevel, waterIntervalDays, addedBy).run();
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
