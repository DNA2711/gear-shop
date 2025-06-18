import {
  PCComponent,
  PCBuild,
  CompatibilityStatus,
  CompatibilityWarning,
  CompatibilityError,
  PowerConsumption,
} from "@/types/pcbuilder";

// Define component categories với metadata
export const COMPONENT_CATEGORIES = {
  cpu: {
    name: "CPU - Bộ Vi Xử Lý",
    icon: "🔧",
    required: true,
    multiple_allowed: false,
    base_power: 65,
    max_power: 150,
  },
  vga: {
    name: "VGA - Card Đồ Họa",
    icon: "🎮",
    required: false,
    multiple_allowed: false,
    base_power: 150,
    max_power: 450,
  },
  mainboard: {
    name: "Mainboard - Bo Mạch Chủ",
    icon: "🔌",
    required: true,
    multiple_allowed: false,
    base_power: 25,
    max_power: 50,
  },
  ram: {
    name: "RAM - Bộ Nhớ",
    icon: "💾",
    required: true,
    multiple_allowed: true,
    base_power: 3,
    max_power: 8,
  },
  storage: {
    name: "Storage - Lưu Trữ",
    icon: "💿",
    required: true,
    multiple_allowed: true,
    base_power: 3,
    max_power: 10,
  },
  psu: {
    name: "PSU - Nguồn Máy Tính",
    icon: "⚡",
    required: true,
    multiple_allowed: false,
    base_power: 0,
    max_power: 0,
  },
  case: {
    name: "Case - Vỏ Máy Tính",
    icon: "🏠",
    required: true,
    multiple_allowed: false,
    base_power: 0,
    max_power: 0,
  },
  cooling: {
    name: "Cooling - Tản Nhiệt",
    icon: "❄️",
    required: false,
    multiple_allowed: false,
    base_power: 5,
    max_power: 15,
  },
};

// Convert to array for easy iteration
export const COMPONENT_CATEGORIES_ARRAY = Object.entries(
  COMPONENT_CATEGORIES
).map(([key, value]) => ({
  key,
  ...value,
  multipleAllowed: value.multiple_allowed,
  maxQuantity: value.multiple_allowed
    ? key === "ram"
      ? 4
      : key === "storage"
      ? 8
      : 1
    : 1,
}));

// Utility function để extract thông số từ specifications
export function extractSpecValue(
  component: PCComponent,
  specName: string
): string {
  if (!component.specifications) return "";

  const spec = component.specifications.find((s) =>
    s.spec_name.toLowerCase().includes(specName.toLowerCase())
  );
  return spec?.spec_value || "";
}

// Extract socket từ CPU hoặc Mainboard
export function extractSocket(component: PCComponent): string {
  const socketSpec = extractSpecValue(component, "socket");
  if (socketSpec) return socketSpec.toUpperCase();

  // Try alternative spec names
  const alternatives = ["Socket", "Chuẩn socket", "Loại socket"];
  for (const alt of alternatives) {
    const value = extractSpecValue(component, alt);
    if (value) return value.toUpperCase();
  }

  return "";
}

// Extract memory type từ RAM hoặc Mainboard
export function extractMemoryType(component: PCComponent): string {
  const memoryTypes = ["DDR4", "DDR5"];
  const specs = component.specifications || [];

  for (const spec of specs) {
    const value = spec.spec_value.toUpperCase();
    for (const type of memoryTypes) {
      if (value.includes(type)) return type;
    }
  }

  return "";
}

// Extract power requirement từ VGA
export function extractPowerRequirement(component: PCComponent): number {
  const powerSpec = extractSpecValue(component, "PSU");
  if (!powerSpec) return 0;

  const match = powerSpec.match(/(\d+)W/i);
  return match ? parseInt(match[1]) : 0;
}

