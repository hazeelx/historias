export const config = {
  runtime: "nodejs18.x",
};

export default async function handler(req, res) {
  try {
    const body = await req.json();
    const historia = body?.historia;

    if (!historia) {
      return Response.json(
        { error: "No se envió historia" },
        { status: 400 }
      );
    }

    const prompt = `Ilustración oscura, atmosférica, estilo narrativo. ${historia}`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.HF_TOKEN}`
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HuggingFace error:", errorText);

      return Response.json(
        { error: "HuggingFace devolvió un error", detalle: errorText },
        { status: 500 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

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
