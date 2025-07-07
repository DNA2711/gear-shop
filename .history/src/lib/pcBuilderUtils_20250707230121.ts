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
    name: "CPU",
    description: "Bộ xử lý trung tâm",
    required: true,
    maxQuantity: 1,
  },
  mainboard: {
    name: "Mainboard",
    description: "Bo mạch chủ",
    required: true,
    maxQuantity: 1,
  },
  ram: {
    name: "RAM",
    description: "Bộ nhớ truy cập ngẫu nhiên",
    required: true,
    maxQuantity: 4,
  },
  storage: {
    name: "Storage",
    description: "Ổ cứng lưu trữ",
    required: true,
    maxQuantity: 4,
  },
  gpu: {
    name: "GPU",
    description: "Card đồ họa",
    required: false,
    maxQuantity: 2,
  },
  psu: {
    name: "PSU",
    description: "Nguồn máy tính",
    required: true,
    maxQuantity: 1,
  },
  case: {
    name: "Case",
    description: "Thùng máy tính",
    required: true,
    maxQuantity: 1,
  },
  cooling: {
    name: "Cooling",
    description: "Tản nhiệt",
    required: false,
    maxQuantity: 4,
  },
  monitor: {
    name: "Monitor",
    description: "Màn hình",
    required: false,
    maxQuantity: 3,
  },
  keyboard: {
    name: "Keyboard",
    description: "Bàn phím",
    required: false,
    maxQuantity: 2,
  },
  mouse: {
    name: "Mouse",
    description: "Chuột",
    required: false,
    maxQuantity: 2,
  },
  headphone: {
    name: "Headphone",
    description: "Tai nghe",
    required: false,
    maxQuantity: 2,
  },
  speaker: {
    name: "Speaker",
    description: "Loa",
    required: false,
    maxQuantity: 2,
  },
  microphone: {
    name: "Microphone",
    description: "Microphone",
    required: false,
    maxQuantity: 1,
  },
  webcam: {
    name: "Webcam",
    description: "Camera",
    required: false,
    maxQuantity: 1,
  },
  network: {
    name: "Network",
    description: "Thiết bị mạng",
    required: false,
    maxQuantity: 2,
  },
  software: {
    name: "Software",
    description: "Phần mềm",
    required: false,
    maxQuantity: 10,
  },
  accessory: {
    name: "Accessory",
    description: "Phụ kiện",
    required: false,
    maxQuantity: 10,
  },
};

export const CATEGORY_ORDER = [
  "cpu",
  "mainboard",
  "ram",
  "storage",
  "gpu",
  "psu",
  "case",
  "cooling",
  "monitor",
  "keyboard",
  "mouse",
  "headphone",
  "speaker",
  "microphone",
  "webcam",
  "network",
  "software",
  "accessory",
];

export function getCategoryInfo(category: string) {
  return COMPONENT_CATEGORIES[category as keyof typeof COMPONENT_CATEGORIES];
}

export function getCategoryOrder() {
  return CATEGORY_ORDER;
}

export function getRequiredCategories(): string[] {
  return Object.entries(COMPONENT_CATEGORIES)
    .filter(([_, info]) => info.required)
    .map(([category, _]) => category);
}

export function getOptionalCategories(): string[] {
  return Object.entries(COMPONENT_CATEGORIES)
    .filter(([_, info]) => !info.required)
    .map(([category, _]) => category);
}

export function getMaxQuantity(category: string): number {
  return COMPONENT_CATEGORIES[category as keyof typeof COMPONENT_CATEGORIES]?.maxQuantity || 1;
}

export function isRequiredCategory(category: string): boolean {
  return COMPONENT_CATEGORIES[category as keyof typeof COMPONENT_CATEGORIES]?.required || false;
}

export function getCurrentQuantity(builder: PCBuilderState, category: string): number {
  const components = builder.components[category] || [];
  return components.length;
}

export function canAddComponent(builder: PCBuilderState, category: string): boolean {
  const currentQuantity = getCurrentQuantity(builder, category);
  const maxQuantity = getMaxQuantity(category);
  return currentQuantity < maxQuantity;
}

