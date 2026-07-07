// api/generate.js (비밀 요원 코드)
export default async function handler(req, res) {
    // 1. 보안 검사: 엉뚱한 요청은 차단합니다.
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    // 2. 유저가 보낸 사진 데이터를 받습니다.
    const { image1, image2 } = req.body;

    try {
        // 3. 금고에 숨겨둔 비밀번호(API TOKEN)를 꺼내서 Replicate 공장에 요청을 보냅니다.
        const response = await fetch("https://api.replicate.com/v1/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                version: "220d9df8df56ec72b4c1945f3e7bbdb5984606ea278d655f442b322a30bbdf37", // 사진을 커플로 합성해 주는 IP-Adapter 모델 엔진 번호
                input: {
                    image: image1,
                    prompt: "A realistic mirror selfie of a young couple, shot on iPhone 6s, vintage retro aesthetic, grainy, slight noise, low-light indoor setting. Affectionate mood, casual, warm lighting, raw photo, unedited, amateur photography.",
                    negative_prompt: "3d, illustration, cartoon, professional photoshoot, high resolution, perfect smooth skin, text, watermark",
                    prompt_strength: 0.45
                }
            })
        });

        const data = await response.json();
        
        // 4. 공장에서 완성된 사진을 받아서 프론트엔드(웹 화면)로 전달합니다.
        res.status(200).json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "사진 인화 중 문제가 발생했습니다." });
    }
}
