export async function onRequestPatch(context) {
  try {
    const id = context.params.id;
    const body = await context.request.json();
    
    const updates = [];
    const values = [];
    
    // Handle all updateable fields
    const fields = [
      'species', 'nickname', 'roomId', 'lightLevel',
      'waterIntervalDays', 'fertilizeIntervalDays',
      'lastWateredAt', 'lastFertilizedAt'
    ];
    
    for (const field of fields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    }
    
    if (updates.length > 0) {
      values.push(id);
      await context.env.DB.prepare(
        `UPDATE plants SET ${updates.join(', ')} WHERE id = ?`
      ).bind(...values).run();
    }
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// Also handle PUT as fallback
export async function onRequestPut(context) {
  return onRequestPatch(context);
}
