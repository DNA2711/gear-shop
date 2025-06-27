import { NextResponse } from "next/server";

// Smart suggestions data - có thể train từ user behavior
const SMART_SUGGESTIONS = {
  // Gaming keywords
  gaming: [
    "laptop gaming",
    "PC gaming",
    "máy tính chơi game",
    "gear gaming",
    "phụ kiện gaming",
  ],
  game: ["gaming laptop", "gaming PC", "gaming gear", "gaming accessories"],
  chơi: ["chơi game", "gaming", "máy tính chơi game"],

  // Phone keywords
  điện: ["điện thoại", "smartphone", "phone", "di động"],
  phone: ["smartphone", "điện thoại", "mobile phone", "cellphone"],
  iphone: ["iPhone 15", "iPhone 14", "iPhone Pro Max", "iPhone Plus"],
  samsung: ["Samsung Galaxy", "Galaxy S24", "Galaxy Note", "Samsung A"],

  // Laptop keywords
  laptop: [
    "laptop gaming",
    "laptop văn phòng",
    "laptop sinh viên",
    "máy tính xách tay",
  ],
  máy: ["máy tính", "laptop", "PC", "computer"],
  tính: ["máy tính", "computer", "laptop", "PC"],

  // Brand suggestions
  apple: ["iPhone", "iPad", "MacBook", "Apple Watch", "AirPods"],
  asus: ["ASUS ROG", "ASUS TUF", "ASUS VivoBook", "ASUS ZenBook"],
  msi: ["MSI Gaming", "MSI GF", "MSI GL", "MSI Stealth"],

  // Price-related
  rẻ: ["giá rẻ", "budget", "tầm trung", "phổ thông"],
  cao: ["cao cấp", "premium", "high-end", "flagship"],

  // Tech specs
  rtx: ["RTX 4090", "RTX 4080", "RTX 4070", "GeForce RTX"],
  intel: ["Intel Core i7", "Intel Core i5", "Intel Core i9"],
  amd: ["AMD Ryzen", "Ryzen 7", "Ryzen 5", "Ryzen 9"],
};

// Fuzzy matching function
function fuzzyMatch(query: string, suggestions: string[]): string[] {
  const queryLower = query.toLowerCase();
  return suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(queryLower) ||
      queryLower.includes(suggestion.toLowerCase())
  );
}

// Generate smart suggestions
function generateSmartSuggestions(query: string): string[] {
  const queryLower = query.toLowerCase().trim();
  const suggestions = new Set<string>();

  // Add original query
  suggestions.add(query);

  // Check for exact matches
  if (SMART_SUGGESTIONS[queryLower]) {
    SMART_SUGGESTIONS[queryLower].forEach((s) => suggestions.add(s));
  }

  // Check for partial matches
  Object.keys(SMART_SUGGESTIONS).forEach((key) => {
    if (queryLower.includes(key) || key.includes(queryLower)) {
      SMART_SUGGESTIONS[key].forEach((s) => suggestions.add(s));
    }
  });

  // Vietnamese specific logic
  const words = queryLower.split(" ");
  words.forEach((word) => {
    if (SMART_SUGGESTIONS[word]) {
      SMART_SUGGESTIONS[word].forEach((s) => suggestions.add(s));
    }
  });

  return Array.from(suggestions).slice(0, 10);
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || query.length < 1) {
      return NextResponse.json({ suggestions: [] });
    }

    const smartSuggestions = generateSmartSuggestions(query);

    return NextResponse.json({
      query,
      suggestions: smartSuggestions,
      success: true,
    });
  } catch (error) {
    console.error("Smart Suggestions Error:", error);
    return NextResponse.json({
      suggestions: [query],
      success: false,
      error: "Smart suggestions failed",
    });
  }
}
