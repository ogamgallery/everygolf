const fs = require('fs');

let content = fs.readFileSync('./src/App.tsx', 'utf8');

// Replace HomeView
const newHomeView = `  const HomeView = () => (
    <div className="pb-32 flex flex-col w-full overflow-hidden">
      <div className="px-5 pt-12 pb-4 flex justify-between items-center bg-white/90 backdrop-blur-xl sticky top-0 z-10 border-b border-gray-100/50 shadow-sm shrink-0">
        <h1 className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent tracking-tighter cursor-pointer shrink-0" onClick={() => showToast('새로고침 되었습니다.')}>
          everygolf
        </h1>
        <div className="flex gap-3 shrink-0">
          <button onClick={() => pushView('empty', { type: 'search', title: '통합 검색' })} className="relative p-2 shrink-0 text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
            <Search size={20} />
          </button>
          <button onClick={() => pushView('empty', { type: 'notifications', title: '알림 내역' })} className="relative p-2 shrink-0 text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      <div className="px-5 mt-5">
        <div onClick={() => pushView('empty', { type: 'default', title: '월간 BEST 스크린 골프 대회' })} className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden cursor-pointer group aspect-[16/10] flex flex-col justify-end">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/banner/800/600')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
          
          <div className="relative z-10 w-full">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold w-fit mb-3 shadow-sm block">무료 라운딩 응모</span>
            <h2 className="text-2xl sm:text-xl font-bold mb-2 leading-tight drop-shadow-md truncate whitespace-normal">캐디와니 등 인플루언서와 함께하는<br/>무료 라운딩 응모</h2>
            <div className="flex justify-between items-end mt-2">
              <p className="text-xs text-gray-300 font-medium leading-relaxed drop-shadow-md flex-1 pr-2">지금 바로 응모하고 VIP 혜택을 누리세요!<br/>친구 초대 시 추가 응모권 지급</p>
              <button className="bg-white text-gray-900 w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-lg group-hover:bg-green-500 group-hover:text-white transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-5 mt-4">
        <div onClick={() => pushView('empty', { type: 'default', title: '이벤트' })} className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-md relative overflow-hidden cursor-pointer flex justify-between items-center group">
          <div>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">신규 가입 혜택</span>
            <h3 className="font-bold text-sm mt-1 mb-0.5">무료 라운딩 응모권 1매 + 첫 부킹 할인 쿠폰</h3>
            <p className="text-[10px] text-blue-100">가입 즉시 100% 지급! 지금 혜택받기</p>
          </div>
          <ChevronRight size={20} className="text-white/80 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      <div className="px-5 mt-8 grid grid-cols-4 gap-3 w-full">
        {[
          { icon: MapPin, label: '내주변 티', color: 'bg-blue-50 text-blue-600', action: () => { resetToHome('booking'); showToast('현재 위치 기반으로 주변 골프장을 검색 중입니다.'); } },
          { icon: Award, label: '프리미엄', color: 'bg-purple-50 text-purple-600', action: () => pushView('empty', { type: 'default', title: '프리미엄 관' }) },
          { icon: Users, label: '1인 조인', color: 'bg-orange-50 text-orange-600', action: () => { resetToHome('community'); showToast('조인 게시판으로 이동합니다.'); } },
          { icon: Star, label: '리뷰/랭킹', color: 'bg-yellow-50 text-yellow-600', action: () => pushView('empty', { type: 'default', title: '베스트 리뷰' }) },
        ].map((item, idx) => (
          <div key={idx} onClick={item.action} className="flex flex-col items-center gap-2 cursor-pointer group w-full">
            <div className={\`w-full aspect-square max-w-[72px] rounded-2xl flex items-center justify-center \${item.color} transition-colors shadow-sm shrink-0\`}>
              <item.icon size={26} strokeWidth={2.5}/>
            </div>
            <span className="text-xs font-bold text-gray-700 whitespace-nowrap text-center">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="px-0 mt-10 mb-6 w-full overflow-hidden">
        <div className="px-5 flex justify-between items-end mb-4 cursor-pointer group" onClick={() => pushView('map')}>
          <div className="min-w-0 pr-2">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 tracking-tight truncate group-hover:text-green-600 transition-colors">
              ⛳ 나를 위한 맞춤 추천 티타임 <ChevronRight size={20} className="text-gray-400 group-hover:text-green-600"/>
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 font-medium truncate">선호 조건 기반의 강력한 AI 추천</p>
          </div>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-6 px-5 snap-x hide-scrollbar w-full">
          {MOCK_BOOKINGS.slice(0, 5).map(booking => (
            <div key={booking.id} onClick={() => pushView('bookingDetail', booking)} className="w-[260px] shrink-0 bg-white border border-gray-100 p-0 rounded-2xl shadow-sm snap-start overflow-hidden group cursor-pointer hover:shadow-md hover:border-green-300 transition-all flex flex-col">
              <div className="aspect-[2/1] w-full bg-gray-200 relative overflow-hidden shrink-0">
                <img src={booking.image} alt={booking.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm shrink-0 flex items-center gap-1"><Sparkles size={10} className="text-yellow-400"/> 맞춤 98%</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h4 className="font-bold text-gray-900 text-lg truncate flex-1">{booking.name}</h4>
                  <span className="text-[10px] shrink-0 font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md flex items-center"><MapPin size={10} className="mr-1"/>{booking.location}</span>
                </div>
                <p className="text-gray-500 text-sm flex items-center font-medium truncate"><Clock size={14} className="mr-1.5 text-gray-400 shrink-0"/> 오늘 {booking.time}</p>
                <div className="mt-4 flex justify-between items-end border-t border-gray-50 pt-4">
                  <div className="min-w-0 pr-2">
                    <span className="text-[11px] text-gray-400 line-through font-medium block truncate">{booking.originalPrice}원</span>
                    <p className="text-red-500 font-black text-xl tracking-tight leading-none truncate">{booking.price}<span className="text-sm font-bold ml-0.5">원</span></p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); pushView('checkout', booking); }} className="bg-gray-900 shrink-0 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors shadow-md whitespace-nowrap">예약하기</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );`;

