export const MOCK_BOOKINGS = [
  { id: 1, name: '스카이72 골프 & 리조트', location: '인천', time: '06:30', price: '180,000', originalPrice: '250,000', isSpecial: true, isUrgent: true },
  { id: 2, name: '베어즈베스트 청라 GC', location: '인천', time: '07:15', price: '210,000', originalPrice: '280,000', isSpecial: false, isUrgent: false },
  { id: 3, name: '레이크우드 CC', location: '경기 양주', time: '08:00', price: '195,000', originalPrice: '230,000', isSpecial: true, isUrgent: true },
  { id: 4, name: '사우스스프링스 CC', location: '경기 이천', time: '09:20', price: '170,000', originalPrice: '210,000', isSpecial: false, isUrgent: false },
  { id: 5, name: '페럼클럽 CC', location: '경기 여주', time: '11:10', price: '230,000', originalPrice: '290,000', isSpecial: true, isUrgent: true },
  { id: 6, name: '자유 CC', location: '경기 여주', time: '12:40', price: '160,000', originalPrice: '200,000', isSpecial: false, isUrgent: false },
  { id: 7, name: '서원밸리 CC', location: '경기 파주', time: '06:50', price: '240,000', originalPrice: '300,000', isSpecial: true, isUrgent: true },
  { id: 8, name: '타이거 CC', location: '경기 파주', time: '13:20', price: '150,000', originalPrice: '180,000', isSpecial: false, isUrgent: true },
  { id: 9, name: '블루원 용인 CC', location: '경기 용인', time: '08:45', price: '220,000', originalPrice: '260,000', isSpecial: true, isUrgent: false },
  { id: 10, name: '에덴블루 CC', location: '경기 안성', time: '10:30', price: '155,000', originalPrice: '190,000', isSpecial: false, isUrgent: true },
  { id: 11, name: '골든베이 골프&리조트', location: '충남 태안', time: '14:00', price: '165,000', originalPrice: '210,000', isSpecial: true, isUrgent: false },
  { id: 12, name: '세종필드 GC', location: '세종', time: '07:30', price: '185,000', originalPrice: '240,000', isSpecial: false, isUrgent: false },
  { id: 13, name: '크리스탈밸리 CC', location: '경기 가평', time: '09:10', price: '215,000', originalPrice: '270,000', isSpecial: true, isUrgent: true },
  { id: 14, name: '안양 CC', location: '경기 군포', time: '11:40', price: '250,000', originalPrice: '320,000', isSpecial: false, isUrgent: false },
  { id: 15, name: '지산 CC', location: '경기 용인', time: '12:15', price: '190,000', originalPrice: '230,000', isSpecial: true, isUrgent: true },
  { id: 16, name: '솔트베이 GC', location: '경기 시흥', time: '06:10', price: '175,000', originalPrice: '220,000', isSpecial: false, isUrgent: true },
  { id: 17, name: '마이다스밸리 청평', location: '경기 가평', time: '08:20', price: '205,000', originalPrice: '250,000', isSpecial: true, isUrgent: false },
  { id: 18, name: '더플레이어스 GC', location: '강원 춘천', time: '10:00', price: '160,000', originalPrice: '190,000', isSpecial: false, isUrgent: true },
  { id: 19, name: '라데나 GC', location: '강원 춘천', time: '13:45', price: '195,000', originalPrice: '240,000', isSpecial: true, isUrgent: false },
  { id: 20, name: '소노펠리체 CC', location: '강원 홍천', time: '07:45', price: '235,000', originalPrice: '280,000', isSpecial: false, isUrgent: false }
].map((item, index) => ({
  ...item,
  image: `https://picsum.photos/seed/golf${index}/400/300`
}));

