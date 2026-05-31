const fs = require('fs');
let content = fs.readFileSync('./src/App.tsx', 'utf8');

// Replace MyPageTabView
const newMyPageTabView = `  const MyPageTabView = () => (
    <div className="pb-32 bg-gray-50 min-h-full flex flex-col w-full overflow-hidden">
       <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 shadow-sm sticky top-0 z-10 flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">마이페이지</h2>
          <button onClick={() => pushView('empty', { type: 'notifications', title: '알림 내역' })} className="text-gray-600 hover:text-gray-900 p-2 shrink-0 bg-gray-50 rounded-full"><Bell size={20}/></button>
       </div>
       
       <div className="bg-white p-6 mb-2 shadow-sm shrink-0 w-full">
          <div className="flex items-center gap-5 mb-8 cursor-pointer group" onClick={() => pushView('empty', { type: 'default', title: '프로필 편집' })}>
            <div className="relative shrink-0">
              <img src="https://picsum.photos/seed/myprofile/200/200" className="w-20 h-20 shrink-0 bg-gray-200 rounded-full object-cover border-4 border-white shadow-md group-hover:border-green-100 transition-colors"/>
              <div className="absolute -bottom-1 -right-1 bg-gray-900 text-white w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-sm shrink-0">
                <Star size={12} fill="currentColor" className="shrink-0"/>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-xl text-gray-900 truncate">김골프 님</h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs shrink-0 font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2.5 py-1 rounded-md shadow-sm">VIP 멤버십</span>
                    <span className="text-xs shrink-0 text-gray-500 font-bold underline underline-offset-2 hover:text-gray-800 transition-colors">혜택 보기</span>
                  </div>
                </div>
                <button className="text-gray-400 shrink-0 group-hover:text-gray-800 group-hover:bg-gray-100 bg-gray-50 p-2 rounded-full transition-colors"><ChevronRight size={18}/></button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 w-full">
            <div onClick={() => pushView('empty', { type: 'default', title: '무료 응모권' })} className="flex-1 min-w-0 bg-gray-50 border border-gray-100 p-4 rounded-2xl text-center cursor-pointer hover:bg-white hover:border-green-300 hover:shadow-md transition-all">
              <p className="text-[11px] sm:text-xs font-bold text-gray-500 mb-1.5 truncate">무료 응모권</p>
              <p className="font-black text-xl sm:text-2xl text-green-600 truncate">3<span className="text-xs sm:text-sm font-medium text-gray-500 ml-0.5">매</span></p>
            </div>
            <div onClick={() => pushView('empty', { type: 'default', title: '할인 쿠폰' })} className="flex-1 min-w-0 bg-gray-50 border border-gray-100 p-4 rounded-2xl text-center cursor-pointer hover:bg-white hover:border-green-300 hover:shadow-md transition-all">
              <p className="text-[11px] sm:text-xs font-bold text-gray-500 mb-1.5 truncate">할인 쿠폰</p>
              <p className="font-black text-xl sm:text-2xl text-blue-600 truncate">2<span className="text-xs sm:text-sm font-medium text-gray-500 ml-0.5">장</span></p>
            </div>
            <div onClick={() => pushView('empty', { type: 'points', title: '포인트' })} className="flex-1 min-w-0 bg-gray-50 border border-gray-100 p-4 rounded-2xl text-center cursor-pointer hover:bg-white hover:border-green-300 hover:shadow-md transition-all">
              <p className="text-[11px] sm:text-xs font-bold text-gray-500 mb-1.5 truncate">포인트</p>
              <p className="font-black text-xl sm:text-2xl text-gray-900 truncate">15K</p>
            </div>
          </div>
       </div>

       <div className="bg-white mb-2 shadow-sm shrink-0 w-full">
          <ul className="divide-y divide-gray-50 w-full">
            {[
              { icon: Calendar, label: '나의 예약 내역', type: 'bookings' },
              { icon: Users, label: '조인 모집/신청 내역', type: 'default', title: '조인 내역' },
              { icon: MapPin, label: '선호 조건 설정', type: 'default', title: '선호 조건 설정' },
              { icon: Heart, label: '찜한 구장', type: 'default', title: '프리미엄 관' },
            ].map((item, i) => (
              <li key={i} onClick={() => pushView('empty', { type: item.type, title: item.title || item.label })} className="p-5 w-full flex justify-between items-center text-sm font-bold text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 shrink-0 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-green-50 group-hover:text-green-600 transition-colors"><item.icon size={18} className="shrink-0"/></div>
                  <span className="truncate">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-300 shrink-0 group-hover:text-green-600"/>
              </li>
            ))}
          </ul>
       </div>
       
       <div className="bg-white shadow-sm shrink-0 w-full">
          <ul className="divide-y divide-gray-50 w-full">
            {[
              { icon: Bell, label: '공지사항', type: 'default', title: '공지사항' },
              { icon: MessageSquare, label: '고객센터 / 1:1 문의', type: 'default', title: '고객센터 / 1:1 문의' },
              { icon: User, label: '계정 설정', type: 'default', title: '계정 설정' },
            ].map((item, i) => (
              <li key={i} onClick={() => pushView('empty', { type: item.type, title: item.title || item.label })} className="p-5 w-full flex justify-between items-center text-sm font-bold text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                   <div className="w-9 h-9 shrink-0 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-900 transition-colors"><item.icon size={18} className="shrink-0"/></div>
                   <span className="truncate">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-300 shrink-0"/>
              </li>
            ))}
          </ul>
       </div>
       <div className="p-8 shrink-0 text-center flex flex-col items-center w-full">
          <div className="text-xl font-black text-gray-300 tracking-tighter mb-2">everygolf</div>
          <div className="text-xs text-gray-400 font-bold">버전 1.2.0 (최신)</div>
          <button onClick={() => showToast('로그아웃 되었습니다.')} className="mt-4 text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600">로그아웃</button>
       </div>
    </div>
  );`;

