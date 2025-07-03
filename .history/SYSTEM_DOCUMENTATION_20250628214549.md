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
    <AuthContext.Provider value={{
      user,
      loading,
      loginLoading,
      error,
      login,
      logout,
      isAuthenticated,
      // ... other functions
    }}>
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
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Load giỏ hàng từ localStorage khi app khởi động
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Lưu giỏ hàng vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Thêm sản phẩm vào giỏ
  const addItem = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      // Kiểm tra sản phẩm đã có trong giỏ chưa
      const existingItem = prevItems.find(item => item.product_id === product.product_id);
      
      if (existingItem) {
        // Nếu có rồi, tăng số lượng
        return prevItems.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Nếu chưa có, thêm mới
        return [...prevItems, {
          product_id: product.product_id,
          product_name: product.product_name,
          price: product.price,
          quantity: quantity,
          image: product.primary_image
        }];
      }
    });
    
    // Hiển thị thông báo
    toast.success(`Đã thêm ${product.product_name} vào giỏ hàng`);
  };

  // Xóa sản phẩm khỏi giỏ
  const removeItem = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.product_id !== productId));
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  // Cập nhật số lượng
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
    toast.success('Đã xóa toàn bộ giỏ hàng');
  };

  return (
    <CartContext.Provider value={{
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
    }}>
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
      ssl: process.env.NODE_ENV === "production" && process.env.DB_SSL !== "false" 
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

**📞 Technical Contact**: Gear Shop Development Team  
**📅 Last Updated**: January 2025  
**🔗 Repository**: gear-shop