export const MOCK_JOINS = [
  { id: 1, name: '스카이72 골프 & 리조트', location: '인천', time: '06:30', price: '180,000', needed: 1, age: '30~40대', gender: '무관', host: '골프왕', status: '모집중' },
  { id: 2, name: '베어즈베스트 청라 GC', location: '인천', time: '07:15', price: '210,000', needed: 2, age: '20~30대', gender: '여성', host: '캐디와니', status: '마감임박' },
  { id: 3, name: '레이크우드 CC', location: '경기 양주', time: '08:00', price: '195,000', needed: 1, age: '40~50대', gender: '남성', host: '버디찬스', status: '모집중' },
  { id: 4, name: '사우스스프링스 CC', location: '경기 이천', time: '09:20', price: '170,000', needed: 2, age: '무관', gender: '무관', host: '이글헌터', status: '모집중' },
  { id: 5, name: '페럼클럽 CC', location: '경기 여주', time: '11:10', price: '230,000', needed: 1, age: '30대', gender: '남성', host: '드라이버샷', status: '마감임박' },
  { id: 6, name: '자유 CC', location: '경기 여주', time: '12:40', price: '160,000', needed: 3, age: '무관', gender: '무관', host: '초보환영', status: '모집중' },
  { id: 7, name: '서원밸리 CC', location: '경기 파주', time: '06:50', price: '240,000', needed: 1, age: '40대', gender: '여성', host: '굿샷', status: '마감' },
  { id: 8, name: '타이거 CC', location: '경기 파주', time: '13:20', price: '150,000', needed: 2, age: '20~40대', gender: '무관', host: '명랑골퍼', status: '모집중' },
  { id: 9, name: '블루원 용인 CC', location: '경기 용인', time: '08:45', price: '220,000', needed: 1, age: '30~50대', gender: '남성', host: '백돌이탈출', status: '마감임박' },
  { id: 10, name: '에덴블루 CC', location: '경기 안성', time: '10:30', price: '155,000', needed: 2, age: '무관', gender: '여성', host: '캐디와니', status: '모집중' },
  { id: 11, name: '골든베이 골프&리조트', location: '충남 태안', time: '14:00', price: '165,000', needed: 1, age: '40대', gender: '무관', host: '홀인원가자', status: '모집중' },
  { id: 12, name: '세종필드 GC', location: '세종', time: '07:30', price: '185,000', needed: 1, age: '30대', gender: '남성', host: '세종피플', status: '마감임박' },
  { id: 13, name: '크리스탈밸리 CC', location: '경기 가평', time: '09:10', price: '215,000', needed: 2, age: '20~30대', gender: '무관', host: '영골퍼', status: '모집중' },
  { id: 14, name: '안양 CC', location: '경기 군포', time: '11:40', price: '250,000', needed: 1, age: '40~50대', gender: '남성', host: '싱글목표', status: '마감' },
  { id: 15, name: '지산 CC', location: '경기 용인', time: '12:15', price: '190,000', needed: 3, age: '무관', gender: '무관', host: '주말골퍼', status: '모집중' },
  { id: 16, name: '솔트베이 GC', location: '경기 시흥', time: '06:10', price: '175,000', needed: 2, age: '30~40대', gender: '여성', host: '아침이슬', status: '모집중' },
  { id: 17, name: '마이다스밸리 청평', location: '경기 가평', time: '08:20', price: '205,000', needed: 1, age: '무관', gender: '남성', host: '캐디와니', status: '마감임박' },
  { id: 18, name: '더플레이어스 GC', location: '강원 춘천', time: '10:00', price: '160,000', needed: 2, age: '20대', gender: '무관', host: '엠지골퍼', status: '모집중' },
  { id: 19, name: '라데나 GC', location: '강원 춘천', time: '13:45', price: '195,000', needed: 1, age: '30~50대', gender: '여성', host: '레이디스', status: '마감임박' },
  { id: 20, name: '소노펠리체 CC', location: '강원 홍천', time: '07:45', price: '235,000', needed: 2, age: '40대', gender: '남성', host: '가을바람', status: '모집중' },
  { id: 21, name: '클럽디 금강', location: '전북 익산', time: '07:20', price: '145,000', needed: 1, age: '30~40대', gender: '남성', host: '익산샷', status: '모집중' },
  { id: 22, name: '해운대비치 CC', location: '부산', time: '08:40', price: '245,000', needed: 2, age: '20~40대', gender: '무관', host: '부산사나이', status: '모집중' },
  { id: 23, name: '제주 엘리시안 CC', location: '제주', time: '13:00', price: '210,000', needed: 1, age: '무관', gender: '여성', host: '제주바람', status: '모집중' },
  { id: 24, name: '한림광릉 CC', location: '경기 남양주', time: '09:50', price: '165,000', needed: 2, age: '30대', gender: '무관', host: '광릉싱글', status: '마감임박' },
  { id: 25, name: '웰리힐리 CC', location: '강원 횡성', time: '06:40', price: '150,000', needed: 1, age: '40대', gender: '남성', host: '강원골퍼', status: '모집중' },
  { id: 26, name: '골프존카운티 선운', location: '전북 고창', time: '08:15', price: '135,000', needed: 3, age: '무관', gender: '무관', host: '명랑골프', status: '모집중' },
  { id: 27, name: '스톤게이트 CC', location: '부산 기장', time: '14:20', price: '190,000', needed: 1, age: '30~40대', gender: '여성', host: '버디러브', status: '마감임박' },
  { id: 28, name: '테디밸리 CC', location: '제주 서귀포', time: '11:30', price: '225,000', needed: 2, age: '무관', gender: '무관', host: '테디베어', status: '모집중' },
  { id: 29, name: '동촌 GC', location: '충북 충주', time: '07:10', price: '160,000', needed: 1, age: '40~50대', gender: '남성', host: '싱글고수', status: '모집중' },
  { id: 30, name: '핀크스 GC', location: '제주', time: '08:50', price: '260,000', needed: 1, age: '30대', gender: '무관', host: '핀크스최고', status: '모집중' },
  { id: 31, name: '스카이72 CC', location: '인천', time: '06:15', price: '175,000', needed: 1, age: '30대', gender: '무관', host: '인천송도', status: '모집중' },
  { id: 32, name: '레이크사이드 CC', location: '경기 용인', time: '07:45', price: '230,000', needed: 2, age: '무관', gender: '여성', host: '레이디스골프', status: '모집중' },
  { id: 33, name: '써닝포인트 CC', location: '경기 용인', time: '08:20', price: '195,000', needed: 1, age: '40대', gender: '남성', host: '써닝파크', status: '모집중' },
  { id: 34, name: '골프존카운티 안성H', location: '경기 안성', time: '09:05', price: '150,000', needed: 2, age: '20~30대', gender: '무관', host: '안성피플', status: '모집중' },
  { id: 35, name: '힐데스하임 CC', location: '충북 제천', time: '12:30', price: '140,000', needed: 3, age: '무관', gender: '무관', host: '제천골퍼', status: '모집중' }
];

