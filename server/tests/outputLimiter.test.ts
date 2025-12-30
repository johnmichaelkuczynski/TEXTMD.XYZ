import { describe, it, expect } from 'vitest';
import { truncateOutput } from '../outputLimiter';

describe('Output Limiter', () => {
  describe('truncateOutput', () => {
    it('should always truncate to 65% regardless of word count', () => {
      // 500 words -> 65% = 325 words, so it should be truncated
      const words = Array(500).fill('word').join(' ');
      const result = truncateOutput(words);
      
      expect(result.isTruncated).toBe(true);
      expect(result.actualPreviewWordCount).toBeLessThanOrEqual(325); // floor(500 * 0.65)
    });
    
    it('should truncate to 65% for outputs where 65% is less than 1000 words', () => {
      const words = Array(800).fill('word').join(' ');
      const result = truncateOutput(words);
      
      expect(result.isTruncated).toBe(true);
      expect(result.actualPreviewWordCount).toBeLessThanOrEqual(520); // floor(800 * 0.65) = 520
    });
    
    it('should truncate to 1000 words maximum for large outputs', () => {
      const words = Array(5000).fill('word').join(' ');
      const result = truncateOutput(words);
      
      expect(result.isTruncated).toBe(true);
      expect(result.actualPreviewWordCount).toBeLessThanOrEqual(1000);
    });
    
    it('should include upgrade banner in truncated output', () => {
      const words = Array(2000).fill('word').join(' ');
      const result = truncateOutput(words);
      
      expect(result.isTruncated).toBe(true);
      expect(result.preview).toContain('PREVIEW ENDS HERE');
      expect(result.preview).toContain('UNLOCK FULL ACCESS');
      expect(result.preview).toContain('$1/month');
    });
    
    it('should never include full text in preview for truncated outputs', () => {
      const uniqueEndMarker = 'UNIQUE_END_MARKER_12345';
      const words = Array(2000).fill('word').join(' ') + ' ' + uniqueEndMarker;
      const result = truncateOutput(words);
      
      expect(result.isTruncated).toBe(true);
      expect(result.preview).not.toContain(uniqueEndMarker);
    });
    
    it('should respect min(1000, floor(0.65 * total)) formula', () => {
      // Test case: 1200 words -> 65% = 780, min(780, 1000) = 780
      const words1200 = Array(1200).fill('word').join(' ');
      const result1200 = truncateOutput(words1200);
      expect(result1200.actualPreviewWordCount).toBeLessThanOrEqual(780);
      
      // Test case: 2000 words -> 65% = 1300, min(1300, 1000) = 1000
      const words2000 = Array(2000).fill('word').join(' ');
      const result2000 = truncateOutput(words2000);
      expect(result2000.actualPreviewWordCount).toBeLessThanOrEqual(1000);
      
      // Test case: 400 words -> 65% = 260, min(260, 1000) = 260
      const words400 = Array(400).fill('word').join(' ');
      const result400 = truncateOutput(words400);
      expect(result400.isTruncated).toBe(true);
      expect(result400.actualPreviewWordCount).toBeLessThanOrEqual(260);
    });
  });
});

describe('Security: Free users never receive full text', () => {
  it('truncated preview should be shorter than full text', () => {
    const fullText = Array(3000).fill('word').join(' ');
    const result = truncateOutput(fullText);
    
    const previewWithoutBanner = result.preview.split('━━━')[0];
    const previewWordCount = previewWithoutBanner.split(/\s+/).filter(w => w.length > 0).length;
    
    expect(previewWordCount).toBeLessThan(3000);
    expect(previewWordCount).toBeLessThanOrEqual(1000);
  });
});
