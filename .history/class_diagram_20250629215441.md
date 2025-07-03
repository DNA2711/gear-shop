# Biểu Đồ Lớp (Class Diagram) - Hệ Thống Gear Shop

## Tổng Quan Hệ Thống

Gear Shop là một hệ thống thương mại điện tử chuyên bán linh kiện máy tính với các tính năng:

- Quản lý sản phẩm và danh mục
- Hệ thống đặt hàng và thanh toán
- PC Builder (xây dựng cấu hình máy tính)
- Hệ thống thông báo real-time
- Quản lý người dùng và phân quyền

## Biểu Đồ Lớp Chi Tiết

```mermaid
classDiagram
    %% ========================================
    %% CORE ENTITIES (Các thực thể cốt lõi)
    %% ========================================

    class User {
        +user_id: bigint
        +full_name: string
        +email: string
        +password_hash: string
        +phone_number: string
        +address: string
        +role: string
        +is_active: boolean
        +last_login: timestamp
        +created_at: timestamp
        +updated_at: timestamp
        +reset_password_token: string
        +reset_password_expires: timestamp
        +register()
        +login()
        +updateProfile()
        +changePassword()
        +resetPassword()
    }

    class Product {
        +product_id: bigint
        +product_name: string
        +product_code: string
        +brand_id: int
        +category_id: bigint
        +price: decimal
        +original_price: decimal
        +stock_quantity: int
        +is_active: boolean
        +created_at: timestamp
        +updated_at: timestamp
        +getDetails()
        +updateStock()
        +toggleStatus()
        +getImages()
        +getSpecifications()
    }

    class Category {
        +category_id: bigint
        +category_name: string
        +category_code: string
        +parent_id: bigint
        +is_active: boolean
        +created_at: timestamp
        +updated_at: timestamp
        +getChildren()
        +getParent()
        +getProducts()
        +toggleStatus()
    }

    class Brand {
        +brand_id: int
        +brand_name: string
        +brand_code: string
        +logo_code: text
        +website: string
        +getLogo()
        +getProducts()
        +updateLogo()
    }

    class Order {
        +id: int
        +user_id: int
        +total_amount: decimal
        +status: string
        +shipping_address: text
        +phone_number: string
        +payment_method: string
        +created_at: timestamp
        +updated_at: timestamp
        +createOrder()
        +updateStatus()
        +calculateTotal()
        +getItems()
        +processPayment()
    }

    %% ========================================
    %% RELATED ENTITIES (Các thực thể liên quan)
    %% ========================================

    class OrderItem {
        +id: int
        +order_id: int
        +product_id: int
        +quantity: int
        +price: decimal
        +created_at: timestamp
        +calculateSubtotal()
    }

    class ProductImage {
        +image_id: bigint
        +product_id: bigint
        +image_name: string
        +image_code: longtext
        +is_primary: boolean
        +display_order: int
        +created_at: timestamp
        +updated_at: timestamp
        +setAsPrimary()
        +getImageUrl()
    }

    class ProductSpecification {
        +spec_id: bigint
        +product_id: bigint
        +spec_name: string
        +spec_value: text
        +display_order: int
        +created_at: timestamp
        +updated_at: timestamp
    }

    class Notification {
        +notification_id: bigint
        +user_id: bigint
        +title: string
        +message: text
        +type: enum
        +category: enum
        +data: json
        +is_read: boolean
        +created_at: timestamp
        +updated_at: timestamp
        +markAsRead()
        +getData()
    }

    class NotificationSettings {
        +setting_id: bigint
        +user_id: bigint
        +email_notifications: boolean
        +push_notifications: boolean
        +order_updates: boolean
        +promotions: boolean
        +new_products: boolean
        +created_at: timestamp
        +updated_at: timestamp
        +updateSettings()
        +isEnabled()
    }

    %% ========================================
    %% PC BUILDER ENTITIES (Thực thể PC Builder)
    %% ========================================

    class PCBuild {
        +build_id: bigint
        +build_name: string
        +user_id: bigint
        +components: object
        +total_price: decimal
        +estimated_power: int
        +compatibility_status: object
        +created_at: timestamp
        +updated_at: timestamp
        +addComponent()
        +removeComponent()
        +checkCompatibility()
        +calculateTotal()
        +saveBuild()
    }

    class PCComponent {
        +component_type: enum
        +product_id: bigint
        +product_name: string
        +product_code: string
        +brand_name: string
        +price: decimal
        +stock_quantity: int
        +primary_image: string
        +specifications: array
        +getPowerConsumption()
        +getCompatibilityInfo()
    }

    %% ========================================
    %% SUPPORTING ENTITIES (Thực thể hỗ trợ)
    %% ========================================

    class Role {
        +id: bigint
        +name: enum
        +getPermissions()
    }

    class UserRole {
        +user_id: bigint
        +role_id: bigint
        +assignRole()
        +removeRole()
    }

    class BrandAsset {
        +asset_id: int
        +brand_id: int
        +asset_type: enum
        +asset_content: text
        +is_primary: boolean
        +created_at: timestamp
        +updated_at: timestamp
        +getAssetUrl()
        +setAsPrimary()
    }

    %% ========================================
    %% SERVICE LAYER (Lớp dịch vụ)
    %% ========================================

    class Database {
        -pool: mysql.Pool
        -instance: Database
        +getInstance()
        +query()
        +queryFirst()
        +insert()
        +update()
        +beginTransaction()
        +commitTransaction()
        +rollbackTransaction()
        +testConnection()
        +close()
    }

    class AuthService {
        +login()
        +register()
        +validateToken()
        +refreshToken()
        +resetPassword()
        +changePassword()
        +logout()
    }

    class ProductService {
        +getProducts()
        +getProductById()
        +createProduct()
        +updateProduct()
        +deleteProduct()
        +searchProducts()
        +getProductsByCategory()
        +getProductsByBrand()
    }

    class OrderService {
        +createOrder()
        +getOrderById()
        +getUserOrders()
        +updateOrderStatus()
        +processPayment()
        +cancelOrder()
        +getOrderHistory()
    }

    class NotificationService {
        +createNotification()
        +getUserNotifications()
        +markAsRead()
        +markAllAsRead()
        +getUnreadCount()
        +sendEmailNotification()
        +sendPushNotification()
    }

    class PCBuilderService {
        +createBuild()
        +getUserBuilds()
        +addComponent()
        +removeComponent()
        +checkCompatibility()
        +saveBuild()
        +loadBuild()
        +exportBuild()
    }

    class PaymentService {
        +createPaymentIntent()
        +processVNPayPayment()
        +processStripePayment()
        +handlePaymentCallback()
        +refundPayment()
        +getPaymentStatus()
    }

    %% ========================================
    %% CONTEXT LAYER (Lớp Context React)
    %% ========================================

    class AuthContext {
        -state: AuthState
        -dispatch: function
        +login()
        +logout()
        +register()
        +updateProfile()
        +isAuthenticated()
        +getUser()
    }

    class CartContext {
        -cart: Cart
        -isLoading: boolean
        +addToCart()
        +updateCartItem()
        +removeFromCart()
        +clearCart()
        +refreshCart()
        +removeOrderedItems()
    }

    class NotificationContext {
        -notifications: array
        -unreadCount: number
        +getNotifications()
        +markAsRead()
        +markAllAsRead()
        +addNotification()
        +clearNotifications()
    }

    class PCBuilderContext {
        -build: PCBuild
        -components: object
        +addComponent()
        +removeComponent()
        +updateComponent()
        +checkCompatibility()
        +saveBuild()
        +loadBuild()
        +clearBuild()
    }

    %% ========================================
    %% RELATIONSHIPS (Mối quan hệ)
    %% ========================================

    %% User Relationships
    User ||--o{ Order : "places"
    User ||--o{ Notification : "receives"
    User ||--|| NotificationSettings : "has"
    User ||--o{ PCBuild : "creates"
    User }o--o{ Role : "has"

    %% Product Relationships
    Product ||--o{ ProductImage : "has"
    Product ||--o{ ProductSpecification : "has"
    Product ||--o{ OrderItem : "included_in"
    Product ||--o{ PCComponent : "can_be"

    %% Category Relationships
    Category ||--o{ Category : "parent_of"
    Category ||--o{ Product : "contains"

    %% Brand Relationships
    Brand ||--o{ Product : "manufactures"
    Brand ||--o{ BrandAsset : "has"

    %% Order Relationships
    Order ||--o{ OrderItem : "contains"
    Order ||--|| User : "belongs_to"

    %% PC Builder Relationships
    PCBuild ||--o{ PCComponent : "includes"
    PCBuild ||--|| User : "created_by"

    %% Service Relationships
    Database ||--|| AuthService : "used_by"
    Database ||--|| ProductService : "used_by"
    Database ||--|| OrderService : "used_by"
    Database ||--|| NotificationService : "used_by"
    Database ||--|| PCBuilderService : "used_by"
    Database ||--|| PaymentService : "used_by"

    %% Context Relationships
    AuthContext ||--|| User : "manages"
    CartContext ||--o{ Product : "contains"
    NotificationContext ||--o{ Notification : "manages"
    PCBuilderContext ||--|| PCBuild : "manages"
```

