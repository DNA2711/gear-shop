# 📋 GEAR SHOP - HỆ THỐNG TÀI LIỆU KỸ THUẬT TOÀN DIỆN

## 📖 MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Kiến trúc tổng thể](#2-kiến-trúc-tổng-thể)
3. [Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
4. [Database Schema](#4-database-schema)
5. [Authentication](#5-authentication)
6. [API Structure](#6-api-structure)
7. [Frontend Components](#7-frontend-components)
8. [State Management](#8-state-management)
9. [Deployment](#9-deployment)
10. [Key Features](#10-key-features)

---

## 1. TỔNG QUAN HỆ THỐNG

### 🎯 **Mục đích**

Gear Shop là một **E-commerce platform** chuyên bán linh kiện máy tính, PC Gaming và các thiết bị công nghệ.

### 🛠️ **Technology Stack**

```
Frontend:     Next.js 15, React 19, TypeScript, Tailwind CSS
Backend:      Next.js API Routes (Full-stack)
Database:     MySQL (Railway Cloud)
Deployment:   Vercel (Frontend) + Railway (Database)
Auth:         JWT (Custom implementation)
UI Library:   Radix UI, Lucide Icons, React Hot Toast
State:        React Context API
```

### 🌐 **Architecture Pattern**

```
Monolithic Full-Stack (Next.js App Router)
├── Client-Side Rendering (CSR)
├── Server-Side Rendering (SSR)
├── API Routes (Backend)
└── Database Layer
```

---

## 2. KIẾN TRÚC TỔNG THỂ

### 📊 **System Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     VERCEL      │    │    RAILWAY      │    │   THIRD PARTY   │
│   (Frontend)    │    │   (Database)    │    │   (Services)    │
│  ┌─────────────┐│    │  ┌─────────────┐│    │  ┌─────────────┐│
│  │ Next.js App ││    │  │ MySQL 8.0   ││    │  │ Email SMTP  ││
│  │  - Pages    ││◄──►│  │  - Tables   ││    │  │ - Nodemailer││
│  │  - API      ││    │  │  - Indexes  ││    │  │ - Gmail     ││
│  │  - Components││   │  │  - Relations││    │  └─────────────┘│
│  └─────────────┘│    │  └─────────────┘│    └─────────────────┘
└─────────────────┘    └─────────────────┘
```

### 🔄 **Request Flow**

```
User → Vercel CDN → Next.js App → API Route → Database (Railway) → Response
```

---

## 3. CẤU TRÚC THƯ MỤC

### 📁 **Root Directory**

```
gear-shop/
├── 📁 src/                     # Source code chính
│   ├── 📁 app/                 # Next.js App Router
│   ├── 📁 components/          # React Components
│   ├── 📁 contexts/            # Context Providers
│   ├── 📁 hooks/               # Custom Hooks
│   ├── 📁 lib/                 # Utility Libraries
│   ├── 📁 types/               # TypeScript Definitions
│   └── 📁 utils/               # Helper Functions
├── 📁 public/                  # Static Assets
├── 📁 database/                # Database Scripts
├── 📄 .env                     # Environment Variables
├── 📄 package.json             # Dependencies
└── 📄 vercel.json              # Vercel Config
```

### 📂 **App Router Structure**

```
src/app/
├── 📁 (main)/                  # Route Group
├── 📁 admin/                   # Admin Dashboard
│   ├── 📄 page.tsx             # Dashboard
│   ├── 📁 products/            # Product management
│   ├── 📁 orders/              # Order management
│   └── 📁 analytics/           # Reports
├── 📁 api/                     # Backend API Routes
│   ├── 📁 auth/                # Authentication
│   ├── 📁 products/            # Product CRUD
│   ├── 📁 orders/              # Order management
│   └── 📁 admin/               # Admin endpoints
├── 📁 products/                # Product pages
├── 📁 cart/                    # Shopping cart
├── 📁 checkout/                # Checkout process
├── 📁 profile/                 # User profile
└── 📄 page.tsx                 # Homepage
```

---

## 4. DATABASE SCHEMA

### 🗃️ **Core Tables**

#### **Users Table**

```sql
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `role` enum('ADMIN','USER') DEFAULT 'USER',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
);
```

#### **Products Table**

```sql
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `product_code` varchar(100) NOT NULL,
  `brand_id` int DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `original_price` decimal(15,2) DEFAULT NULL,
  `stock_quantity` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_code` (`product_code`)
);
```

### 🔗 **Relationships**

```
Users (1) ──────── (N) Orders
Orders (1) ─────── (N) Order_Items
Products (1) ───── (N) Order_Items
Products (N) ───── (1) Categories
Products (N) ───── (1) Brands
```

---

## 5. AUTHENTICATION

### 🔐 **JWT Authentication Flow**

#### **Login Process**

```
1. User submits credentials (email/password)
2. API validates user in database
3. Password verification using bcryptjs
4. Generate JWT token pair (access + refresh)
5. Return tokens to client
6. Store tokens in localStorage + cookies
7. Include token in subsequent requests
```

#### **Token Structure**

```typescript
interface JWTPayload {
  sub: string; // User email
  roles: string[]; // ['USER'] or ['ADMIN']
  iat: number; // Issued at
  exp: number; // Expiration
}
```

#### **Route Protection**

```typescript
// Protected Routes
const protectedRoutes = ["/dashboard", "/profile", "/admin"];
const adminRoutes = ["/admin", "/api/admin"];

// Middleware Authentication
export async function middleware(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const isAuthenticated = await verifyToken(token);
  // Route protection logic
}
```

---

## 6. API STRUCTURE

### 🌐 **API Endpoints**

#### **Authentication**

```
POST   /api/auth/login           # User login
POST   /api/auth/register        # User registration
GET    /api/auth/me              # Get current user
POST   /api/auth/refresh         # Refresh token
POST   /api/auth/forgot-password # Password reset
```

#### **Products**

```
GET    /api/products             # Get products with filters
POST   /api/products             # Create product (Admin)
GET    /api/products/[id]        # Get product by ID
PUT    /api/products/[id]        # Update product (Admin)
DELETE /api/products/[id]        # Delete product (Admin)
```

#### **Orders**

```
GET    /api/orders               # Get user orders
POST   /api/orders               # Create new order
GET    /api/orders/[id]          # Get order details
PUT    /api/orders/[id]/status   # Update status (Admin)
```

### 📝 **Response Format**

```typescript
// Success Response
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: PaginationInfo;
}

// Error Response
interface ErrorResponse {
  success: false;
  status: number;
  message: string;
  errors?: string[];
}
```

---

## 7. FRONTEND COMPONENTS

### 🧱 **Component Architecture**

#### **Layout Structure**

```typescript
<RootLayout>
  <ErrorBoundary>
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <CartProvider>
            <LoadingProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </LoadingProvider>
          </CartProvider>
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  </ErrorBoundary>
</RootLayout>
```

#### **Key Components**

```
📦 components/
├── 📁 admin/           # Admin components
│   ├── DashboardStats.tsx
│   ├── ProductModal.tsx
│   └── SalesChart.tsx
├── 📁 auth/            # Authentication
│   └── ProtectedRoute.tsx
├── 📁 cart/            # Shopping cart
│   ├── CartDrawer.tsx
│   └── AddToCartButton.tsx
├── 📁 layout/          # Layout components
│   ├── header.tsx
│   └── footer.tsx
└── 📁 ui/              # Reusable UI
    ├── button.tsx
    ├── ProductCard.tsx
    └── Loading.tsx
```

---

## 8. STATE MANAGEMENT

### 🔄 **Context Providers**

#### **Authentication Context**

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginForm) => Promise<{ success: boolean }>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

#### **Cart Context**

```typescript
interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}
```

#### **Notification Context**

```typescript
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}
```

---

## 9. DEPLOYMENT

### 🚀 **Environment Configuration**

#### **Local Development**

```bash
# .env
DB_HOST=caboose.proxy.rlwy.net
DB_PORT=29150
DB_USER=root
DB_PASSWORD=RTbPDjFprveDAFWcKaIjOpiFimetgWdR
DB_NAME=railway
JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### **Production (Vercel)**

```bash
# .env.production
DB_HOST=caboose.proxy.rlwy.net
DB_PORT=29150
DB_USER=root
DB_PASSWORD=RTbPDjFprveDAFWcKaIjOpiFimetgWdR
DB_NAME=railway
JWT_SECRET=production-secret
NEXT_PUBLIC_APP_URL=https://gear-shop.vercel.app
NODE_ENV=production
```

#### **Database Connection**

```typescript
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Serverless optimizations
  connectionLimit: process.env.NODE_ENV === "production" ? 2 : 10,
  idleTimeout: 30000,
  charset: "utf8mb4",
};
```

---

## 10. KEY FEATURES

### 🛒 **E-commerce Features**

#### **Product Management**

- ✅ Product CRUD operations
- ✅ Category hierarchy management
- ✅ Brand management
- ✅ Multiple product images (Base64)
- ✅ Product specifications
- ✅ Inventory tracking
- ✅ Price management
- ✅ Search & filtering

#### **Shopping Cart**

- ✅ Add/remove products
- ✅ Quantity management
- ✅ Persistent cart (localStorage)
- ✅ Real-time price calculation
- ✅ Stock validation

#### **Order Management**

- ✅ Order creation & tracking
- ✅ Status workflow (pending → delivered)
- ✅ Payment methods (COD, VNPay)
- ✅ Order history
- ✅ Admin order management

#### **User Management**

- ✅ Registration & authentication
- ✅ Profile management
- ✅ Role-based access (USER, ADMIN)
- ✅ Password reset

### 📊 **Admin Features**

- ✅ Dashboard with statistics
- ✅ Product management interface
- ✅ Order management
- ✅ User management
- ✅ Analytics & reports

### 🔔 **Advanced Features**

- ✅ Real-time notifications
- ✅ Smart search suggestions
- ✅ Email notifications (SMTP)
- ✅ Responsive design
- ✅ Vietnamese language support

---

## 🔒 SECURITY

### **Security Measures**

- 🔐 JWT authentication with short expiration
- 🔐 bcryptjs password hashing
- 🔐 SQL injection prevention (prepared statements)
- 🔐 Input validation on all endpoints
- 🔐 Role-based access control
- 🔐 Secure error handling

---

## 📈 DATA FLOW EXAMPLES

### **User Login Flow**

```
User Input → Validation → API Call → Database Check → JWT Generation → Context Update → UI Redirect
```

### **Add to Cart Flow**

```
Product Page → Add Button → Stock Check → Cart Context → localStorage → UI Update
```

### **Order Creation Flow**

```
Cart Review → Checkout Form → API Call → Database Transaction → Email Notification → Success Page
```

---

---

## 📚 GIẢI THÍCH CHI TIẾT CÁC FILE CODE

### 🏠 **File Root Layout (src/app/layout.tsx)**

```typescript
// File này là "cha" của toàn bộ ứng dụng - mọi trang đều được bọc trong này
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vn">
      <body className={fontSans.className}>
        {/* ErrorBoundary: Bắt lỗi toàn hệ thống, tránh crash app */}
        <ErrorBoundary>
          {/* AuthProvider: Quản lý trạng thái đăng nhập của user */}
          <AuthProvider>
            {/* ToastProvider: Hiển thị thông báo (success, error, warning) */}
            <ToastProvider>
              {/* NotificationProvider: Quản lý thông báo realtime */}
              <NotificationProvider>
                {/* CartProvider: Quản lý giỏ hàng */}
                <CartProvider>
                  {/* LoadingProvider: Quản lý trạng thái loading toàn cục */}
                  <LoadingProvider>
                    {/* ConditionalLayout: Quyết định hiển thị layout nào (admin/user) */}
                    <ConditionalLayout>{children}</ConditionalLayout>
                    {/* Overlay loading che toàn màn hình khi cần */}
                    <GlobalLoadingOverlay />
                  </LoadingProvider>
                </CartProvider>
              </NotificationProvider>
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>

        {/* Toast notifications với cấu hình màu sắc */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: "#363636", color: "#fff" },
            success: { duration: 3000, style: { background: "#10B981" } },
            error: { duration: 5000, style: { background: "#EF4444" } },
          }}
        />
      </body>
    </html>
  );
}
```

**🧠 Tại sao cần thiết kế như này?**

- **Providers Stack**: Mỗi Provider cung cấp data/functionality cho toàn bộ app
- **Error Boundary**: Nếu 1 component bị lỗi, chỉ component đó crash, không làm sập toàn app
- **Conditional Layout**: Admin và User có giao diện khác nhau
- **Global Loading**: Khi gọi API, hiển thị loading để user biết đang xử lý

---

### 🔐 **Authentication Context (src/contexts/AuthContext.tsx)**

```typescript
// Context này quản lý toàn bộ authentication logic
export function AuthProvider({ children }: AuthProviderProps) {
  // State quản lý user hiện tại
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra xem user đã đăng nhập chưa
  const isAuthenticated = !!user;

  // Khi app load lần đầu, kiểm tra xem có token trong localStorage không
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  // Hàm load thông tin user từ localStorage
  const loadUserFromStorage = async () => {
    try {
      setLoading(true);
      // Lấy token từ localStorage
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return; // Không có token = chưa đăng nhập
      }

      // Gọi API để verify token và lấy thông tin user
      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData); // Lưu thông tin user vào state
      } else {
        // Token hết hạn hoặc không hợp lệ
        clearAuthStorage();
      }
    } catch (error) {
      console.error("Error loading user:", error);
      clearAuthStorage();
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng nhập
  const login = async (credentials: LoginForm) => {
    try {
      setLoginLoading(true);
      setError(null);

      // Gọi API đăng nhập
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const loginData: LoginResponse = await response.json();

        // Lưu token vào localStorage và cookie
        localStorage.setItem("accessToken", loginData.accessToken);
        localStorage.setItem("refreshToken", loginData.refreshToken);

        // Cookie để middleware có thể đọc được
        document.cookie = `accessToken=${loginData.accessToken}; path=/; max-age=3600`;

        // Lấy thông tin user chi tiết
        const userResponse = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${loginData.accessToken}` },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }

        return { success: true, user: userData };
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Đăng nhập thất bại");
        return { success: false };
      }
    } catch (error) {
      setError("Lỗi kết nối. Vui lòng thử lại.");
      return { success: false };
    } finally {
      setLoginLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    clearAuthStorage();
    // Redirect về trang chủ hoặc login
  };

  // Xóa toàn bộ dữ liệu authentication
  const clearAuthStorage = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    document.cookie = `accessToken=; path=/; max-age=0`; // Xóa cookie
    setUser(null);
  };

  // Cung cấp data và functions cho toàn bộ app
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginLoading,
        error,
        login,
        logout,
        isAuthenticated,
        // ... other functions
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

**🧠 Tại sao thiết kế như này?**

- **Centralized State**: Mọi component đều có thể biết được trạng thái đăng nhập
- **Token Management**: Tự động lưu/xóa token, refresh khi hết hạn
- **Error Handling**: Xử lý lỗi authentication tập trung
- **Persistent Login**: User không cần đăng nhập lại khi reload trang

---

### 🛒 **Cart Context (src/contexts/CartContext.tsx)**

```typescript
// Context quản lý giỏ hàng
export function CartProvider({ children }: { children: React.ReactNode }) {
  // State lưu danh sách sản phẩm trong giỏ
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng cart drawer

  // Tính tổng số lượng sản phẩm
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Tính tổng tiền
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Load giỏ hàng từ localStorage khi app khởi động
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
  }, []);

  // Lưu giỏ hàng vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Thêm sản phẩm vào giỏ
  const addItem = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      // Kiểm tra sản phẩm đã có trong giỏ chưa
      const existingItem = prevItems.find(
        (item) => item.product_id === product.product_id
      );

      if (existingItem) {
        // Nếu có rồi, tăng số lượng
        return prevItems.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Nếu chưa có, thêm mới
        return [
          ...prevItems,
          {
            product_id: product.product_id,
            product_name: product.product_name,
            price: product.price,
            quantity: quantity,
            image: product.primary_image,
          },
        ];
      }
    });

    // Hiển thị thông báo
    toast.success(`Đã thêm ${product.product_name} vào giỏ hàng`);
  };

  // Xóa sản phẩm khỏi giỏ
  const removeItem = (productId: number) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product_id !== productId)
    );
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  // Cập nhật số lượng
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
    toast.success("Đã xóa toàn bộ giỏ hàng");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
