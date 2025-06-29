# PC Builder System - Hướng dẫn đầy đủ

## Tổng quan

PC Builder là một hệ thống cho phép người dùng thiết kế và xây dựng cấu hình PC tùy chỉnh với các tính năng:

- ✅ **Chọn linh kiện theo danh mục**: CPU, VGA, Mainboard, RAM, Storage, PSU, Case, Cooling
- ✅ **Kiểm tra tương thích tự động**: Socket, Memory type, Power requirements
- ✅ **Tính toán giá và công suất**: Real-time pricing và power consumption
- ✅ **Lưu và chia sẻ cấu hình**: Local storage và export/import
- ✅ **Thêm vào giỏ hàng**: Integrate với cart system
- ✅ **Responsive design**: Mobile và desktop friendly

## Cấu trúc hệ thống

### 1. Types & Interfaces (`src/types/pcbuilder.ts`)

```typescript
interface PCComponent {
  component_type:
    | "cpu"
    | "vga"
    | "mainboard"
    | "ram"
    | "storage"
    | "psu"
    | "case"
    | "cooling";
  product_id: number;
  product_name: string;
  product_code: string;
  brand_name?: string;
  price: number;
  stock_quantity: number;
  primary_image?: string;
  specifications?: ProductSpecification[];
}

interface PCBuild {
  build_name: string;
  components: {
    cpu?: PCComponent;
    vga?: PCComponent;
    mainboard?: PCComponent;
    ram?: PCComponent[]; // Multiple allowed
    storage?: PCComponent[]; // Multiple allowed
    psu?: PCComponent;
    case?: PCComponent;
    cooling?: PCComponent;
  };
  total_price: number;
  estimated_power: number;
  compatibility_status: CompatibilityStatus;
}
```

### 2. Utility Functions (`src/lib/pcBuilderUtils.ts`)

#### Component Categories

```typescript
export const COMPONENT_CATEGORIES = {
  cpu: {
    name: "CPU - Bộ Vi Xử Lý",
    icon: "🔧",
    required: true,
    multiple_allowed: false,
    base_power: 65,
    max_power: 150,
  },
  // ... other categories
};
```

#### Compatibility Checking

```typescript
// Socket compatibility (CPU ↔ Mainboard)
export function checkSocketCompatibility(
  cpu,
  mainboard
): CompatibilityError | null;

// Memory compatibility (RAM ↔ Mainboard)
export function checkMemoryCompatibility(
  ram,
  mainboard
): CompatibilityError | null;

// Power supply adequacy
export function checkPowerSupply(
  build
): CompatibilityError | CompatibilityWarning | null;

// Main compatibility checker
export function checkCompatibility(build): CompatibilityStatus;
```

#### Power Calculation

```typescript
export function calculatePowerConsumption(build): PowerConsumption[];
export function getTotalEstimatedPower(build): number;
```

### 3. API Endpoints

#### `/api/pc-builder/components` (GET)

Lấy danh sách components với filtering:

```
GET /api/pc-builder/components?category_code=cpu&page=1&limit=12&search=intel
```

**Query Parameters:**

- `category_code`: cpu, vga, mainboard, ram, storage, psu, case, cooling
- `brand_id`: Filter by brand
- `min_price`, `max_price`: Price range
- `socket`: Socket type for CPU/Mainboard
- `memory_type`: DDR4/DDR5 for RAM/Mainboard
- `power_rating`: Power rating for PSU
- `search`: Search term
- `page`, `limit`: Pagination

**Response:**

```json
{
  "success": true,
  "data": {
    "components": [PCComponent[]],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 245,
      "totalPages": 21
    }
  }
}
```

#### `/api/pc-builder/compatibility` (POST)

Kiểm tra compatibility của build:

```json
{
  "build_name": "Gaming Build",
  "components": {
    "cpu": {
      /* PCComponent */
    },
    "mainboard": {
      /* PCComponent */
    },
    "ram": [
      {
        /* PCComponent */
      }
    ]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "build": {
      /* Updated PCBuild with calculations */
    },
    "compatibility": {
      "is_compatible": true,
      "warnings": [],
      "errors": []
    },
    "totals": {
      "price": 25000000,
      "power": 450
    }
  }
}
```

### 4. Context & State Management (`src/contexts/PCBuilderContext.tsx`)

```typescript
const PCBuilderContext = createContext<{
  state: PCBuilderState;
  setBuildName: (name: string) => void;
  addComponent: (type: string, component: PCComponent) => void;
  removeComponent: (type: string, index?: number) => void;
  clearBuild: () => void;
  loadBuild: (build: PCBuild) => void;
  openComponentModal: (type: string) => void;
  closeComponentModal: () => void;
  // ... other methods
}>();
```

