export const MessageLib = {
  TASK: {
    TITLE_REQUIRED: "Title is required",
    TITLE_IS_TO_LANG: "Title is too long",
    DESCRIPTION_IS_TO_LANG: "Description is too long",
    CREATED: "Task created successfully",
    UPDATED: "Task updated successfully",
    DELETED: "Task deleted successfully",
    NOT_FOUND: "Task not found",
    VALIDATION_ERROR: "Task validation error",
  },
  USER: {
    USER_NOT_FOUND: "User not found",
    USER_INVALID_ID: "Invalid user ID",
    USER_DELETED: "User deleted successfully",
    USER_UPDATE_FAILED: "Failed to update user",
    USER_RETRIEVED: "User retrieved successfully",
    USER_UPDATED: "User updated successfully",
  },
  DATE: {
    INVALID_FORMAT: "Invalid date format",
  },
  COMMON: {
    ERROR_OCCURRED: "Error occurred",
    INTERNAL_SERVER_ERROR: "Internal server error",
    INVALID_REQUEST: "Invalid request",
    NOT_FOUND: "Resource not found",
  },
  SERVER: {
    STARTED: "Server started successfully on port",
  },
  JWT: {
    INVALID_TOKEN: "Invalid token",
    EXPIRED_TOKEN: "Expired token",
    SIGNED_TOKEN: "Signed token",
    VERIFIED_TOKEN: "Verified token",
    DECODED_TOKEN: "Decoded token",
    ERROR_VERIFYING_TOKEN: "Error verifying token",
    TOKEN_IS_NOT_VALID: "Token is not valid",
    NO_TOKEN_AUTHORIZATION: "No token authorization denied",
  },
  MIDDLEWARE: {
    UNAUTHORIZED_ACCESS: "Unauthorized access",
    USER_NOT_FOUND: "User not found",
    FORBIDDEN_ACCESS: "Forbidden: Insufficient permissions",
    SERVER_ERROR: "Server error",
  },
  MONGODB: {
    CONNECTED_MONGODB: "Connected to MongoDB",
    DISCONNECTED_MONGODB: "Disconnected from MongoDB",
    ERROR_CONNECTING_MONGODB: "Error connecting to MongoDB",
    ENV_MONGO_URI_NOT_DEFINED: "Environment variable MONGO_URI is not defined",
  },
  AUTH: {
    INVALID_CREDENTIALS: "Invalid credentials",
    USER_LOGIN_SUCCESSFULLY: "User login successfully",
    USER_ALREADY_EXISTS: "User already exists",
    USER_REGISTERED_SUCCESSFULLY: "User registered successfully",
  },
  UTIL: {
    FAILED: "Failed"
  }
};
