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

        // 📝 [사장님 기획 구역] 대표님이 치밀하게 설계하신 20가지의 시나리오 프롬프트 리스트입니다!
        // 여기에 원하시는 상황과 착장, 구도를 20개까지 마음껏 채워 넣으실 수 있습니다.
        const promptTemplates = [
            // 1. 엘리베이터 거울 셀카 (보내주신 예시)
            "A photorealistic mirror selfie taken inside a modern metallic elevator. Two people are standing closely side-by-side. On the left, one person with their original hair is standing slightly behind, looking at the mirror with one hand in their pocket. On the right, another person is standing in front, holding a smartphone with one hand to take the picture, the smartphone is completely covering their face.",
            
            // 2. 어두운 방 가로등 불빛 아래 (보내주신 레퍼런스 감성)
            "A low-light indoor mirror selfie of two people posing intimately close in front of a bedroom mirror. Warm cozy room lighting, raw camera flash effect illuminating their faces, one person gently resting their chin on the other's shoulder, capturing an affectionate mood.",
            
            // 3. 지하철 역 거울 셀카 (보내주신 레퍼런스 감성)
            "A retro lo-fi mirror selfie of two people standing extremely close together in a subway station corridor mirror. Natural underground station lighting, casual street style clothes, capturing a nostalgic urban night walk vibe."
            
            // 💡 여기에 4번부터 20번까지 번호 뒤에 쉼표(,)를 붙이고 똑같은 형식으로 영어 문장을 쭉 추가해 주시면 됩니다!
        ];

        // 🎲 유저가 버튼을 누르면 이 20개의 시나리오 중 하나가 무작위로 선택됩니다.
        const selectedScenario = promptTemplates[Math.floor(Math.random() * promptTemplates.length)];

        // 아이폰 6s / XS 고유의 질감과 아날로그 필터를 입혀줄 마법의 공통 주문
        const aestheticFilter = " shot on iPhone 6s camera, iPhone XS color grading, realistic smartphone camera quality, slight low-light lo-fi aesthetic, grainy, slight noise, raw photo, unedited, amateur photography.";

        // 🚀 미드저니 --cref 기능과 완벽하게 똑같이 인물 특징을 유지하며 텍스트 기반으로 새로 그려내는 고성능 InstantID 다중 인물 제어 엔진 호출
        const response = await fetch("https://api.replicate.com/v1/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                version: "0a9a1e03ca4d9241517742da3b27670cbdfef5c8d6cb33b7ba085731b8a531f8", // 다중 인물 고유 특징 보존(InstantID-Multi) 엔진 주소
                input: {
                    // 유저가 올린 사진 2장을 미드저니의 --cref 1, --cref 2 처럼 타겟 인물로 지정합니다.
                    face_image_1: image1,
                    face_image_2: image2,
                    
                    // 뽑힌 시나리오에 아이폰 감성 필터 텍스트를 정교하게 결합합니다.
                    prompt: selectedScenario + aestheticFilter,
                    negative_prompt: "3d, illustration, cartoon, professional photoshoot, high resolution, perfect smooth skin, text, watermark, bad anatomy, deformed, missing fingers",
                    
                    // --cw 100과 같은 역할! 인물의 고유 특징(머리스타일, 이목구비)을 얼마나 강력하게 보존할지 결정 (0.8이 가장 자연스럽게 녹아듭니다)
                    character_strength_1: 0.82,
                    character_strength_2: 0.82,
                    num_steps: 30
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
