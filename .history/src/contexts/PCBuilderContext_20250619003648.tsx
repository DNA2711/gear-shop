"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { PCBuild, PCComponent, CompatibilityStatus } from "@/types/pcbuilder";
import {
  checkCompatibility,
  calculateTotalPrice,
  getTotalEstimatedPower,
  COMPONENT_CATEGORIES,
} from "@/lib/pcBuilderUtils";

interface PCBuilderState {
  currentBuild: PCBuild;
  selectedComponentType: string | null;
  isComponentModalOpen: boolean;
  loading: boolean;
  error: string | null;
}

type PCBuilderAction =
  | { type: "SET_BUILD_NAME"; payload: string }
  | { type: "ADD_COMPONENT"; payload: { type: string; component: PCComponent } }
  | { type: "REMOVE_COMPONENT"; payload: { type: string; index?: number } }
  | { type: "CLEAR_BUILD" }
  | { type: "LOAD_BUILD"; payload: PCBuild }
  | { type: "OPEN_COMPONENT_MODAL"; payload: string }
  | { type: "CLOSE_COMPONENT_MODAL" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "UPDATE_COMPATIBILITY" };

const initialBuild: PCBuild = {
  build_name: "Cấu hình mới",
  components: {},
  total_price: 0,
  estimated_power: 0,
  compatibility_status: {
    is_compatible: true,
    warnings: [],
    errors: [],
  },
};

const initialState: PCBuilderState = {
  currentBuild: initialBuild,
  selectedComponentType: null,
  isComponentModalOpen: false,
  loading: false,
  error: null,
};

