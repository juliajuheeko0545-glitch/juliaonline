export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
    const token = process.env.REPLICATE_API_TOKEN;

    try {
        // 1. 프론트엔드가 대기표(predictionId)를 들고 "다 됐어?" 하고 물어보러 온 경우
        if (req.body.predictionId) {
            const checkRes = await fetch(`https://api.replicate.com/v1/predictions/${req.body.predictionId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const checkData = await checkRes.json();
            return res.status(200).json(checkData);
        }

        // 2. 처음 사진을 보내서 "인화 시작해 줘!" 라고 요청한 경우
        const { image1 } = req.body;
        
        // (안정성을 위해 가장 유명하고 강력한 SDXL 모델을 사용합니다)
        const response = await fetch("https://api.replicate.com/v1/models/stability-ai/sdxl/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                input: {
                    image: image1, // 베이스가 되는 1번 인물 사진
                    prompt: "A realistic mirror selfie of a young couple, shot on iPhone 6s, vintage retro aesthetic, grainy, slight noise, low-light indoor setting. Affectionate mood, casual, warm lighting, raw photo, unedited, amateur photography.",
                    prompt_strength: 0.5 // 사진을 유지하면서 필터를 씌우는 적절한 강도
                }
            })
        });

        const data = await response.json();
        return res.status(200).json(data); // "나 지금 시작했어! 대기표 받아가!" 하고 돌려줍니다.

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
