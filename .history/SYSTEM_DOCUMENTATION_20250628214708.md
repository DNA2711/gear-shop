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
      brand_id: searchParams.get("brand_id") ? parseInt(searchParams.get("brand_id")!) : undefined,
      category_id: searchParams.get("category_id") ? parseInt(searchParams.get("category_id")!) : undefined,
      min_price: searchParams.get("min_price") ? parseFloat(searchParams.get("min_price")!) : undefined,
      max_price: searchParams.get("max_price") ? parseFloat(searchParams.get("max_price")!) : undefined,
      is_active: searchParams.get("is_active") ? searchParams.get("is_active") === "true" : undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20,
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
    const allowedSortColumns = ["product_name", "price", "stock_quantity", "created_at", "updated_at"];
    const safeSortBy = allowedSortColumns.includes(filters.sort_by) ? filters.sort_by : "product_name";
    const safeSortOrder = ["asc", "desc"].includes(filters.sort_order.toLowerCase()) 
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
        { success: false, message: "Tên sản phẩm, mã sản phẩm và giá là bắt buộc" },
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
    const existingProduct = await dbHelpers.productCodeExists(body.product_code);
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
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

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
  const [searchSuggestions, setSearchSuggestions] = useState<ProductWithDetails[]>([]);
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
        setCategories(result.data.filter((cat: CategoryWithChildren) => cat.is_active));
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
                      index === selectedIndex ? 'bg-blue-50' : ''
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
            {user ? (
              <HeaderDropdownMenu />
            ) : (
              <LoginButton />
            )}
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

**📞 Technical Contact**: Gear Shop Development Team  
**📅 Last Updated**: January 2025  
**🔗 Repository**: gear-shop