content = content.replace(/const MyPageTabView = \(\) => \([\s\S]*?\n  \);\n/m, newMyPageTabView + '\n');

// Replace CheckoutView to include companion form
const newCheckoutView = `  const CheckoutView = ({ payload }: { payload: any }) => {
    const [companionCount, setCompanionCount] = useState(3);
    const [agreed, setAgreed] = useState(false);
    return (
    <div className="w-full h-full bg-white flex flex-col relative z-50">
      <TopBarNav title="결제하기" />
      <div className="flex-1 overflow-y-auto p-5">
        <h2 className="text-2xl font-black text-gray-900 mb-6">예약 정보 확인</h2>
        <div className="bg-gray-50 p-5 rounded-2xl mb-8 border border-gray-100 shadow-sm">
          <div className="flex gap-4 items-center">
            <img src={payload.image || 'https://picsum.photos/seed/golf/400/400'} className="w-20 h-20 rounded-xl object-cover shadow-sm" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{payload.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{payload.location} • {payload.time} 티오프</p>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 mb-4 text-lg">동반자 정보 입력</h3>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 shadow-sm">
           <div className="flex justify-between items-center mb-4">
             <span className="text-sm font-bold text-gray-800">동반자 수 (본인 포함)</span>
             <div className="flex items-center gap-4 bg-gray-50 rounded-full px-2 py-1">
               <button onClick={() => setCompanionCount(Math.max(1, companionCount - 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-100"><Minus size={16}/></button>
               <span className="font-bold">{companionCount}명</span>
               <button onClick={() => setCompanionCount(Math.min(4, companionCount + 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-100"><Plus size={16}/></button>
             </div>
           </div>
           <div className="space-y-3 mt-4">
             {Array.from({length: companionCount}).map((_, i) => (
               <div key={i} className="flex gap-2">
                 <input type="text" placeholder={i===0 ? "본인 이름" : \`동반자 \${i} 이름\`} className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 bg-gray-50" />
                 <input type="tel" placeholder={i===0 ? "본인 연락처" : \`동반자 \${i} 연락처\`} className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 bg-gray-50" />
               </div>
             ))}
           </div>
        </div>

        <h3 className="font-bold text-gray-900 mb-4 text-lg">결제 수단</h3>
        <div className="space-y-3 mb-8">
          <label className="flex items-center p-4 border border-green-500 rounded-2xl bg-green-50 cursor-pointer shadow-sm">
            <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-green-600 accent-green-600" />
            <span className="ml-3 font-bold text-gray-900">간편 결제 (등록된 카드)</span>
            <span className="ml-auto text-xs text-green-600 font-bold bg-white px-2 py-1 rounded shadow-sm">추천</span>
          </label>
          <label className="flex items-center p-4 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50">
            <input type="radio" name="payment" className="w-4 h-4 text-gray-900 accent-gray-900" />
            <span className="ml-3 font-medium text-gray-900">신용/체크카드</span>
          </label>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-6 cursor-pointer" onClick={() => setAgreed(!agreed)}>
          <div className={\`w-6 h-6 rounded-full flex items-center justify-center \${agreed ? 'bg-green-500' : 'bg-gray-300'}\`}>
             <CheckCircle2 size={16} className="text-white"/>
          </div>
          <span className="text-sm font-bold text-gray-700">취소 및 환불 규정에 동의합니다. (필수)</span>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <span className="text-lg font-black text-green-600 bg-green-50 px-3 py-1 rounded-xl shadow-sm">결제금액</span>
          <span className="text-3xl font-black text-gray-900">{payload.price}원</span>
        </div>

        <button onClick={() => {
          if(!agreed) return showToast('규정에 동의해주세요.');
          showToast('결제가 성공적으로 진행되었습니다.');
          setTimeout(() => pushView('success', { 
            message: '예약이 확정되었습니다!', 
            subMessage: \`예약 번호: B\${Math.floor(Math.random()*1000000)}\\n상세 내역은 나의 예약에서 확인 가능합니다. 취소는 3일 전까지 수수료 없이 가능합니다.\` 
          }), 500);
        }} className="w-full py-4.5 bg-gray-900 text-white font-black text-lg rounded-2xl shadow-xl hover:bg-gray-800 transition-colors mt-auto">
          {payload.price}원 결제하기
        </button>
      </div>
    </div>
    );
  };`;

