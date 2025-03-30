/**
 * Log levels for consistent logging across the application
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * Logger configuration options
 */
interface LoggerOptions {
  level: LogLevel;
  prefix?: string;
  timestamp?: boolean;
}

/**
 * Default logger configuration
 */
const defaultOptions: LoggerOptions = {
  level: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
  prefix: '[Leo]',
  timestamp: true
};

/**
 * Logger class for consistent logging across the application
 */
class Logger {
  private options: LoggerOptions;
  private static instance: Logger;

  private constructor(options: Partial<LoggerOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
  }

  /**
   * Gets the singleton instance of the logger
   */
  public static getInstance(options?: Partial<LoggerOptions>): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(options);
    }
    return Logger.instance;
  }

  /**
   * Formats a log message with timestamp and prefix
   */
  private formatMessage(level: LogLevel, message: string): string {
    const parts: string[] = [];
    
    if (this.options.timestamp) {
      parts.push(new Date().toISOString());
    }
    
    if (this.options.prefix) {
      parts.push(this.options.prefix);
    }
    
    parts.push(`[${level.toUpperCase()}]`);
    parts.push(message);
    
    return parts.join(' ');
  }

  /**
   * Logs a debug message
   */
  public debug(message: string, ...args: any[]): void {
    if (this.options.level === LogLevel.DEBUG) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message), ...args);
    }
  }

  /**
   * Logs an info message
   */
  public info(message: string, ...args: any[]): void {
    if ([LogLevel.DEBUG, LogLevel.INFO].includes(this.options.level)) {
      console.info(this.formatMessage(LogLevel.INFO, message), ...args);
    }
  }

  /**
   * Logs a warning message
   */
  public warn(message: string, ...args: any[]): void {
    if ([LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN].includes(this.options.level)) {
      console.warn(this.formatMessage(LogLevel.WARN, message), ...args);
    }
  }

  /**
   * Logs an error message
   */
  public error(message: string, error?: Error, ...args: any[]): void {
    console.error(this.formatMessage(LogLevel.ERROR, message), ...args);
    if (error) {
      console.error(error);
    }
  }

  /**
   * Logs an API error
   */
  public logApiError(error: any, context: string): void {
    this.error(`API Error in ${context}:`, error);
    // Here you could also send the error to an error tracking service
  }

  /**
   * Logs a validation error
   */
  public logValidationError(errors: any[], context: string): void {
    this.warn(`Validation Error in ${context}:`, errors);
  }

  /**
   * Logs a performance metric
   */
  public logPerformance(metric: string, value: number, context: string): void {
    if (this.options.level === LogLevel.DEBUG) {
      this.debug(`Performance [${context}] - ${metric}: ${value}ms`);
    }
  }

  /**
   * Logs a user action
   */
  public logUserAction(action: string, context: string, data?: any): void {
    this.info(`User Action [${context}] - ${action}`, data);
  }
}

/**
 * Export a singleton instance of the logger
 */
export const logger = Logger.getInstance(); 