export const MOCK_COMMUNITY = [
  { id: 1, author: '캐디와니', role: '인플루언서', time: '10분 전', content: '오늘 베어즈베스트에서 라운딩! 날씨 완전 굿입니다 🌞 모두 즐거운 주말 보내세요! #베어즈베스트 #주말골프', likes: 245, comments: 42, isRecruit: false },
  { id: 2, author: '골프왕', role: 'USER', time: '1시간 전', content: '드디어 백돌이 탈출했습니다ㅠㅠ 사우스스프링스에서 98타 쳤네요! 기념으로 스윙 영상 올립니다. 🏌️‍♂️', likes: 120, comments: 15, isRecruit: false },
  { id: 3, author: '캐디와니', role: '인플루언서', time: '2시간 전', content: '🔥 긴급 조인 모집 🔥 내일 오전 스카이72 같이 가실 1분 모십니다! 그린피 제가 쏩니다! 선착순 1명!', likes: 500, comments: 128, isRecruit: true },
  { id: 4, author: '김프로', role: 'PRO', time: '3시간 전', content: '비거리 20m 늘리는 꿀팁 대방출! 어깨 회전만 신경 쓰시면 됩니다. 자세한 내용은 제 레슨 영상 참고하세요~ ⛳', likes: 310, comments: 22, isRecruit: false },
  { id: 5, author: '명랑골퍼', role: 'USER', time: '5시간 전', content: '페럼클럽 풍경 너무 예쁘네요. 힐링 제대로 하고 갑니다. 조경 1티어 인정!', likes: 85, comments: 8, isRecruit: false },
  { id: 6, author: '버디찬스', role: 'USER', time: '하루 전', content: '새로 산 드라이버 개시! 타구음 미쳤습니다. 핑 G430 강추합니다 🚀', likes: 210, comments: 34, isRecruit: false },
  { id: 7, author: '초보환영', role: 'USER', time: '하루 전', content: '이번주 토요일 타이거 CC 조인 구합니다! 20~30대 명랑골프 치실분 연락주세요.', likes: 45, comments: 12, isRecruit: true },
  { id: 8, author: '이글헌터', role: 'USER', time: '이틀 전', content: '생애 첫 이글!! 서원밸리 3번홀에서 샷이글 들어갔습니다 ㅠㅠ 아직도 손이 떨리네요', likes: 890, comments: 150, isRecruit: false },
  { id: 9, author: '캐디와니', role: '인플루언서', time: '이틀 전', content: '골린이 시절 사진 발견ㅋㅋㅋ 저 때도 장비는 프로급이었네요. 연습만이 살길! 💪', likes: 420, comments: 55, isRecruit: false },
  { id: 10, author: '세종피플', role: 'USER', time: '3일 전', content: '세종필드 그린 스피드 2.8 나옵니다. 방문하실 분들 참고하세요~', likes: 60, comments: 5, isRecruit: false },
  { id: 11, author: '홀인원가자', role: 'USER', time: '3일 전', content: '골든베이 리조트 숙박 패키지 다녀왔는데 가성비 진짜 좋습니다. 1박 2일 추천해요.', likes: 110, comments: 18, isRecruit: false },
  { id: 12, author: '영골퍼', role: 'USER', time: '4일 전', content: '오늘 크리스탈밸리에서 역대급 노을 보고 왔습니다. 골프는 핑계고 경치 구경하러 다니는 듯 🌅', likes: 180, comments: 20, isRecruit: false },
  { id: 13, author: '싱글목표', role: 'USER', time: '4일 전', content: '퍼터 바꿨더니 쓰리펏이 없어졌습니다. 역시 퍼터는 돈값을 하네요 💸', likes: 140, comments: 25, isRecruit: false },
  { id: 14, author: '주말골퍼', role: 'USER', time: '5일 전', content: '지산 CC 일요일 오전 1팀 긴급 양도합니다. 사정이 생겨서 급하게 내놓습니다 ㅠㅠ', likes: 30, comments: 8, isRecruit: true },
  { id: 15, author: '아침이슬', role: 'USER', time: '5일 전', content: '솔트베이 새벽 라운딩 강추합니다. 덥지도 않고 페어웨이 상태도 최상! 👍', likes: 95, comments: 10, isRecruit: false },
  { id: 16, author: '박프로', role: 'PRO', time: '6일 전', content: '체중 이동이 안되는 분들을 위한 초간단 연습법 영상 올렸습니다! 프로필 링크 확인해주세요.', likes: 250, comments: 30, isRecruit: false },
  { id: 17, author: '엠지골퍼', role: 'USER', time: '6일 전', content: '요즘 20대 골퍼들 많이 늘어서 좋네요! 더플레이어스 다녀왔는데 또래분들 많았습니다.', likes: 130, comments: 40, isRecruit: false },
  { id: 18, author: '레이디스', role: 'USER', time: '일주일 전', content: '여성 골프웨어 브랜드 추천해주실 분 계신가요? 너무 화려하지 않은 심플한 스타일 찾아요.', likes: 70, comments: 60, isRecruit: false },
  { id: 19, author: '캐디와니', role: '인플루언서', time: '일주일 전', content: '제주도 골프 투어 다녀왔습니다! 블랙스톤, 나인브릿지 후기 블로그에 올렸어요 ✈️', likes: 580, comments: 85, isRecruit: false },
  { id: 20, author: '가을바람', role: 'USER', time: '일주일 전', content: '소노펠리체 CC 잔디 관리 상태 10점 만점에 10점입니다. 디봇 자국이 없어요 ㄷㄷ', likes: 160, comments: 15, isRecruit: false }
].map((item, index) => ({
  ...item,
  avatar: `https://picsum.photos/seed/user${index}/100/100`,
  image: `https://picsum.photos/seed/post${index}/400/500`
}));

