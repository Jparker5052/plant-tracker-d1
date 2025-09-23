export async function onRequestPatch(context) {
  try {
    const id = context.params.id;
    const body = await context.request.json();
    
    const updates = [];
    const values = [];
    
    // Handle all possible update fields
    const allowedFields = [
      'species', 'nickname', 'roomId', 'lightLevel',
      'waterIntervalDays', 'fertilizeIntervalDays',
      'fertilizeSeasonalPauseStart', 'fertilizeSeasonalPauseEnd',
      'lastWateredAt', 'lastFertilizedAt'
    ];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    }
    
    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }
    
    // Add updatedAt
    updates.push("updatedAt = datetime('now')");
    
    // Add id for WHERE clause
    values.push(id);
    
    await context.env.DB.prepare(
      `UPDATE plants SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...values).run();
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