```

**🧠 Tại sao thiết kế như này?**

- **Persistent Cart**: Giỏ hàng được lưu trong localStorage, không mất khi reload
- **Real-time Updates**: Mọi component đều thấy thay đổi giỏ hàng ngay lập tức
- **Optimistic Updates**: UI update ngay, không cần đợi API
- **Toast Notifications**: User luôn biết được hành động đã thực hiện

---

### 🗄️ **Database Connection (src/lib/database.ts)**

```typescript
// Singleton pattern để quản lý kết nối database
export class Database {
  private static instance: Database;
  private pool: mysql.Pool;

  private constructor() {
    // Cấu hình connection pool
    const dbConfig = {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "123456",
      database: process.env.DB_NAME || "gear_shop",

      // Tối ưu cho serverless (Vercel)
      connectionLimit: process.env.NODE_ENV === "production" ? 2 : 10,
      // Production: ít connection để tránh quá tải
      // Development: nhiều connection để test song song

      idleTimeout: 30000, // 30 giây không dùng thì đóng connection
      acquireTimeout: 30000, // Timeout khi lấy connection từ pool

      // Hỗ trợ tiếng Việt
      charset: "utf8mb4",
      timezone: "+00:00", // UTC timezone

      // SSL cho production
      ssl:
        process.env.NODE_ENV === "production" && process.env.DB_SSL !== "false"
          ? { rejectUnauthorized: false }
          : undefined,
    };

    this.pool = mysql.createPool(dbConfig);
  }

