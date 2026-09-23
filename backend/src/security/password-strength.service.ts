import { Injectable, BadRequestException } from '@nestjs/common';
import zxcvbn from 'zxcvbn';

export interface PasswordStrengthResult {
  score: number; // 0-4
  feedback: string[];
  crackTime: string | number;
  isValid: boolean;
}

@Injectable()
export class PasswordStrengthService {
  private readonly MIN_SCORE = 3; // Minimum score of 3 (strong)

  checkPassword(password: string): PasswordStrengthResult {
    if (!password || password.length === 0) {
      return {
        score: 0,
        feedback: ['Password is required'],
        crackTime: 'instant',
        isValid: false,
      };
    }

    const result = zxcvbn(password);
    
    const feedback: string[] = [];
    
    if (result.score < this.MIN_SCORE) {
      feedback.push('Password is too weak');
    }
    
    if (result.feedback.warning) {
      feedback.push(result.feedback.warning);
    }
    
    feedback.push(...result.feedback.suggestions);

    return {
      score: result.score,
      feedback,
      crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second,
      isValid: result.score >= this.MIN_SCORE,
    };
  }

  validateOrThrow(password: string): void {
    const result = this.checkPassword(password);
    if (!result.isValid) {
      throw new BadRequestException({
        message: 'Password does not meet security requirements',
        errors: result.feedback,
        score: result.score,
      });
    }
  }

  getRequirements(): string[] {
    return [
      'Minimum 8 characters',
      'Mix of uppercase and lowercase letters',
      'At least one number',
      'At least one special character (!@#$%^&*)',
      'Avoid common patterns (123, abc, password, etc.)',
      'Avoid personal information (name, email, birthdate)',
    ];
  }
}