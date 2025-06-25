// Common user-friendly error messages for the entire system

export const ErrorMessages = {
  // Authentication errors
  AUTH: {
    INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng",
    EMAIL_REQUIRED: "Vui lòng nhập email",
    PASSWORD_REQUIRED: "Vui lòng nhập mật khẩu",
    EMAIL_EXISTS: "Email đã được sử dụng",
    ACCOUNT_DISABLED: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên",
    REGISTRATION_SUCCESS: "Đăng ký tài khoản thành công",
    LOGIN_SUCCESS: "Đăng nhập thành công",
    LOGOUT_SUCCESS: "Đăng xuất thành công",
    TOKEN_EXPIRED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại",
    UNAUTHORIZED: "Bạn không có quyền truy cập",
    FORBIDDEN: "Truy cập bị từ chối",
  },

  // Validation errors
  VALIDATION: {
    REQUIRED_FIELD: "Trường này không được để trống",
    INVALID_EMAIL: "Email không hợp lệ",
    INVALID_PHONE: "Số điện thoại không hợp lệ",
    INVALID_ID: "ID không hợp lệ",
    INVALID_DATA: "Thông tin không hợp lệ. Vui lòng kiểm tra lại",
    PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp",
    WEAK_PASSWORD: "Mật khẩu quá yếu",
    PRICE_INVALID: "Giá phải lớn hơn 0",
    QUANTITY_INVALID: "Số lượng phải lớn hơn 0",
  },

  // Product errors
  PRODUCT: {
    NOT_FOUND: "Không tìm thấy sản phẩm",
    CODE_EXISTS: "Mã sản phẩm đã tồn tại",
    CREATE_SUCCESS: "Tạo sản phẩm thành công",
    UPDATE_SUCCESS: "Cập nhật sản phẩm thành công",
    DELETE_SUCCESS: "Xóa sản phẩm thành công",
    FETCH_ERROR: "Không thể tải danh sách sản phẩm",
    CREATE_ERROR: "Có lỗi xảy ra khi tạo sản phẩm",
    UPDATE_ERROR: "Có lỗi xảy ra khi cập nhật sản phẩm",
    DELETE_ERROR: "Có lỗi xảy ra khi xóa sản phẩm",
    OUT_OF_STOCK: "Sản phẩm đã hết hàng",
    INSUFFICIENT_STOCK: "Không đủ hàng trong kho",
  },

  // Category errors
  CATEGORY: {
    NOT_FOUND: "Không tìm thấy danh mục",
    CODE_EXISTS: "Mã danh mục đã tồn tại",
    CREATE_SUCCESS: "Tạo danh mục thành công",
    UPDATE_SUCCESS: "Cập nhật danh mục thành công",
    DELETE_SUCCESS: "Xóa danh mục thành công",
    FETCH_ERROR: "Không thể tải danh sách danh mục",
    CREATE_ERROR: "Có lỗi xảy ra khi tạo danh mục",
    UPDATE_ERROR: "Có lỗi xảy ra khi cập nhật danh mục",
    DELETE_ERROR: "Có lỗi xảy ra khi xóa danh mục",
    HAS_PRODUCTS: "Không thể xóa danh mục có sản phẩm",
    HAS_CHILDREN: "Không thể xóa danh mục có danh mục con",
  },

  // Brand errors
  BRAND: {
    NOT_FOUND: "Không tìm thấy thương hiệu",
    CODE_EXISTS: "Mã thương hiệu đã tồn tại",
    CREATE_SUCCESS: "Tạo thương hiệu thành công",
    UPDATE_SUCCESS: "Cập nhật thương hiệu thành công",
    DELETE_SUCCESS: "Xóa thương hiệu thành công",
    FETCH_ERROR: "Không thể tải danh sách thương hiệu",
    CREATE_ERROR: "Có lỗi xảy ra khi tạo thương hiệu",
    UPDATE_ERROR: "Có lỗi xảy ra khi cập nhật thương hiệu",
    DELETE_ERROR: "Có lỗi xảy ra khi xóa thương hiệu",
  },

  // Order errors
  ORDER: {
    NOT_FOUND: "Không tìm thấy đơn hàng",
    CREATE_SUCCESS: "Đặt hàng thành công",
    UPDATE_SUCCESS: "Cập nhật đơn hàng thành công",
    CANCEL_SUCCESS: "Hủy đơn hàng thành công",
    FETCH_ERROR: "Không thể tải danh sách đơn hàng",
    CREATE_ERROR: "Có lỗi xảy ra khi đặt hàng",
    UPDATE_ERROR: "Có lỗi xảy ra khi cập nhật đơn hàng",
    CANCEL_ERROR: "Có lỗi xảy ra khi hủy đơn hàng",
    PAYMENT_FAILED: "Thanh toán thất bại",
    PAYMENT_SUCCESS: "Thanh toán thành công",
    EMPTY_CART: "Giỏ hàng trống",
  },

  // User errors
  USER: {
    NOT_FOUND: "Không tìm thấy người dùng",
    UPDATE_SUCCESS: "Cập nhật thông tin thành công",
    UPDATE_ERROR: "Có lỗi xảy ra khi cập nhật thông tin",
    PROFILE_FETCH_ERROR: "Không thể tải thông tin cá nhân",
    PASSWORD_CHANGE_SUCCESS: "Đổi mật khẩu thành công",
    PASSWORD_CHANGE_ERROR: "Có lỗi xảy ra khi đổi mật khẩu",
    CURRENT_PASSWORD_WRONG: "Mật khẩu hiện tại không đúng",
  },

  // System errors
  SYSTEM: {
    INTERNAL_ERROR: "Có lỗi xảy ra trong hệ thống. Vui lòng thử lại sau.",
    DATABASE_ERROR: "Có lỗi xảy ra với cơ sở dữ liệu. Vui lòng thử lại sau.",
    CONNECTION_ERROR: "Hệ thống đang bận, vui lòng thử lại sau ít phút.",
    NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.",
    SERVER_BUSY: "Server đang quá tải. Vui lòng thử lại sau.",
    MAINTENANCE: "Hệ thống đang bảo trì. Vui lòng quay lại sau.",
    UNKNOWN_ERROR: "Có lỗi không xác định xảy ra. Vui lòng thử lại.",
    TIMEOUT: "Quá thời gian chờ. Vui lòng thử lại.",
    REQUEST_TOO_LARGE: "Dữ liệu quá lớn. Vui lòng giảm kích thước.",
    RATE_LIMITED: "Quá nhiều yêu cầu. Vui lòng thử lại sau.",
  },

  // File upload errors
  UPLOAD: {
    FILE_TOO_LARGE: "File quá lớn. Vui lòng chọn file nhỏ hơn.",
    INVALID_FORMAT: "Định dạng file không được hỗ trợ",
    UPLOAD_FAILED: "Tải file lên thất bại. Vui lòng thử lại.",
    NO_FILE: "Vui lòng chọn file",
    MULTIPLE_FILES: "Chỉ được chọn một file",
  },

  // Search errors
  SEARCH: {
    NO_RESULTS: "Không tìm thấy kết quả nào",
    INVALID_QUERY: "Từ khóa tìm kiếm không hợp lệ",
    SEARCH_ERROR: "Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.",
  },

  // Cart errors
  CART: {
    ADD_SUCCESS: "Đã thêm vào giỏ hàng",
    ADD_ERROR: "Có lỗi xảy ra khi thêm vào giỏ hàng",
    UPDATE_SUCCESS: "Cập nhật giỏ hàng thành công",
    UPDATE_ERROR: "Có lỗi xảy ra khi cập nhật giỏ hàng",
    REMOVE_SUCCESS: "Đã xóa khỏi giỏ hàng",
    REMOVE_ERROR: "Có lỗi xảy ra khi xóa khỏi giỏ hàng",
    CLEAR_SUCCESS: "Đã xóa tất cả sản phẩm trong giỏ hàng",
    LOAD_ERROR: "Không thể tải giỏ hàng",
  },
};

