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
    console.log("getUserDisplayName: user is null/undefined");
    return "User";
  }
  
  console.log("getUserDisplayName input:", user);

  // Try different name fields in priority order
  const displayName =
    user.full_name || user.fullName || user.name || user.username;

  console.log("getUserDisplayName extracted:", displayName);

  if (displayName && displayName.trim().length > 0) {
    return displayName.trim();
  }

  // Fallback to email prefix
  if (user.email) {
    const emailPrefix = user.email.split("@")[0];
    console.log("getUserDisplayName fallback to email prefix:", emailPrefix);
    return emailPrefix;
  }

  console.log("getUserDisplayName fallback to User");
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
 */
export const getGreetingName = (user?: User | null): string => {
  const shortName = getShortDisplayName(user);
  return shortName === "User" ? "bạn" : shortName;
};
