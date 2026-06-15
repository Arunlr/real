/**
 * Suppress warnings from Figma's internal preview system
 * These warnings are from Figma's iframe rendering, not from user code
 */

// Store original console methods
const originalError = console.error;
const originalWarn = console.warn;

// Patterns to suppress (Figma-specific errors)
const suppressPatterns = [
  /Detected multiple Jotai instances/i,
  /multiple renderers concurrently rendering the same context provider/i,
  /figma\.com\/webpack-artifacts/i,
  /code_components_preview_iframe/i,
];

// Check if message should be suppressed
function shouldSuppress(args: any[]): boolean {
  const message = args.join(' ');
  return suppressPatterns.some(pattern => pattern.test(message));
}

// Override console.error
console.error = (...args: any[]) => {
  if (!shouldSuppress(args)) {
    originalError.apply(console, args);
  }
};

// Override console.warn
console.warn = (...args: any[]) => {
  if (!shouldSuppress(args)) {
    originalWarn.apply(console, args);
  }
};

// Export for cleanup if needed
export function restoreConsole() {
  console.error = originalError;
  console.warn = originalWarn;
}
