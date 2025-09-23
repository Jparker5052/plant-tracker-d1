// Handle DELETE requests
export async function onRequestDelete(context) {
  try {
    const id = context.params.id;
    
    await context.env.DB.prepare(
      "DELETE FROM plants WHERE id = ?"
    ).bind(id).run();
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
export async function onRequestPatch(context) {
  const id = context.params.id;
  const body = await context.request.json();
  
  const updates = [];
  const values = [];
  
  if (body.fertilizeSeasonalPauseStart !== undefined) {
    updates.push("fertilizeSeasonalPauseStart = ?");
    values.push(body.fertilizeSeasonalPauseStart);
  }
  if (body.fertilizeSeasonalPauseEnd !== undefined) {
    updates.push("fertilizeSeasonalPauseEnd = ?");
    values.push(body.fertilizeSeasonalPauseEnd);
  }
  
  if (updates.length > 0) {
    values.push(id);
    await context.env.DB.prepare(
      `UPDATE plants SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...values).run();
  }
  
  return Response.json({ success: true });
}
