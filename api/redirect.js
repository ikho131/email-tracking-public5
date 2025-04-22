export default async function handler(req, res) {
  const { email, university, company, type } = req.query;
  const linkRaw = req.query.link || "";
  const link = decodeURIComponent(decodeURIComponent(linkRaw)); // ✅ 이중 디코딩

  const scriptUrl = "https://script.google.com/macros/s/AKfycbwEBA4PwO8jiskRxHxTFg6W4nz7qEfvHWzh63_AyqoDrWkQEQvIkIzpuTeWaqGV2Ese/exec";

  console.log("🖱️ [REDIRECT] 요청 수신됨");
  console.log("받은 쿼리값:", { email, university, company, type, link });

  if (!scriptUrl || !link) {
    console.warn("⚠️ 잘못된 요청: scriptUrl 또는 link 누락");
    return res.status(400).json({ error: "Invalid request. Missing scriptUrl or link." });
  }

  try {
    const payload = {
      type: type || "click",
      email,
      university,
      company,
      link,
      time: new Date().toISOString(),
    };

    console.log("🔗 Google Apps Script로 POST 요청 전송:", payload);

    await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("✅ Google Apps Script POST 완료");
    console.log("🔁 사용자 리디렉션:", link);

    res.writeHead(302, { Location: link });
    res.end();
  } catch (err) {
    console.error("🔥 redirect error:", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
}
