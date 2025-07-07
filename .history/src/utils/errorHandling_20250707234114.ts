export const sanitizeErrorMessage = (message: string): string => {
  if (!message) return "Đã có lỗi xảy ra. Vui lòng thử lại.";

  const technicalKeywords = [
    "JDBC",
    "SQL",
    "Exception",
    "NullPointerException",
    "RuntimeException",
    "SQLException",
    "HibernateException",
    "JPA",
    "Hibernate",
    "org.springframework",
    "java.lang",
    "javax.persistence",
    "at com.",
    "at org.",
    "at java.",
    "Caused by:",
    "Stack trace:",
    "stack trace",
    "stacktrace",
  ];

  const containsTechnicalContent = technicalKeywords.some((keyword) =>
    message.toLowerCase().includes(keyword.toLowerCase())
  );

  if (containsTechnicalContent) {
    return "Lỗi server. Vui lòng thử lại sau.";
  }

  return message;
};

export const getErrorMessageByStatus = (
  status: number,
  defaultMessage?: string
): string => {
  switch (status) {
    case 400:
      return "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
    case 401:
      return "Thông tin đăng nhập không chính xác.";
    case 403:
      return "Bạn không có quyền thực hiện hành động này.";
    case 404:
      return "Không tìm thấy thông tin yêu cầu.";
    case 409:
      return "Thông tin đã tồn tại trong hệ thống.";
    case 422:
      return "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
    case 429:
      return "Quá nhiều yêu cầu. Vui lòng thử lại sau.";
    case 500:
    case 502:
    case 503:
    case 504:
      return "Lỗi server. Vui lòng thử lại sau.";
    default:
      return defaultMessage || "Đã có lỗi xảy ra. Vui lòng thử lại.";
  }
};

export const handleApiError = async (response: Response): Promise<string> => {
  try {
    const data = await response.json();
    const rawMessage = data.message || data.error;

    if (rawMessage) {
      const sanitizedMessage = sanitizeErrorMessage(rawMessage);
      return sanitizedMessage;
    }
  } catch {}

  return getErrorMessageByStatus(response.status);
};
