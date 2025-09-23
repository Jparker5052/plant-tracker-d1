export async function onRequestGet(context) {
  const { results } = await context.env.DB.prepare(
    "SELECT * FROM care_events ORDER BY performedAt DESC"
  ).all();
  return Response.json(results || []);
}

export async function onRequestPost(context) {
  const body = await context.request.json();
  const { plantId, role, type, soilMoisture, intervalDaysChosen, snoozeDays, note } = body;
  
  await context.env.DB.prepare(
    `INSERT INTO care_events (plantId, eventType, performedBy, performedAt, notes) 
     VALUES (?, ?, ?, datetime('now'), ?)`
  ).bind(plantId, type, role, note || null).run();
  
  return Response.json({ success: true });
}
