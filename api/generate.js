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

        // 사장님이 모아주신 22개의 레퍼런스 구도 룰렛
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

        const randomPose = poseTemplates[Math.floor(Math.random() * poseTemplates.length)];

        // 🔥 얼굴만 오려 붙이는 기계가 아닌, 머리와 옷차림의 특징을 분석해 재창조하는 고성능 SDXL 융합 엔진으로 변경!
        const response = await fetch("https://api.replicate.com/v1/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                version: "c56fcd935368a44d82b09088656cbdf7b031c55c0a3dc26f59ee0bfb2d2db3b9", // 인물 특징+가이드 융합 공식 SDXL 모델
                input: {
                    image: image1,           // 인물 1의 사진 (이 사람의 머리스타일, 옷 분위기를 베이스로 삼음)
                    secondary_image: image2, // 인물 2의 사진 (이 사람의 특징을 섞음)
                    control_image: randomPose, // 🎲 룰렛에서 뽑힌 레퍼런스 사진 (오직 포즈와 구도, 배경의 뼈대로만 사용!)
                    
                    prompt: "A realistic mirror selfie of two people, keeping their original hairstyles and clothing styles, shot on iPhone 6s, vintage retro aesthetic, grainy, slight noise, low-light indoor setting. Casual, warm lighting, raw photo, unedited.",
                    negative_prompt: "bad anatomy, deformed, extra limbs, 3d, illustration, cartoon, professional photoshoot, perfect smooth skin, text, watermark",
                    
                    // 뼈대(포즈)를 얼마나 엄격하게 따라 할지 결정하는 수치 (0.6~0.7이 가장 자연스럽습니다)
                    controlnet_conditioning_scale: 0.65, 
                    prompt_strength: 0.8
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