content = content.replace(/const HomeView = \(\) => \([\s\S]*?\n  \);\n/m, newHomeView + '\n');

// Replace BookingTabView tabs
content = content.replace(/>할인 부킹<\/button>/, '>일반 부킹</button>');
content = content.replace(/>라운드 조인<\/button>/, '>긴급양도(특가티)</button>');

// Adjust RegionListView to show "수수료 없음", "최저가 보장" labels when mode === '긴급양도(특가티)'
const regionListMatch = content.match(/<span className="text-\[10px\] text-gray-500 font-bold bg-gray-50 px-1\.5 py-0\.5 rounded">{booking\.location}<\/span>/);
if (regionListMatch) {
  content = content.replace(/<span className="text-\[10px\] text-gray-500 font-bold bg-gray-50 px-1\.5 py-0\.5 rounded">{booking\.location}<\/span>/g,
    `<span className="text-[10px] text-gray-500 font-bold bg-gray-50 px-1.5 py-0.5 rounded">{booking.location}</span>
     {mode === '조인' && <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-100">최저가 보장</span>}
     {mode === '조인' && <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">수수료 없음</span>}`);
}

// Ensure AiAgentModal handles input and filtering properly
const newAiModal = `  const AiAgentModal = () => (
    <AnimatePresence>
      {isAiOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={() => setIsAiOpen(false)}>
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} onClick={e => e.stopPropagation()} className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col h-[85vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg"><Sparkles size={20} className="text-white"/></div>
                <div><h3 className="text-lg font-black text-gray-900 tracking-tight">AI 비서</h3><p className="text-xs text-green-600 font-bold">1초 만에 찾아주는 맞춤 티타임</p></div>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
               {aiChatStep >= 0 && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                   <div className="w-8 h-8 shrink-0 bg-gradient-to-tr from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-md"><Sparkles size={14} className="text-white"/></div>
                   <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 text-sm text-gray-800 font-medium leading-relaxed max-w-[85%]">
                     원하시는 조건(날짜/시간/장소/그린피)을 입력해주세요.
                   </div>
                 </motion.div>
               )}
               {aiChatStep >= 1 && (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-end mb-4">
                   <div className="bg-gray-900 text-white p-4 rounded-2xl rounded-tr-sm shadow-md text-sm font-medium">이번주 주말, 수도권, 20만원 이하 티타임 찾아줘</div>
                 </motion.div>
               )}
               {aiChatStep >= 2 && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                   <div className="w-8 h-8 shrink-0 bg-gradient-to-tr from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-md"><Sparkles size={14} className="text-white"/></div>
                   <div className="w-full max-w-[85%]">
                     <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 text-sm text-gray-800 font-medium mb-3">
                       딱 맞는 티타임 3건을 찾았습니다!
                     </div>
                     <div className="space-y-2">
                       {MOCK_BOOKINGS.slice(0, 3).map(b => (
                         <div key={b.id} onClick={() => { setIsAiOpen(false); pushView('bookingDetail', b); }} className="bg-white p-3 rounded-xl border border-gray-200 cursor-pointer flex gap-3 hover:border-green-400">
                           <img src={b.image} className="w-14 h-14 rounded-lg object-cover" />
                           <div className="flex-1">
                             <h4 className="font-bold text-gray-900 text-sm truncate">{b.name}</h4>
                             <p className="text-xs text-gray-500 mt-0.5">{b.location} • {b.time}</p>
                             <p className="text-green-600 font-bold text-sm mt-0.5">{b.price}원</p>
                           </div>
                         </div>
                       ))}
                     </div>
                     <button onClick={() => { setIsAiOpen(false); resetToHome('booking'); }} className="w-full mt-3 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm border border-gray-200 hover:bg-gray-200">모두보기</button>
                   </div>
                 </motion.div>
               )}
            </div>
            <div className="p-4 bg-white border-t border-gray-100 shrink-0 pb-safe">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="조건을 자유롭게 입력해보세요 (예: 내일 오전 제주도)" 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3.5 text-sm font-medium outline-none focus:border-green-500 transition-colors"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && aiChatStep === 0) {
                      e.currentTarget.value = '';
                      setAiChatStep(1);
                    }
                  }}
                />
                <button 
                  onClick={() => { if(aiChatStep === 0) setAiChatStep(1); }}
                  className="bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md hover:bg-green-600 transition-colors"
                ><Send size={18}/></button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );`;