**Features:**

- Auto-save to localStorage
- Real-time compatibility checking
- Component count tracking
- Multiple component support (RAM, Storage)

### 5. UI Components

#### `ComponentCard` (`src/components/pc-builder/ComponentCard.tsx`)

- Product image, name, brand, price
- Key specifications display
- Stock status
- Compatibility indicators
- Add to cart functionality

#### `ComponentSelector` (`src/components/pc-builder/ComponentSelector.tsx`)

- Modal for component selection
- Search & filtering
- Pagination
- Real-time compatibility checking

#### Main PC Builder Page (`src/app/pc-builder/page.tsx`)

- Component slots for each category
- Drag & drop reordering
- Real-time totals
- Compatibility status
- Save/export functionality

## Compatibility Rules

### 1. Socket Compatibility

```typescript
// CPU socket must match Mainboard socket
CPU: "LGA 1700" ↔ Mainboard: "LGA 1700" ✅
CPU: "LGA 1700" ↔ Mainboard: "AM4" ❌
```

### 2. Memory Compatibility

```typescript
// RAM type must match Mainboard supported memory
RAM: "DDR5" ↔ Mainboard: "DDR5" ✅
RAM: "DDR4" ↔ Mainboard: "DDR5" ❌
```

### 3. Power Supply

```typescript
// PSU wattage must be sufficient for total system power
Total Power: 450W, PSU: 650W ✅ (45% headroom)
Total Power: 450W, PSU: 500W ⚠️ (10% headroom - warning)
Total Power: 450W, PSU: 400W ❌ (insufficient)
```

### 4. Multiple Components

- **RAM**: Up to 4 modules allowed
- **Storage**: Up to 8 devices allowed (SSD + HDD)

## Power Consumption Calculation

### Base Power Values (Watts)

- **CPU**: 65-150W (depends on specifications)
- **VGA**: 150-450W (extracted from specs)
- **Mainboard**: 25-50W
- **RAM**: 3-8W per module
- **Storage**: 3-10W per device
- **PSU**: 0W (supplies power)
- **Case**: 0W
- **Cooling**: 5-15W

### Dynamic Power Calculation

```typescript
// VGA power từ specifications
const vgaPower = extractPowerRequirement(vgaComponent); // "700W PSU đề nghị" → 250W estimated

// Total system power
const totalPower =
  cpu.power +
  vga.power +
  mainboard.power +
  ram.length * ramPower +
  storage.length * storagePower +
  cooling.power;

// PSU recommendation = totalPower * 1.2 (20% headroom)
```

## Usage Guide

### 1. Accessing PC Builder

- **Header Navigation**: Click "PC Builder" in main header
- **Direct URL**: `/pc-builder`
- **Test Page**: `/pc-builder/test` (for testing APIs)

### 2. Building a PC

#### Step 1: Start with Required Components

1. **CPU** (Required) - Choose processor first
2. **Mainboard** (Required) - Will show compatible sockets
3. **RAM** (Required) - Will show compatible memory types
4. **Storage** (Required) - At least one storage device
5. **PSU** (Required) - Based on power requirements
6. **Case** (Required) - To house everything

#### Step 2: Add Optional Components

7. **VGA** (Optional) - For dedicated graphics
8. **Cooling** (Optional) - For better temperatures

#### Step 3: Review & Finalize

- Check compatibility status
- Review total price
- Verify power requirements
- Add to cart or save configuration

### 3. Component Selection Process

1. Click "Chọn linh kiện" button in any category
2. Use search and filters to find suitable components
3. Check compatibility indicators (green ✓ or red ❌)
4. Click component to select
5. Review in build summary

### 4. Compatibility Checking

- **Real-time**: Updates as you add components
- **Visual indicators**: Green/red status icons
- **Detailed messages**: Specific compatibility issues
- **Warnings vs Errors**: Warnings allow build, errors block it

### 5. Saving & Sharing

- **Auto-save**: Configuration saved to localStorage
- **Manual save**: Click "Lưu cấu hình" (future: database)
- **Export**: Download as JSON file (future feature)
- **Import**: Upload JSON configuration (future feature)

## Developer Notes

### 1. Adding New Component Categories

```typescript
// 1. Update COMPONENT_CATEGORIES in pcBuilderUtils.ts
cooling: {
  name: 'Cooling - Tản Nhiệt',
  icon: '❄️',
  required: false,
  multiple_allowed: false,
  base_power: 5,
  max_power: 15,
}

// 2. Update PCComponent type
component_type: 'cpu' | 'vga' | ... | 'cooling'

// 3. Update PCBuild.components interface
components: {
  // existing...
  cooling?: PCComponent;
}
```

