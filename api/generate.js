import Replicate from "replicate";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    
    // 토큰 디버깅: 토큰이 들어왔는지 확인
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) return res.status(500).json({ error: "환경 변수 REPLICATE_API_TOKEN이 없습니다." });

    const replicate = new Replicate({ auth: token });
    const { image1, image2, prompt } = req.body;

    try {
        // [중요] 레플리케이트 사이트의 [API] 탭에서 복사한 '최신 해시값'을 여기 넣으세요.
        // 예: "instantx/instantid:해시값"
        const modelVersion = "여기에_최신_해시값_전체_붙여넣기"; 

        const prediction = await replicate.run(modelVersion, {
            input: {
                prompt: prompt,
                image: image1, // 모델에 따라 image, face_image 등 변수명이 다릅니다. API 문서 확인 필수!
                negative_prompt: "monochrome, lowres, bad anatomy, worst quality, low quality",
                // ... 모델별 필수 옵션들
            }
        });

        res.status(200).json(prediction);
    } catch (error) {
        // [디버깅] 여기서 왜 에러가 났는지 정확한 메시지를 띄웁니다.
        console.error("Replicate Error:", error);
        res.status(500).json({ error: error.message });
    }
}
