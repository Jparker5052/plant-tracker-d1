export async function onRequestPost(context) {
  try {
    const id = context.params.id;
    const { performedBy } = await context.request.json();
    
    // Update last watered time - THIS IS CRITICAL
    await context.env.DB.prepare(
      "UPDATE plants SET lastWateredAt = datetime('now') WHERE id = ?"
    ).bind(id).run();
    
    // Also log the event if care_events table exists
    try {
      await context.env.DB.prepare(
        "INSERT INTO care_events (plantId, eventType, performedBy, performedAt) VALUES (?, 'water', ?, datetime('now'))"
      ).bind(id, performedBy).run();
    } catch (e) {
      // Care events table might not exist, that's ok
    }
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