content = content.replace(/const CheckoutView = \(\{ payload \}: \{ payload: any \}\) => \{[\s\S]*?\n  \};\n/m, newCheckoutView + '\n');


// Replace EmptyStateView cases to cover MyPage settings and PRD requirements
content = content.replace(/case '월간 BEST 스크린 골프 대회':/g, "case '월간 BEST 스크린 골프 대회':\n      case '무료 응모권':\n      case '할인 쿠폰':");

// Add case for Preference Form and Booking History tabs
const missingEmptyStates = `      case '조인 내역':
        return (
          <div className="w-full h-full bg-gray-50 flex flex-col">
            <TopBarNav title="조인 내역" />
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
              <p className="text-gray-500 font-bold">최근 조인 내역이 없습니다.</p>
            </div>
          </div>
        );
      case '선호 조건 설정':
        return (
          <div className="w-full h-full bg-white flex flex-col">
            <TopBarNav title="나만의 선호 조건" />
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">선호하는 지역 (최대 3개)</label>
                <div className="flex gap-2 flex-wrap">
                  {['서울/경기', '강원', '충청', '경상', '전라', '제주'].map(r => (
                    <span key={r} onClick={(e) => e.currentTarget.classList.toggle('bg-green-500')} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-bold cursor-pointer hover:bg-gray-200 transition-colors">{r}</span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">선호하는 시간대</label>
                <div className="grid grid-cols-2 gap-2">
                  {['새벽 (05~07시)', '오전 (07~12시)', '오후 (12~16시)', '야간 (16시~)'].map(t => (
                    <div key={t} onClick={(e) => e.currentTarget.classList.toggle('border-green-500')} className="border border-gray-200 rounded-xl p-3 text-center cursor-pointer hover:bg-gray-50">
                      <p className="text-sm font-bold text-gray-700">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">1인 그린피 예산 (최대)</label>
                <input type="range" min="100000" max="400000" step="10000" className="w-full accent-green-500" onChange={(e) => e.currentTarget.nextElementSibling.innerHTML = Number(e.target.value).toLocaleString()+'원'}/>
                <p className="text-center font-black text-green-600 mt-2 text-xl">250,000원</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 shrink-0 pb-safe">
              <button onClick={() => { showToast('선호 조건이 저장되었습니다.'); popView(); }} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">저장하기</button>
            </div>
          </div>
        );`;

content = content.replace(/case '새 글 작성':/g, missingEmptyStates + "\n      case '새 글 작성':");

// Replace Booking tabs in EmptyStateView
content = content.replace(/<h3 className="font-bold text-gray-900">다가오는 라운딩<\/h3>/, 
  `<div className="flex gap-2 mb-6">
     <button className="flex-1 bg-gray-900 text-white font-bold py-2 rounded-lg text-sm">예약 완료</button>
     <button className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-2 rounded-lg text-sm">라운딩 종료</button>
     <button className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-2 rounded-lg text-sm">예약 취소</button>
   </div>
   <h3 className="font-bold text-gray-900">다가오는 라운딩</h3>`);


// Notification Push alert PRD requirement
content = content.replace(/'예약이 확정되었습니다'/, "'예약이 확정되었습니다 (예약번호: B77891)'");
content = content.replace(/'찜한 구장의 새로운 특가가 올라왔어요!'/, "'회원님이 설정한 조건에 맞는 특가티가 등록되었습니다'");


fs.writeFileSync('./src/App.tsx', content);
console.log('App.tsx phase 2 rewritten');
