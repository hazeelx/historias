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










// export const config = 
// {
//   runtime: "edge",
// };

// export default async function handler(req)
// {
//   try 
//   {
//     const { historia } = await req.json();

//     const prompt = `Ilustración oscura, atmosférica, estilo narrativo. ${historia}`;

//     const response = await fetch
//     (
//       "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
//       {
//         method: "POST",
//         headers:
//         {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${process.env.HF_TOKEN}`
//         },
//         body: JSON.stringify({ inputs: prompt })
//       }
//     );

//     if(!response.ok)
//     {
//       return Response.json(
//         { error: "Error en el servidor"},
//         { status: 500 }
//       );
//     }

//     const arrayBuffer = await response.arrayBuffer();
//     const base64 = Buffer.from(arrayBuffer).toString("base64");

//     return Response.json(
//     {
//       url: `data:image/png;base64,${base64}`
//     }
//     );
//   }

//   catch (error)
//   {
//     return Response.json
//     (
//       { error: "Error ene el servidor" },
//       { status: 500 }
//     );
//   }
// }
