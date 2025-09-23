export async function onRequestPost(context) {
  const { name, orderIndex } = await context.request.json();
  
  await context.env.DB.prepare(
    "INSERT INTO rooms (name, orderIndex) VALUES (?, ?)"
  ).bind(name, orderIndex).run();
  
  return Response.json({ success: true });
}
