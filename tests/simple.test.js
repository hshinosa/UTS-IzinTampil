// Simple test file to verify Jest setup is working
describe('Basic Test Setup', () => {
  test('should pass a simple test', () => {
    expect(true).toBe(true);
    expect(2 + 2).toBe(4);
  });

  test('should handle async operations', async () => {
    const result = await Promise.resolve('success');
    expect(result).toBe('success');
  });

  test('should handle DOM testing', () => {
    expect(document.createElement('div').tagName).toBe('DIV');
  });

  test('should handle fetch mock', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    const response = await fetch('/api/test');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(fetch).toHaveBeenCalledWith('/api/test');
  });
});
