const url = "https://formation-fbvmlypag-lollys-projects-2eff597e.vercel.app/api/webhooks/bunny";

async function testWebhook() {
  console.log("Testing Webhook URL:", url);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        VideoLibraryId: "test-lib-id",
        VideoGuid: "test-guid-" + Date.now(),
        Status: 4 // Finished
      })
    });

    console.log("Status Code:", response.status);
    const text = await response.text();
    console.log("Response Body:", text);
  } catch (err) {
    console.error("Network Error:", err);
  }
}

testWebhook();