  // Singleton: chỉ có 1 instance duy nhất
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Thực hiện query với prepared statement (an toàn khỏi SQL injection)
  public async query(sql: string, params?: any[]): Promise<any[]> {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows as any[];
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

  // Thực hiện INSERT và trả về ID được tạo
  public async insert(sql: string, params?: any[]): Promise<number> {
    try {
      const [result] = await this.pool.execute(sql, params);
      return (result as any).insertId;
    } catch (error) {
      console.error("Database insert error:", error);
      throw error;
    }
  }

  // Thực hiện UPDATE/DELETE và trả về số dòng bị ảnh hưởng
  public async update(sql: string, params?: any[]): Promise<number> {
    try {
      const [result] = await this.pool.execute(sql, params);
      return (result as any).affectedRows;
    } catch (error) {
      console.error("Database update error:", error);
      throw error;
    }
  }

  // Lấy 1 record đầu tiên
  public async queryFirst(sql: string, params?: any[]): Promise<any | null> {
    const rows = await this.query(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }
}

// Export instance để sử dụng trong toàn bộ app
export const db = Database.getInstance();

// Helper functions để dễ sử dụng
export const dbHelpers = {
  // Tìm user theo email
  findUserByEmail: async (email: string) => {
    return await db.queryFirst("SELECT * FROM users WHERE email = ?", [email]);
  },

  // Tìm user theo ID
  findUserById: async (id: number) => {
    return await db.queryFirst("SELECT * FROM users WHERE user_id = ?", [id]);
  },

  // Tạo user mới
  createUser: async (userData: {
    fullName: string;
    email: string;
    passwordHash: string;
    phone?: string;
    address?: string;
  }) => {
    const sql = `
      INSERT INTO users (full_name, email, password_hash, phone, address) 
      VALUES (?, ?, ?, ?, ?)
    `;
    return await db.insert(sql, [
      userData.fullName,
      userData.email,
      userData.passwordHash,
      userData.phone || null,
      userData.address || null,
    ]);
  },

  // Kiểm tra product code đã tồn tại chưa
  productCodeExists: async (productCode: string) => {
    const result = await db.queryFirst(
      "SELECT product_id FROM products WHERE product_code = ?",
      [productCode]
    );
    return !!result;
  },

  // Lấy products với filter và pagination
  getProducts: async (filters: ProductFilter) => {
    let sql = `
      SELECT 
        p.*,
        b.brand_name,
        c.category_name,
        pi.image_code as primary_image
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id  
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
      WHERE 1=1
    `;

    const params: any[] = [];

    // Thêm điều kiện filter
    if (filters.search) {
      sql += " AND (p.product_name LIKE ? OR p.product_code LIKE ?)";
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.category_id) {
      sql += " AND p.category_id = ?";
      params.push(filters.category_id);
    }

    if (filters.brand_id) {
      sql += " AND p.brand_id = ?";
      params.push(filters.brand_id);
    }

    if (filters.min_price) {
      sql += " AND p.price >= ?";
      params.push(filters.min_price);
    }

    if (filters.max_price) {
      sql += " AND p.price <= ?";
      params.push(filters.max_price);
    }

    // Sorting
    const sortBy = filters.sort_by || "created_at";
    const sortOrder = filters.sort_order || "desc";
    sql += ` ORDER BY p.${sortBy} ${sortOrder}`;

    // Pagination
    const limit = filters.limit || 20;
    const offset = ((filters.page || 1) - 1) * limit;
    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    return await db.query(sql, params);
  },
};
```

**🧠 Tại sao thiết kế như này?**

- **Connection Pool**: Tái sử dụng connection, không tạo mới mỗi lần query
- **Singleton Pattern**: Đảm bảo chỉ có 1 database instance trong toàn app
- **Prepared Statements**: An toàn khỏi SQL injection
- **Helper Functions**: Code dễ đọc, dễ maintain
- **Error Handling**: Log lỗi chi tiết để debug
- **Serverless Optimization**: Ít connection hơn cho môi trường serverless

---

### 🔐 **API Authentication Route (src/app/api/auth/login/route.ts)**

```typescript
// API endpoint xử lý đăng nhập
export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body: LoginForm = await request.json();
    const { username, password } = body;

    // 2. Validate input
    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Email là bắt buộc" },
        { status: 400 }
      );
    }

    if (!password || password.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    // 3. Tìm user trong database
    const user = await dbHelpers.findUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email không tồn tại" },
        { status: 404 }
      );
    }

    // 4. Kiểm tra account có bị khóa không
    if (!user.is_active) {
      return NextResponse.json(
        { success: false, message: "Tài khoản đã bị khóa" },
        { status: 403 }
      );
    }

    // 5. Verify password
    const isPasswordValid = await passwordUtils.verifyPassword(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // 6. Generate JWT tokens
    const roles = [user.role || "USER"];
    const tokenPair = await jwtService.generateTokenPair(username, roles);

    // 7. Prepare response
    const loginResponse: LoginResponse = {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      tokenType: "Bearer",
      expiresIn: 3600, // 1 hour
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    };

    // 8. Return success response
    return NextResponse.json(loginResponse, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
```

**🧠 Flow xử lý đăng nhập:**

1. **Input Validation**: Kiểm tra email/password có hợp lệ không
2. **User Lookup**: Tìm user trong database theo email
3. **Account Status**: Kiểm tra account có bị khóa không
4. **Password Verification**: Dùng bcrypt để so sánh password
5. **Token Generation**: Tạo JWT token với thông tin user
6. **Response**: Trả về token + thông tin user

**🔒 Bảo mật:**

- Password được hash bằng bcryptjs
- Input validation để tránh injection
- Error messages cụ thể nhưng không tiết lộ thông tin nhạy cảm
- JWT token có thời gian hết hạn

---

### 🛍️ **Products API Route (src/app/api/products/route.ts)**

```typescript
// API endpoint để lấy danh sách sản phẩm với filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 1. Parse các filter parameters từ URL
    const filters = {
      search: searchParams.get("search") || undefined,
      brand_id: searchParams.get("brand_id")
        ? parseInt(searchParams.get("brand_id")!)
        : undefined,
      category_id: searchParams.get("category_id")
        ? parseInt(searchParams.get("category_id")!)
        : undefined,
      min_price: searchParams.get("min_price")
        ? parseFloat(searchParams.get("min_price")!)
        : undefined,
      max_price: searchParams.get("max_price")
        ? parseFloat(searchParams.get("max_price")!)
        : undefined,
      is_active: searchParams.get("is_active")
        ? searchParams.get("is_active") === "true"
        : undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 20,
      sort_by: searchParams.get("sort_by") || "product_name",
      sort_order: searchParams.get("sort_order") || "asc",
    };

    // 2. Build SQL query động dựa trên filters
    const whereConditions: string[] = ["1=1"]; // Base condition
    const queryParams: any[] = [];

    // Thêm điều kiện search
    if (filters.search) {
      whereConditions.push("(p.product_name LIKE ? OR p.product_code LIKE ?)");
      queryParams.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    // Thêm filter theo brand
    if (filters.brand_id) {
      whereConditions.push("p.brand_id = ?");
      queryParams.push(filters.brand_id);
    }

    // Thêm filter theo category
    if (filters.category_id) {
      whereConditions.push("p.category_id = ?");
      queryParams.push(filters.category_id);
    }

    // Thêm filter theo giá
    if (filters.min_price) {
      whereConditions.push("p.price >= ?");
      queryParams.push(filters.min_price);
    }

    if (filters.max_price) {
      whereConditions.push("p.price <= ?");
      queryParams.push(filters.max_price);
    }

    // Thêm filter theo trạng thái
    if (filters.is_active !== undefined) {
      whereConditions.push("p.is_active = ?");
      queryParams.push(filters.is_active);
    }

    const whereClause = whereConditions.join(" AND ");

    // 3. Tính toán pagination
    const offset = (filters.page - 1) * filters.limit;

    // 4. Validate sort column để tránh SQL injection
    const allowedSortColumns = [
      "product_name",
      "price",
      "stock_quantity",
      "created_at",
      "updated_at",
    ];
    const safeSortBy = allowedSortColumns.includes(filters.sort_by)
      ? filters.sort_by
      : "product_name";
    const safeSortOrder = ["asc", "desc"].includes(
      filters.sort_order.toLowerCase()
    )
      ? filters.sort_order.toLowerCase()
      : "asc";

    // 5. Query chính lấy products với thông tin liên quan
    const productsQuery = `
      SELECT 
        p.*,
        b.brand_name,
        b.brand_code,
        c.category_name,
        c.category_code,
        pc.category_name as category_parent_name,
        pi.image_code as primary_image
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN categories pc ON c.parent_id = pc.category_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
      WHERE ${whereClause}
      ORDER BY p.updated_at DESC, p.${safeSortBy} ${safeSortOrder}
      LIMIT ${filters.limit} OFFSET ${offset}
    `;

    const products = await db.query(productsQuery, queryParams);

    // 6. Query đếm tổng số records cho pagination
    const totalQuery = `
      SELECT COUNT(*) as total 
      FROM products p
      WHERE ${whereClause}
    `;
    const totalResult = await db.queryFirst(totalQuery, queryParams);
    const total = totalResult?.total || 0;

    // 7. Return formatted response với pagination info
    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh sách sản phẩm" },
      { status: 500 }
    );
  }
}

