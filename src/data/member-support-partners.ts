/** 협력 협단체 회원사 지원 검색·명단 데이터. 기관 추가 시 이 배열에 항목을 추가하세요. */
export type MemberSupportPartner = {
  id: string;
  /** 공식 기관명 */
  name: string;
  /** 검색용 별칭·약칭 (선택) */
  keywords?: string[];
  member: boolean;
  free: boolean;
  discount: boolean;
  available: boolean;
};

export const memberSupportPartners: MemberSupportPartner[] = [
  {
    id: "kfsi",
    name: "한국서비스산업총연합회",
    keywords: ["서비스산업총연합회", "서비스산업"],
    member: true,
    free: true,
    discount: true,
    available: true,
  },
  {
    id: "kswict",
    name: "한국SWICT총연합회",
    keywords: ["SWICT총연합회", "SWICT", "swict"],
    member: true,
    free: true,
    discount: true,
    available: true,
  },
];

export function searchMemberSupportPartners(query: string): MemberSupportPartner[] {
  const q = query.trim().toLowerCase();
  if (!q) return memberSupportPartners;

  return memberSupportPartners.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.keywords?.some((k) => k.toLowerCase().includes(q)),
  );
}

export function formatSupportFlag(value: boolean, yes = "예", no = "아니오") {
  return value ? yes : no;
}
