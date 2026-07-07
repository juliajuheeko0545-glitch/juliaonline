export default async function handler(req, res) {
    // 1. 프론트엔드가 대기표를 들고 "다 됐어?" 물어볼 때
    if (req.body.predictionId) {
        // 대기표에 적힌 시간(timestamp)을 확인합니다.
        const startTime = parseInt(req.body.predictionId.split("_")[2]);
        const now = Date.now();
        
        // 8초가 안 지났으면 아직 작업 중이라고 거짓말을 합니다. (로딩 화면 유지용)
        if (now - startTime < 8000) { 
            return res.status(200).json({ 
                status: "processing", 
                id: req.body.predictionId 
            });
        } 
        // 8초가 지났으면 성공했다고 하며, 미리 준비한 예쁜 빈티지 사진을 던져줍니다!
        else { 
            return res.status(200).json({
                status: "succeeded",
                output: ["https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop"] 
            });
        }
    }

    // 2. 처음 사용자가 버튼을 눌렀을 때
    // 현재 시간을 기록한 '가짜 대기표'를 발급해 줍니다.
    const newTicket = "fake_ticket_" + Date.now();
    return res.status(200).json({
        id: newTicket,
        status: "processing"
    });
}
