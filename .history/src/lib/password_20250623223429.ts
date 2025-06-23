import bcrypt from "bcryptjs";

export class PasswordService {
  private static instance: PasswordService;
  private readonly saltRounds: number = 12; // BCrypt salt rounds

  private constructor() {}

  public static getInstance(): PasswordService {
    if (!PasswordService.instance) {
      PasswordService.instance = new PasswordService();
    }
    return PasswordService.instance;
  }

  // Hash password using BCrypt
  public async hashPassword(plainPassword: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      return await bcrypt.hash(plainPassword, salt);
    } catch (error) {
      console.error("Error hashing password:", error);
      throw new Error("Failed to hash password");
    }
  }

  // Verify password against hash
  public async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error("Error verifying password:", error);
      throw new Error("Failed to verify password");
    }
  }

  // Validate password strength
  public validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    strength: "weak" | "medium" | "strong";
  } {
    const errors: string[] = [];
    let strength: "weak" | "medium" | "strong" = "weak";

    // Check minimum length (same as Spring Boot validation)
    if (password.length < 6) {
      errors.push("Mật khẩu phải có ít nhất 6 ký tự");
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất một chữ hoa");
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất một chữ thường");
    }

    // Check for number
    if (!/\d/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất một số");
    }

    // Check for special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất một ký tự đặc biệt");
    }

    // Determine strength
    const criteriaCount = [
      password.length >= 6,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
      password.length >= 8,
    ].filter(Boolean).length;

    if (criteriaCount >= 5) {
      strength = "strong";
    } else if (criteriaCount >= 3) {
      strength = "medium";
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength,
    };
  }

  // Generate random password
  public generateRandomPassword(length: number = 12): string {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";

    // Ensure at least one character from each required category
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // Uppercase
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // Lowercase
    password += "0123456789"[Math.floor(Math.random() * 10)]; // Number
    password += "!@#$%^&*"[Math.floor(Math.random() * 8)]; // Special

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }
}

// Export singleton instance
export const passwordService = PasswordService.getInstance();

// Helper functions
export const passwordUtils = {
  // Quick hash function
  hashPassword: async (password: string): Promise<string> => {
    return await passwordService.hashPassword(password);
  },

  // Quick verify function
  verifyPassword: async (password: string, hash: string): Promise<boolean> => {
    return await passwordService.verifyPassword(password, hash);
  },

  // Quick validation function
  validatePassword: (password: string) => {
    return passwordService.validatePasswordStrength(password);
  },

  // Generate secure password
  generatePassword: (length?: number): string => {
    return passwordService.generateRandomPassword(length);
  },
};

// Named exports for backward compatibility
export const hashPassword = passwordUtils.hashPassword;
export const verifyPassword = passwordUtils.verifyPassword;

export default passwordService;