## Mô Tả Chi Tiết Các Lớp

### 1. Core Entities (Thực thể cốt lõi)

#### User

- **Mô tả**: Đại diện cho người dùng hệ thống (admin, customer)
- **Thuộc tính chính**: Thông tin cá nhân, xác thực, phân quyền
- **Phương thức chính**: Đăng ký, đăng nhập, cập nhật thông tin

#### Product

- **Mô tả**: Sản phẩm linh kiện máy tính
- **Thuộc tính chính**: Thông tin sản phẩm, giá, tồn kho
- **Phương thức chính**: Quản lý thông tin, hình ảnh, thông số kỹ thuật

#### Category

- **Mô tả**: Danh mục sản phẩm (hierarchical)
- **Thuộc tính chính**: Tên, mã, danh mục cha
- **Phương thức chính**: Quản lý cấu trúc cây, sản phẩm

#### Brand

- **Mô tả**: Thương hiệu sản phẩm
- **Thuộc tính chính**: Tên, logo, website
- **Phương thức chính**: Quản lý logo, sản phẩm

#### Order

- **Mô tả**: Đơn hàng của khách hàng
- **Thuộc tính chính**: Thông tin đơn hàng, trạng thái, thanh toán
- **Phương thức chính**: Tạo đơn hàng, cập nhật trạng thái

