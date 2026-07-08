// api/generate.js
export default async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
        return res.status(500).json({ error: "Vercel 환경 변수에 REPLICATE_API_TOKEN이 설정되지 않았습니다." });
    }

    try {
        if (req.body.predictionId) {
            const checkRes = await fetch(`https://api.replicate.com/v1/predictions/${req.body.predictionId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const checkData = await checkRes.json();
            
            // 엑스박스 방지용 포장 코드
            if (checkData.status === "succeeded" && typeof checkData.output === "string") {
                checkData.output = [checkData.output];
            }
            
            return res.status(200).json(checkData);
        }

        const { image1, image2 } = req.body;

        // 📝 성별 완전 삭제 & 헤어스타일 강제 유지 프롬프트 20종
        const promptTemplates = [
            "A close-up mirror selfie in a dark room. Person 1 on the left is leaning in closely, pressing their face against Person 2's cheek. Person 2 is holding a smartphone, completely covering their face. Both individuals exactly retain their original hairstyles and facial features from the reference images. Shot on iPhone 6s camera, low-light lo-fi aesthetic.",
            "A close-up selfie of two people wearing baseball caps. Person 1 on the left is making a playful duck face. Person 2 on the right is smiling warmly at the camera. Dark background. Both individuals exactly retain their original hairstyles. Shot on iPhone 6s camera, flash photography aesthetic.",
            "A selfie in a bright modern hallway with large glass windows. Person 1 is in the foreground looking directly at the camera. Person 2 is standing in the background, slightly out of focus, making a playful hand gesture. Both individuals exactly retain their original hairstyles. Natural daylight. Shot on iPhone 6s camera.",
            "A full-body mirror selfie in a cozy hotel bedroom. Person 1 is holding a smartphone covering their face. Person 2 is standing close beside them, resting their arm playfully near Person 1's shoulder. Both individuals exactly retain their original hairstyles. Warm indoor lighting. Shot on iPhone 6s camera.",
            "A close-up mirror selfie of a couple hugging tightly. Person 1 is facing away from the mirror with their back to the camera. Person 2 is hugging them from the front and holding a smartphone over Person 1's shoulder to capture the reflection. Faces obscured. Both individuals exactly retain their original hairstyles. Shot on iPhone 6s camera.",
            "A close-up selfie taken inside a train or airplane cabin. Person 1 is leaning their head affectionately against Person 2's head. Person 2 is gently poking their own cheek with one finger, looking at the camera. Both individuals exactly retain their original hairstyles. Cool lighting. Shot on iPhone 6s camera.",
            "A high-angle selfie taken from above on a street. Person 1, wearing a patterned beanie, is kissing Person 2 on the cheek. Person 2 is looking down with a gentle smile. Casual streetwear vibe. Both individuals exactly retain their original hairstyles. Shot on iPhone 6s camera, raw photo aesthetic.",
            "A full-body mirror selfie in a minimalist modern room. Person 1 in the foreground is holding a smartphone and making a peace sign. Person 2 is standing behind them with their back completely turned away from the mirror. Both individuals exactly retain their original hairstyles. Natural indoor lighting. Shot on iPhone 6s camera.",
            "A mirror selfie in an ornate wooden elevator. Person 1 is facing the mirror, holding a smartphone and smiling. Person 2 is standing in front of them, facing away from the mirror, holding a massive colorful flower bouquet. Their back is to the camera. Both individuals exactly retain their original hairstyles. Shot on iPhone 6s camera.",
            "A mirror selfie inside a modern metallic elevator. Person 1 on the left is standing slightly behind, looking at the mirror with one hand in their pocket. Person 2 on the right is standing in front, holding a smartphone that completely covers their face. Both individuals exactly retain their original hairstyles. Shot on iPhone 6s camera.",
            "A top-down selfie of two people lying down. Person 1 is at the bottom, looking up at the camera smiling. Person 2 is positioned at the top right, looking down at the camera. Casual outdoor vibe. Both individuals exactly retain their original hairstyles. Shot on iPhone 6s camera, raw photo.",
            "A close-up mirror selfie inside a metallic elevator. Two people are hugging intimately. Person 1 is hugging Person 2 closely from the side, holding a red smartphone to take the picture. Person 2 is wearing a white face mask. Both individuals exactly retain their original hairstyles. Shot on iPhone 6s camera.",
            "A close-up mirror selfie in a dimly lit room. Person 1 is in the foreground holding a black smartphone that partially covers their face. Person 2 is leaning in closely from behind, resting their head near Person 1's shoulder and looking at the mirror. Both individuals exactly retain their original hairstyles. Shot on iPhone 6s camera.",
            "A mirror selfie in a cozy bedroom with a bed in the background. Person 1 is holding a white smartphone, completely covering their face. Person 2 is leaning their head affectionately on Person 1's shoulder. Matching white t-shirts. Both individuals exactly retain their original hairstyles. Shot on iPhone 6s camera.",
            "A close-up front-facing selfie. Person 1 is looking directly at the camera. Person 2 beside them is playfully squishing their own cheek with one finger. Both individuals exactly retain their original hairstyles and clothing vibe. Natural daytime lighting. Shot on iPhone 6s camera.",
            "A front-facing selfie taken outdoors near a cafe. Person 1 is in the foreground taking the picture. Person 2 is in the background, playfully holding up a pastry and a paper cup over Person 1's head. Both individuals exactly retain their original hairstyles. Bright daylight. Shot on iPhone 6s camera.",
            "A front-facing selfie taken outdoors. Person 1 is holding the camera in the foreground. They and Person 2 standing slightly behind them are making a large heart shape together with their arms over Person 1's head. Both individuals exactly retain their original hairstyles. Natural daylight. Shot on iPhone 6s camera.",
            "A mirror selfie in a casual indoor room. Person 1 is standing in front, holding a smartphone that covers their face. Person 2 is standing right behind them, looking into the mirror. Both individuals exactly retain their original hairstyles and clothing vibe. Shot on iPhone 6s camera.",
            "A very close-up side profile selfie of two people resting. Person 1 is in the foreground, showing their side profile looking straight ahead. Person 2 is right behind them, also showing their side profile looking in the same direction. Both individuals exactly retain their original hairstyles. Dark environment. Shot on iPhone 6s camera.",
            "A mirror selfie in a public subway station. Person 1 is holding the smartphone taking the picture. Person 2 beside them is making a half-heart shape with their fingers pointing towards the phone in the mirror. They are leaning in close together. Both individuals exactly retain their original hairstyles. Shot on iPhone 6s camera."
        ];

        const selectedScenario = promptTemplates[Math.floor(Math.random() * promptTemplates.length)];

        const response = await fetch("https://api.replicate.com/v1/models/flux-kontext-apps/multi-image-kontext-pro/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                input: {
                    prompt: selectedScenario,
                    input_image_1: image1,
                    input_image_2: image2
                }
            })
        });

        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            return res.status(500).json({ error: "레플리케이트 서버 응답 오류", details: responseText });
        }
        
        if (!response.ok) {
            return res.status(500).json({ error: data.detail || data.error || "AI 공장 요청 거절" });
        }

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
