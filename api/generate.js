export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
    const token = process.env.REPLICATE_API_TOKEN;

    try {
        if (req.body.predictionId) {
            const checkRes = await fetch(`https://api.replicate.com/v1/predictions/${req.body.predictionId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const checkData = await checkRes.json();
            return res.status(200).json(checkData);
        }

        const { image1, image2 } = req.body;
        
        const response = await fetch("https://api.replicate.com/v1/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                version: "24ed4a267cd458569aa9f4da971ccc8d3587eaa47c43cf79572c3c7738a390f9",
                input: {
                    identity_image_1: image1,
                    identity_image_2: image2,
                    
                    // 1. 포즈/뼈대를 잡아줄 사진
                    base_image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800", 
                    
                    // 2. 👇 서류 미비 에러를 해결해 줄 필수 요소! (색감/분위기 참고용)
                    style_image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800", 
                    
                    prompt: "A realistic mirror selfie of a young couple, shot on iPhone 6s, vintage retro aesthetic, grainy, slight noise, low-light indoor setting. Affectionate mood, casual, warm lighting, raw photo, unedited, amateur photography.",
                    negative_prompt: "3d, illustration, cartoon, professional photoshoot, high resolution, perfect smooth skin, text, watermark",
                    guidance_scale: 3
                }
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(500).json({ error: data.detail || data.error || "AI 공장 요청 거절" });
        }

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