### 2. Related Entities (Thực thể liên quan)

#### OrderItem

- **Mô tả**: Chi tiết sản phẩm trong đơn hàng
- **Mối quan hệ**: Nhiều-1 với Order và Product

#### ProductImage

- **Mô tả**: Hình ảnh sản phẩm
- **Mối quan hệ**: Nhiều-1 với Product

#### ProductSpecification

- **Mô tả**: Thông số kỹ thuật sản phẩm
- **Mối quan hệ**: Nhiều-1 với Product

#### Notification

- **Mô tả**: Thông báo hệ thống
- **Mối quan hệ**: Nhiều-1 với User

### 3. PC Builder Entities (Thực thể PC Builder)

#### PCBuild

- **Mô tả**: Cấu hình máy tính được xây dựng
- **Thuộc tính chính**: Danh sách linh kiện, tổng giá, tương thích
- **Phương thức chính**: Thêm/xóa linh kiện, kiểm tra tương thích

#### PCComponent

- **Mô tả**: Linh kiện trong cấu hình PC
- **Thuộc tính chính**: Loại linh kiện, thông tin sản phẩm
- **Phương thức chính**: Tính toán tiêu thụ điện, kiểm tra tương thích

### 4. Service Layer (Lớp dịch vụ)

#### Database

- **Mô tả**: Singleton pattern cho kết nối database
- **Phương thức chính**: Query, transaction management

#### AuthService

- **Mô tả**: Xử lý xác thực và phân quyền
- **Phương thức chính**: Login, register, token management

#### ProductService

- **Mô tả**: Quản lý sản phẩm
- **Phương thức chính**: CRUD operations, search, filter

#### OrderService

- **Mô tả**: Quản lý đơn hàng
- **Phương thức chính**: Tạo, cập nhật, xử lý thanh toán

#### NotificationService

- **Mô tả**: Quản lý thông báo
- **Phương thức chính**: Tạo, gửi, đánh dấu đã đọc

#### PCBuilderService

- **Mô tả**: Xử lý logic PC Builder
- **Phương thức chính**: Tạo build, kiểm tra tương thích

#### PaymentService

- **Mô tả**: Xử lý thanh toán (VNPay, Stripe)
- **Phương thức chính**: Tạo payment intent, xử lý callback

### 5. Context Layer (Lớp Context React)

#### AuthContext

- **Mô tả**: Quản lý trạng thái xác thực toàn cục
- **Phương thức chính**: Login, logout, user state

#### CartContext

- **Mô tả**: Quản lý giỏ hàng
- **Phương thức chính**: Thêm, xóa, cập nhật sản phẩm

#### NotificationContext

- **Mô tả**: Quản lý thông báo real-time
- **Phương thức chính**: Hiển thị, đánh dấu đã đọc

#### PCBuilderContext

- **Mô tả**: Quản lý trạng thái PC Builder
- **Phương thức chính**: Thêm linh kiện, kiểm tra tương thích

## Mối Quan Hệ Chính

1. **User - Order**: 1-N (Một người dùng có thể có nhiều đơn hàng)
2. **Order - OrderItem**: 1-N (Một đơn hàng có nhiều sản phẩm)
3. **Product - OrderItem**: 1-N (Một sản phẩm có thể trong nhiều đơn hàng)
4. **Category - Product**: 1-N (Một danh mục có nhiều sản phẩm)
5. **Brand - Product**: 1-N (Một thương hiệu có nhiều sản phẩm)
6. **Category - Category**: 1-N (Self-referencing cho hierarchical categories)
7. **User - PCBuild**: 1-N (Một người dùng có thể tạo nhiều cấu hình PC)
8. **PCBuild - PCComponent**: 1-N (Một cấu hình PC có nhiều linh kiện)

## Đặc Điểm Thiết Kế

1. **Singleton Pattern**: Database class sử dụng singleton để quản lý connection pool
2. **Context Pattern**: React Context để quản lý state toàn cục
3. **Service Layer**: Tách biệt business logic khỏi data access
4. **Hierarchical Categories**: Self-referencing relationship cho danh mục đa cấp
5. **Real-time Notifications**: Hệ thống thông báo real-time
6. **PC Builder**: Tính năng đặc biệt cho việc xây dựng cấu hình máy tính
7. **Multi-payment**: Hỗ trợ nhiều phương thức thanh toán (VNPay, Stripe)
8. **Image Management**: Quản lý hình ảnh sản phẩm và logo thương hiệu

## Công Nghệ Sử Dụng

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MySQL 8.0
- **Authentication**: JWT, bcryptjs
- **Payment**: VNPay, Stripe
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Real-time**: WebSocket (thông báo)
- **Image Storage**: Base64 encoding
- **Deployment**: Vercel, Railway
