export async function onRequestPost(context) {
  try {
    const id = context.params.id;
    const { performedBy } = await context.request.json();
    
    // Update last watered time
    await context.env.DB.prepare(
      "UPDATE plants SET lastWateredAt = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(id).run();
    
    // Log the event
    await context.env.DB.prepare(
      "INSERT INTO care_events (plantId, eventType, performedBy) VALUES (?, 'water', ?)"
    ).bind(id, performedBy).run();
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
