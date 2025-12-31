import { v4 as uuidv4 } from 'uuid';
import { storage } from './storage';
import type { GeneratedOutput } from '@shared/schema';

export function truncateOutput(fullText: string): { preview: string; isTruncated: boolean; actualPreviewWordCount: number } {
  const words = fullText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  const limit65Percent = Math.floor(wordCount * 0.65);
  const limit = Math.min(limit65Percent, 1000);
  
  if (wordCount <= limit) {
    return { preview: fullText, isTruncated: false, actualPreviewWordCount: wordCount };
  }
  
  const previewWords = words.slice(0, limit);
  let previewText = previewWords.join(' ');
  
  const lastParagraphBreak = previewText.lastIndexOf('\n\n');
  const lastSentenceEnd = Math.max(
    previewText.lastIndexOf('. '),
    previewText.lastIndexOf('.\n'),
    previewText.lastIndexOf('.')
  );
  
  if (lastParagraphBreak > previewText.length * 0.8) {
    previewText = previewText.substring(0, lastParagraphBreak);
  } else if (lastSentenceEnd > previewText.length * 0.7) {
    previewText = previewText.substring(0, lastSentenceEnd + 1);
  }
  
  const remainingWords = wordCount - previewText.split(/\s+/).filter(w => w.length > 0).length;
  
  const upgradeBanner = `

${'━'.repeat(60)}

                    PREVIEW ENDS HERE
                    
   You're viewing ${Math.round((previewText.split(/\s+/).length / wordCount) * 100)}% of this analysis (${remainingWords}+ words remaining)
   
   UNLOCK FULL ACCESS:
   
   Subscribe to Pro for just $1/month
   
   Pro members get:
   - Complete AI analysis reports  
   - Unlimited text reconstructions
   - Full cognitive evaluations
   - Priority processing

${'━'.repeat(60)}`;

  const preview = previewText + upgradeBanner;
  const actualPreviewWordCount = previewText.split(/\s+/).filter(w => w.length > 0).length;
  
  return { preview, isTruncated: true, actualPreviewWordCount };
}

export interface OutputResult {
  outputId: string;
  content: string;
  isTruncated: boolean;
  fullWordCount: number;
  previewWordCount: number;
}

export async function storeAndReturnOutput(
  fullOutput: string,
  outputType: string,
  isPro: boolean,
  userId: number,
  metadata?: Record<string, any>
): Promise<OutputResult> {
  const outputId = uuidv4();
  const { preview, isTruncated, actualPreviewWordCount } = truncateOutput(fullOutput);
  
  const fullWords = fullOutput.split(/\s+/).filter(w => w.length > 0);
  
  await storage.createGeneratedOutput({
    outputId,
    outputType,
    outputFull: fullOutput,
    outputPreview: preview,
    isTruncated,
    userId,
    metadata: metadata || null,
  });
  
  return {
    outputId,
    content: isPro ? fullOutput : preview,
    isTruncated: isPro ? false : isTruncated,
    fullWordCount: fullWords.length,
    previewWordCount: actualPreviewWordCount,
  };
}

export async function getFullOutputIfAuthorized(
  outputId: string,
  isPro: boolean,
  userId: number
): Promise<{ content: string; authorized: boolean; outputType: string } | null> {
  const output = await storage.getGeneratedOutput(outputId);
  if (!output) return null;
  
  if (output.userId !== userId) {
    return null;
  }
  
  if (!isPro && output.isTruncated) {
    return { content: output.outputPreview, authorized: false, outputType: output.outputType };
  }
  
  return { content: output.outputFull, authorized: true, outputType: output.outputType };
}
