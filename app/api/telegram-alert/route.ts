import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { temperature, humidity } = await request.json();

    // Telegram Bot Configuration
    const BOT_TOKEN = "8096396730:AAEmHbo2asHNPWKaiJL8aswdJMg64w-OLqA";
    const CHAT_IDS = ["1617730988", "6752039692"];

    // Check if temperature is out of range
    const isAlert = temperature < 2 || temperature > 8;
    
    if (!isAlert) {
      return NextResponse.json({ 
        success: true, 
        message: 'Temperature is normal, no alert sent' 
      });
    }

    // Determine alert type
    let alertType = "";
    if (temperature < 2) {
      alertType = "⚠️ CRITICAL: Temperature TOO LOW";
    } else if (temperature > 8) {
      alertType = "🔥 CRITICAL: Temperature TOO HIGH";
    }

    const message = `${alertType}

🌡️ Temperature: ${temperature.toFixed(1)}°C
💧 Humidity: ${humidity.toFixed(1)}%
⏰ Time: ${new Date().toLocaleString()}

⚠️ Vaccine storage temperature is outside safe range (2-8°C)!`;

    // Send to all chat IDs
    const results = await Promise.all(
      CHAT_IDS.map(async (chatId) => {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
          }),
        });

        return response.json();
      })
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Alert sent successfully',
      results 
    });

  } catch (error) {
    console.error('Telegram alert error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send alert' },
      { status: 500 }
    );
  }
}
