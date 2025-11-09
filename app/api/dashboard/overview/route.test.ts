import { GET } from './route';
/** @jest-environment node */

describe('Dashboard Overview API (/api/dashboard/overview)', () => {
  it('should return 200 OK and correct overview data', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      totalTasks: 120,
      completedTasks: 80,
      inProgressTasks: 30,
      pendingTasks: 10,
    });
  });
});