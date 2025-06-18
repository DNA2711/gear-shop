# Hướng Dẫn Sử Dụng Hệ Thống Loading Toàn Cục

## Tổng Quan

Hệ thống loading toàn cục đã được triển khai để hiển thị biểu tượng loading mỗi khi có API calls đang được thực hiện. Điều này cải thiện trải nghiệm người dùng bằng cách cung cấp phản hồi trực quan về trạng thái xử lý.

## Cấu Trúc Hệ Thống

### 1. LoadingContext (`src/contexts/LoadingContext.tsx`)

- Quản lý trạng thái loading toàn cục
- Hỗ trợ multiple concurrent loading operations
- Cung cấp methods để show/hide loading

### 2. GlobalLoadingOverlay (`src/components/ui/GlobalLoadingOverlay.tsx`)

- Component hiển thị overlay loading
- Thiết kế đẹp với animation và backdrop blur
- Tự động hiện/ẩn dựa trên LoadingContext

### 3. ApiWrapper (`src/lib/apiWrapper.ts`)

- Wrapper cho fetch API với automatic loading management
- Tự động thêm Authorization headers
- Hỗ trợ các HTTP methods thông dụng

### 4. useApi Hook (`src/hooks/useApi.ts`)

- Custom hook để sử dụng API wrapper
- Tự động setup loading context

## Cách Sử Dụng

### 1. Sử Dụng API Wrapper (Khuyến nghị)

```typescript
import { useApi } from "@/hooks/useApi";

function MyComponent() {
  const api = useApi();

  const fetchData = async () => {
    try {
      // Tự động hiển thị loading
      const result = await api.get("/api/products", {
        loadingMessage: "Đang tải sản phẩm...",
      });

      // Xử lý kết quả
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
    }
    // Loading tự động ẩn
  };

  return <button onClick={fetchData}>Tải Dữ Liệu</button>;
}
```

### 2. Các HTTP Methods Hỗ Trợ

```typescript
// GET request
const data = await api.get("/api/endpoint", {
  loadingMessage: "Đang tải...",
});

// POST request
const result = await api.post(
  "/api/endpoint",
  {
    name: "value",
  },
  {
    loadingMessage: "Đang tạo...",
  }
);

// PUT request
const updated = await api.put(
  "/api/endpoint/1",
  {
    name: "new value",
  },
  {
    loadingMessage: "Đang cập nhật...",
  }
);

// DELETE request
await api.delete("/api/endpoint/1", {
  loadingMessage: "Đang xóa...",
});
```

### 3. Sử Dụng Manual Loading

```typescript
import { useLoading } from "@/contexts/LoadingContext";

function MyComponent() {
  const { withLoading, showLoading, hideLoading } = useLoading();

  // Cách 1: Sử dụng withLoading wrapper
  const doSomething = async () => {
    await withLoading(async () => {
      // Your async operation
      await someAsyncOperation();
    }, "Đang xử lý...");
  };

  // Cách 2: Manual control
  const doSomethingManual = async () => {
    showLoading("Đang xử lý...");
    try {
      await someAsyncOperation();
    } finally {
      hideLoading();
    }
  };
}
```

### 4. Tắt Loading Cho Specific API Call

```typescript
// Tắt loading cho API call này
const result = await api.get("/api/endpoint", {
  showLoading: false,
});
```

## Tùy Chỉnh

### 1. Thay Đổi Loading Message

```typescript
const data = await api.get("/api/products", {
  loadingMessage: "Đang tải danh sách sản phẩm...",
});
```

### 2. Tùy Chỉnh Giao Diện Loading

Chỉnh sửa file `src/components/ui/GlobalLoadingOverlay.tsx` để thay đổi:

- Màu sắc
- Animation
- Layout
- Text styling

### 3. Thêm Loading Cho Existing Code

**Trước:**

```typescript
const response = await fetch("/api/products");
const data = await response.json();
```

**Sau:**

```typescript
const api = useApi();
const data = await api.get("/api/products", {
  loadingMessage: "Đang tải sản phẩm...",
});
```

## Lưu Ý Quan Trọng

### 1. Multiple Concurrent Calls

Hệ thống hỗ trợ multiple API calls đồng thời. Loading sẽ hiển thị cho đến khi tất cả calls hoàn thành.

