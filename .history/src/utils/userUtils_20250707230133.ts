interface User {
  name?: string;
  email?: string;
  fullName?: string;
  full_name?: string;
  username?: string;
}

/**
 * Get display name from user object
 * Priority: full_name > fullName > name > username > email prefix
 */
export function getUserDisplayName(user: any): string {
  if (!user) return "User";

  const nameFields = [
    user.fullName,
    user.name,
    user.displayName,
    user.username,
    user.email,
  ];

  for (const field of nameFields) {
    if (field && typeof field === "string" && field.trim()) {
      return field.trim();
    }
  }

  if (user.email && typeof user.email === "string") {
    const emailPrefix = user.email.split("@")[0];
    if (emailPrefix && emailPrefix.trim()) {
      return emailPrefix.trim();
    }
  }

  return "User";
}

/**
 * Get short display name (first name only)
 */
export const getShortDisplayName = (user?: User | null): string => {
  const fullName = getUserDisplayName(user);

  if (fullName === "User") return fullName;

  // Return first word of the name
  const firstName = fullName.split(" ")[0];
  return firstName || fullName;
};

/**
 * Get greeting name (for welcome messages)
 * Returns full name for greeting instead of just first name
 */
export const getGreetingName = (user?: User | null): string => {
  console.log("getGreetingName called with user:", user);
  const fullName = getUserDisplayName(user);
  console.log("getGreetingName result:", fullName);
  return fullName === "User" ? "bạn" : fullName;
};

export function getUserInitials(user: any): string {
  const displayName = getUserDisplayName(user);
  
  if (displayName === "User") return "U";

  const words = displayName.split(" ").filter(word => word.trim());
  
  if (words.length === 0) return "U";
  
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

export function formatUserName(name: string): string {
  if (!name || typeof name !== "string") return "User";
  
  const trimmed = name.trim();
  if (!trimmed) return "User";
  
  const words = trimmed.split(" ").filter(word => word.trim());
  if (words.length === 0) return "User";
  
  return words[0];
}
