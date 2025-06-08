import { SignJWT, jwtVerify, type JWTPayload } from "jose";

// JWT configuration based on Spring Boot application.properties
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "ducaan20202038djfndfjcuhfbbhsddaihocthuyloi2025doaantotnghiep";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "604800000"; // 7 days in milliseconds
const JWT_REFRESH_EXPIRATION =
  process.env.JWT_REFRESH_EXPIRATION || "604800000";

// Convert secret to Uint8Array for jose
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface JwtPayload extends JWTPayload {
  username: string;
  roles: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export class JwtService {
  private static instance: JwtService;
  private secret: Uint8Array;
  private expirationInMillis: number;
  private refreshExpirationInMillis: number;

  private constructor() {
    this.secret = secretKey;
    this.expirationInMillis = parseInt(JWT_EXPIRATION);
    this.refreshExpirationInMillis = parseInt(JWT_REFRESH_EXPIRATION);
  }

  public static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }
    return JwtService.instance;
  }

  // Generate access token
  public async generateToken(
    username: string,
    roles: string[]
  ): Promise<string> {
    const expirationTime = new Date(Date.now() + this.expirationInMillis);

    return await new SignJWT({
      username,
      roles,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(this.secret);
  }

  // Generate refresh token
  public async generateRefreshToken(
    username: string,
    roles: string[]
  ): Promise<string> {
    const expirationTime = new Date(
      Date.now() + this.refreshExpirationInMillis
    );

    return await new SignJWT({
      username,
      roles,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(this.secret);
  }

  // Generate token pair
  public async generateTokenPair(
    username: string,
    roles: string[]
  ): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(username, roles),
      this.generateRefreshToken(username, roles),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: Math.floor(this.expirationInMillis / 1000), // Convert to seconds
    };
  }

  // Extract username from token
  public async extractUsername(token: string): Promise<string> {
    try {
      const { payload } = await jwtVerify(token, this.secret);
      const jwtPayload = payload as JwtPayload;
      return jwtPayload.username;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  // Extract roles from token
  public async getRolesFromToken(token: string): Promise<string[]> {
    try {
      const { payload } = await jwtVerify(token, this.secret);
      const jwtPayload = payload as JwtPayload;
      return jwtPayload.roles || [];
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  // Verify token
  public async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const { payload } = await jwtVerify(token, this.secret);
      return payload as JwtPayload;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  // Check if token is expired
  public async isTokenExpired(token: string): Promise<boolean> {
    try {
      await jwtVerify(token, this.secret);
      return false;
    } catch (error) {
      if (error instanceof Error && error.message.includes("expired")) {
        return true;
      }
      throw new Error("Invalid token");
    }
  }

  // Refresh token
  public async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const decoded = await this.verifyToken(refreshToken);
      return await this.generateTokenPair(decoded.username, decoded.roles);
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }
}

// Export singleton instance
export const jwtService = JwtService.getInstance();

// Helper functions for token extraction from requests
export const tokenUtils = {
  // Extract token from Authorization header
  extractTokenFromHeader: (authHeader: string | null): string | null => {
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
    return null;
  },

  // Extract token from Request object
  extractTokenFromRequest: (request: Request): string | null => {
    const authHeader = request.headers.get("Authorization");
    return tokenUtils.extractTokenFromHeader(authHeader);
  },

  // Verify token from request
  verifyTokenFromRequest: async (request: Request): Promise<JwtPayload> => {
    const token = tokenUtils.extractTokenFromRequest(request);
    if (!token) {
      throw new Error("No token provided");
    }
    return await jwtService.verifyToken(token);
  },

  // Extract user info from request
  extractUserFromRequest: async (
    request: Request
  ): Promise<{ username: string; roles: string[] }> => {
    const payload = await tokenUtils.verifyTokenFromRequest(request);
    return {
      username: payload.username,
      roles: payload.roles,
    };
  },
};

export default jwtService;
