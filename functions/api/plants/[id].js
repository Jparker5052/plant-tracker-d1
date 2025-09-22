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
