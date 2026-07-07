// api/generate.js
export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
    const token = process.env.REPLICATE_API_TOKEN;

    try {
        // 1. 대기표 상태 확인
        if (req.body.predictionId) {
            const checkRes = await fetch(`https://api.replicate.com/v1/predictions/${req.body.predictionId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const checkData = await checkRes.json();
            return res.status(200).json(checkData);
        }

        // 2. 인화 시작 (가장 안정적인 SDXL 공식 주소로 변경!)
        const { image1 } = req.body;
        
        const response = await fetch("https://api.replicate.com/v1/models/stability-ai/sdxl/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                input: {
                    image: image1,
                    prompt: "A realistic mirror selfie of a young couple, shot on iPhone 6s, vintage retro aesthetic, grainy, slight noise, low-light indoor setting. Affectionate mood, casual, warm lighting, raw photo, unedited, amateur photography.",
                    negative_prompt: "3d, illustration, cartoon, professional photoshoot, high resolution, perfect smooth skin, text, watermark",
                    prompt_strength: 0.55
                }
            })
        });

        const data = await response.json();
        
        // 🚨 만약 공장에서 에러를 뱉으면, 얼버무리지 않고 정확한 이유를 프론트로 보냅니다.
        if (!response.ok) {
            return res.status(500).json({ error: data.detail || data.error || "AI 공장 요청 거절" });
        }

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