### 2. Error Handling

Loading sẽ tự động ẩn ngay cả khi có lỗi xảy ra.

### 3. Memory Management

Hệ thống sử dụng reference counting để đảm bảo loading state chính xác.

### 4. Performance

- Loading overlay sử dụng backdrop-blur cho hiệu ứng đẹp
- Animation được tối ưu hóa cho performance
- Tự động cleanup khi component unmount

## Ví Dụ Thực Tế

### 1. Component Homepage với Loading

```typescript
import { useApi } from "@/hooks/useApi";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const api = useApi();

  const fetchProducts = async () => {
    try {
      const result = await api.get("/api/products?limit=8", {
        loadingMessage: "Đang tải sản phẩm nổi bật...",
      });
      setProducts(result.data || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return <div>{/* Component content */}</div>;
}
```

### 2. Form Submit với Loading

```typescript
const handleSubmit = async (formData: any) => {
  try {
    await api.post("/api/products", formData, {
      loadingMessage: "Đang tạo sản phẩm...",
    });

    // Success handling
    showToast("Tạo sản phẩm thành công!", "success");
  } catch (error) {
    // Error handling
    showToast("Có lỗi xảy ra!", "error");
  }
};
```

## Migration Guide

### Updating Existing Components

1. **Import useApi hook:**

```typescript
import { useApi } from "@/hooks/useApi";
```

2. **Initialize hook:**

```typescript
const api = useApi();
```

3. **Replace fetch calls:**

```typescript
// Old
const response = await fetch("/api/endpoint");
const data = await response.json();

// New
const data = await api.get("/api/endpoint", {
  loadingMessage: "Đang tải...",
});
```

4. **Remove local loading states (optional):**

```typescript
// These can be removed if using global loading
const [loading, setLoading] = useState(false);
const [isLoading, setIsLoading] = useState(false);
```

## Testing

Sử dụng `LoadingDemo` component để test hệ thống:

```typescript
import { LoadingDemo } from "@/components/ui/LoadingDemo";

// Add to any page for testing
<LoadingDemo />;
```

## Troubleshooting

### 1. Loading không hiển thị

- Kiểm tra LoadingProvider đã được wrap ở root level
- Đảm bảo GlobalLoadingOverlay được thêm vào layout
- Verify useApi hook được sử dụng trong component

### 2. Loading không tắt

- Kiểm tra error handling trong API calls
- Đảm bảo try/finally blocks được sử dụng đúng cách

### 3. Multiple loadings overlap

- Hệ thống được thiết kế để handle multiple calls
- Chỉ một overlay loading sẽ hiển thị cho tất cả calls

## Performance Considerations

- Loading overlay chỉ render khi cần thiết
- Animation sử dụng CSS transforms để tối ưu
- Backdrop blur được optimize cho modern browsers
- Reference counting prevents memory leaks

## Instant Navigation Loading

### Vấn Đề Được Giải Quyết

Thay vì chờ Next.js detect route change (có thể bị delay), hệ thống **Instant Loading** hiển thị loading overlay NGAY LẬP TỨC khi user click vào link.

### Cách Hoạt Động

1. **useInstantLoading Hook** - Quản lý instant loading state
2. **LoadingLink Component** - Wrapper cho Link với instant loading
3. **Tích hợp onClick** - Hiển thị loading ngay khi click

### Sử Dụng Instant Loading

```typescript
import { LoadingLink } from "@/components/ui/LoadingLink";

// Thay thế Link thông thường
<LoadingLink 
  href="/admin/products"
  loadingMessage="Đang chuyển tới Sản phẩm..."
  className="your-classes"
>
  Quản lý Sản phẩm
</LoadingLink>
```

### So Sánh

**Link thông thường:**
```
Click → Delay → Route change → Loading hiện → Page load
```

**LoadingLink:**
```
Click → Loading hiện NGAY → Route change → Page load → Loading ẩn
```

### Tích Hợp Sẵn

Instant loading đã được tích hợp trong:
- Admin Sidebar (`src/components/admin/Sidebar.tsx`)
- Header Logo (`src/components/layout/header.tsx`)

### Test Instant Loading

Truy cập `/test-loading` để test và so sánh giữa instant loading và link thông thường.