content = content.replace(/const AiAgentModal = \(\) => \([\s\S]*?\n  \);\n/m, newAiModal + '\n');

// Replace CommunityTabView to mix recruit posts into the G-gram feed if isRecruit=true
const newCommunityTabView = `  const CommunityTabView = () => {
    const [subTab, setSubTab] = useState('ggram');
    return (
      <div className="pb-32 bg-gray-50 min-h-full flex flex-col w-full overflow-hidden">
        <div className="bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm shrink-0">
          <div className="px-5 pt-12 pb-2 flex justify-between items-center">
             <h2 className="text-2xl font-bold text-gray-900 tracking-tight">커뮤니티</h2>
             <button onClick={() => pushView('empty', { type: 'default', title: '새 글 작성' })} className="text-gray-900 bg-gray-50 w-9 h-9 shrink-0 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors shadow-sm">
               <Plus size={20} />
             </button>
          </div>
          <div className="flex px-5 gap-6 mt-2">
            <button onClick={() => setSubTab('ggram')} className={\`pb-3 text-sm font-bold border-b-[3px] transition-colors relative whitespace-nowrap \${subTab === 'ggram' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400'}\`}>전체 피드 (SNS)</button>
            <button onClick={() => setSubTab('partner')} className={\`pb-3 text-sm font-bold border-b-[3px] transition-colors relative whitespace-nowrap \${subTab === 'partner' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400'}\`}>동반자 구하기 전용</button>
          </div>
        </div>

        <div className="p-0 flex-1 w-full overflow-hidden">
          <AnimatePresence mode="wait">
            {subTab === 'ggram' ? (
               <motion.div key="ggram" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mt-2 w-full">
                  {MOCK_COMMUNITY.map(post => (
                    <div key={post.id} className="bg-white py-5 shadow-sm border-b border-gray-100 mb-2 w-full">
                      <div className="flex items-center gap-3 px-5 mb-4 w-full">
                        <img src={post.avatar} className="w-11 h-11 shrink-0 bg-gray-200 rounded-full object-cover shadow-sm border border-gray-100 cursor-pointer" onClick={() => showToast('유저 프로필을 불러옵니다.')}/>
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => pushView('postDetail', post)}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-base text-gray-900 truncate">{post.author}</span>
                            {post.role === '인플루언서' && <span className="text-[10px] shrink-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-0.5 rounded-full font-bold shadow-sm flex items-center gap-0.5"><ShieldCheck size={10}/> 인플루언서</span>}
                            {post.role === 'PRO' && <span className="text-[10px] shrink-0 bg-gray-900 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">PRO</span>}
                          </div>
                          <span className="text-xs text-gray-400 font-medium block truncate">{post.time}</span>
                        </div>
                        <button onClick={() => showToast('더보기 메뉴')} className="text-gray-400 shrink-0 hover:text-gray-800 p-2"><ChevronDown size={18}/></button>
                      </div>
                      
                      {post.isRecruit ? (
                         <div onClick={() => pushView('joinDetail', MOCK_JOINS[post.id % MOCK_JOINS.length])} className="mx-5 mb-4 p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 cursor-pointer hover:shadow-md transition-shadow">
                           <div className="flex justify-between items-start mb-2">
                             <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">동반자 모집글</span>
                             <span className="text-xs text-gray-500 font-bold bg-white px-2 py-1 rounded shadow-sm">1/N 결제</span>
                           </div>
                           <h4 className="font-black text-lg text-gray-900 mb-2 leading-snug">{MOCK_JOINS[post.id % MOCK_JOINS.length].name} 급구!</h4>
                           <div className="flex flex-wrap gap-2 mb-3">
                             <span className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded">그린피 {MOCK_JOINS[post.id % MOCK_JOINS.length].price}원</span>
                             <span className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded">{MOCK_JOINS[post.id % MOCK_JOINS.length].gender}</span>
                             <span className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded">{MOCK_JOINS[post.id % MOCK_JOINS.length].age}</span>
                           </div>
                           <button className="w-full bg-green-600 text-white font-bold py-2.5 rounded-xl shadow-sm text-sm">자세히 보기</button>
                         </div>
                      ) : (
                        <div className="w-full aspect-[4/5] bg-gray-100 mb-4 relative cursor-pointer group shrink-0" onDoubleClick={() => toggleLike(post.id)}>
                           <img src={post.image} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                              <Heart size={64} className="text-white drop-shadow-lg scale-0 group-hover:scale-100 transition-transform duration-300" fill="rgba(255,255,255,0.5)"/>
                           </div>
                        </div>
                      )}
                      
                      <div className="px-5 w-full">
                        <div className="flex gap-5 text-gray-800 mb-3">
                          <button onClick={() => toggleLike(post.id)} className={\`flex items-center gap-1.5 text-sm font-medium transition-colors shrink-0 \${likedPosts.includes(post.id) ? 'text-red-500' : 'text-gray-800'}\`}>
                            <Heart size={26} fill={likedPosts.includes(post.id) ? "currentColor" : "none"} strokeWidth={1.5}/>
                          </button>
                          <button onClick={() => pushView('postDetail', post)} className="flex items-center gap-1.5 text-sm font-medium hover:text-gray-500 shrink-0"><MessageSquare size={26} strokeWidth={1.5}/></button>
                          <button onClick={() => showToast('공유하기')} className="flex items-center gap-1.5 text-sm font-medium ml-auto hover:text-gray-500 shrink-0"><Share2 size={24} strokeWidth={1.5}/></button>
                        </div>
                        <p className="text-sm font-bold text-gray-900 mb-2 truncate">좋아요 {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}개</p>
                        <p className="text-sm text-gray-800 mb-2 leading-relaxed break-words whitespace-pre-wrap">
                          <span className="font-bold mr-2 cursor-pointer" onClick={() => showToast('유저 프로필을 불러옵니다.')}>{post.author}</span>
                          {post.content}
                        </p>
                        <p onClick={() => pushView('postDetail', post)} className="text-sm text-gray-400 font-medium cursor-pointer mt-3 hover:text-gray-600 transition-colors inline-block">댓글 {post.comments}개 모두 보기</p>
                      </div>
                    </div>
                  ))}
               </motion.div>
            ) : (
              <motion.div key="partner" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-5 flex flex-col gap-4 w-full">
                 <div className="bg-white p-4 rounded-2xl shadow-sm mb-1 border border-gray-100 shrink-0 w-full">
                   <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5"><Filter size={16} className="shrink-0"/> 상세 조건</p>
                      <button onClick={() => showToast('초기화됨')} className="text-xs shrink-0 text-green-600 font-bold bg-green-50 px-2.5 py-1.5 rounded-lg hover:bg-green-100 transition-colors">초기화</button>
                   </div>
                   <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 w-full snap-x">
                      {['비용 부담', '성별', '연령대', '지역', '날짜'].map((filter, i) => (
                        <div key={i} onClick={() => showToast(\`\${filter} 조건으로 목록을 필터링합니다.\`)} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-100 shadow-sm shrink-0 snap-start">
                          {filter} <ChevronDown size={14} className="shrink-0"/>
                        </div>
                      ))}
                   </div>
                 </div>

                {MOCK_PARTNERS.map((partner, i) => (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={partner.id} onClick={() => pushView('joinDetail', MOCK_JOINS[i % MOCK_JOINS.length])} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-green-300 hover:shadow-md transition-all group shrink-0 w-full flex flex-col">
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <span className="text-xs shrink-0 font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">{partner.time}</span>
                        <span className={\`text-[10px] shrink-0 font-bold px-2 py-1 rounded-md shadow-sm border \${partner.status === '모집중' ? 'bg-green-50 text-green-600 border-green-100' : partner.status === '마감임박' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-100 text-gray-500 border-gray-200'}\`}>{partner.status}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-3 leading-snug group-hover:text-green-600 transition-colors break-words">{partner.title}</h4>
                      <div className="flex flex-wrap gap-2 mb-5">
                        <span className="text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100/50 px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0"><MapPin size={12} className="shrink-0"/> {partner.location}</span>
                        <span className="text-xs font-bold bg-purple-50 text-purple-600 border border-purple-100/50 px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0"><User size={12} className="shrink-0"/> {partner.gender}</span>
                        <span className="text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100/50 px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0"><Award size={12} className="shrink-0"/> {partner.age}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-50 pt-4 gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <img src={partner.avatar} className="w-8 h-8 shrink-0 bg-gray-100 rounded-full object-cover shadow-sm border border-gray-200"/>
                          <div className="min-w-0">
                            <span className="text-sm font-bold text-gray-800 block truncate">{partner.author}</span>
                            <span className="text-[10px] text-gray-400 font-medium block truncate">조회 {partner.views}</span>
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); pushView('chat', partner); }} className="py-2.5 px-4 shrink-0 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-md hover:bg-green-600 transition-colors whitespace-nowrap">연락하기</button>
                      </div>
                   </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };`;

content = content.replace(/const CommunityTabView = \(\) => {[\s\S]*?\n  };\n/m, newCommunityTabView + '\n');


fs.writeFileSync('./src/App.tsx', content);
console.log('App.tsx partially rewritten');
