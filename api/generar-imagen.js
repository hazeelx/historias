export default async function handler(req,res) 
{
    try
    {
        const { historia } = req.body;

        const response = await fetch("https://api.openai.com/v1/images/generations",
            {
            method: "POST",
            headers: 
            {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_KEY}`
            },
            body: JSON.stringify
            ({
            model:"gpt-image-1",
            prompt: `Genera una ilustración oscura, atmosférica y narrativa basada en esta historia: ${historia}`,
            size: "1024x1024"
            })
        });

        const data = await response.json();

        res.status(200).json({ url: data.data[0].url });

    } catch (error)
    {
        console.error("Error en backend:", error);
        res.status(500).json({ error: "Error generando imagen"})
    }
}