export const MOCK_PARTNERS = MOCK_JOINS.map((join, index) => {
  const smoke = index % 3 === 0 ? '비흡연' : '무관';
  const license = index % 5 === 0 ? '보유' : '무관';
  const maxHandicap = index % 4 === 0 ? 90 : (index % 4 === 1 ? 100 : 120);
  const cost = index % 2 === 0 ? '1/N 결제' : '호스트 부담';
  const date = index % 5 === 4 ? '05/30 (토)' : (index % 2 === 0 ? '05/28 (목)' : '05/29 (금)');
  const description = `${join.host}님이 올린 동반자 모집 공고글입니다. 매너 좋고 명랑한 라운딩을 함께 하실 동반자분 구해요! 끝나고 편하게 인사 나누실 분들 환영합니다. ⛳`;
  const hostProfile = {
    gender: index % 2 === 0 ? '남성' : '여성',
    age: index % 3 === 0 ? '30대' : (index % 3 === 1 ? '40대' : '20대'),
    handicap: 80 + (index * 3) % 25,
    smoke: index % 3 === 0 ? '비흡연' : '흡연',
    license: index % 5 === 0 ? '보유' : '미보유'
  };

  const applicants = index % 3 === 0 
    ? [
        { id: 1, name: '캐디와니', avatar: 'https://picsum.photos/seed/app1/100/100', handicap: 85, gender: '남성', age: '30대', experience: '구력 5년', status: '참여 확정' },
        { id: 2, name: '버디찬스', avatar: 'https://picsum.photos/seed/app2/100/100', handicap: 90, gender: '여성', age: '20대', experience: '구력 2년', status: '대기중' }
      ]
    : index % 3 === 1
      ? [
          { id: 1, name: '이글헌터', avatar: 'https://picsum.photos/seed/app3/100/100', handicap: 95, gender: '남성', age: '40대', experience: '구력 8년', status: '대기중' }
        ]
      : [];

  return {
    id: index + 1,
    title: `[${join.location}] ${join.name} ${join.needed}명 급구합니다!`,
    author: join.host,
    time: `${join.time} 티오프`,
    location: join.location,
    name: join.name,
    needed: join.needed,
    gender: join.gender,
    age: join.age,
    status: join.status,
    views: Math.floor(Math.random() * 500),
    avatar: `https://picsum.photos/seed/partner${index}/100/100`,
    smoke,
    license,
    maxHandicap,
    cost,
    date,
    price: join.price,
    description,
    hostProfile,
    applicants
  };
});

