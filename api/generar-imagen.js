export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  // 1. Validar que el JSON llega bien
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "JSON inválido recibido" },
      { status: 400 }
    );
  }

  const historia = body?.historia;

  if (!historia) {
    return Response.json(
      { error: "No se envió historia" },
      { status: 400 }
    );
  }

  // 2. Crear prompt
  const prompt = `Ilustración oscura, atmosférica, estilo narrativo. ${historia}`;

  try {
    // 3. Llamada a HuggingFace
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.HF_TOKEN}`
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    // 4. Si HuggingFace devuelve error, mostrarlo
    if (!response.ok) {
      const errorText = await response.text();
      console.error("HuggingFace error:", errorText);

      return Response.json(
        { error: "HuggingFace devolvió un error", detalle: errorText },
        { status: 500 }
      );
    }

    // 5. Convertir imagen a base64 compatible con Edge Runtime
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    let binary = "";
    bytes.forEach(b => binary += String.fromCharCode(b));
    const base64 = btoa(binary);

    // 6. Respuesta final para tu frontend
    return Response.json({
      url: `data:image/png;base64,${base64}`
    });

  } catch (error) {
    console.error("Error en backend:", error);
    return Response.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