// Helper function to get error message by category and key
export function getErrorMessage(
  category: keyof typeof ErrorMessages,
  key: string
): string {
  const categoryMessages = ErrorMessages[category] as Record<string, string>;
  return categoryMessages[key] || ErrorMessages.SYSTEM.UNKNOWN_ERROR;
}

// Helper function to create standardized error response
export function createErrorResponse(
  status: number,
  message: string,
  data?: any
) {
  return {
    success: false,
    status,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

// Helper function to create standardized success response
export function createSuccessResponse(
  message: string,
  data?: any,
  pagination?: any
) {
  return {
    success: true,
    status: 200,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
  };
}

// Helper function to handle common database errors
export function handleDatabaseError(error: any): {
  status: number;
  message: string;
} {
  // Connection errors
  if (
    error.code === "ETIMEDOUT" ||
    error.code === "ECONNREFUSED" ||
    error.code === "ENOTFOUND"
  ) {
    return {
      status: 503,
      message: ErrorMessages.SYSTEM.CONNECTION_ERROR,
    };
  }

  // Duplicate entry errors
  if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
    return {
      status: 409,
      message: "Dữ liệu đã tồn tại",
    };
  }

  // Foreign key constraint errors
  if (error.code === "ER_NO_REFERENCED_ROW_2" || error.errno === 1452) {
    return {
      status: 400,
      message: "Dữ liệu tham chiếu không tồn tại",
    };
  }

  // Parameter binding errors
  if (error.message?.includes("Bind parameters must not contain undefined")) {
    return {
      status: 400,
      message: ErrorMessages.VALIDATION.INVALID_DATA,
    };
  }

  // Default system error
  return {
    status: 500,
    message: ErrorMessages.SYSTEM.INTERNAL_ERROR,
  };
}
