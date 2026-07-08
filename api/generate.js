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

        // 📝 대표님의 정교한 20종 시나리오 리스트
        const promptTemplates = [
            "A close-up mirror selfie in a dark room. A man on the left is leaning in closely, pressing his face against the woman's cheek. The woman is holding a smartphone, completely covering her face. Shot on iPhone 6s camera, low-light lo-fi aesthetic.",
            "A close-up selfie of two people wearing baseball caps. The woman on the left is making a playful duck face. The man on the right is smiling warmly at the camera. Dark background. Shot on iPhone 6s camera, flash photography aesthetic.",
            "A selfie in a bright modern hallway with large glass windows. The woman is in the foreground looking directly at the camera. The man is standing in the background, slightly out of focus, making a playful hand gesture. Natural daylight. Shot on iPhone 6s camera, realistic smartphone camera quality.",
            "A full-body mirror selfie in a cozy hotel bedroom. Two people wearing white t-shirts. The woman is holding a smartphone covering her face. The man is standing close beside her, resting his arm playfully near her shoulder. Warm indoor lighting. Shot on iPhone 6s camera, low-light lo-fi aesthetic.",
            "A close-up mirror selfie of a couple hugging tightly. The man is facing away from the mirror with his back to the camera. The woman is hugging him from the front and holding a smartphone over his shoulder to capture the reflection. Faces obscured. Shot on iPhone 6s camera, low-light lo-fi aesthetic.",
            "A close-up selfie taken inside a train or airplane cabin. The man is leaning his head affectionately against the woman's head. The woman is gently poking her own cheek with one finger, looking at the camera. Cool lighting. Shot on iPhone 6s camera, realistic smartphone camera quality.",
            "A high-angle selfie taken from above on a street. The man, wearing a patterned beanie, is kissing the woman on the cheek. The woman is looking down with a gentle smile. Casual streetwear vibe. Shot on iPhone 6s camera, raw photo aesthetic.",
            "A full-body mirror selfie in a minimalist modern room. The woman in the foreground is holding a smartphone and making a peace sign. The man is standing behind her with her back completely turned away from the mirror. Natural indoor lighting. Shot on iPhone 6s camera, realistic smartphone camera quality.",
            "A mirror selfie in an ornate wooden elevator. The man is facing the mirror, holding a smartphone and smiling. The woman is standing in front of him, facing away from the mirror, holding a massive colorful flower bouquet. Her back is to the camera. Warm vintage lighting. Shot on iPhone 6s camera, low-light lo-fi aesthetic.",
            "A mirror selfie inside a modern metallic elevator. The man on the left is standing slightly behind, looking at the mirror with one hand in his pocket. The woman on the right is standing in front, holding a smartphone that completely covers her face. Shot on iPhone 6s camera, slight low-light lo-fi aesthetic.",
            "A top-down selfie of two people lying down. A man with curly hair and round glasses is at the bottom, looking up at the camera smiling. A woman is positioned at the top right, looking down at the camera. Casual outdoor vibe. Shot on iPhone 6s camera, realistic smartphone camera quality, raw photo.",
            "A close-up mirror selfie inside a metallic elevator. A couple is hugging intimately. The man is hugging the woman closely from the side, holding a red smartphone to take the picture. The woman is wearing a white face mask. Shot on iPhone 6s camera, low-light lo-fi aesthetic, realistic smartphone camera quality.",
            "A close-up mirror selfie in a dimly lit room. A woman is in the foreground holding a black smartphone that partially covers her face. A man is leaning in closely from behind, resting his head near her shoulder and looking at the mirror. Shot on iPhone 6s camera, low-light lo-fi aesthetic, realistic smartphone camera quality.",
            "A mirror selfie in a cozy bedroom with a bed in the background. The man is holding a white smartphone, completely covering his face. The woman is leaning her head affectionately on his shoulder. They are wearing matching white t-shirts and jeans. Shot on iPhone 6s camera, realistic smartphone camera quality, soft indoor lighting.",
            "A close-up front-facing selfie. A man in a brown hoodie is looking directly at the camera. A woman beside him in a white off-shoulder top is playfully squishing her own cheek with one finger. Shot on iPhone 6s camera, realistic smartphone camera quality, natural daytime lighting.",
            "A front-facing selfie taken outdoors near a cafe. A man in a striped hoodie is in the foreground taking the picture. A woman in a red shirt is in the background, playfully holding up a pastry and a paper cup over his head. Shot on iPhone 6s camera, realistic smartphone camera quality, bright daylight.",
            "A front-facing selfie taken outdoors. A man is holding the camera in the foreground. He and a woman standing slightly behind him are making a large heart shape together with their arms over his head. Shot on iPhone 6s camera, realistic smartphone camera quality, natural daylight.",
            "A mirror selfie in a casual indoor room. A woman is standing in front, holding a smartphone that covers her face. A man is standing right behind her wearing a striped long-sleeve polo shirt, looking into the mirror. Shot on iPhone 6s camera, realistic smartphone camera quality, casual indoor lighting.",
            "A very close-up side profile selfie of two people resting. The woman is in the foreground, showing her side profile looking straight ahead. The man is right behind her, also showing his side profile looking in the same direction. Dark environment. Shot on iPhone 6s camera, low-light lo-fi aesthetic, flash photography vibe.",
            "A mirror selfie in a public subway station. A man is holding the smartphone taking the picture. A woman beside him is making a half-heart shape with her fingers pointing towards the phone in the mirror. They are leaning in close together. Shot on iPhone 6s camera, realistic smartphone camera quality, fluorescent public lighting."
        ];

        const selectedScenario = promptTemplates[Math.floor(Math.random() * promptTemplates.length)];

        // 🔥 찾으신 완벽한 모델로 요청 송신!
        const response = await fetch("https://api.replicate.com/v1/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                version: "69d41d996924294155169a53232c7f4659f818833989c97b5e40632b7194380a", // multi-image-kontext-pro 모델 주소
                input: {
                    prompt: selectedScenario,
                    input_image_1: image1,
                    input_image_2: image2
                }
            })
        });

        const data = await response.json();
        
        if (!response.ok) return res.status(500).json({ error: data.detail || data.error || "AI 공장 요청 거절" });
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
