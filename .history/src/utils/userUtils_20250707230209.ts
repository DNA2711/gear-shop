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
export const getUserDisplayName = (user?: User | null): string => {
  if (!user) {
    return "User";
  }

  // Try different name fields in priority order
  const nameFields = [user.fullName, user.full_name, user.name, user.username];

  for (const field of nameFields) {
    if (field && typeof field === "string" && field.trim().length > 0) {
      return field.trim();
    }
  }

  // Fallback to email prefix only if no name fields are available
  if (user.email) {
    const emailPrefix = user.email.split("@")[0];
    return emailPrefix;
  }

  return "User";
};

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
