# 📋 GEAR SHOP - HỆ THỐNG TÀI LIỆU KỸ THUẬT TOÀN DIỆN

## 📖 MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Kiến trúc tổng thể](#2-kiến-trúc-tổng-thể)
3. [Cấu trúc thư mục chi tiết](#3-cấu-trúc-thư-mục-chi-tiết)
4. [Database Schema](#4-database-schema)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [API Structure](#6-api-structure)
7. [Frontend Components](#7-frontend-components)
8. [State Management](#8-state-management)
9. [Deployment & Environment](#9-deployment--environment)
10. [Key Features](#10-key-features)
11. [Data Flow](#11-data-flow)
12. [Security](#12-security)

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

### 📊 **System Architecture Diagram**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│     VERCEL      │    │    RAILWAY      │    │   THIRD PARTY   │
│   (Frontend)    │    │   (Database)    │    │   (Services)    │
│                 │    │                 │    │                 │
│  ┌─────────────┐│    │  ┌─────────────┐│    │  ┌─────────────┐│
│  │ Next.js App ││    │  │ MySQL 8.0   ││    │  │ Email SMTP  ││
│  │  - Pages    ││    │  │  - Tables   ││    │  │ - Nodemailer││
│  │  - API      ││◄──►│  │  - Indexes  ││    │  │ - Gmail     ││
│  │  - Components││   │  │  - Relations││    │  └─────────────┘│
│  └─────────────┘│    │  └─────────────┘│    │                 │
│                 │    │                 │    │  ┌─────────────┐│
└─────────────────┘    └─────────────────┘    │  │ File Storage││
                                              │  │ - Base64    ││
                                              │  │ - Local     ││
                                              │  └─────────────┘│
                                              └─────────────────┘
```

### 🔄 **Request Flow**
```
User → Vercel CDN → Next.js App → API Route → Database (Railway) → Response
```

---

## 3. CẤU TRÚC THƯ MỤC CHI TIẾT

### 📁 **Root Directory Structure**
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
├── 📁 scripts/                 # Automation Scripts
├── 📄 .env                     # Environment Variables (Local)
├── 📄 .env.production          # Production Environment
├── 📄 package.json             # Dependencies
├── 📄 next.config.ts           # Next.js Configuration
├── 📄 tailwind.config.ts       # Tailwind CSS Config
└── 📄 vercel.json              # Vercel Deployment Config
```

### 📂 **App Router Structure (src/app/)**
```
app/
├── 📁 (main)/                  # Route Group (Main Layout)
│   └── 📄 layout.tsx           # Main layout wrapper
├── 📁 admin/                   # Admin Dashboard
│   ├── 📄 layout.tsx           # Admin layout
│   ├── 📄 page.tsx             # Dashboard overview
│   ├── 📁 products/            # Product management
│   ├── 📁 orders/              # Order management
│   ├── 📁 users/               # User management
│   └── 📁 analytics/           # Analytics & Reports
├── 📁 api/                     # Backend API Routes
│   ├── 📁 auth/                # Authentication endpoints
│   ├── 📁 products/            # Product CRUD
│   ├── 📁 orders/              # Order management
│   ├── 📁 users/               # User management
│   └── 📁 admin/               # Admin-only endpoints
├── 📁 products/                # Product pages
│   ├── 📄 page.tsx             # Product listing
│   └── 📁 [productId]/         # Dynamic product detail
├── 📁 cart/                    # Shopping cart
├── 📁 checkout/                # Checkout process
├── 📁 orders/                  # Order history
├── 📁 profile/                 # User profile
├── 📁 login/                   # Authentication pages
├── 📁 register/                
├── 📄 layout.tsx               # Root layout
└── 📄 page.tsx                 # Homepage
```

### 🧩 **Components Structure (src/components/)**
```
components/
├── 📁 admin/                   # Admin-specific components
│   ├── 📄 DashboardStats.tsx   # Statistics widgets
│   ├── 📄 ProductModal.tsx     # Product form modal
│   ├── 📄 SalesChart.tsx       # Charts & analytics
│   └── 📄 Sidebar.tsx          # Admin navigation
├── 📁 auth/                    # Authentication components
│   ├── 📄 ProtectedRoute.tsx   # Route protection
│   └── 📄 AdminProtectedRoute.tsx
├── 📁 cart/                    # Shopping cart components
│   ├── 📄 CartDrawer.tsx       # Cart sidebar
│   ├── 📄 CartItem.tsx         # Individual cart item
│   └── 📄 AddToCartButton.tsx  # Add to cart functionality
├── 📁 layout/                  # Layout components
│   ├── 📄 header.tsx           # Main navigation
│   ├── 📄 footer.tsx           # Site footer
│   └── 📄 ConditionalLayout.tsx # Layout switcher
├── 📁 pages/                   # Page-specific components
│   ├── 📁 homepage/            # Homepage sections
│   └── 📁 products/            # Product page components
├── 📁 ui/                      # Reusable UI components
│   ├── 📄 button.tsx           # Button component
│   ├── 📄 card.tsx             # Card component
│   ├── 📄 Loading.tsx          # Loading states
│   └── 📄 ProductCard.tsx      # Product display card
└── 📄 ErrorBoundary.tsx        # Error handling
```

---

## 4. DATABASE SCHEMA

### 🗃️ **Core Tables**

#### **Users Table**
```sql
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `role` enum('ADMIN','USER') COLLATE utf8mb4_unicode_ci DEFAULT 'USER',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **Products Table**
```sql
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand_id` int DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `original_price` decimal(15,2) DEFAULT NULL,
  `stock_quantity` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_code` (`product_code`),
  KEY `brand_id` (`brand_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### **Orders Table**
```sql
CREATE TABLE `orders` (
  `order_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `order_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `status` enum('pending','confirmed','processing','shipping','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_method` enum('cod','vnpay','momo','bank_transfer') COLLATE utf8mb4_unicode_ci DEFAULT 'cod',
  `payment_status` enum('pending','paid','failed','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `shipping_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `order_code` (`order_code`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 🔗 **Relationships**
```
Users (1) ──────── (N) Orders
Users (1) ──────── (N) Notifications
Orders (1) ─────── (N) Order_Items
Products (1) ───── (N) Order_Items
Products (1) ───── (N) Product_Images
Products (N) ───── (1) Categories
Products (N) ───── (1) Brands
Categories (1) ─── (N) Categories (Self-reference)
```

---

## 5. AUTHENTICATION & AUTHORIZATION

### 🔐 **Authentication Flow**

#### **Login Process**
```
1. User submits credentials (email/password)
   ↓
2. API validates user in database
   ↓
3. Password verification using bcryptjs
   ↓
4. Generate JWT token pair (access + refresh)
   ↓
5. Return tokens to client
   ↓
6. Store tokens in localStorage + cookies
   ↓
7. Include token in subsequent requests
```

#### **JWT Token Structure**
```typescript
// Token Payload
interface JWTPayload {
  sub: string;        // User email
  roles: string[];    // ['USER'] or ['ADMIN']
  iat: number;        // Issued at timestamp
  exp: number;        // Expiration timestamp
}

// Token Configuration
const JWT_CONFIG = {
  accessTokenExpiration: '1h',
  refreshTokenExpiration: '7d',
  algorithm: 'HS256'
};
```

#### **Route Protection (Middleware)**
```typescript
// Protected Routes
const protectedRoutes = [
  '/dashboard',
  '/profile', 
  '/admin',
  '/api/auth/me',
  '/api/admin'
];

// Admin Only Routes  
const adminRoutes = [
  '/admin',
  '/api/admin'
];

// Authentication Flow in Middleware
const middleware = async (request: NextRequest) => {
  // 1. Extract token from header or cookie
  // 2. Verify JWT token
  // 3. Check route permissions
  // 4. Redirect or allow access
};
```

### 👤 **User Roles & Permissions**

#### **Role Matrix**
```
Feature                 | USER | ADMIN
-----------------------|------|-------
Browse Products        | ✅   | ✅
Place Orders           | ✅   | ✅  
View Order History     | ✅   | ✅
Manage Profile         | ✅   | ✅
Admin Dashboard        | ❌   | ✅
Manage Products        | ❌   | ✅
Manage Orders          | ❌   | ✅
Manage Users           | ❌   | ✅
View Analytics         | ❌   | ✅
```

---

## 6. API STRUCTURE

### 🌐 **API Endpoints Overview**

#### **Authentication APIs**
```
POST   /api/auth/login           # User login
POST   /api/auth/register        # User registration  
POST   /api/auth/logout          # User logout
GET    /api/auth/me              # Get current user profile
POST   /api/auth/refresh         # Refresh access token
POST   /api/auth/forgot-password # Password reset request
POST   /api/auth/reset-password  # Reset password with token
POST   /api/auth/change-password # Change password (authenticated)
```

#### **Product APIs**
```
GET    /api/products             # Get products with filters
POST   /api/products             # Create new product (Admin)
GET    /api/products/[id]        # Get product by ID
PUT    /api/products/[id]        # Update product (Admin)
DELETE /api/products/[id]        # Delete product (Admin)
GET    /api/products/[id]/images # Get product images
POST   /api/products/[id]/images # Upload product image (Admin)
```

#### **Order APIs**
```
GET    /api/orders               # Get user orders / all orders (Admin)
POST   /api/orders               # Create new order
GET    /api/orders/[id]          # Get order details
PUT    /api/orders/[id]/status   # Update order status (Admin)
```

#### **Admin APIs**
```
GET    /api/admin/dashboard      # Dashboard statistics
GET    /api/admin/statistics     # Analytics data
GET    /api/admin/orders         # All orders management
GET    /api/admin/users          # User management
```

### 📝 **API Response Format**

#### **Success Response**
```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### **Error Response**
```typescript
interface ErrorResponse {
  success: false;
  status: number;
  message: string;
  errors?: string[];
  timestamp?: string;
}
```

#### **Example API Implementation**
```typescript
// /api/products/route.ts
export async function GET(request: NextRequest) {
  try {
    // 1. Parse query parameters
    const filters = parseFilters(request.url);
    
    // 2. Build SQL query with filters
    const query = buildProductQuery(filters);
    
    // 3. Execute database query
    const products = await db.query(query);
    
    // 4. Return formatted response
    return NextResponse.json({
      success: true,
      data: products,
      pagination: calculatePagination(filters)
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

## 7. FRONTEND COMPONENTS

### 🧱 **Component Architecture**

#### **Layout Components**
```typescript
// Main Layout Structure
<RootLayout>
  <ErrorBoundary>
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <CartProvider>
            <LoadingProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <GlobalLoadingOverlay />
            </LoadingProvider>
          </CartProvider>
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  </ErrorBoundary>
</RootLayout>
```

#### **Key Component Patterns**

**1. Product Card Component**
```typescript
interface ProductCardProps {
  product: ProductWithDetails;
  onAddToCart?: (product: Product) => void;
  showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  showActions = true
}) => {
  // Component logic
  return (
    <div className="product-card">
      <img src={product.primary_image} alt={product.product_name} />
      <h3>{product.product_name}</h3>
      <p className="price">{formatPrice(product.price)}</p>
      {showActions && (
        <AddToCartButton product={product} onClick={onAddToCart} />
      )}
    </div>
  );
};
```

**2. Protected Route Wrapper**
```typescript
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};
```

**3. Admin Dashboard Stats**
```typescript
const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<DashboardData | null>(null);
  
  useEffect(() => {
    fetchDashboardStats();
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard title="Total Orders" value={stats?.totalOrders} />
      <StatCard title="Revenue" value={stats?.totalRevenue} />
      <StatCard title="Products" value={stats?.totalProducts} />
      <StatCard title="Users" value={stats?.totalUsers} />
    </div>
  );
};
```

### 🎨 **UI Components Library**

#### **Base Components**
```
📦 ui/
├── 📄 button.tsx          # Customizable button with variants
├── 📄 card.tsx            # Container cards
├── 📄 badge.tsx           # Status badges  
├── 📄 separator.tsx       # Visual separators
├── 📄 dropdown-menu.tsx   # Dropdown menus
├── 📄 Loading.tsx         # Loading states
├── 📄 Toast.tsx           # Notification toasts
└── 📄 ProductCard.tsx     # Product display cards
```

#### **Styling System**
```css
/* Tailwind CSS Classes Used */
.btn-primary: "bg-blue-600 hover:bg-blue-700 text-white"
.btn-secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800"
.card: "bg-white rounded-lg shadow-md border p-6"
.input: "border border-gray-300 rounded-md px-3 py-2 focus:ring-2"
```

---

## 8. STATE MANAGEMENT

### 🔄 **Context Providers**

#### **Authentication Context**
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginLoading: boolean;
  error: string | null;
  login: (credentials: LoginForm) => Promise<{success: boolean, user?: User}>;
  register: (userData: SignupForm) => Promise<{success: boolean, message?: string}>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
  isAuthenticated: boolean;
}

// Usage
const { user, login, logout, isAuthenticated } = useAuth();
```

#### **Cart Context**
```typescript
interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

// Usage
const { items, addItem, totalPrice, openCart } = useCart();
```

#### **Loading Context**
```typescript
interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (message: string) => void;
}

// Usage for global loading states
const { setLoading, setLoadingMessage } = useLoading();
```

#### **Notification Context**
```typescript
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: number) => void;
}
```

### 💾 **Local Storage Management**
```typescript
// Automatic cleanup utility
// src/utils/cleanLocalStorage.ts
const cleanupOldData = () => {
  const keys = ['cart', 'user', 'preferences'];
  keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.expiry && Date.now() > parsed.expiry) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        localStorage.removeItem(key);
      }
    }
  });
};
```

---

## 9. DEPLOYMENT & ENVIRONMENT

### 🚀 **Deployment Configuration**

#### **Vercel Configuration (vercel.json)**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["sin1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### **Environment Variables**

**Local Development (.env)**
```bash
# Database Configuration - Railway MySQL
DB_HOST=caboose.proxy.rlwy.net
DB_PORT=29150
DB_USER=root
DB_PASSWORD=RTbPDjFprveDAFWcKaIjOpiFimetgWdR
DB_NAME=railway
DB_SSL=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=gearhubno1@gmail.com
SMTP_PASS=svdo xaxs umhq kgxy

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Production (.env.production)**
```bash
# Production Environment Variables for Vercel + Railway

# Railway MySQL Database
DB_HOST=caboose.proxy.rlwy.net
DB_PORT=29150
DB_USER=root
DB_PASSWORD=RTbPDjFprveDAFWcKaIjOpiFimetgWdR
DB_NAME=railway
DB_SSL=false

# JWT Settings
JWT_SECRET=your-super-secret-jwt-key-for-graduation-project-2024
JWT_EXPIRATION=604800000
JWT_REFRESH_EXPIRATION=604800000

# App URLs (replace with your Vercel domain)
NEXT_PUBLIC_BASE_URL=https://gear-shop-graduation.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://gear-shop-graduation.vercel.app
NEXT_PUBLIC_APP_URL=https://gear-shop-graduation.vercel.app

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Production mode
NODE_ENV=production
```

#### **Database Connection Configuration**
```typescript
// src/lib/database.ts
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root", 
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "gear_shop",
  waitForConnections: true,
  // Optimized for serverless deployment
  connectionLimit: process.env.NODE_ENV === "production" ? 2 : 10,
  queueLimit: 0,
  // MySQL2 pool options - reduced for serverless
  idleTimeout: process.env.NODE_ENV === "production" ? 30000 : 60000,
  acquireTimeout: 30000,
  // Character set for Vietnamese support
  charset: "utf8mb4",
  timezone: "+00:00",
  // SSL configuration for production
  ssl: process.env.NODE_ENV === "production" && process.env.DB_SSL !== "false" 
    ? { rejectUnauthorized: false } 
    : undefined,
};
```

---

## 10. KEY FEATURES

### 🛒 **E-commerce Features**

#### **Product Management**
- ✅ Product CRUD operations
- ✅ Category hierarchy (parent-child)
- ✅ Brand management
- ✅ Multiple product images (Base64 storage)
- ✅ Product specifications
- ✅ Inventory tracking
- ✅ Price management (original vs sale price)
- ✅ Product search & filtering
- ✅ Product status (active/inactive)

#### **Shopping Cart**
- ✅ Add/remove products
- ✅ Quantity management
- ✅ Persistent cart (localStorage)
- ✅ Real-time price calculation
- ✅ Cart drawer/sidebar
- ✅ Stock validation

#### **Order Management**
- ✅ Order creation & tracking
- ✅ Order status workflow (pending → confirmed → processing → shipping → delivered)
- ✅ Payment method selection (COD, VNPay, Bank Transfer)
- ✅ Order history
- ✅ Order notifications
- ✅ Admin order management

#### **User Management**
- ✅ User registration & authentication
- ✅ Profile management
- ✅ Role-based access (USER, ADMIN)
- ✅ Password reset functionality
- ✅ Account activation/deactivation

### 📊 **Admin Features**

#### **Dashboard & Analytics**
- ✅ Sales statistics
- ✅ Order analytics
- ✅ Product performance
- ✅ User activity tracking
- ✅ Revenue charts
- ✅ Inventory reports

#### **Content Management**
- ✅ Product CRUD with image upload
- ✅ Category management
- ✅ Brand management
- ✅ Order status updates
- ✅ User management

### 🔔 **Notification System**
- ✅ Real-time notifications
- ✅ Order status updates
- ✅ Admin notifications for new orders
- ✅ Email notifications (SMTP)
- ✅ In-app notification bell
- ✅ Notification history

### 🔍 **Search & Discovery**
- ✅ Product search with smart suggestions
- ✅ Category filtering
- ✅ Brand filtering
- ✅ Price range filtering
- ✅ Sorting options
- ✅ Instant search suggestions
- ✅ Search history

---

## 11. DATA FLOW

### 🔄 **Main Application Flow**

#### **User Registration & Login Flow**
```
User Registration:
1. User fills registration form
2. Frontend validates input
3. POST /api/auth/register
4. Backend validates & hashes password
5. Save user to database
6. Send confirmation email
7. Return success response

User Login:
1. User submits credentials
2. POST /api/auth/login  
3. Backend validates credentials
4. Generate JWT tokens
5. Return tokens to frontend
6. Store tokens in localStorage + cookies
7. Redirect to dashboard/homepage
```

#### **Product Browsing Flow**
```
Product Listing:
1. User visits /products
2. Frontend calls GET /api/products with filters
3. Backend builds SQL query with WHERE conditions
4. Execute query with pagination
5. Return products with primary images
6. Frontend renders product cards
7. User can filter/sort/search

Product Detail:
1. User clicks product card
2. Navigate to /products/[productId]
3. Frontend calls GET /api/products/[id]
4. Backend fetches product with all images & specs
5. Return detailed product data
6. Frontend renders product detail page
7. User can add to cart
```

#### **Shopping Cart Flow**
```
Add to Cart:
1. User clicks "Add to Cart" button
2. Frontend validates stock availability
3. Add item to cart context
4. Update localStorage
5. Show success toast
6. Update cart icon counter

Checkout Process:
1. User reviews cart items
2. Navigate to /checkout
3. Fill shipping information
4. Select payment method
5. Submit order (POST /api/orders)
6. Backend creates order & order items
7. Clear cart
8. Redirect to success page
9. Send order confirmation email
```

#### **Admin Order Management Flow**
```
Order Processing:
1. Admin views orders list
2. GET /api/admin/orders
3. Admin clicks order to view details
4. Admin updates order status
5. PUT /api/orders/[id]/status
6. Backend updates order status
7. Send notification to customer
8. Update order history
```

### 📈 **Data Flow Diagrams**

#### **Authentication Flow**
```
[User Input] → [Frontend Validation] → [API Route] → [Database] → [JWT Generation] → [Response] → [Context Update] → [UI Update]
```

#### **Product Management Flow**
```
[Admin Form] → [Image Upload] → [Validation] → [API Route] → [Database Transaction] → [Response] → [UI Refresh]
```

#### **Order Processing Flow**
```
[Cart] → [Checkout Form] → [Order API] → [Database] → [Email Service] → [Notification] → [Success Page]
```

---

## 12. SECURITY

### 🔒 **Security Measures**

#### **Authentication Security**
```typescript
// Password Security
- bcryptjs for password hashing (saltRounds: 10)
- JWT with short expiration (1 hour access, 7 days refresh)
- Secure token storage (httpOnly cookies + localStorage)
- Password strength validation
- Account lockout after failed attempts

// Route Protection
- Middleware authentication for protected routes
- Role-based access control (RBAC)
- API route protection
- Admin route segregation
```

#### **Data Security**
```sql
-- Database Security
- Prepared statements (prevents SQL injection)
- Input validation on all endpoints
- Type-safe database queries
- Connection pooling with limits
- UTF-8 encoding for international support
```

#### **Input Validation**
```typescript
// API Input Validation
const validateCreateProduct = (data: CreateProductRequest) => {
  if (!data.product_name || data.product_name.trim().length === 0) {
    throw new Error("Product name is required");
  }
  if (!data.price || data.price <= 0) {
    throw new Error("Valid price is required");
  }
  // Additional validations...
};
```

#### **Error Handling**
```typescript
// Consistent Error Responses
interface ErrorResponse {
  success: false;
  status: number;
  message: string;
  errors?: string[];
  timestamp: string;
}

// Error Handler
const handleDatabaseError = (error: any) => {
  // Log error securely
  console.error("Database error:", error.message);
  
  // Return sanitized error
  return {
    status: 500,
    message: "Internal server error"
  };
};
```

#### **CORS & Headers**
```typescript
// Security Headers in Middleware
response.headers.set("Access-Control-Allow-Origin", "*");
response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
```

---

## 📋 **SUMMARY & CONCLUSION**

### 🎯 **System Highlights**
1. **Full-Stack Next.js**: Modern React-based e-commerce platform
2. **Scalable Architecture**: Serverless deployment with efficient database connections
3. **Secure Authentication**: JWT-based auth with role management
4. **Rich Admin Panel**: Complete product and order management
5. **Responsive Design**: Mobile-first approach with Tailwind CSS
6. **Real-time Features**: Notifications, cart updates, search suggestions
7. **Vietnamese Support**: Full UTF-8 encoding with Vietnamese language support

### 🚀 **Performance Optimizations**
- Server-side rendering (SSR) for SEO
- Client-side rendering (CSR) for interactions
- Optimized database queries with indexes
- Connection pooling for database efficiency
- Image optimization with Next.js
- Lazy loading for components

### 🔧 **Development Best Practices**
- TypeScript for type safety
- Context API for state management
- Error boundaries for fault tolerance
- Consistent API response format
- Comprehensive error handling
- Code organization with clear separation of concerns

### 📈 **Future Enhancements**
- Payment gateway integration (VNPay, MoMo)
- Real-time chat support
- Product reviews and ratings
- Inventory alerts
- Advanced analytics dashboard
- Mobile app development
- SEO optimization
- Performance monitoring

---

**📞 Technical Support**: Gear Shop Development Team
**📅 Last Updated**: January 2025
**🔗 Repository**: [gear-shop](https://github.com/your-username/gear-shop) 