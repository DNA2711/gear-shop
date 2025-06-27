import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || query.length < 2) {
      return NextResponse.json({ enhanced_query: query });
    }

    // AI enhancement prompt
    const prompt = `
Bạn là chuyên gia về sản phẩm công nghệ. Hãy mở rộng và cải thiện từ khóa tìm kiếm sau để tìm được nhiều sản phẩm liên quan hơn.

Từ khóa gốc: "${query}"

Hãy trả về:
1. Các từ đồng nghĩa
2. Các từ liên quan
3. Các thương hiệu phổ biến
4. Các thuật ngữ kỹ thuật

Trả về dưới dạng chuỗi các từ khóa cách nhau bởi dấu phẩy, tối đa 50 từ.
Ví dụ: "laptop gaming, máy tính chơi game, gaming laptop, MSI, ASUS, RTX, GTX"
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Bạn là chuyên gia sản phẩm công nghệ, trả lời bằng tiếng Việt.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    const enhancedQuery = completion.choices[0]?.message?.content || query;

    return NextResponse.json({
      original_query: query,
      enhanced_query: enhancedQuery,
      success: true,
    });
  } catch (error) {
    console.error("AI Search Enhancement Error:", error);
    return NextResponse.json({
      enhanced_query: query,
      success: false,
      error: "AI enhancement failed",
    });
  }
}