export const MOCK_INFLUENCERS = [
  {
    id: 1,
    name: '캐디와니',
    title: '"골프인플루언서계의 GD"',
    tags: ['#유쾌한라운딩', '#백돌이탈출'],
    description: '안녕하세요! 🏌️‍♂️ 다양한 채널에서 즐거운 골프 라이프를 전하고 있는 캐디와니입니다.\n\n단순히 공만 치는 라운딩이 아니라, 필드에서의 실전 꿀팁과 멘탈 관리법까지 아낌없이 전수해 드립니다. 저와 함께 웃음 끊이지 않는 프리미엄 라운딩을 즐겨보세요!',
    avatar: 'image/1.png',
    cover: 'image/2.png',
    schedule: { location: '스카이72 GC (인천)', time: '이번주 토요일 11:00 티오프', count: 3 }
  },
  {
    id: 2,
    name: '골프여신_제인',
    title: '"스타일리쉬한 명랑 골프"',
    tags: ['#2030골프', '#패셔니스타', '#명랑골프'],
    description: '반갑습니다! 골프웨어 코디부터 스윙 폼 피드백까지 책임지는 제인입니다 ✨\n\n초보분들도 부담 없이 오세요. 사진 이쁘게 찍는 스팟부터 인생샷까지 남겨드릴게요! 저랑 재밌게 라운딩하실 분들 기다릴게요~',
    avatar: 'https://picsum.photos/seed/jane/200/200',
    cover: 'https://picsum.photos/seed/golfcoursejane/800/600',
    schedule: { location: '베어즈베스트 청라 GC', time: '다음주 수요일 07:30 티오프', count: 2 }
  },
  {
    id: 3,
    name: '스윙몬스터',
    title: '"비거리 250m 장타의 정석"',
    tags: ['#비거리증가', '#파워스윙', '#드라이버샷'],
    description: '드라이버 비거리가 고민이신가요? 🚀\n\n제대로 된 체중 이동과 임팩트 타이밍을 필드에서 직접 교정해 드립니다. 시원하게 뻗어나가는 티샷의 짜릿함을 함께 느껴보시죠!',
    avatar: 'https://picsum.photos/seed/swingmonster/200/200',
    cover: 'https://picsum.photos/seed/golfcourseswing/800/600',
    schedule: { location: '사우스스프링스 CC', time: '이번주 일요일 13:00 티오프', count: 1 }
  },
  {
    id: 4,
    name: '김프로',
    title: '"KPGA 정회원, 정석 레슨"',
    tags: ['#1대1레슨', '#숏게임마스터', '#싱글도전'],
    description: 'KPGA 투어 프로 출신 김프로입니다. ⛳\n\n아마추어 분들이 가장 어려워하는 어프로치와 퍼팅 숏게임 노하우를 필드에서 1:1로 밀착 지도합니다. 싱글을 목표로 하신다면 주저 말고 신청하세요.',
    avatar: 'https://picsum.photos/seed/kimpro/200/200',
    cover: 'https://picsum.photos/seed/golfcoursekim/800/600',
    schedule: { location: '서원밸리 CC', time: '다음주 금요일 08:00 티오프', count: 2 }
  }
];

