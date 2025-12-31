import type { Request } from 'express';

/**
 * DEV BYPASS - Always returns true (no gating)
 * Stripe and payment system removed.
 */
export function isDevBypass(_req: Request): boolean {
  return true;
}

export interface OutputResult {
  outputId: string;
  content: string;
  isTruncated: boolean;
  fullWordCount: number;
  previewWordCount: number;
}

/**
 * Store and return output - always returns full output (no gating)
 */
export async function storeAndReturnOutput(
  fullText: string,
  _outputType: string,
  _isPro: boolean,
  _userId: number | null,
  _devBypass: boolean,
  _metadata: Record<string, any> = {}
): Promise<OutputResult> {
  const words = fullText.trim().split(/\s+/);
  const wordCount = words.length;

  return {
    outputId: '',
    content: fullText,
    isTruncated: false,
    fullWordCount: wordCount,
    previewWordCount: wordCount,
  };
}

/**
 * Get output - always returns full content
 */
export async function getFullOutputIfAuthorized(
  _outputId: string,
  _isPro: boolean,
  _userId: number | null,
  _devBypass: boolean = false
): Promise<{ content: string; authorized: boolean; outputType: string } | null> {
  return null;
}
