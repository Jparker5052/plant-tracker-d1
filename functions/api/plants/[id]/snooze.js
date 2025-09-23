export async function onRequestPost(context) {
  const id = context.params.id;
  const { performedBy, days, notes } = await context.request.json();
  
  const snoozedUntil = new Date();
  snoozedUntil.setDate(snoozedUntil.getDate() + days);
  
  await context.env.DB.prepare(
    "UPDATE plants SET snoozedUntil = ? WHERE id = ?"
  ).bind(snoozedUntil.toISOString(), id).run();
  
  await context.env.DB.prepare(
    "INSERT INTO care_events (plantId, eventType, performedBy, notes) VALUES (?, 'snooze', ?, ?)"
  ).bind(id, performedBy, notes || `Snoozed for ${days} days`).run();
  
  return Response.json({ success: true });
}
