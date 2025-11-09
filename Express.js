// backend/api.js (Contoh menggunakan Express.js)
import express from 'express';
import axios from 'axios';

const app = express();
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 
const REPO_OWNER = 'your-org';
const REPO_NAME = 'your-repo';

// Endpoint untuk mendapatkan status build terbaru
app.get('/api/status/builds', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          per_page: 10, // Ambil 10 build terbaru
        },
      }
    );
    // Filter dan kirim data yang relevan ke frontend
    const buildStatuses = response.data.workflow_runs.map(run => ({
      id: run.id,
      status: run.conclusion, // 'success', 'failure', 'pending', etc.
      branch: run.head_branch,
      commit: run.head_commit.id.substring(0, 7),
      url: run.html_url,
    }));

    res.json(buildStatuses);
  } catch (error) {
    console.error('Error fetching GitHub builds:', error.message);
    res.status(500).json({ error: 'Failed to fetch build data' });
  }
});

// Endpoint untuk mendapatkan data coverage (Diasumsikan sudah diproses/disimpan)
app.get('/api/status/coverage', async (req, res) => {
    // Di sini Anda akan membaca data persentase dari database/cache
    // yang diperbarui setelah GHA mengupload report json-summary.json
    res.json({
        lines: 85.5,
        branches: 78.2,
        functions: 90.1,
        last_updated: new Date().toISOString()
    });
});

app.listen(3000, () => console.log('Dashboard API running on port 3000'));