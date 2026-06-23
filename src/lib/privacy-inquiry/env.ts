/** GitHub Pages 정적 배포 빌드 여부 (서버 함수·파일 저장 불가) */
export const isStaticGitHubPages =
  import.meta.env.VITE_GITHUB_PAGES === "true";
