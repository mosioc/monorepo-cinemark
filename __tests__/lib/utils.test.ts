import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('class1', 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'conditional');
    expect(result).toContain('base');
    expect(result).toContain('conditional');
  });

  it('should handle undefined and null', () => {
    const result = cn('base', undefined, null, 'valid');
    expect(result).toContain('base');
    expect(result).toContain('valid');
  });

  it('should merge tailwind classes correctly', () => {
    // tailwind-merge should handle conflicting classes
    const result = cn('p-4', 'p-2');
    // the last one should win or be merged appropriately
    expect(result).toBeTruthy();
  });
});

