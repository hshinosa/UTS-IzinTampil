import { GET } from './route';

/**
 * @jest-environment node
 */

// 'describe' mengelompokkan tes-tes yang berhubungan
describe('Admin Summary API Endpoint (/api/admin/summary)', () => {

  // 'it' atau 'test' adalah skenario tes yang spesifik
  it('should return a 200 OK status and correct summary data', async () => {
    
    // 1. EKSEKUSI: Panggil fungsi handler-nya
    // Kita 'await' karena ini fungsi async
    const response = await GET();

    // 2. VERIFIKASI (STATUS):
    // Kita cek apakah status respons-nya adalah 200 (OK)
    expect(response.status).toBe(200);

    // 3. VERIFIKASI (ISI DATA):
    // Kita 'await response.json()' untuk membaca isi datanya
    // Lalu kita cek apakah datanya SAMA PERSIS dengan yang kita definisikan di API dummy
    expect(await response.json()).toEqual({
      totalUsers: 150,
      activeTasks: 45,
    });

  });
});