function pcBuilderReducer(
  state: PCBuilderState,
  action: PCBuilderAction
): PCBuilderState {
  switch (action.type) {
    case "SET_BUILD_NAME":
      return {
        ...state,
        currentBuild: {
          ...state.currentBuild,
          build_name: action.payload,
        },
      };

    case "ADD_COMPONENT": {
      const { type, component } = action.payload;
      const category =
        COMPONENT_CATEGORIES[type as keyof typeof COMPONENT_CATEGORIES];

      if (!category) return state;

      let newComponents = { ...state.currentBuild.components };

      if (category.multiple_allowed) {
        // For RAM and Storage - allow multiple
        const existing =
          (newComponents[
            type as keyof typeof newComponents
          ] as PCComponent[]) || [];
        newComponents = {
          ...newComponents,
          [type]: [...existing, component],
        };
      } else {
        // For single components - replace existing
        newComponents = {
          ...newComponents,
          [type]: component,
        };
      }

      const updatedBuild = {
        ...state.currentBuild,
        components: newComponents,
      };

      // Recalculate totals and compatibility
      try {
        const compatibility = checkCompatibility(updatedBuild);
        const totalPrice = calculateTotalPrice(updatedBuild);
        const estimatedPower = getTotalEstimatedPower(updatedBuild);

        return {
          ...state,
          currentBuild: {
            ...updatedBuild,
            total_price: totalPrice,
            estimated_power: estimatedPower,
            compatibility_status: compatibility,
          },
          isComponentModalOpen: false,
        };
      } catch (error) {
        console.error("Error calculating compatibility:", error);
        return {
          ...state,
          currentBuild: {
            ...updatedBuild,
            total_price: 0,
            estimated_power: 0,
            compatibility_status: {
              is_compatible: false,
              warnings: [],
              errors: [
                {
                  type: "socket_mismatch",
                  message: "Lỗi tính toán compatibility",
                  component_types: [],
                  blocking: true,
                },
              ],
            },
          },
          isComponentModalOpen: false,
        };
      }
    }

    case "REMOVE_COMPONENT": {
      const { type, index } = action.payload;
      const category =
        COMPONENT_CATEGORIES[type as keyof typeof COMPONENT_CATEGORIES];

      if (!category) return state;

      let newComponents = { ...state.currentBuild.components };

      if (category.multiple_allowed && typeof index === "number") {
        // Remove specific item from array
        const existing =
          (newComponents[
            type as keyof typeof newComponents
          ] as PCComponent[]) || [];
        newComponents = {
          ...newComponents,
          [type]: existing.filter((_, i) => i !== index),
        };
      } else {
        // Remove single component
        newComponents = { ...newComponents };
        delete (newComponents as any)[type];
      }

      const updatedBuild = {
        ...state.currentBuild,
        components: newComponents,
      };

      // Recalculate totals and compatibility
      const compatibility = checkCompatibility(updatedBuild);
      const totalPrice = calculateTotalPrice(updatedBuild);
      const estimatedPower = getTotalEstimatedPower(updatedBuild);

      return {
        ...state,
        currentBuild: {
          ...updatedBuild,
          total_price: totalPrice,
          estimated_power: estimatedPower,
          compatibility_status: compatibility,
        },
      };
    }

    case "CLEAR_BUILD":
      return {
        ...state,
        currentBuild: initialBuild,
      };

    case "LOAD_BUILD":
      return {
        ...state,
        currentBuild: action.payload,
      };

    case "OPEN_COMPONENT_MODAL":
      return {
        ...state,
        selectedComponentType: action.payload,
        isComponentModalOpen: true,
      };

    case "CLOSE_COMPONENT_MODAL":
      return {
        ...state,
        selectedComponentType: null,
        isComponentModalOpen: false,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "UPDATE_COMPATIBILITY": {
      const compatibility = checkCompatibility(state.currentBuild);
      const totalPrice = calculateTotalPrice(state.currentBuild);
      const estimatedPower = getTotalEstimatedPower(state.currentBuild);

      return {
        ...state,
        currentBuild: {
          ...state.currentBuild,
          total_price: totalPrice,
          estimated_power: estimatedPower,
          compatibility_status: compatibility,
        },
      };
    }

    default:
      return state;
  }
}

interface PCBuilderContextType {
  state: PCBuilderState;
  setBuildName: (name: string) => void;
  addComponent: (type: string, component: PCComponent) => void;
  removeComponent: (type: string, index?: number) => void;
  clearBuild: () => void;
  loadBuild: (build: PCBuild) => void;
  openComponentModal: (type: string) => void;
  closeComponentModal: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateCompatibility: () => void;
  getComponentCount: (type: string) => number;
  getComponentByType: (type: string) => PCComponent | PCComponent[] | undefined;
  canAddMoreComponents: (type: string) => boolean;
}

const PCBuilderContext = createContext<PCBuilderContextType | undefined>(
  undefined
);

export function PCBuilderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(pcBuilderReducer, initialState);

  // Load saved build from localStorage on mount
  useEffect(() => {
    const savedBuild = localStorage.getItem("pcbuilder-current-build");
    if (savedBuild) {
      try {
        const build = JSON.parse(savedBuild);
        // Validate build structure before loading
        if (build && build.components && build.build_name) {
          dispatch({ type: "LOAD_BUILD", payload: build });
        } else {
          console.warn("Invalid saved build, clearing localStorage");
          localStorage.removeItem("pcbuilder-current-build");
        }
      } catch (error) {
        console.error("Failed to load saved build:", error);
        localStorage.removeItem("pcbuilder-current-build");
      }
    }
  }, []);

  // Save build to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "pcbuilder-current-build",
      JSON.stringify(state.currentBuild)
    );
  }, [state.currentBuild]);

  const setBuildName = (name: string) => {
    dispatch({ type: "SET_BUILD_NAME", payload: name });
  };

  const addComponent = (type: string, component: PCComponent) => {
    dispatch({ type: "ADD_COMPONENT", payload: { type, component } });
  };

  const removeComponent = (type: string, index?: number) => {
    dispatch({ type: "REMOVE_COMPONENT", payload: { type, index } });
  };

  const clearBuild = () => {
    dispatch({ type: "CLEAR_BUILD" });
  };

  const loadBuild = (build: PCBuild) => {
    dispatch({ type: "LOAD_BUILD", payload: build });
  };

  const openComponentModal = (type: string) => {
    dispatch({ type: "OPEN_COMPONENT_MODAL", payload: type });
  };

  const closeComponentModal = () => {
    dispatch({ type: "CLOSE_COMPONENT_MODAL" });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const updateCompatibility = () => {
    dispatch({ type: "UPDATE_COMPATIBILITY" });
  };

  const getComponentCount = (type: string): number => {
    const component =
      state.currentBuild.components[
        type as keyof typeof state.currentBuild.components
      ];
    if (Array.isArray(component)) {
      return component.length;
    }
    return component ? 1 : 0;
  };

  const getComponentByType = (
    type: string
  ): PCComponent | PCComponent[] | undefined => {
    return state.currentBuild.components[
      type as keyof typeof state.currentBuild.components
    ];
  };

  const canAddMoreComponents = (type: string): boolean => {
    const category =
      COMPONENT_CATEGORIES[type as keyof typeof COMPONENT_CATEGORIES];
    if (!category) return false;

    if (category.multiple_allowed) {
      // For multiple components, check reasonable limits
      const count = getComponentCount(type);
      return count < (type === "ram" ? 4 : 8); // Max 4 RAM modules, 8 storage devices
    } else {
      // For single components, check if slot is empty
      return getComponentCount(type) === 0;
    }
  };

  const contextValue: PCBuilderContextType = {
    state,
    setBuildName,
    addComponent,
    removeComponent,
    clearBuild,
    loadBuild,
    openComponentModal,
    closeComponentModal,
    setLoading,
    setError,
    updateCompatibility,
    getComponentCount,
    getComponentByType,
    canAddMoreComponents,
  };

  return (
    <PCBuilderContext.Provider value={contextValue}>
      {children}
    </PCBuilderContext.Provider>
  );
}

export function usePCBuilder() {
  const context = useContext(PCBuilderContext);
  if (context === undefined) {
    throw new Error("usePCBuilder must be used within a PCBuilderProvider");
  }
  return context;
}
