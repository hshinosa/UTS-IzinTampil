# SonarCloud Integration Setup Guide

## 🔧 Prerequisites

- GitHub account dengan repository `uts-izintampil`
- SonarCloud account ( gratis dengan GitHub auth)
- Repository sudah di-inisialisikan dengan code

## 📋 Setup Steps

### 1. Create SonarCloud Project

1. Buka [SonarCloud.io](https://sonarcloud.io)
2. Sign in dengan **GitHub** account
3. Klik **"+" → Analyze new project**
4. Pilih repository `uts-izintampil`
5. Pilih analysis method (GitHub)
6. Install SonarCloud GitHub App
7. Create project dan dapatkan token

### 2. Configure GitHub Secrets

Di GitHub repository Settings → Secrets and variables → Actions:

```yaml
Secret: SONAR_TOKEN
Value: <copy dari SonarCloud project settings>
```

### 3. Update Configuration

Edit `sonar-project.properties`:

```properties
# Ganti dengan GitHub username kamu
sonar.organization=github-username-kamu

# Project key harus unique
sonar.projectKey=uts-izintampil-analytics
```

## 🚀 Testing Integration

### Local Testing:
```bash
# Run tests dengan coverage
npm run test:coverage

# Lihat coverage folder
ls coverage/ # akan ada lcov.info
```

### CI/CD Testing:
```bash
# Push untuk trigger SonarCloud scan
git add .
git commit -m "feat: add SonarCloud integration"
git push origin main
```

## 📊 Results

### In GitHub Actions:
- Check "Actions" tab → workflow runs
- SonarCloud step akan show analysis progress
- Quality Gate status akan ditampilkan

### In SonarCloud:
- Dashboard di `https://sonarcloud.io/dashboard?id=uts-izintampil-analytics`
- Metrics: Coverage, Bugs, Vulnerabilities, Code Smells
- Pull Request analysis

### In Pull Requests:
- SonarCloud bot akan comment dengan analysis result
- Quality Gate status (PASS/FAIL)
- Coverage percentage
- New code issues identified

## 🔍 Expected Metrics

Untuk Analytics module yang sederhana:

| Metric | Expected Status |
|--------|-----------------|
| Coverage | 60-80% (minimal) |
| Bugs | 0 (no critical bugs) |
| Vulnerabilities | 0 (no security issues) |
| Code Smells | < 5 (clean code) |
| Maintainability | A rating |

## 🛠️ Troubleshooting

### Common Issues:

**1. SONAR_TOKEN error:**
- Check secrets di GitHub repository
- Verify SonarCloud project token
- Ensure correct organization name

**2. Coverage not showing:**
- Ensure `coverage/lcov.info` exists after tests
- Check `.sonar-project.properties` paths
- Verify Jest generates coverage

**3. Quality Gate failure:**
- Check SonarCloud project quality gate settings
- Adjust thresholds if needed
- Fix identified code issues

### Debug Commands:
```bash
# Check SonarCloud configuration
cat sonar-project.properties

# Verify coverage generation
npm run test:coverage && ls -la coverage/

# Test locally with scanner (optional)
npx sonar-scanner \
  -Dsonar.projectKey=uts-izintampil \
  -Dsonar.sources=app \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.token=$SONAR_TOKEN
```

## 📞 Support

- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [GitHub Actions for SonarCloud](https://github.com/SonarSource/sonarcloud-github-action)
- Check project README for additional setup steps

---

**Note**: SonarCloud gratis untuk public repositories, dan $21/bulan untuk private repositories.