// Extract power rating từ PSU
export function extractPowerRating(component: PCComponent): number {
  // Try to find power rating in product name or specs
  const productName = component.product_name.toUpperCase();
  const wattMatch = productName.match(/(\d+)W/);
  if (wattMatch) return parseInt(wattMatch[1]);

  const powerSpec = extractSpecValue(component, "Công suất");
  if (powerSpec) {
    const match = powerSpec.match(/(\d+)W/i);
    if (match) return parseInt(match[1]);
  }

  return 0;
}

// Calculate total power consumption
export function calculatePowerConsumption(build: PCBuild): PowerConsumption[] {
  const consumptions: PowerConsumption[] = [];

  Object.entries(build.components).forEach(([type, component]) => {
    if (!component) return;

    const category =
      COMPONENT_CATEGORIES[type as keyof typeof COMPONENT_CATEGORIES];
    if (!category) return;

    if (Array.isArray(component)) {
      // Multiple components (RAM, Storage)
      component.forEach((comp, index) => {
        consumptions.push({
          component_type: `${type}_${index + 1}`,
          base_power: category.base_power,
          max_power: category.max_power,
          estimated_power: category.base_power,
        });
      });
    } else {
      // Single component
      let estimatedPower = category.base_power;

      // Special case for VGA - use actual power requirement
      if (type === "vga") {
        const vgaPower = extractPowerRequirement(component);
        estimatedPower = vgaPower || category.base_power;
      }

      consumptions.push({
        component_type: type,
        base_power: category.base_power,
        max_power: category.max_power,
        estimated_power: estimatedPower,
      });
    }
  });

  return consumptions;
}

// Get total estimated power
export function getTotalEstimatedPower(build: PCBuild): number {
  const consumptions = calculatePowerConsumption(build);
  return consumptions.reduce(
    (total, consumption) => total + consumption.estimated_power,
    0
  );
}

// Check socket compatibility between CPU and Mainboard
export function checkSocketCompatibility(
  cpu?: PCComponent,
  mainboard?: PCComponent
): CompatibilityError | null {
  if (!cpu || !mainboard) return null;

  const cpuSocket = extractSocket(cpu);
  const mainboardSocket = extractSocket(mainboard);

  if (!cpuSocket || !mainboardSocket) return null;

  if (cpuSocket !== mainboardSocket) {
    return {
      type: "socket_mismatch",
      message: `Socket không tương thích: CPU ${cpuSocket} vs Mainboard ${mainboardSocket}`,
      component_types: ["cpu", "mainboard"],
      blocking: true,
    };
  }

  return null;
}

// Check memory compatibility between RAM and Mainboard
export function checkMemoryCompatibility(
  ram?: PCComponent[],
  mainboard?: PCComponent
): CompatibilityError | null {
  if (!ram || !ram.length || !mainboard) return null;

  const mainboardMemoryType = extractMemoryType(mainboard);
  if (!mainboardMemoryType) return null;

  for (const ramModule of ram) {
    const ramMemoryType = extractMemoryType(ramModule);
    if (ramMemoryType && ramMemoryType !== mainboardMemoryType) {
      return {
        type: "memory_incompatible",
        message: `Loại RAM không tương thích: ${ramMemoryType} vs Mainboard hỗ trợ ${mainboardMemoryType}`,
        component_types: ["ram", "mainboard"],
        blocking: true,
      };
    }
  }

  return null;
}

// Check power supply adequacy
export function checkPowerSupply(
  build: PCBuild
): CompatibilityError | CompatibilityWarning | null {
  const psu = build.components.psu;
  if (!psu) return null;

  const totalPower = getTotalEstimatedPower(build);
  const psuRating = extractPowerRating(psu);

  if (!psuRating) return null;

  // Error if PSU is insufficient
  if (psuRating < totalPower) {
    return {
      type: "power_insufficient",
      message: `Nguồn không đủ: Cần ${totalPower}W, PSU chỉ có ${psuRating}W`,
      component_types: ["psu"],
      blocking: true,
    };
  }

  // Warning if PSU is too close to limit (less than 20% headroom)
  const headroom = (psuRating - totalPower) / psuRating;
  if (headroom < 0.2) {
    return {
      type: "power",
      message: `Nguồn ít dư thừa: ${psuRating}W cho ${totalPower}W (khuyến nghị dự trữ 20%)`,
      component_types: ["psu"],
    };
  }

  return null;
}

