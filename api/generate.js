// api/generate.js
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

        // 🎯 직접 모아주신 22개의 레퍼런스 구도 룰렛!
        const poseTemplates = [
            "https://i.postimg.cc/64yZWz2z/6d064ccc21aeee4e10cb8617356d50dd.png",
            "https://i.postimg.cc/qgRyxBbz/13e77870-2d2a-438c-bad3-cb7892daca94-20250417144828.jpg",
            "https://i.postimg.cc/ThwgJ27y/98f8b9a9-3e4d-49a3-9234-ef4fa944a0fe-20250417144828.jpg",
            "https://i.postimg.cc/NLMmkGJM/9fea9531679280d03cfc2fa47a02a0bb.jpg",
            "https://i.postimg.cc/V56nWsGv/b15ec072d9e0ff9efd0d78768320bf86.jpg",
            "https://i.postimg.cc/xqCM3jxX/b55aa4f7a04c5c4da3e2a5f2dfaf00b2.jpg",
            "https://i.postimg.cc/SjsCfQT2/ik7BYCmj.jpg",
            "https://i.postimg.cc/vDN9qRkj/images.jpg",
            "https://i.postimg.cc/kD4KvM1K/images-(1).jpg",
            "https://i.postimg.cc/4nStLCqw/images-(10).jpg",
            "https://i.postimg.cc/qg5nbfS1/images-(11).jpg",
            "https://i.postimg.cc/Hjh5ZGRB/images-(12).jpg",
            "https://i.postimg.cc/6T3nf6jC/images-(2).jpg",
            "https://i.postimg.cc/Z0RpxY7r/images-(3).jpg",
            "https://i.postimg.cc/mhDCyZXy/images-(4).jpg",
            "https://i.postimg.cc/XXJdkNHs/images-(5).jpg",
            "https://i.postimg.cc/MXFRPkNR/images-(6).jpg",
            "https://i.postimg.cc/yWb9Qqtc/images-(7).jpg",
            "https://i.postimg.cc/V5VMGypj/images-(8).jpg",
            "https://i.postimg.cc/5jRv7cTm/images-(9).jpg",
            "https://i.postimg.cc/Z0M37k2G/style-69304e80c7d02-650x650.webp",
            "https://i.postimg.cc/mh5MXxKx/daunlodeu.jpg"
        ];

        // 유저가 버튼을 누를 때마다 이 22장 중 하나가 무작위로 선택됩니다.
        const randomPose = poseTemplates[Math.floor(Math.random() * poseTemplates.length)];

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
                    
                    // 뽑힌 사진을 구도 뼈대와 색감 기준으로 설정
                    base_image: randomPose,
                    style_image: randomPose,
                    
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
