# 협단체 협약 신청 — Google Sheet + Apps Script 설정

GitHub Pages(정적 호스팅)에서는 서버가 없으므로, 신청 저장·관리자 목록 조회는 **Google Apps Script Web App**을 사용합니다.

## 1. Google Sheet 준비

1. [Google Sheets](https://sheets.google.com)에서 새 스프레드시트를 만듭니다.
2. URL의 시트 ID를 복사합니다. (`/d/{SHEET_ID}/edit`)

## 2. Apps Script 배포

1. 스프레드시트 → **확장 프로그램** → **Apps Script**
2. `docs/google-apps-script-association-applications.js` 내용을 붙여넣습니다.
3. 상수 수정:
   - `SHEET_ID` — 위에서 복사한 ID
   - `ADMIN_TOKEN` — 임의의 긴 비밀 문자열 (관리자 API용)
   - `ADMIN_EMAIL` — 신청 알림 수신 이메일
4. **배포** → **새 배포** → 유형: **웹 앱**
   - 실행: **나**
   - 액세스: **모든 사용자**
5. 배포 URL(`.../exec`)을 복사합니다.

## 3. GitHub Secrets 등록

저장소 **Settings → Secrets and variables → Actions**에서 다음을 추가합니다.

| Secret 이름 | 값 |
|-------------|-----|
| `ASSOCIATION_APPLICATION_API_URL` | GAS 웹 앱 URL (`.../exec`) |
| `ASSOCIATION_ADMIN_TOKEN` | GAS의 `ADMIN_TOKEN`과 동일 |
| `PRIVACY_ADMIN_KEY` | (선택) `/admin` 로그인 비밀번호. 미설정 시 `kcf2026` |

`main` 브랜치에 푸시되면 Actions가 자동으로 다시 빌드·배포합니다.

## 4. 로컬 개발

`.env` 파일 예시:

```env
PRIVACY_ADMIN_KEY=kcf2026
VITE_ASSOCIATION_APPLICATION_API_URL=https://script.google.com/macros/s/.../exec
VITE_ASSOCIATION_ADMIN_TOKEN=your-admin-token
```

GAS URL이 없으면 로컬에서는 `data/association-applications/applications.json`에 저장됩니다.

## 5. 확인

1. https://www.kcf-korea.org/privacy-center/association-apply 에서 테스트 신청
2. https://www.kcf-korea.org/admin/ — 비밀번호 `kcf2026` (또는 설정한 값)
3. **협단체 협약 신청 관리** 탭에서 신청 목록 확인
