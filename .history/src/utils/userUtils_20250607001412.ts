interface User {
  name?: string;
  email?: string;
  fullName?: string;
  full_name?: string;
  username?: string;
}

/**
 * Get display name from user object
 * Priority: name > fullName > full_name > username > email prefix
 */
export const getUserDisplayName = (user?: User | null): string => {
  if (!user) return "User";

  // Try different name fields
  const displayName =
    user.name || user.fullName || user.full_name || user.username;

  if (displayName && displayName.trim().length > 0) {
    return displayName.trim();
  }

  // Fallback to email prefix
  if (user.email) {
    return user.email.split("@")[0];
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
 */
export const getGreetingName = (user?: User | null): string => {
  const shortName = getShortDisplayName(user);
  return shortName === "User" ? "bạn" : shortName;
};
