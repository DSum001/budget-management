import {
  Injectable,
  LoggerService as NestLoggerService,
  LogLevel,
} from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    this.printMessage('log', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.printMessage('error', message, context);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: any, context?: string) {
    this.printMessage('warn', message, context);
  }

  debug(message: any, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      this.printMessage('debug', message, context);
    }
  }

  verbose(message: any, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      this.printMessage('verbose', message, context);
    }
  }

  private printMessage(level: LogLevel, message: any, context?: string) {
    const timestamp = new Date().toISOString();
    const ctx = context || this.context || 'Application';
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] [${ctx}] ${message}`;

    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'debug':
      case 'verbose':
      case 'log':
      default:
        console.log(formattedMessage);
        break;
    }
  }
}
