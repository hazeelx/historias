export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { historia } = await req.json();

    console.log("Historia recibida:", historia);
    console.log("API KEY existe:", !!process.env.OPENAI_KEY);

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: `Genera una ilustración oscura, atmosférica y narrativa basada en esta historia: ${historia}`,
        size: "1024x1024"
      })
    });

    const data = await response.json();
    console.log("Respuesta OpenAI:", data);

    return Response.json({ url: data.data?.[0]?.url });

  } catch (error) {
    console.error("Error en backend:", error);
    return Response.json({ error: "Error generando imagen" }, { status: 500 });
  }
}