export interface ChatMessage {
  id: number;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

export interface ChatRoom {
  id: string;
  type: 'agent' | 'partner';
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  initialMessages: ChatMessage[];
  autoReplies: string[];
}

export const MOCK_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'agent-1',
    type: 'agent',
    name: '세종 매니저',
    avatar: 'S',
    lastMessage: '네, 고객님! 스카이72 예약 일정 조율 중입니다.',
    time: '오후 3:45',
    unreadCount: 2,
    initialMessages: [
      { id: 1, sender: 'other', text: '안녕하세요! 에브리골프 세종 매니저입니다. 찾으시는 티타임이 있으신가요?', time: '오후 3:30' },
      { id: 2, sender: 'me', text: '네, 05/28 목요일 오전 스카이72 CC 혹시 예약 가능한가요?', time: '오후 3:40' },
      { id: 3, sender: 'other', text: '네, 고객님! 스카이72 예약 일정 조율 중입니다.', time: '오후 3:45' }
    ],
    autoReplies: [
      '확인 감사합니다! 요청하신 시간대로 골프장 예약 확정 후 메시지 드리겠습니다. 잠시만 기다려주세요! ⛳',
      '네, 추가로 더 희망하시는 골프장이나 금액대가 있으시면 편하게 말씀 남겨주세요.'
    ]
  },
  {
    id: 'agent-2',
    type: 'agent',
    name: '지원 매니저',
    avatar: 'J',
    lastMessage: '요청하신 이천 사우스스프링스 예약 확정되었습니다.',
    time: '오전 11:20',
    unreadCount: 0,
    initialMessages: [
      { id: 1, sender: 'me', text: '사우스스프링스 05/29 예약 대기 넣은 것 어떻게 되었나요?', time: '오전 11:00' },
      { id: 2, sender: 'other', text: '요청하신 이천 사우스스프링스 예약 확정되었습니다.', time: '오전 11:20' }
    ],
    autoReplies: [
      '예약 확정 내역은 마이페이지 > 나의 예약 탭에서도 확인하실 수 있습니다. 이용해 주셔서 감사합니다! 😊'
    ]
  },
  {
    id: 'agent-3',
    type: 'agent',
    name: '민지 매니저',
    avatar: 'M',
    lastMessage: '페럼클럽 주말 잔여 티타임 리스트 보내드립니다.',
    time: '어제',
    unreadCount: 0,
    initialMessages: [
      { id: 1, sender: 'other', text: '페럼클럽 주말 잔여 티타임 리스트 보내드립니다.', time: '어제' }
    ],
    autoReplies: [
      '티타임 선점을 원하시면 빠르게 말씀 부탁드립니다. 주말 잔여 티는 실시간 마감률이 매우 높습니다!'
    ]
  },
  {
    id: 'partner-1',
    type: 'partner',
    name: '골프왕',
    avatar: 'https://picsum.photos/seed/partner0/100/100',
    lastMessage: '안녕하세요! 스카이72 조인 신청했습니다. 구력은 어떻게 되시나요?',
    time: '오후 4:10',
    unreadCount: 1,
    initialMessages: [
      { id: 1, sender: 'other', text: '안녕하세요! 스카이72 조인 신청했습니다. 구력은 어떻게 되시나요?', time: '오후 4:10' }
    ],
    autoReplies: [
      '아하, 그렇군요! 저도 비슷한 구력인데 편하게 명랑 골프로 치고 와요! 단톡방 파서 연락드릴게요 🏌️‍♂️',
      '네, 내일 라운딩 때 뵙겠습니다! 조심히 오세요!'
    ]
  },
  {
    id: 'partner-2',
    type: 'partner',
    name: '캐디와니',
    avatar: 'https://picsum.photos/seed/partner1/100/100',
    lastMessage: '네, 그럼 클럽하우스 로비에서 6시까지 뵐게요!',
    time: '오전 9:15',
    unreadCount: 0,
    initialMessages: [
      { id: 1, sender: 'me', text: '내일 티오프 시간 맞춰서 몇 시까지 모일까요?', time: '오전 9:00' },
      { id: 2, sender: 'other', text: '네, 그럼 클럽하우스 로비에서 6시까지 뵐게요!', time: '오전 9:15' }
    ],
    autoReplies: [
      '네, 좋습니다! 내일 뵙겠습니다! ⛳',
      '이따 필드에서 뵈어요~!'
    ]
  },
  {
    id: 'partner-3',
    type: 'partner',
    name: '버디찬스',
    avatar: 'https://picsum.photos/seed/partner2/100/100',
    lastMessage: '레이크우드 CC 티타임 양도 가능할까요?',
    time: '어제',
    unreadCount: 0,
    initialMessages: [
      { id: 1, sender: 'other', text: '레이크우드 CC 티타임 양도 가능할까요?', time: '어제' }
    ],
    autoReplies: [
      '죄송합니다, 방금 양도 대기자가 있어서 먼저 거래 완료되었습니다 ㅠㅠ 다음에 또 기회되면 연락해요!',
      '네, 확인 감사합니다.'
    ]
  }
];