// API endpoint để tạo sản phẩm mới (chỉ Admin)
export async function POST(request: NextRequest) {
  try {
    const body: CreateProductRequest = await request.json();

    // 1. Validate dữ liệu đầu vào
    if (!body.product_name || !body.product_code || !body.price) {
      return NextResponse.json(
        {
          success: false,
          message: "Tên sản phẩm, mã sản phẩm và giá là bắt buộc",
        },
        { status: 400 }
      );
    }

    if (body.price <= 0) {
      return NextResponse.json(
        { success: false, message: "Giá sản phẩm phải lớn hơn 0" },
        { status: 400 }
      );
    }

    // 2. Kiểm tra mã sản phẩm đã tồn tại chưa
    const existingProduct = await dbHelpers.productCodeExists(
      body.product_code
    );
    if (existingProduct) {
      return NextResponse.json(
        { success: false, message: "Mã sản phẩm đã tồn tại" },
        { status: 409 }
      );
    }

    // 3. Insert sản phẩm mới vào database
    const insertSql = `
      INSERT INTO products (
        product_name, product_code, brand_id, category_id, 
        price, original_price, stock_quantity, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const productId = await db.insert(insertSql, [
      body.product_name,
      body.product_code,
      body.brand_id || null,
      body.category_id || null,
      body.price,
      body.original_price || null,
      body.stock_quantity || 0,
      body.is_active !== undefined ? body.is_active : true,
    ]);

    // 4. Lấy thông tin sản phẩm vừa tạo để trả về
    const newProduct = await db.queryFirst(
      "SELECT * FROM products WHERE product_id = ?",
      [productId]
    );

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: "Tạo sản phẩm thành công",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi tạo sản phẩm" },
      { status: 500 }
    );
  }
}
```

**🧠 Tại sao thiết kế như này?**

- **Dynamic Filtering**: Build SQL query dựa trên filters được truyền vào
- **SQL Injection Prevention**: Dùng prepared statements với parameters
- **Pagination**: Hỗ trợ phân trang để không load quá nhiều data
- **Join Tables**: Lấy thông tin brand, category cùng lúc
- **Validation**: Kiểm tra dữ liệu đầu vào kỹ lưỡng
- **Error Handling**: Xử lý lỗi và trả về message phù hợp

---

### 🛡️ **Middleware Protection (src/middleware.ts)**

```typescript
// Middleware chạy trước mọi request để kiểm tra authentication
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Lấy token từ Authorization header hoặc cookie
  const authHeader = request.headers.get("Authorization");
  let token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : request.cookies.get("auth-token")?.value;

  // Fallback: thử lấy từ accessToken cookie
  if (!token) {
    const accessTokenCookie = request.cookies.get("accessToken")?.value;
    if (accessTokenCookie) {
      token = accessTokenCookie;
    }
  }

  // 2. Verify token và lấy thông tin user
  let isAuthenticated = false;
  let userRole = "";

  if (token) {
    try {
      const payload = await jwtService.verifyToken(token);
      isAuthenticated = true;
      userRole = payload.roles?.[0] || "USER";
    } catch (error) {
      // Token không hợp lệ hoặc hết hạn
      isAuthenticated = false;
    }
  }

  // 3. Xử lý protected routes (cần đăng nhập)
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Web pages: redirect đến login
      if (!pathname.startsWith("/api/")) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname); // Lưu trang muốn truy cập
        return NextResponse.redirect(loginUrl);
      }

      // API routes: trả về 401
      return NextResponse.json(
        { status: 401, message: "Token không hợp lệ hoặc đã hết hạn" },
        { status: 401 }
      );
    }

    // 4. Kiểm tra admin routes (cần quyền admin)
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (userRole.toLowerCase() !== "admin") {
        // Web pages: redirect về dashboard
        if (!pathname.startsWith("/api/")) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // API routes: trả về 403
        return NextResponse.json(
          { status: 403, message: "Không có quyền truy cập" },
          { status: 403 }
        );
      }
    }
  }

  // 5. Xử lý auth routes (login, register)
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      // User đã đăng nhập rồi thì redirect khỏi trang login
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 6. Thêm CORS headers cho API routes
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  }

  // 7. Cho phép truy cập các routes khác
  return NextResponse.next();
}

// Cấu hình các paths mà middleware sẽ chạy
export const config = {
  matcher: [
    // Chạy trên tất cả routes trừ static files
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
```

**🧠 Logic bảo vệ routes:**

1. **Token Extraction**: Lấy token từ header hoặc cookie
2. **Token Verification**: Verify JWT token và lấy thông tin user
3. **Route Protection**: Kiểm tra route có cần authentication không
4. **Role-Based Access**: Kiểm tra quyền admin cho admin routes
5. **Redirect Logic**: Web pages redirect, API trả về error code
6. **CORS Support**: Thêm headers cho API calls
7. **Auth Routes**: Prevent đã login vào lại trang login

---

### 🎨 **Main Header Component (src/components/layout/header.tsx)**

```typescript
export default function Header() {
  // States quản lý UI
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<
    ProductWithDetails[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Refs và contexts
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Load categories khi component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Fetch categories từ API
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const result = await response.json();
      if (result.success) {
        setCategories(
          result.data.filter((cat: CategoryWithChildren) => cat.is_active)
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Xử lý search
  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); // Clear search sau khi redirect
      setShowSuggestions(false);
    }
  };

  // Xử lý keyboard navigation trong search suggestions
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && searchSuggestions[selectedIndex]) {
        handleSuggestionClick(searchSuggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < searchSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      searchInputRef.current?.blur();
    }
  };

  // Fetch search suggestions (instant search)
  const fetchSearchSuggestions = async (query: string) => {
    if (query.length < 1) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await fetch(
        `/api/search/smart-suggestions?q=${encodeURIComponent(query)}&limit=8`
      );
      if (response.ok) {
        const suggestions = await response.json();
        setSearchSuggestions(suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSearchSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Xử lý thay đổi input search (instant search)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIndex(-1);

    // Clear timeout trước đó
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Instant search - gọi API ngay lập tức
    fetchSearchSuggestions(value);
  };

  // Click vào suggestion
  const handleSuggestionClick = (product: any) => {
    router.push(`/products/${product.product_id}`);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900">
      {/* Navigation bar */}
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <LoadingLink href="/" className="text-2xl font-bold text-white">
              Gear Shop
            </LoadingLink>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-8 relative">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyPress}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />

              {/* Search loading indicator */}
              {searchLoading && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                </div>
              )}
            </div>

            {/* Search suggestions dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border max-h-96 overflow-y-auto z-50">
                {searchSuggestions.map((product, index) => (
                  <div
                    key={product.product_id}
                    className={`p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 flex items-center space-x-3 ${
                      index === selectedIndex ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleSuggestionClick(product)}
                  >
                    {/* Product image */}
                    {product.primary_image && (
                      <img
                        src={`data:image/jpeg;base64,${product.primary_image}`}
                        alt={product.product_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}

                    {/* Product info */}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 line-clamp-1">
                        {product.product_name}
                      </h4>
                      <p className="text-sm text-blue-600 font-semibold">
                        {product.price?.toLocaleString()}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Cart, User menu */}
          <div className="flex items-center space-x-4">
            {/* Shopping cart */}
            <HeaderShoppingCart />

            {/* Notifications (if logged in) */}
            {user && <NotificationBell />}

            {/* User menu */}
            {user ? <HeaderDropdownMenu /> : <LoginButton />}
          </div>
        </div>
      </nav>

      {/* Popular categories bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 py-2 overflow-x-auto">
            {popularCategories.map((category) => (
              <LoadingLink
                key={category.name}
                href={category.href}
                className="flex items-center space-x-2 text-sm text-white/80 hover:text-white whitespace-nowrap"
              >
                <span className={category.color}>{category.icon}</span>
                <span>{category.name}</span>
              </LoadingLink>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
```

**🧠 Tính năng chính của Header:**

- **Smart Search**: Instant search với suggestions và keyboard navigation
- **Authentication UI**: Hiển thị khác nhau cho user đã/chưa login
- **Shopping Cart**: Icon cart với số lượng sản phẩm
- **Notifications**: Bell icon cho thông báo realtime
- **Popular Categories**: Quick links đến các danh mục hot
- **Mobile Responsive**: Responsive design cho mobile

---

## 🔄 BUSINESS LOGIC VÀ DATA FLOW

### 📱 **User Journey: Mua hàng hoàn chỉnh**

```
1. KHÁM PHÁ SẢN PHẨM
   User truy cập trang chủ (/page.tsx)
   → Component FeaturedProducts fetch API /api/products?featured=true
   → ProductCard components hiển thị grid sản phẩm
   → User click vào sản phẩm

2. XEM CHI TIẾT SẢN PHẨM
   Route: /products/[productId]/page.tsx
   → useEffect gọi API /api/products/[id]
   → ProductDetail component hiển thị:
     - Ảnh sản phẩm (từ product_images table)
     - Thông số kỹ thuật (từ specifications table)
     - Related products
   → User click "Thêm vào giỏ"

3. THÊM VÀO GIỎ HÀNG
   AddToCartButton component → CartContext.addItem()
   → Kiểm tra sản phẩm đã có trong giỏ chưa
   → Update localStorage và state
   → Toast notification "Đã thêm vào giỏ"
   → Header cart icon update số lượng

4. XEM GIỎ HÀNG
   User click cart icon → CartDrawer component mở
   → Hiển thị danh sách CartItem components
   → User có thể update quantity, remove items
   → Click "Thanh toán" → redirect /checkout

5. THANH TOÁN
   Checkout page (/checkout/page.tsx):
   → Nếu chưa login: redirect /login với redirect param
   → Form nhập địa chỉ giao hàng
   → Chọn phương thức thanh toán
   → Click "Đặt hàng" → gọi API /api/orders

6. TẠO ĐƠN HÀNG
   API /api/orders POST:
   → Validate user authentication
   → Validate cart items trong database
   → Begin database transaction
   → INSERT vào orders table
   → INSERT vào order_items table
   → UPDATE stock_quantity trong products
   → Commit transaction
   → Return order_id

7. THANH TOÁN
   → Redirect /payment/[orderId]
   → Tích hợp VNPay/Momo payment gateway
   → Callback URL: /api/payment/callback
   → Update payment_status trong orders table

8. HOÀN THÀNH
   → Redirect /checkout/success
   → Gửi email confirmation
   → Clear giỏ hàng
   → Tạo notification cho user
```

### 🔄 **Admin Workflow: Quản lý sản phẩm**

```
1. ĐĂNG NHẬP ADMIN
   Admin login với role="ADMIN"
   → Middleware check admin routes
   → Access /admin dashboard

2. THÊM SẢN PHẨM MỚI
   /admin/products/page.tsx:
   → ProductModal component
   → Form validation (product_name, price, etc.)
   → POST /api/products
   → Upload images POST /api/products/[id]/images
   → Update stock quantity

3. QUẢN LÝ ĐON HÀNG
   /admin/orders/page.tsx:
   → GET /api/admin/orders với filter
   → Table hiển thị orders với status
   → Click vào order → Chi tiết + update status
   → PUT /api/orders/[id]/status

4. THỐNG KÊ DOANH THU
   /admin/analytics/page.tsx:
   → GET /api/admin/statistics
   → Chart components (SalesChart, etc.)
   → Real-time data updates
```

### 🧠 **Code Organization Logic**

```typescript
// Tại sao chia thành các layer như này:

1. PRESENTATION LAYER (src/components/)
   → UI components thuần túy
   → Nhận data từ props
   → Emit events lên parent
   → Không chứa business logic

2. BUSINESS LOGIC LAYER (src/contexts/, src/hooks/)
   → AuthContext: Quản lý authentication state
   → CartContext: Quản lý giỏ hàng logic
   → Custom hooks: Reusable logic
   → API calls và data transformation

3. DATA ACCESS LAYER (src/lib/, src/app/api/)
   → Database connection & queries
   → API route handlers
   → Data validation
   → Error handling

4. TYPES LAYER (src/types/)
   → TypeScript interfaces
   → Type safety across app
   → API contract definitions
```

### 🔐 **Security Implementation Chi Tiết**

```typescript
// 1. INPUT VALIDATION
const validateProductInput = (data: ProductInput) => {
  // XSS prevention
  const sanitized = {
    product_name: sanitizeHtml(data.product_name),
    description: sanitizeHtml(data.description),
    price: parseFloat(data.price), // Type coercion
  };

  // Business validation
  if (sanitized.price <= 0) {
    throw new ValidationError("Giá phải lớn hơn 0");
  }

  return sanitized;
};

// 2. SQL INJECTION PREVENTION
const query = "SELECT * FROM products WHERE category_id = ? AND price >= ?";
const params = [categoryId, minPrice]; // Prepared statements

// 3. AUTHORIZATION
const checkAdminAccess = (user: User) => {
  if (!user || user.role !== "ADMIN") {
    throw new AuthorizationError("Không có quyền truy cập");
  }
};

// 4. RATE LIMITING (trong middleware)
const rateLimiter = new Map();
const checkRateLimit = (ip: string) => {
  const requests = rateLimiter.get(ip) || [];
  const now = Date.now();
  const recentRequests = requests.filter((time) => now - time < 60000); // 1 minute

  if (recentRequests.length > 100) {
    // Max 100 requests/minute
    throw new Error("Too many requests");
  }

  rateLimiter.set(ip, [...recentRequests, now]);
};
```

### 📊 **Performance Optimizations**

```typescript
// 1. DATABASE OPTIMIZATION
// Index trên các column search thường xuyên
CREATE INDEX idx_products_search ON products(product_name, product_code);
CREATE INDEX idx_products_category ON products(category_id, is_active);
CREATE INDEX idx_products_price ON products(price);

// 2. API OPTIMIZATION
// Pagination để tránh load quá nhiều data
const limit = Math.min(request.limit || 20, 100); // Max 100 items

// Join thông minh để giảm số query
const query = `
  SELECT p.*, b.brand_name, c.category_name
  FROM products p
  LEFT JOIN brands b ON p.brand_id = b.brand_id
  LEFT JOIN categories c ON p.category_id = c.category_id
`; // 1 query thay vì N+1 queries

// 3. FRONTEND OPTIMIZATION
// Lazy loading cho images
<img src={product.image} loading="lazy" />

// Component memoization
const ProductCard = React.memo(({ product }) => {
  // Component chỉ re-render khi product thay đổi
});

// Debounce cho search
const debouncedSearch = useCallback(
  debounce((query) => fetchSuggestions(query), 300),
  []
);
```

### 🧭 **Navigation Pattern**

```typescript
// Tại sao dùng LoadingLink thay vì Link bình thường:

const LoadingLink = ({ href, children, ...props }) => {
  const { setLoading } = useLoading();

  const handleClick = () => {
    setLoading(true); // Hiển thị loading ngay lập tức
    // Router.push sẽ xử lý navigation
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

// UX benefit: User thấy loading ngay, không bị "lag"
```

### 💾 **State Management Strategy**

```typescript
// Tại sao dùng Context thay vì Redux:

1. SIMPLE STATE UPDATES
   // Context đủ cho most cases
   const { addItem } = useCart();
   addItem(product, quantity);

2. COMPONENT COUPLING
   // Chỉ components cần cart data mới subscribe
   const cartComponents = useCart(); // Selective subscription

3. NO BOILERPLATE
   // Không cần actions, reducers, store setup
   // Ít code hơn, dễ maintain

4. TYPESCRIPT FRIENDLY
   // Type safety ngay từ đầu
   interface CartContextValue {
     items: CartItem[];
     addItem: (product: Product, qty: number) => void;
   }
```

## 💡 **TIPS ĐỂ HIỂU CODE TỐT HƠN**

### 🔍 **Cách đọc API endpoints:**

1. **Method** quyết định hành động: GET (lấy), POST (tạo), PUT (sửa), DELETE (xóa)
2. **URL pattern**: `/api/products/[id]` → Dynamic route với product ID
3. **Request/Response types**: Xem trong `src/types/` để hiểu data structure

### 🎯 **Cách trace một tính năng:**

```
1. Start từ UI component (ví dụ: AddToCartButton)
2. Follow event handler (handleAddToCart)
3. Trace context call (cartContext.addItem)
4. Check API call (nếu có)
5. Verify database query (src/lib/database.ts)
```

### 🐛 **Debugging workflow:**

```
1. Console.log trong component để check props/state
2. Network tab để check API requests/responses
3. Database logs để check SQL queries
4. React DevTools để check component tree
```

### 📚 **Học từ code patterns:**

- **Error boundaries**: Catch React errors gracefully
- **Context patterns**: Share state without prop drilling
- **Custom hooks**: Reusable logic between components
- **Middleware**: Centralized request processing
- **TypeScript**: Type safety và better developer experience

---

## 🗄️ CHI TIẾT DATABASE SCHEMA VÀ RELATIONSHIPS

### 🏗️ **Database Tables Chi Tiết**

```sql
-- 1. USERS TABLE - Quản lý người dùng
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL COMMENT 'Họ tên đầy đủ',
  email VARCHAR(255) UNIQUE NOT NULL COMMENT 'Email đăng nhập (unique)',
  password_hash VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã hash bằng bcrypt',
  phone VARCHAR(20) COMMENT 'Số điện thoại',
  address TEXT COMMENT 'Địa chỉ giao hàng mặc định',
  role ENUM('USER', 'ADMIN') DEFAULT 'USER' COMMENT 'Vai trò người dùng',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Trạng thái active/banned',
  email_verified BOOLEAN DEFAULT FALSE COMMENT 'Email đã xác thực chưa',
  reset_token VARCHAR(255) COMMENT 'Token reset password',
  reset_token_expires DATETIME COMMENT 'Thời hạn token reset',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for performance
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_reset_token (reset_token)
);

-- 2. CATEGORIES TABLE - Danh mục sản phẩm (có thể nested)
CREATE TABLE categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(255) NOT NULL COMMENT 'Tên danh mục',
  category_code VARCHAR(100) UNIQUE NOT NULL COMMENT 'Mã danh mục (URL slug)',
  description TEXT COMMENT 'Mô tả danh mục',
  parent_id INT COMMENT 'ID danh mục cha (NULL = root category)',
  icon_name VARCHAR(100) COMMENT 'Tên icon (cho UI)',
  sort_order INT DEFAULT 0 COMMENT 'Thứ tự sắp xếp',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Hiển thị hay ẩn',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraint
  FOREIGN KEY (parent_id) REFERENCES categories(category_id) ON DELETE SET NULL,
  
  -- Indexes
  INDEX idx_parent (parent_id),
  INDEX idx_active (is_active),
  INDEX idx_code (category_code)
);

-- 3. BRANDS TABLE - Thương hiệu
CREATE TABLE brands (
  brand_id INT PRIMARY KEY AUTO_INCREMENT,
  brand_name VARCHAR(255) NOT NULL COMMENT 'Tên thương hiệu',
  brand_code VARCHAR(100) UNIQUE NOT NULL COMMENT 'Mã thương hiệu',
  description TEXT COMMENT 'Mô tả thương hiệu',
  logo_url VARCHAR(500) COMMENT 'URL logo thương hiệu',
  website_url VARCHAR(500) COMMENT 'Website chính thức',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_active (is_active),
  INDEX idx_code (brand_code)
);

-- 4. PRODUCTS TABLE - Sản phẩm chính
CREATE TABLE products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(500) NOT NULL COMMENT 'Tên sản phẩm',
  product_code VARCHAR(100) UNIQUE NOT NULL COMMENT 'Mã SKU',
  brand_id INT COMMENT 'ID thương hiệu',
  category_id INT COMMENT 'ID danh mục',
  description TEXT COMMENT 'Mô tả chi tiết sản phẩm',
  short_description VARCHAR(1000) COMMENT 'Mô tả ngắn',
  price DECIMAL(15,2) NOT NULL COMMENT 'Giá bán hiện tại (VND)',
  original_price DECIMAL(15,2) COMMENT 'Giá gốc (để tính % giảm giá)',
  cost_price DECIMAL(15,2) COMMENT 'Giá nhập (cho tính lãi)',
  stock_quantity INT DEFAULT 0 COMMENT 'Số lượng tồn kho',
  min_stock_level INT DEFAULT 5 COMMENT 'Mức tồn kho tối thiểu (cảnh báo)',
  weight DECIMAL(8,2) COMMENT 'Trọng lượng (kg) - cho tính phí ship',
  dimensions VARCHAR(100) COMMENT 'Kích thước (DxRxC cm)',
  warranty_period INT COMMENT 'Thời hạn bảo hành (tháng)',
  is_featured BOOLEAN DEFAULT FALSE COMMENT 'Sản phẩm nổi bật',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Đang bán hay ngừng bán',
  view_count INT DEFAULT 0 COMMENT 'Số lượt xem (cho trending)',
  sale_count INT DEFAULT 0 COMMENT 'Số lượt bán (cho bestseller)',
  seo_title VARCHAR(255) COMMENT 'SEO title',
  seo_description VARCHAR(500) COMMENT 'SEO meta description',
  seo_keywords VARCHAR(500) COMMENT 'SEO keywords',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign keys
  FOREIGN KEY (brand_id) REFERENCES brands(brand_id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
  
  -- Performance indexes
  INDEX idx_search (product_name, product_code), -- Cho search
  INDEX idx_category (category_id, is_active), -- Filter theo category
  INDEX idx_brand (brand_id, is_active), -- Filter theo brand
  INDEX idx_price (price), -- Sort/filter theo giá
  INDEX idx_featured (is_featured, is_active), -- Sản phẩm nổi bật
  INDEX idx_stock (stock_quantity), -- Kiểm tra tồn kho
  INDEX idx_popularity (view_count, sale_count) -- Trending products
);

-- 5. PRODUCT_IMAGES TABLE - Ảnh sản phẩm
CREATE TABLE product_images (
  image_id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  image_code LONGTEXT COMMENT 'Base64 encoded image data',
  image_url VARCHAR(500) COMMENT 'URL ảnh (nếu dùng external storage)',
  image_name VARCHAR(255) COMMENT 'Tên file gốc',
  image_alt VARCHAR(255) COMMENT 'Alt text cho SEO',
  is_primary BOOLEAN DEFAULT FALSE COMMENT 'Ảnh chính (thumbnail)',
  sort_order INT DEFAULT 0 COMMENT 'Thứ tự hiển thị',
  file_size INT COMMENT 'Kích thước file (bytes)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  
  -- Chỉ 1 ảnh primary per product
  UNIQUE KEY unique_primary_per_product (product_id, is_primary),
  INDEX idx_product (product_id),
  INDEX idx_primary (is_primary)
);

-- 6. SPECIFICATIONS TABLE - Thông số kỹ thuật
CREATE TABLE specifications (
  spec_id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  spec_name VARCHAR(255) NOT NULL COMMENT 'Tên thông số (VD: CPU, RAM)',
  spec_value TEXT NOT NULL COMMENT 'Giá trị thông số',
  spec_group VARCHAR(100) COMMENT 'Nhóm thông số (VD: Hardware, Software)',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  INDEX idx_product (product_id),
  INDEX idx_group (spec_group)
);

-- 7. ORDERS TABLE - Đơn hàng
CREATE TABLE orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(50) UNIQUE NOT NULL COMMENT 'Mã đơn hàng (public)',
  user_id INT NOT NULL,
  status ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING',
  payment_status ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
  payment_method ENUM('COD', 'VNPAY', 'MOMO', 'BANK_TRANSFER') DEFAULT 'COD',
  
  -- Shipping info
  shipping_name VARCHAR(255) NOT NULL COMMENT 'Tên người nhận',
  shipping_phone VARCHAR(20) NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_note TEXT COMMENT 'Ghi chú giao hàng',
  
  -- Pricing
  subtotal DECIMAL(15,2) NOT NULL COMMENT 'Tổng tiền hàng',
  shipping_fee DECIMAL(15,2) DEFAULT 0 COMMENT 'Phí giao hàng',
  discount_amount DECIMAL(15,2) DEFAULT 0 COMMENT 'Số tiền giảm giá',
  total_amount DECIMAL(15,2) NOT NULL COMMENT 'Tổng thanh toán',
  
  -- Timestamps
  ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP NULL,
  shipped_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  cancelled_at TIMESTAMP NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_payment (payment_status),
  INDEX idx_ordered_date (ordered_at),
  INDEX idx_order_number (order_number)
);

-- 8. ORDER_ITEMS TABLE - Chi tiết đơn hàng
CREATE TABLE order_items (
  item_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(500) NOT NULL COMMENT 'Lưu tên tại thời điểm mua',
  product_code VARCHAR(100) NOT NULL COMMENT 'Lưu mã tại thời điểm mua',
  price DECIMAL(15,2) NOT NULL COMMENT 'Giá tại thời điểm mua',
  quantity INT NOT NULL,
  total_price DECIMAL(15,2) NOT NULL COMMENT 'price * quantity',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
  
  INDEX idx_order (order_id),
  INDEX idx_product (product_id)
);

-- 9. NOTIFICATIONS TABLE - Thông báo real-time
CREATE TABLE notifications (
  notification_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('ORDER', 'PROMOTION', 'SYSTEM', 'PRODUCT') DEFAULT 'SYSTEM',
  is_read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500) COMMENT 'URL để redirect khi click',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  
  INDEX idx_user_unread (user_id, is_read),
  INDEX idx_created (created_at)
);
```

### 🔗 **Relationships và Business Logic**

```sql
-- RELATIONSHIP CONSTRAINTS VÀ BUSINESS RULES:

-- 1. User có thể có nhiều orders
-- 1 Order thuộc về 1 User duy nhất
users 1 ---- N orders

-- 2. Order có nhiều order_items  
-- 1 order_item thuộc về 1 order
orders 1 ---- N order_items

-- 3. Product có thể xuất hiện trong nhiều order_items
-- 1 order_item chỉ reference 1 product
products 1 ---- N order_items

-- 4. Category có thể có sub-categories (self-referencing)
-- 1 Category có thể có 1 parent category
categories 1 ---- N categories (parent_id)

-- 5. Product thuộc về 1 category và 1 brand
-- 1 category/brand có thể có nhiều products
categories 1 ---- N products
brands 1 ---- N products

-- 6. Product có nhiều images và specifications
-- Images/specs thuộc về 1 product
products 1 ---- N product_images
products 1 ---- N specifications

-- 7. User nhận nhiều notifications
-- 1 notification thuộc về 1 user
users 1 ---- N notifications
```

### 📊 **Database Queries Thường Dùng**

```sql
-- 1. LẤY PRODUCTS VỚI THÔNG TIN LIÊN QUAN (JOIN COMPLEX)
SELECT 
  p.*,
  b.brand_name,
  b.brand_code,
  c.category_name,
  c.category_code,
  pc.category_name as parent_category_name,
  pi.image_code as primary_image,
  COUNT(DISTINCT s.spec_id) as specs_count,
  AVG(r.rating) as avg_rating,
  COUNT(DISTINCT r.review_id) as review_count
FROM products p
LEFT JOIN brands b ON p.brand_id = b.brand_id
LEFT JOIN categories c ON p.category_id = c.category_id  
LEFT JOIN categories pc ON c.parent_id = pc.category_id
LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
LEFT JOIN specifications s ON p.product_id = s.product_id
LEFT JOIN reviews r ON p.product_id = r.product_id AND r.is_approved = TRUE
WHERE p.is_active = TRUE
GROUP BY p.product_id
ORDER BY p.view_count DESC, p.sale_count DESC
LIMIT 20;

-- 2. TÌM KIẾM PRODUCTS VỚI FULL-TEXT SEARCH
SELECT p.*, b.brand_name, c.category_name
FROM products p
LEFT JOIN brands b ON p.brand_id = b.brand_id
LEFT JOIN categories c ON p.category_id = c.category_id
WHERE p.is_active = TRUE
  AND (
    p.product_name LIKE '%laptop gaming%' 
    OR p.description LIKE '%laptop gaming%'
    OR p.product_code LIKE '%laptop gaming%'
    OR b.brand_name LIKE '%laptop gaming%'
  )
ORDER BY 
  -- Relevance scoring
  CASE 
    WHEN p.product_name LIKE '%laptop gaming%' THEN 1
    WHEN p.description LIKE '%laptop gaming%' THEN 2  
    ELSE 3
  END,
  p.sale_count DESC;

-- 3. LẤY ORDER VỚI CHI TIẾT ITEMS
SELECT 
  o.*,
  u.full_name as customer_name,
  u.email as customer_email,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'item_id', oi.item_id,
      'product_name', oi.product_name,
      'product_code', oi.product_code, 
      'price', oi.price,
      'quantity', oi.quantity,
      'total_price', oi.total_price
    )
  ) as order_items
FROM orders o
LEFT JOIN users u ON o.user_id = u.user_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_id = ?
GROUP BY o.order_id;

-- 4. THỐNG KÊ DOANH THU THEO THỜI GIAN
SELECT 
  DATE(ordered_at) as order_date,
  COUNT(*) as total_orders,
  SUM(total_amount) as revenue,
  AVG(total_amount) as avg_order_value,
  COUNT(DISTINCT user_id) as unique_customers
FROM orders 
WHERE status NOT IN ('CANCELLED', 'REFUNDED')
  AND ordered_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(ordered_at)
ORDER BY order_date DESC;

-- 5. TOP SELLING PRODUCTS
SELECT 
  p.product_name,
  p.product_code,
  SUM(oi.quantity) as total_sold,
  SUM(oi.total_price) as total_revenue,
  COUNT(DISTINCT oi.order_id) as order_count
FROM products p
INNER JOIN order_items oi ON p.product_id = oi.product_id
INNER JOIN orders o ON oi.order_id = o.order_id
WHERE o.status NOT IN ('CANCELLED', 'REFUNDED')
  AND o.ordered_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY p.product_id
ORDER BY total_sold DESC
LIMIT 10;

-- 6. KIỂM TRA STOCK VÀ CẬP NHẬT
-- Transaction để đảm bảo consistency
START TRANSACTION;

-- Check stock
SELECT stock_quantity 
FROM products 
WHERE product_id = ? AND stock_quantity >= ?
FOR UPDATE; -- Lock row cho đến khi commit

-- Update stock nếu đủ
UPDATE products 
SET stock_quantity = stock_quantity - ?,
    sale_count = sale_count + 1,
    updated_at = NOW()
WHERE product_id = ?;

COMMIT;
```

---

## 🛠️ CHI TIẾT CÁC COMPONENT VÀ LOGIC

### 🎨 **ProductCard Component Chi Tiết**

```typescript
// src/components/ui/ProductCard.tsx
interface ProductCardProps {
  product: ProductWithDetails;
  showQuickActions?: boolean; // Hiện nút Add to Cart nhanh
  showCompare?: boolean; // Hiện nút so sánh
  layout?: 'grid' | 'list'; // Layout hiển thị
  className?: string;
}

export const ProductCard = React.memo(({ 
  product, 
  showQuickActions = true,
  showCompare = false,
  layout = 'grid',
  className 
}: ProductCardProps) => {
  // Contexts
  const { addItem } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Derived values
  const isOutOfStock = product.stock_quantity <= 0;
  const discountPercent = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;
  const formattedPrice = product.price.toLocaleString('vi-VN');
  const formattedOriginalPrice = product.original_price?.toLocaleString('vi-VN');

  // Event handlers
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation khi click trong Link
    e.stopPropagation();

    if (isOutOfStock) {
      showToast('Sản phẩm đã hết hàng', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await addItem(product, 1);
      showToast(`Đã thêm ${product.product_name} vào giỏ hàng`, 'success');
      
      // Track event cho analytics
      trackEvent('add_to_cart', {
        product_id: product.product_id,
        product_name: product.product_name,
        price: product.price,
        category: product.category_name
      });
    } catch (error) {
      showToast('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      showToast('Vui lòng đăng nhập để thêm vào wishlist', 'warning');
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(product.product_id);
        setIsInWishlist(false);
        showToast('Đã xóa khỏi wishlist', 'success');
      } else {
        await addToWishlist(product.product_id);
        setIsInWishlist(true);
        showToast('Đã thêm vào wishlist', 'success');
      }
    } catch (error) {
      showToast('Có lỗi xảy ra', 'error');
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Check wishlist status on mount
  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
  }, [user, product.product_id]);

  const checkWishlistStatus = async () => {
    try {
      const status = await isProductInWishlist(product.product_id);
      setIsInWishlist(status);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  // Component render
  return (
    <div className={cn(
      'group relative bg-white rounded-lg border border-gray-200 hover:border-blue-300',
      'hover:shadow-lg transition-all duration-300',
      'overflow-hidden',
      layout === 'list' && 'flex items-center p-4',
      className
    )}>
      {/* Discount badge */}
      {discountPercent > 0 && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercent}%
          </span>
        </div>
      )}

      {/* Out of stock overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
          <span className="bg-red-600 text-white px-4 py-2 rounded font-semibold">
            Hết hàng
          </span>
        </div>
      )}

      {/* Wishlist button */}
      <button
        onClick={handleToggleWishlist}
        className={cn(
          'absolute top-2 right-2 z-10 p-2 rounded-full',
          'bg-white/80 hover:bg-white transition-colors',
          'shadow-md hover:shadow-lg',
          isInWishlist && 'text-red-500'
        )}
      >
        {isInWishlist ? (
          <Heart className="w-4 h-4 fill-current" />
        ) : (
          <Heart className="w-4 h-4" />
        )}
      </button>

      {/* Main link wrapper */}
      <LoadingLink 
        href={`/products/${product.product_id}`}
        className="block"
      >
        {/* Product image */}
        <div className={cn(
          'relative overflow-hidden',
          layout === 'grid' ? 'aspect-square' : 'w-24 h-24 flex-shrink-0'
        )}>
          {!imageError && product.primary_image ? (
            <img
              src={`data:image/jpeg;base64,${product.primary_image}`}
              alt={product.product_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Product info */}
        <div className={cn(
          'p-4',
          layout === 'list' && 'flex-1 pl-4'
        )}>
          {/* Brand */}
          {product.brand_name && (
            <div className="text-sm text-gray-500 mb-1">
              {product.brand_name}
            </div>
          )}

          {/* Product name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {product.product_name}
          </h3>

          {/* Rating and reviews */}
          {product.avg_rating && (
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < Math.floor(product.avg_rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-1">
                ({product.review_count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-blue-600">
                {formattedPrice}₫
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {formattedOriginalPrice}₫
                </span>
              )}
            </div>
          </div>

          {/* Stock status */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span>
              {isOutOfStock ? (
                <span className="text-red-500 font-medium">Hết hàng</span>
              ) : product.stock_quantity <= 5 ? (
                <span className="text-orange-500">Chỉ còn {product.stock_quantity}</span>
              ) : (
                <span className="text-green-500">Còn hàng</span>
              )}
            </span>
            
            {product.view_count > 0 && (
              <span>{product.view_count} lượt xem</span>
            )}
          </div>
        </div>
      </LoadingLink>

      {/* Quick actions */}
      {showQuickActions && (
        <div className="p-4 pt-0">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isLoading}
            className={cn(
              'w-full py-2 px-4 rounded-lg font-medium transition-colors',
              'flex items-center justify-center space-x-2',
              isOutOfStock || isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang thêm...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Thêm vào giỏ</span>
              </>
            )}
          </button>

          {/* Additional quick actions */}
          {showCompare && (
            <button className="mt-2 w-full py-1 text-sm text-gray-600 hover:text-blue-600">
              So sánh sản phẩm
            </button>
          )}
        </div>
      )}
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// Performance optimization: chỉ re-render khi product thay đổi
export default ProductCard;
```

### 🛒 **Cart Management Logic Chi Tiết**

```typescript
// src/contexts/CartContext.tsx - Logic nghiệp vụ chi tiết

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [syncWithServer, setSyncWithServer] = useState(false);
  
  // Computed values với memoization
  const totalItems = useMemo(() => 
    items.reduce((sum, item) => sum + item.quantity, 0), 
    [items]
  );
  
  const totalPrice = useMemo(() => 
    items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    [items]
  );

  const totalWeight = useMemo(() =>
    items.reduce((sum, item) => sum + ((item.weight || 0) * item.quantity), 0),
    [items]
  );

  // Load cart từ multiple sources
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Sync với server nếu user đăng nhập
  const { user } = useAuth();
  useEffect(() => {
    if (user && syncWithServer) {
      syncCartWithServer();
    }
  }, [user, syncWithServer]);

  // Save to localStorage khi cart thay đổi
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(items));
    } else {
      localStorage.removeItem('cart');
    }
  }, [items]);

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        
        // Validate cart data
        const validatedCart = parsedCart.filter(item => 
          item.product_id && 
          item.product_name && 
          item.price > 0 && 
          item.quantity > 0
        );
        
        setItems(validatedCart);
        
        // Verify products still exist and prices are current
        if (validatedCart.length > 0) {
          verifyCartItems(validatedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      localStorage.removeItem('cart'); // Clear invalid data
    }
  };

  // Verify cart items với database (price changes, availability)
  const verifyCartItems = async (cartItems: CartItem[]) => {
    try {
      const productIds = cartItems.map(item => item.product_id);
      const response = await fetch('/api/products/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_ids: productIds })
      });

      if (response.ok) {
        const { products } = await response.json();
        
        let hasChanges = false;
        const updatedItems = cartItems.map(cartItem => {
          const dbProduct = products.find(p => p.product_id === cartItem.product_id);
          
          if (!dbProduct) {
            // Product không tồn tại nữa
            hasChanges = true;
            return null;
          }

          if (dbProduct.price !== cartItem.price) {
            // Giá đã thay đổi
            hasChanges = true;
            toast.info(`Giá ${cartItem.product_name} đã thay đổi`);
            return { ...cartItem, price: dbProduct.price };
          }

          if (dbProduct.stock_quantity < cartItem.quantity) {
            // Không đủ tồn kho
            hasChanges = true;
            toast.warning(`${cartItem.product_name} chỉ còn ${dbProduct.stock_quantity} sản phẩm`);
            return { ...cartItem, quantity: dbProduct.stock_quantity };
          }

          return cartItem;
        }).filter(Boolean);

        if (hasChanges) {
          setItems(updatedItems);
        }
      }
    } catch (error) {
      console.error('Error verifying cart items:', error);
    }
  };

  // Sync cart với server cho logged-in users
  const syncCartWithServer = async () => {
    try {
      // Get cart từ server
      const response = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });

      if (response.ok) {
        const { cart: serverCart } = await response.json();
        
        // Merge local cart với server cart
        const mergedCart = mergeCartItems(items, serverCart);
        
        if (JSON.stringify(mergedCart) !== JSON.stringify(items)) {
          setItems(mergedCart);
          
          // Update server với merged cart
          await fetch('/api/cart', {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ items: mergedCart })
          });
        }
      }
    } catch (error) {
      console.error('Error syncing cart with server:', error);
    }
  };

  // Merge logic cho cart items
  const mergeCartItems = (localItems: CartItem[], serverItems: CartItem[]): CartItem[] => {
    const merged = [...localItems];
    
    serverItems.forEach(serverItem => {
      const existingIndex = merged.findIndex(item => item.product_id === serverItem.product_id);
      
      if (existingIndex >= 0) {
        // Lấy quantity lớn hơn
        merged[existingIndex].quantity = Math.max(
          merged[existingIndex].quantity,
          serverItem.quantity
        );
      } else {
        merged.push(serverItem);
      }
    });
    
    return merged;
  };

  // Add item với advanced logic
  const addItem = async (product: Product, quantity: number = 1, options?: AddToCartOptions) => {
    // Validate input
    if (!product.product_id || quantity <= 0) {
      throw new Error('Invalid product or quantity');
    }

    // Check stock availability
    if (product.stock_quantity < quantity) {
      throw new Error(`Chỉ còn ${product.stock_quantity} sản phẩm`);
    }

    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.product_id === product.product_id
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
        
        // Check if new quantity exceeds stock
        if (newQuantity > product.stock_quantity) {
          toast.warning(`Không thể thêm quá ${product.stock_quantity} sản phẩm`);
          return prevItems;
        }

        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        };

        return updatedItems;
      } else {
        // Add new item
        const newItem: CartItem = {
          product_id: product.product_id,
          product_name: product.product_name,
          product_code: product.product_code,
          price: product.price,
          quantity,
          image: product.primary_image,
          weight: product.weight,
          brand_name: product.brand_name,
          category_name: product.category_name,
          added_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        return [...prevItems, newItem];
      }
    });

    // Analytics tracking
    trackEvent('add_to_cart', {
      product_id: product.product_id,
      product_name: product.product_name,
      quantity,
      price: product.price,
      cart_total_items: totalItems + quantity
    });

    // Success feedback
    toast.success(
      <div className="flex items-center space-x-2">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <span>Đã thêm {product.product_name} vào giỏ hàng</span>
      </div>
    );

    // Auto-open cart nếu được config
    if (options?.autoOpenCart) {
      setIsOpen(true);
    }
  };

  // Advanced remove với confirmation
  const removeItem = (productId: number, options?: RemoveOptions) => {
    const itemToRemove = items.find(item => item.product_id === productId);
    
    if (!itemToRemove) return;

    if (options?.requireConfirmation) {
      if (!confirm(`Bạn có chắc muốn xóa ${itemToRemove.product_name} khỏi giỏ hàng?`)) {
        return;
      }
    }

    setItems(prevItems => prevItems.filter(item => item.product_id !== productId));

    // Analytics
    trackEvent('remove_from_cart', {
      product_id: productId,
      product_name: itemToRemove.product_name,
      quantity: itemToRemove.quantity,
      price: itemToRemove.price
    });

    toast.success(
      <div className="flex items-center space-x-2">
        <Trash2 className="w-5 h-5 text-red-500" />
        <span>Đã xóa {itemToRemove.product_name}</span>
      </div>
    );
  };

  // Batch update quantities
  const updateQuantities = (updates: QuantityUpdate[]) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        const update = updates.find(u => u.product_id === item.product_id);
        if (update) {
          return { 
            ...item, 
            quantity: update.quantity,
            updated_at: new Date().toISOString()
          };
        }
        return item;
      }).filter(item => item.quantity > 0); // Remove items with 0 quantity
    });
  };

  // Calculate shipping estimate
  const calculateShipping = useMemo(() => {
    if (totalWeight === 0) return 0;
    
    // Shipping calculation logic
    const baseShippingFee = 30000; // 30k VND
    const weightShippingFee = Math.ceil(totalWeight / 1000) * 10000; // 10k per kg
    const freeShippingThreshold = 500000; // Free shipping over 500k
    
    if (totalPrice >= freeShippingThreshold) {
      return 0;
    }
    
    return baseShippingFee + weightShippingFee;
  }, [totalWeight, totalPrice]);

  // Estimate delivery time
  const estimatedDelivery = useMemo(() => {
    const baseDeliveryDays = 2;
    const weightDelayDays = Math.ceil(totalWeight / 5000); // +1 day per 5kg
    return baseDeliveryDays + weightDelayDays;
  }, [totalWeight]);

  const contextValue = {
    // State
    items,
    isOpen,
    
    // Computed values
    totalItems,
    totalPrice,
    totalWeight,
    shippingFee: calculateShipping,
    estimatedDelivery,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity: (productId: number, newQuantity: number) => {
      updateQuantities([{ product_id: productId, quantity: newQuantity }]);
    },
    updateQuantities,
    clearCart: () => {
      setItems([]);
      toast.success('Đã xóa toàn bộ giỏ hàng');
    },
    
    // UI controls
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toggleCart: () => setIsOpen(prev => !prev),
    
    // Advanced features
    verifyCartItems: () => verifyCartItems(items),
    syncWithServer: () => setSyncWithServer(true),
    
    // Helper functions
    isInCart: (productId: number) => items.some(item => item.product_id === productId),
    getItemQuantity: (productId: number) => items.find(item => item.product_id === productId)?.quantity || 0,
    getCartSummary: () => ({
      totalItems,
      totalPrice, 
      shippingFee: calculateShipping,
      finalTotal: totalPrice + calculateShipping
    })
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Types for advanced cart functionality
interface AddToCartOptions {
  autoOpenCart?: boolean;
  showNotification?: boolean;
}

interface RemoveOptions {
  requireConfirmation?: boolean;
}

interface QuantityUpdate {
  product_id: number;
  quantity: number;
}
```

**📞 Technical Contact**: Gear Shop Development Team  
**📅 Last Updated**: January 2025  
**🔗 Repository**: gear-shop