// Main compatibility check function
export function checkCompatibility(build: PCBuild): CompatibilityStatus {
  const errors: CompatibilityError[] = [];
  const warnings: CompatibilityWarning[] = [];

  // Check socket compatibility
  const socketError = checkSocketCompatibility(
    build.components.cpu,
    build.components.mainboard
  );
  if (socketError) errors.push(socketError);

  // Check memory compatibility
  const memoryError = checkMemoryCompatibility(
    build.components.ram,
    build.components.mainboard
  );
  if (memoryError) errors.push(memoryError);

  // Check power supply
  const powerCheck = checkPowerSupply(build);
  if (powerCheck) {
    if ("blocking" in powerCheck) {
      errors.push(powerCheck);
    } else {
      warnings.push(powerCheck);
    }
  }

  // Check for missing required components
  Object.entries(COMPONENT_CATEGORIES).forEach(([type, category]) => {
    if (
      category.required &&
      !build.components[type as keyof typeof build.components]
    ) {
      warnings.push({
        type: "performance",
        message: `Thiếu linh kiện bắt buộc: ${category.name}`,
        component_types: [type],
      });
    }
  });

  return {
    is_compatible: errors.length === 0,
    warnings,
    errors,
  };
}

// Calculate total price
export function calculateTotalPrice(build: PCBuild): number {
  let total = 0;

  Object.values(build.components).forEach((component) => {
    if (Array.isArray(component)) {
      total += component.reduce((sum, comp) => sum + comp.price, 0);
    } else if (component) {
      total += component.price;
    }
  });

  return total;
}

// Validate build before saving
export function validateBuild(build: PCBuild): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!build.build_name.trim()) {
    errors.push("Tên cấu hình không được để trống");
  }

  const requiredComponents = Object.entries(COMPONENT_CATEGORIES)
    .filter(([_, category]) => category.required)
    .map(([type, _]) => type);

  for (const componentType of requiredComponents) {
    if (!build.components[componentType as keyof typeof build.components]) {
      const category =
        COMPONENT_CATEGORIES[
          componentType as keyof typeof COMPONENT_CATEGORIES
        ];
      errors.push(`Thiếu linh kiện bắt buộc: ${category.name}`);
    }
  }

  const compatibility = checkCompatibility(build);
  const blockingErrors = compatibility.errors.filter((error) => error.blocking);

  if (blockingErrors.length > 0) {
    errors.push(...blockingErrors.map((error) => error.message));
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Get component suggestions based on current build
export function getComponentSuggestions(
  build: PCBuild,
  targetType: string
): string[] {
  const suggestions: string[] = [];

  // CPU suggestions based on mainboard
  if (targetType === "cpu" && build.components.mainboard) {
    const socket = extractSocket(build.components.mainboard);
    if (socket) {
      suggestions.push(`Chọn CPU tương thích với socket ${socket}`);
    }
  }

  // Mainboard suggestions based on CPU
  if (targetType === "mainboard" && build.components.cpu) {
    const socket = extractSocket(build.components.cpu);
    if (socket) {
      suggestions.push(`Chọn mainboard với socket ${socket}`);
    }
  }

  // RAM suggestions based on mainboard
  if (targetType === "ram" && build.components.mainboard) {
    const memoryType = extractMemoryType(build.components.mainboard);
    if (memoryType) {
      suggestions.push(`Chọn RAM loại ${memoryType}`);
    }
  }

  // PSU suggestions based on current components
  if (targetType === "psu") {
    const estimatedPower = getTotalEstimatedPower(build);
    const recommendedPower = Math.ceil((estimatedPower * 1.2) / 50) * 50; // Round up to nearest 50W with 20% headroom
    suggestions.push(`Khuyến nghị PSU từ ${recommendedPower}W trở lên`);
  }

  return suggestions;
}