export function extractSpecValue(specifications: any[], specName: string): string | null {
  if (!specifications || !Array.isArray(specifications)) {
    return null;
  }

  const spec = specifications.find((s) =>
    s.specification_name?.toLowerCase().includes(specName.toLowerCase())
  );

  return spec?.specification_value || null;
}

export function extractSocket(specifications: any[]): string | null {
  let socket = extractSpecValue(specifications, "socket");
  if (!socket) {
    socket = extractSpecValue(specifications, "cpu socket");
  }
  if (!socket) {
    socket = extractSpecValue(specifications, "mainboard socket");
  }
  return socket;
}

export function extractMemoryType(specifications: any[]): string | null {
  let memoryType = extractSpecValue(specifications, "memory type");
  if (!memoryType) {
    memoryType = extractSpecValue(specifications, "ram type");
  }
  if (!memoryType) {
    memoryType = extractSpecValue(specifications, "ddr");
  }
  if (!memoryType) {
    memoryType = extractSpecValue(specifications, "memory standard");
  }
  return memoryType;
}

export function extractPowerRequirement(specifications: any[]): number | null {
  const powerStr = extractSpecValue(specifications, "power requirement");
  if (powerStr) {
    const match = powerStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
  }
  return null;
}

export function extractPowerRating(specifications: any[]): number | null {
  const powerStr = extractSpecValue(specifications, "power rating");
  if (powerStr) {
    const match = powerStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  const wattageStr = extractSpecValue(specifications, "wattage");
  if (wattageStr) {
    const match = wattageStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  return null;
}

export function calculateEstimatedPower(builder: PCBuilderState): number {
  let totalPower = 0;

  const cpuComponents = builder.components.cpu || [];
  const gpuComponents = builder.components.gpu || [];
  const ramComponents = builder.components.ram || [];
  const storageComponents = builder.components.storage || [];

  cpuComponents.forEach((component) => {
    const power = extractPowerRequirement(component.specifications);
    if (power) totalPower += power;
  });

  gpuComponents.forEach((component) => {
    const power = extractPowerRequirement(component.specifications);
    if (power) totalPower += power;
  });

  ramComponents.forEach((component) => {
    totalPower += 5;
  });

  storageComponents.forEach((component) => {
    totalPower += 10;
  });

  totalPower += 50;

  return totalPower;
}

export function getCurrentPowerSupply(builder: PCBuilderState): PCBuilderComponent | null {
  const psuComponents = builder.components.psu || [];
  return psuComponents.length > 0 ? psuComponents[0] : null;
}

export function checkSocketCompatibility(
  cpuComponent: PCBuilderComponent,
  mainboardComponent: PCBuilderComponent
): { compatible: boolean; message: string } {
  const cpuSocket = extractSocket(cpuComponent.specifications);
  const mainboardSocket = extractSocket(mainboardComponent.specifications);

  if (!cpuSocket || !mainboardSocket) {
    return {
      compatible: true,
      message: "Không thể kiểm tra tương thích socket",
    };
  }

  const cpuSocketLower = cpuSocket.toLowerCase();
  const mainboardSocketLower = mainboardSocket.toLowerCase();

  if (cpuSocketLower === mainboardSocketLower) {
    return {
      compatible: true,
      message: "Socket tương thích",
    };
  }

  return {
    compatible: false,
    message: `Socket không tương thích: CPU (${cpuSocket}) vs Mainboard (${mainboardSocket})`,
  };
}

export function checkMemoryCompatibility(
  ramComponent: PCBuilderComponent,
  mainboardComponent: PCBuilderComponent
): { compatible: boolean; message: string } {
  const ramType = extractMemoryType(ramComponent.specifications);
  const mainboardMemoryType = extractMemoryType(mainboardComponent.specifications);

  if (!ramType || !mainboardMemoryType) {
    return {
      compatible: true,
      message: "Không thể kiểm tra tương thích RAM",
    };
  }

  const ramTypeLower = ramType.toLowerCase();
  const mainboardMemoryTypeLower = mainboardMemoryType.toLowerCase();

  if (ramTypeLower.includes(mainboardMemoryTypeLower) || mainboardMemoryTypeLower.includes(ramTypeLower)) {
    return {
      compatible: true,
      message: "RAM tương thích",
    };
  }

  return {
    compatible: false,
    message: `RAM không tương thích: RAM (${ramType}) vs Mainboard (${mainboardMemoryType})`,
  };
}

export function checkPowerSupplyAdequacy(
  estimatedPower: number,
  psuComponent: PCBuilderComponent
): { adequate: boolean; message: string } {
  const psuPower = extractPowerRating(psuComponent.specifications);

  if (!psuPower) {
    return {
      adequate: true,
      message: "Không thể kiểm tra công suất PSU",
    };
  }

  if (psuPower < estimatedPower) {
    return {
      adequate: false,
      message: `PSU không đủ công suất: Cần ${estimatedPower}W, PSU chỉ có ${psuPower}W`,
    };
  }

  const headroom = psuPower - estimatedPower;
  const headroomPercentage = (headroom / psuPower) * 100;

  if (headroomPercentage < 20) {
    return {
      adequate: true,
      message: `PSU đủ công suất nhưng ít dư địa (${headroom}W dư)`,
    };
  }

  return {
    adequate: true,
    message: `PSU đủ công suất với dư địa tốt (${headroom}W dư)`,
  };
}

export function validateBuild(builder: PCBuilderState): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredCategories = getRequiredCategories();
  const missingCategories = requiredCategories.filter(
    (category) => getCurrentQuantity(builder, category) === 0
  );

  if (missingCategories.length > 0) {
    errors.push(`Thiếu các thành phần bắt buộc: ${missingCategories.join(", ")}`);
  }

  const estimatedPower = calculateEstimatedPower(builder);
  const psuComponent = getCurrentPowerSupply(builder);

  if (psuComponent) {
    const powerCheck = checkPowerSupplyAdequacy(estimatedPower, psuComponent);
    if (!powerCheck.adequate) {
      errors.push(powerCheck.message);
    } else if (powerCheck.message.includes("ít dư địa")) {
      warnings.push(powerCheck.message);
    }
  }

  const cpuComponents = builder.components.cpu || [];
  const mainboardComponents = builder.components.mainboard || [];

  if (cpuComponents.length > 0 && mainboardComponents.length > 0) {
    const socketCheck = checkSocketCompatibility(cpuComponents[0], mainboardComponents[0]);
    if (!socketCheck.compatible) {
      errors.push(socketCheck.message);
    }
  }

  const ramComponents = builder.components.ram || [];
  if (ramComponents.length > 0 && mainboardComponents.length > 0) {
    const memoryCheck = checkMemoryCompatibility(ramComponents[0], mainboardComponents[0]);
    if (!memoryCheck.compatible) {
      errors.push(memoryCheck.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function calculateTotalPrice(builder: PCBuilderState): number {
  let total = 0;

  Object.values(builder.components).forEach((components) => {
    components.forEach((component) => {
      total += component.price * component.quantity;
    });
  });

  return total;
}

export function getComponentSuggestions(
  category: string,
  builder: PCBuilderState
): { category: string; reason: string }[] {
  const suggestions: { category: string; reason: string }[] = [];

  if (category === "cpu" && builder.components.mainboard?.length > 0) {
    suggestions.push({
      category: "mainboard",
      reason: "Chọn mainboard tương thích với CPU",
    });
  }

  if (category === "mainboard" && builder.components.cpu?.length > 0) {
    suggestions.push({
      category: "cpu",
      reason: "Chọn CPU tương thích với mainboard",
    });
  }

  if (category === "ram" && builder.components.mainboard?.length > 0) {
    suggestions.push({
      category: "mainboard",
      reason: "Chọn RAM tương thích với mainboard",
    });
  }

  if (category === "psu") {
    const estimatedPower = calculateEstimatedPower(builder);
    const recommendedPower = Math.ceil((estimatedPower * 1.2) / 50) * 50;
    suggestions.push({
      category: "psu",
      reason: `Khuyến nghị PSU ${recommendedPower}W trở lên`,
    });
  }

  return suggestions;
}
