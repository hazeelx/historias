export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { historia } = await req.json();

    const prompt = `Ilustración oscura, atmosférica, estilo narrativo. ${historia}`;

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HuggingFace error:", errorText);

      return Response.json(
        { error: "HuggingFace devolvió un error", detalle: errorText },
        { status: 500 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Convertir a base64 compatible con Edge Runtime
    let binary = "";
    bytes.forEach(b => binary += String.fromCharCode(b));
    const base64 = btoa(binary);

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