### 2. Adding New Compatibility Rules

```typescript
// Create new checker function
export function checkCoolingCompatibility(
  cpu: PCComponent,
  cooling: PCComponent
): CompatibilityError | null {
  const cpuSocket = extractSocket(cpu);
  const coolingSocket = extractSpecValue(cooling, "tương thích");

  if (cpuSocket && coolingSocket && !coolingSocket.includes(cpuSocket)) {
    return {
      type: "socket_mismatch",
      message: `Tản nhiệt không tương thích với CPU socket ${cpuSocket}`,
      component_types: ["cpu", "cooling"],
      blocking: true,
    };
  }

  return null;
}

// Add to main checkCompatibility function
export function checkCompatibility(build: PCBuild): CompatibilityStatus {
  // existing checks...

  const coolingError = checkCoolingCompatibility(
    build.components.cpu,
    build.components.cooling
  );
  if (coolingError) errors.push(coolingError);

  // return result...
}
```

### 3. Database Integration (Future)

```sql
-- PC builds table
CREATE TABLE pc_builds (
  build_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  build_name VARCHAR(255),
  components JSON,
  total_price DECIMAL(15,2),
  estimated_power INT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Build templates table
CREATE TABLE build_templates (
  template_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  template_name VARCHAR(255),
  description TEXT,
  target_budget DECIMAL(15,2),
  target_use ENUM('gaming', 'workstation', 'office', 'budget', 'high_end'),
  recommended_components JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

### 1. API Testing

```bash
# Test component endpoint
curl "http://localhost:3000/api/pc-builder/components?category_code=cpu&limit=5"

# Test compatibility endpoint
curl -X POST "http://localhost:3000/api/pc-builder/compatibility" \
  -H "Content-Type: application/json" \
  -d '{"build_name":"Test","components":{}}'
```

### 2. Component Testing

Visit `/pc-builder/test` to test all APIs and view sample data.

### 3. Manual Testing Scenarios

1. **Socket Incompatibility**: Choose Intel CPU + AMD Mainboard
2. **Memory Incompatibility**: Choose DDR4 RAM + DDR5 Mainboard
3. **Power Insufficiency**: High-end VGA + Low-wattage PSU
4. **Multiple Components**: Add multiple RAM modules and storage
5. **Mobile Responsiveness**: Test on different screen sizes

## Future Enhancements

### 1. Advanced Features

- **Pre-built Templates**: Gaming, Workstation, Budget builds
- **AI Recommendations**: Smart component suggestions
- **Price Tracking**: Historical pricing and alerts
- **Build Comparison**: Side-by-side configuration comparison
- **Performance Benchmarks**: Estimated FPS and scores

### 2. Social Features

- **Public Builds**: Share configurations with community
- **Build Reviews**: Rate and comment on builds
- **Build Contests**: Monthly themed competitions
- **Expert Builds**: Verified builds from tech experts

### 3. Advanced Compatibility

- **Form Factor Checking**: ITX, ATX, E-ATX compatibility
- **Clearance Validation**: GPU length, CPU cooler height
- **Thermal Analysis**: Temperature predictions
- **Bottleneck Detection**: Performance balance warnings

### 4. E-commerce Integration

- **Real-time Pricing**: Live price updates from suppliers
- **Bulk Discounts**: Package deals for complete builds
- **Assembly Service**: Professional build service
- **Warranty Packages**: Extended coverage options

---

## Troubleshooting

### Common Issues

1. **Components not loading**

   - Check API endpoints are working
   - Verify database has product data with specifications
   - Check category mappings in API

2. **Compatibility false positives**

   - Review specification extraction logic
   - Check socket/memory type parsing
   - Verify power calculation formulas

3. **UI state issues**

   - Clear localStorage: `localStorage.removeItem('pcbuilder-current-build')`
   - Refresh page to reset context state
   - Check browser console for errors

4. **Mobile responsiveness**
   - Test component modal on small screens
   - Verify sticky sidebar behavior
   - Check touch interactions

### Debug Mode

```typescript
// Enable debug logging
localStorage.setItem("pcbuilder-debug", "true");

// View current build state
console.log(
  "Current Build:",
  JSON.parse(localStorage.getItem("pcbuilder-current-build"))
);
```

---

**Tính năng PC Builder đã được triển khai thành công với đầy đủ functionality để người dùng có thể tạo cấu hình PC tùy chỉnh một cách dễ dàng và trực quan!** 🖥️✨
