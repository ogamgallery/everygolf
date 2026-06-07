import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Calendar, Users, User, Bell, Search, MapPin, 
  Clock, Sparkles, X, ChevronRight, MessageSquare, Heart, Share2, Filter, RotateCcw,
  Star, ChevronDown, Award, Plus, CheckCircle2, AlertCircle, AlertTriangle,
  ChevronLeft, CreditCard, Send, MoreHorizontal, Minus, Crosshair,
  Phone, Mail, SlidersHorizontal, ArrowDown, ArrowUp, Map,
  Flag, UserPlus, CalendarCheck
} from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// --- [Mock Data] ---
import { MOCK_BOOKINGS, MOCK_JOINS, MOCK_COMMUNITY, MOCK_PARTNERS, MOCK_INFLUENCERS, MOCK_CHAT_ROOMS } from './mockData';

interface ViewState {
  id: string;
  type: 'main' | 'bookingDetail' | 'postDetail' | 'partnerDetail' | 'map' | 'empty' | 'checkout' | 'success' | 'chat' | 'influencerProfile' | 'influencerList' | 'regionList' | 'joinDetail' | 'storyForm' | 'login' | 'profileInput' | 'userProfileDetail' | 'chatRoom';
  payload?: any;
}

if (typeof window !== 'undefined') {
  window.onerror = function (message, source, lineno, colno, error) {
    alert(`[런타임 에러 발생]\n메시지: ${message}\n파일: ${source}\n라인: ${lineno}\n콜롬: ${colno}\n에러객체: ${error}`);
    return false;
  };
}
const calendarDays = [
  { date: '05/25', dayName: '월', isWeekend: false, isCurrentMonth: true },
  { date: '05/26', dayName: '화', isWeekend: false, isCurrentMonth: true },
  { date: '05/27', dayName: '수', isWeekend: false, isCurrentMonth: true },
  { date: '05/28', dayName: '목', isWeekend: false, isCurrentMonth: true },
  { date: '05/29', dayName: '금', isWeekend: false, isCurrentMonth: true },
  { date: '05/30', dayName: '토', isWeekend: true, isCurrentMonth: true },
  { date: '05/31', dayName: '일', isWeekend: true, isCurrentMonth: true },
  { date: '06/01', dayName: '월', isWeekend: false, isCurrentMonth: false },
  { date: '06/02', dayName: '화', isWeekend: false, isCurrentMonth: false },
  { date: '06/03', dayName: '수', isWeekend: false, isCurrentMonth: false },
  { date: '06/04', dayName: '목', isWeekend: false, isCurrentMonth: false },
  { date: '06/05', dayName: '금', isWeekend: false, isCurrentMonth: false },
  { date: '06/06', dayName: '토', isWeekend: true, isCurrentMonth: false },
  { date: '06/07', dayName: '일', isWeekend: true, isCurrentMonth: false },
  { date: '06/08', dayName: '월', isWeekend: false, isCurrentMonth: false },
  { date: '06/09', dayName: '화', isWeekend: false, isCurrentMonth: false },
  { date: '06/10', dayName: '수', isWeekend: false, isCurrentMonth: false },
];

interface UserProfile {
  gender: '남성' | '여성';
  handicap: number;
  age: number;
  smoke: '흡연' | '비흡연';
  license: '보유' | '미보유';
}

interface PartnerFilters {
  cost: number;
  gender: string;
  age: string;
  region: string;
  smoke: string;
}

const timeOptions = ['전체 시간', '1부 (06:00~08:00)', '2부 (11:00~14:00)', '3부/야간 (16:00~)'];
const regionOptions = ['전체 지역', '서울/경기', '강원', '충청', '전라', '경상', '제주'];

interface FavoriteFilter {
  id: string;
  name: string;
  filters: PartnerFilters;
}

function EveryGolfApp() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewStack, setViewStack] = useState<ViewState[]>([{ id: 'home-root', type: 'main' }]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => sessionStorage.getItem('admin_auth') === 'true');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [partnerFilters, setPartnerFilters] = useState<PartnerFilters>({
    cost: 350000,
    gender: '전체',
    age: '전체',
    region: '전체',
    smoke: '전체'
  });
  
  const [favoriteFilters, setFavoriteFilters] = useState<FavoriteFilter[]>([
    {
      id: 'fav-1',
      name: '⛳ 인천 여성 1/N',
      filters: { cost: 250000, gender: '여성', age: '전체', region: '인천', smoke: '전체' }
    },
    {
      id: 'fav-2',
      name: '🏌️‍♂️ 경기 30대 명랑',
      filters: { cost: 350000, gender: '무관', age: '30대', region: '경기', smoke: '전체' }
    }
  ]);
  if (false as boolean) console.log(favoriteFilters);
  
  const [showDetailedFilterModal, setShowDetailedFilterModal] = useState(false);
  const [isDiscountSpecialOnly, setIsDiscountSpecialOnly] = useState(false);
  const [userBalls, setUserBalls] = useState(1000);
  const dates = ['05/25 (월)', '05/26 (화)', '05/27 (수)', '05/28 (목)', '05/29 (금)', '05/30 (토)', '05/31 (일)', '06/01 (월)', '06/02 (화)', '06/03 (수)'];

  const [activeTab, setActiveTab] = useState('home');

  // 홈 화면 캐러셀 자동 슬라이드 배너 상태 (5초 주기, 홈 탭 활성화 시에만 동작하도록 최적화)
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  useEffect(() => {
    if (activeTab !== 'home') return;
    
    const timer = setInterval(() => {
      setActiveBannerIndex(prev => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, [activeTab]);

  const [favNameInput, setFavNameInput] = useState('');
  const [partnerList, setPartnerList] = useState<any[]>(MOCK_PARTNERS);
  const [chatRooms, setChatRooms] = useState<any[]>(MOCK_CHAT_ROOMS);
  const [expandedPartnerId, setExpandedPartnerId] = useState<number | null>(null);
  const [showSearchFilter, setShowSearchFilter] = useState(true);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiChatStep, setAiChatStep] = useState(0);
  const [aiQuery, setAiQuery] = useState('이번주 주말, 수도권, 20만원 이하 티타임 찾아줘');
  const [aiInputVal, setAiInputVal] = useState('');
  const [likedPosts, setLikedPosts] = useState<number[]>([1]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // 티타임 찜하기 상태
  const [likedBookings, setLikedBookings] = useState<string[]>([]);
  const [bookingMode, setBookingMode] = useState<'부킹' | '조인'>('부킹');
  const [selectedDate, setSelectedDate] = useState('05/28 (목)');
    
    // 필터 및 모달 상태
    const [showTimeFilter, setShowTimeFilter] = useState(false);
    const [showRegionFilter, setShowRegionFilter] = useState(false);
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    
    
    const [selectedTime, setSelectedTime] = useState('전체 시간');
    const [selectedRegion, setSelectedRegion] = useState('전체 지역');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedJoinFilter, setSelectedJoinFilter] = useState('전체');
    
    // 신규 추가: 검색 필터 화면 토글 및 상세 필터 상태
    const [showDetailFilterSection, setShowDetailFilterSection] = useState(false);
    const [selectedCaddieType, setSelectedCaddieType] = useState('전체');
    
    const [sortBy, setSortBy] = useState<'추천순' | '거리순' | '시간순' | '금액순'>('추천순');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [selectedMinPlayers, setSelectedMinPlayers] = useState<'전체' | '2인이상' | '3인이상' | '4인이상'>('전체');
    const [groupByGolfCourse, setGroupByGolfCourse] = useState<boolean>(true);
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
    const [likedGolfCourses, setLikedGolfCourses] = useState<string[]>([]);
    
    // 선택된 티의 상세 정보 바텀 시트 상태 (골팡 스타일)
    const [activeDetailItem, setActiveDetailItem] = useState<{ type: '부킹' | '조인', data: any } | null>(null);
    // 티 하단 인라인 확장 아코디언 상태
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

    const hasActiveFilters = () => {
      return (
        selectedRegion !== '전체 지역' ||
        selectedTime !== '전체 시간' ||
        selectedCaddieType !== '전체' ||
        selectedMinPlayers !== '전체' ||
        selectedFeatures.length > 0 ||
        searchQuery.trim() !== ''
      );
    };

    const getActiveFilterCount = () => {
      let count = 0;
      if (selectedRegion !== '전체 지역') count++;
      if (selectedTime !== '전체 시간') count++;
      if (selectedCaddieType !== '전체') count++;
      if (selectedMinPlayers !== '전체') count++;
      if (selectedFeatures.length > 0) count += selectedFeatures.length;
      if (searchQuery.trim() !== '') count++;
      return count;
    };

    const getActiveFilterSummary = () => {
      const summary: string[] = [];
      if (selectedRegion !== '전체 지역') summary.push(selectedRegion);
      if (selectedTime !== '전체 시간') summary.push(selectedTime);
      if (selectedCaddieType !== '전체') summary.push(selectedCaddieType);
      if (selectedMinPlayers !== '전체') summary.push(selectedMinPlayers);
      selectedFeatures.forEach(f => summary.push(f));
      if (searchQuery.trim() !== '') summary.push(searchQuery.trim());
      return summary;
    };

    const resetFilters = () => {
      setSelectedTime('전체 시간');
      setSelectedRegion('전체 지역');
      setSearchQuery('');
      setSelectedDate('05/28 (목)');
      setSelectedCaddieType('전체');
      setSelectedJoinFilter('전체');

      
      setSortBy('추천순');
      setSortOrder('asc');
      setSelectedFeatures([]);
      setSelectedMinPlayers('전체');
      setGroupByGolfCourse(!isDiscountSpecialOnly);
      setExpandedGroup(null);
      showToast('필터가 초기화되었습니다.');
    };


    // 화면 전환 시 부모 스크롤 최상단 리셋
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: 'instant' as any });
      }
    }, [showSearchFilter, scrollRef]);
  const toggleLikeBooking = (key: string, name: string) => {
    setLikedBookings(prev => {
      const isLiked = prev.includes(key);
      showToast(isLiked ? `${name} 찜하기를 취소했습니다.` : `${name}을(를) 찜 목록에 추가했습니다.`);
      return isLiked ? prev.filter(k => k !== key) : [...prev, key];
    });
  };

  useEffect(() => {
    if (isAiOpen && aiChatStep === 1) {
      const timer = setTimeout(() => setAiChatStep(2), 1500);
      return () => clearTimeout(timer);
    }
  }, [isAiOpen, aiChatStep]);
  
  
  const pushView = (type: ViewState['type'], payload?: any) => {
    setViewStack(prev => [...prev, { id: Math.random().toString(36).substring(7), type, payload }]);
  };

  const popView = () => {
    if (viewStack.length > 1) {
      setViewStack(prev => prev.slice(0, -1));
    }
  };

  const resetToHome = (tab = 'home') => {
    if (tab === 'booking') {
      setShowSearchFilter(true);
    }
    setActiveTab(tab);
    setViewStack([{ id: 'home-root', type: 'main' }]);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const toggleLike = (id: number) => {
    setLikedPosts(prev => {
      const isLiked = prev.includes(id);
      showToast(isLiked ? '좋아요를 취소했습니다.' : '게시글에 좋아요를 눌렀습니다.');
      return isLiked ? prev.filter(postId => postId !== id) : [...prev, id];
    });
  };

  // --- [Global Components] ---

  const GlobalToast = () => {
    const isError = toastMessage && (
      toastMessage.includes('실패') || 
      toastMessage.includes('올바르지') || 
      toastMessage.includes('오류') || 
      toastMessage.includes('제한') || 
      toastMessage.includes('금지')
    );
    return (
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, x: "-50%" }}
            style={{ left: "50%" }}
            className="absolute bottom-24 w-fit bg-gray-900/90 backdrop-blur-sm text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-xl z-[100] whitespace-nowrap flex items-center gap-2 border border-white/10"
          >
            {isError ? (
              <AlertCircle size={18} className="text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="text-green-400 shrink-0" />
            )}
            <span className="truncate">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const TopBarNav = ({ title, rightIcon, transparent = false }: { title: string, rightIcon?: React.ReactNode, transparent?: boolean }) => (
    <div className={`px-4 pt-12 pb-4 ${transparent ? 'bg-transparent text-white' : 'bg-white text-gray-900 border-b border-gray-100'} sticky top-0 z-10 flex items-center justify-between shrink-0`}>
      <button onClick={popView} className={`p-2 -ml-2 rounded-full transition-colors shrink-0 ${transparent ? 'bg-black/20 hover:bg-black/40 backdrop-blur-md' : 'hover:bg-gray-50'}`}>
        <ChevronLeft size={24} />
      </button>
      <h2 className="text-lg font-bold truncate mx-2 drop-shadow-sm">{title}</h2>
      <div className="w-10 flex justify-end shrink-0">
        {rightIcon}
      </div>
    </div>
  );

  const BottomNav = () => (
    <div className="absolute bottom-0 inset-x-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 flex justify-between pb-safe z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      {[
        { id: 'home', icon: Home, label: '홈' },
        { id: 'booking', icon: CalendarCheck, label: '부킹/조인' },
        { id: 'community', icon: Users, label: '나 홀로 조인' },
        { id: 'chat', icon: MessageSquare, label: '채팅' },
        { id: 'mypage', icon: User, label: '마이페이지' },
      ].map((tab) => (
        <button 
          key={tab.id}
          onClick={() => { 
            if (tab.id === 'booking') {
              setIsDiscountSpecialOnly(false);
              setGroupByGolfCourse(true);
              if (activeTab === 'booking') {
                setSelectedTime('전체 시간');
                setSelectedRegion('전체 지역');
                setSearchQuery('');
                setSelectedDate('05/28 (목)');
                setSelectedCaddieType('전체');
                
                setSortBy('시간순');
                setSortOrder('asc');
                setSelectedFeatures([]);
                setGroupByGolfCourse(true);
                setExpandedGroup(null);
                showToast('필터가 초기화되었습니다.');
              }
              setShowSearchFilter(true);
            }
            setActiveTab(tab.id); 
            if(scrollRef.current) scrollRef.current.scrollTo({top:0, behavior:'smooth'}); 
          }} 
          className="flex-1 pt-3 pb-2 flex flex-col items-center relative"
        >
          {activeTab === tab.id && (
            <motion.div layoutId="bottomNavIndicator" className="absolute top-0 w-12 h-1 bg-green-500 rounded-b-full shadow-[0_2px_5px_rgba(34,197,94,0.5)]" />
          )}
          <tab.icon size={24} className={`transition-colors duration-300 shrink-0 ${activeTab === tab.id ? 'text-green-600' : 'text-gray-400'}`} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          <span className={`text-[10px] mt-1.5 font-bold transition-colors duration-300 ${activeTab === tab.id ? 'text-green-600' : 'text-gray-400'}`}>{tab.label}</span>
        </button>
      ))}
    </div>
  );

  const AiAgentButton = () => (
    <motion.button 
      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      onClick={() => { setIsAiOpen(true); setAiChatStep(0); setAiInputVal(''); }}
      className="absolute bottom-[90px] right-4 w-14 h-14 shrink-0 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-500/40 z-30"
    >
      <Sparkles size={28} className="animate-pulse shrink-0" />
    </motion.button>
  );

  const AiAgentModal = () => (
    <AnimatePresence>
      {isAiOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={() => setIsAiOpen(false)}>
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} onClick={e => e.stopPropagation()} className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col h-[80%]">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg"><Sparkles size={20} className="text-white"/></div>
                <div><h3 className="text-lg font-black text-gray-900 tracking-tight">AI 비서</h3><p className="text-xs text-green-600 font-bold">1초 만에 찾아주는 맞춤 티타임</p></div>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
               {aiChatStep >= 0 && (
                 <div className="space-y-4">
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                     <div className="w-8 h-8 shrink-0 bg-gradient-to-tr from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-md"><Sparkles size={14} className="text-white"/></div>
                     <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 text-sm text-gray-800 font-medium leading-relaxed max-w-[85%]">
                       원하시는 조건(날짜/시간/장소/그린피)을 입력해주세요.
                     </div>
                   </motion.div>
                   
                   {aiChatStep === 0 && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-2 pl-11">
                       <p className="text-xs text-gray-400 font-bold mb-1">💡 이런 질문은 어떠세요?</p>
                       {[
                         "3팀 연속 가능한 티 시간 알려줘.",
                         "여기서 30분 내로 갈 수 있는 골프장 알려줘",
                         "수원내에 있는 골프장 알려줘",
                         "오늘 야간에 10만원 이하 티 알려줘"
                       ].map((q, idx) => (
                         <button
                           key={idx}
                           onClick={() => {
                             setAiQuery(q);
                             setAiChatStep(1);
                           }}
                           className="text-left w-fit bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm transition-all active:scale-[0.98]"
                         >
                           {q}
                         </button>
                       ))}
                     </motion.div>
                   )}
                 </div>
               )}
               {aiChatStep >= 1 && (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-end">
                   <div className="bg-gray-900 text-white p-4 rounded-2xl rounded-tr-sm shadow-md text-sm font-medium max-w-[85%] break-all">{aiQuery}</div>
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
                  value={aiInputVal}
                  onChange={e => setAiInputVal(e.target.value)}
                  placeholder="조건을 자유롭게 입력해보세요 (예: 내일 오전 제주도)" 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3.5 text-sm font-medium outline-none focus:border-green-500 transition-colors"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && aiInputVal.trim() !== '') {
                      setAiQuery(aiInputVal);
                      setAiInputVal('');
                      setAiChatStep(1);
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    if (aiInputVal.trim() !== '') {
                      setAiQuery(aiInputVal);
                      setAiInputVal('');
                      setAiChatStep(1);
                    }
                  }}
                  className="bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md hover:bg-green-600 transition-colors"
                ><Send size={18}/></button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // --- [Depth 2 Views (Dead-ends)] ---

  const SuccessView = ({ payload }: { payload: { message: string, subMessage?: string } }) => (
    <div className="w-full h-full bg-white flex flex-col items-center justify-center px-6">
      <motion.div 
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6"
      >
        <CheckCircle2 size={48} />
      </motion.div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">{payload.message}</h2>
      <p className="text-gray-500 text-center mb-10">{payload.subMessage || '정상적으로 처리되었습니다.'}</p>
      <button onClick={() => resetToHome()} className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-colors">
        홈으로 돌아가기
      </button>
    </div>
  );

  const CheckoutView = ({ payload }: { payload: any }) => (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      <TopBarNav title="결제하기" />
      <div className="flex-1 overflow-y-auto p-5">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
          <h3 className="font-bold text-gray-900 mb-4">예약 정보</h3>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">골프장</span>
            <span className="font-bold text-sm">{payload.name}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">일시</span>
            <span className="font-bold text-sm">오늘 {payload.time}</span>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-gray-900 font-bold">총 결제 금액</span>
            <span className="font-black text-xl text-red-500">{payload.price}원</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-900 mb-4">결제 수단</h3>
           <div className="border border-green-500 bg-green-50 rounded-xl p-4 flex items-center justify-between cursor-pointer">
             <div className="flex items-center gap-2">
               <CreditCard size={20} className="text-green-600"/>
               <span className="font-bold text-green-700 text-sm">every 간편결제</span>
             </div>
             <CheckCircle2 size={18} className="text-green-500"/>
           </div>
        </div>
      </div>
      <div className="p-5 bg-white border-t border-gray-100 shrink-0 pb-safe">
        <button onClick={() => pushView('success', { message: '예약이 확정되었습니다!', subMessage: '상세 내역은 마이페이지에서 확인 가능합니다.' })} className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg">
          {payload.price}원 결제하기
        </button>
      </div>
    </div>
  );

  const ChatView = ({ payload }: { payload: any }) => (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      <TopBarNav title={payload.author} rightIcon={<MoreHorizontal size={20} className="text-gray-400"/>} />
      <div className="bg-white p-3 border-b border-gray-100 flex items-center gap-3 shrink-0 shadow-sm">
        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0"><img src={payload.avatar || 'https://picsum.photos/seed/g/50/50'} className="w-full h-full object-cover"/></div>
        <div>
           <p className="text-xs text-gray-500 font-bold truncate">{payload.title}</p>
           <p className="font-bold text-sm text-gray-900">{payload.location}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <div className="self-center bg-gray-200 text-gray-500 text-[10px] px-3 py-1 rounded-full font-medium">오늘</div>
        <div className="flex gap-2 max-w-[80%]">
          <img src={payload.avatar || 'https://picsum.photos/seed/g/50/50'} className="w-8 h-8 rounded-full bg-gray-200 shrink-0 object-cover"/>
          <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-sm text-sm text-gray-800 shadow-sm">
            안녕하세요! 조인 아직 구하시나요?
          </div>
        </div>
      </div>
      <div className="p-3 bg-white border-t border-gray-100 shrink-0 pb-safe flex gap-2">
        <button onClick={() => showToast('사진 첨부 기능입니다.')} className="p-3 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full shrink-0"><Plus size={20}/></button>
        <input type="text" placeholder="메시지 보내기" className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 text-sm outline-none focus:border-green-500 transition-colors" />
        <button onClick={() => showToast('메시지를 전송했습니다.')} className="p-3 bg-green-500 text-white rounded-full shrink-0 hover:bg-green-600 shadow-md"><Send size={18}/></button>
      </div>
    </div>
  );

  const RegionListView = ({ payload }: { payload: any }) => {
    const { title, mode } = payload;
    return (
      <div className="w-full h-full bg-gray-50 flex flex-col">
        <TopBarNav title={title} transparent={false} />
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="flex justify-between items-end mb-2">
             <p className="text-sm font-bold text-gray-500">총 {mode === '조인' ? MOCK_JOINS.length : MOCK_BOOKINGS.length}건의 결과가 있습니다.</p>
             <button className="text-xs font-bold text-gray-600 flex items-center gap-1 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">시간순 <ChevronDown size={14}/></button>
          </div>
          {mode === '조인' ? (
            MOCK_JOINS.map((join, i) => (
              <div key={i} onClick={() => pushView('joinDetail', join)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-green-300 transition-colors">
                <div className="flex justify-between mb-2">
                   <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{join.needed}명 모집중</span>
                   <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded">{join.location}</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{join.time} {join.name}</h4>
                <div className="mt-4 flex justify-between items-end border-t border-gray-50 pt-3">
                   <div className="flex gap-2 text-[11px] text-gray-500 font-bold">
                     <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{join.age}</span>
                     <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{join.gender}</span>
                   </div>
                   <p className="font-black text-gray-900 text-lg">{join.price}<span className="text-sm font-bold text-gray-500 ml-0.5">원</span></p>
                </div>
              </div>
            ))
          ) : (
            MOCK_BOOKINGS.map((booking, i) => (
              <div key={i} onClick={() => pushView('bookingDetail', booking)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-blue-300 flex gap-4 transition-colors">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0"><img src={booking.image} className="w-full h-full object-cover"/></div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] text-gray-500 font-bold bg-gray-50 px-1.5 py-0.5 rounded">{booking.location}</span>
     {mode === '조인' && <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-100">최저가 보장</span>}
     {mode === '조인' && <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">수수료 없음</span>}
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm truncate leading-tight">{booking.name}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1">{booking.time}</p>
                  </div>
                  <div className="flex justify-between items-end mt-1">
                    <span className="text-[10px] text-gray-400 line-through pr-1 truncate">{booking.originalPrice}원</span>
                    <p className="font-black text-gray-900 shrink-0">{booking.price}<span className="text-xs font-bold text-gray-500 ml-0.5">원</span></p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const JoinDetailView = ({ payload }: { payload: any }) => {
    return (
      <div className="w-full h-full bg-gray-50 flex flex-col">
        <TopBarNav title="조인 상세 정보" transparent={false} />
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-green-50 to-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-md">{payload.needed}명 모집중</span>
              <span className="text-sm font-bold text-gray-500 bg-white border border-gray-200 px-2.5 py-0.5 rounded-md">{payload.location}</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">{payload.name}</h2>
            <p className="text-lg font-bold text-gray-700 flex items-center gap-1.5"><Clock size={18} className="text-gray-400"/> {payload.time} 티오프</p>
          </div>
          <div className="p-6 border-b border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => showToast('호스트 프로필은 준비 중입니다.')}>
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center font-black text-white text-lg shadow-inner border-2 border-white">{payload.host.substring(0,2)}</div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-lg flex items-center gap-1.5">{payload.host} <CheckCircle2 size={16} className="text-blue-500"/></p>
              <p className="text-xs text-gray-500 font-bold mt-0.5">매너온도 <span className="text-orange-500">38.5도</span> • 응답률 95%</p>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </div>
          <div className="p-6 space-y-5">
            <h3 className="font-black text-gray-900 text-lg flex items-center gap-2"><Sparkles size={20} className="text-green-500"/> 모집 조건</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 mb-1 font-bold">연령대</p><p className="font-black text-gray-900 text-base">{payload.age}</p></div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 mb-1 font-bold">성별</p><p className="font-black text-gray-900 text-base">{payload.gender}</p></div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 mb-1 font-bold">예상 1인 그린피</p><p className="font-black text-blue-600 text-base">{payload.price}원</p></div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 mb-1 font-bold">카트/캐디피</p><p className="font-black text-gray-900 text-base">현장 1/N</p></div>
            </div>
            <div className="bg-green-50 p-5 rounded-2xl mt-6 border border-green-100 relative">
              <MessageSquare size={24} className="text-green-200 absolute top-4 right-4" />
              <p className="text-sm text-green-900 font-bold leading-relaxed whitespace-pre-wrap">
                안녕하세요! {payload.time} 티오프입니다.<br/>명랑 골프 치실 분 즐겁게 구합니다. 식사 내기 없이 편하게 치실 분 연락주세요~
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border-t border-gray-100 shrink-0 pb-safe shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
          <button onClick={() => {
            showToast('조인 신청이 전달되었습니다.');
            setTimeout(() => pushView('success', { message: '조인 신청 완료!', subMessage: '호스트에게 조인 신청 메시지를 보냈습니다. 수락 시 푸시 알림을 보내드립니다.' }), 500);
          }} className="w-full py-4.5 bg-gray-900 text-white font-black text-lg rounded-2xl shadow-xl hover:bg-gray-800 transition-colors">
            조인 신청하기
          </button>
        </div>
      </div>
    );
  };

  // --- [Data-Filled Dummy Views] ---

  const EmptyStateView = ({ payload }: { payload: { type: string, title?: string } }) => {
    if (payload.type === 'drawEvent') {
      const [appliedGifts, setAppliedGifts] = useState<Record<string, boolean>>({});

      const getGiftCost = (name: string) => {
        if (name.includes('거리측정기')) return 200;
        return 50;
      };

      const handleApply = (giftName: string) => {
        const cost = getGiftCost(giftName);
        if (userBalls < cost) {
          showToast(`보유하신 응모볼이 부족합니다. (${cost}볼 필요)`);
          return;
        }
        if (appliedGifts[giftName]) {
          showToast('이미 응모 완료된 상품입니다.');
          return;
        }
        setUserBalls(prev => prev - cost);
        setAppliedGifts(prev => ({ ...prev, [giftName]: true }));
        showToast(`'${giftName}' 경품 응모에 성공하였습니다! (${cost}볼 사용)`);
      };

      return (
        <div className="w-full h-full bg-gray-50 flex flex-col">
          <TopBarNav title="데일리 경품 응모" />
          
          <div className="flex-1 overflow-y-auto pb-24 hide-scrollbar">
            {/* 1. 상단 프로모션 배너 */}
            <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-700 text-white px-5 py-6 flex flex-col gap-1 shadow-sm">
              <span className="bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded text-[9.5px] font-black w-fit mb-1 shadow-sm">
                DAILY DRAW EVENT 🎁
              </span>
              <h2 className="text-xl font-black leading-snug tracking-tight">
                매일매일 100% 무료 경품 추첨!<br/>원하는 상품에 즉시 응모하세요
              </h2>
              <p className="text-[10.5px] text-indigo-100/90 font-medium mt-1">
                매일 지급되는 무료 응모볼로 행운의 주인공이 되어보세요.
              </p>
            </div>

            {/* 2. 유저 정보 영역 */}
            <div className="px-5 mt-4">
              <div className="bg-white p-4.5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-bold mb-0.5">나의 응모 가능 볼</p>
                  <p className="text-sm text-gray-800 font-black">에브리골프 가입 회원 혜택</p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl">
                  <span className="text-xs font-black text-amber-600">보유 응모볼</span>
                  <span className="text-lg font-black text-amber-700">{userBalls}볼</span>
                </div>
              </div>
            </div>

            {/* 3. 경품 상품 라인업 목록 */}
            <div className="px-5 mt-5 space-y-4">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5 mb-1">
                <span className="text-indigo-600">●</span> 오늘의 골프 경품 라인업
              </h3>

              {[
                {
                  id: 'gift-1',
                  name: '보이스캐디 TL1 GPS 레이저 거리측정기',
                  brand: '보이스캐디 (Voice Caddie)',
                  desc: '초정밀 0.1초 거리 측정, 핀 어시스트 및 슬로프 오토 보정 탑재로 정확한 비거리를 보장합니다.',
                  count: '1명',
                  applicants: '1,542명',
                  bg: 'from-blue-500 to-indigo-600',
                  img: 'https://picsum.photos/seed/voicecaddie/150/150'
                },
                {
                  id: 'gift-2',
                  name: '테일러메이드 로켓볼즈(RocketBallz) 3피스 공 1더즌',
                  brand: '테일러메이드 (TaylorMade)',
                  desc: '폭발적인 비거리 상승과 명확한 궤적 스핀 컨트롤을 지원하는 3피스 최고급 골프공 세트.',
                  count: '5명',
                  applicants: '3,214명',
                  bg: 'from-emerald-500 to-teal-600',
                  img: 'https://picsum.photos/seed/rocketballz/150/150'
                },
                {
                  id: 'gift-3',
                  name: '타이틀리스트 PRO V1 골프공 3구 패키지',
                  brand: '타이틀리스트 (Titleist)',
                  desc: '세계 프로 골퍼 1위 점유율! 극강의 부드러운 타구감과 탁월한 스핀 유지력을 선물합니다.',
                  count: '10명',
                  applicants: '4,890명',
                  bg: 'from-rose-500 to-red-600',
                  img: 'https://picsum.photos/seed/prov1/150/150'
                }
              ].map(gift => {
                const isApplied = appliedGifts[gift.name];
                return (
                  <div key={gift.id} className="bg-white rounded-2.5xl border border-gray-100 shadow-sm overflow-hidden flex flex-col p-4 gap-4">
                    <div className="flex gap-4">
                      {/* 썸네일 이미지 */}
                      <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center relative">
                        <span className="absolute top-1 left-1 bg-black/60 text-white text-[8px] font-bold px-1 py-0.5 rounded">
                          {gift.count} 추첨
                        </span>
                        <img src={gift.img} alt={gift.name} className="w-full h-full object-cover" />
                      </div>
                      
                      {/* 경품 텍스트 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-1.5 items-center flex-wrap">
                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {gift.brand}
                          </span>
                          <span className="text-[9.5px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 flex items-center gap-0.5">
                            🟡 {getGiftCost(gift.name)}볼 사용
                          </span>
                        </div>
                        <h4 className="font-black text-gray-900 text-sm mt-1 leading-snug truncate">
                          {gift.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed line-clamp-2">
                          {gift.desc}
                        </p>
                      </div>
                    </div>

                    {/* 실시간 응모 현황 및 응모 버튼 */}
                    <div className="flex items-center justify-between pt-3.5 border-t border-gray-50 w-full gap-4">
                      <div className="text-[11px] font-bold text-gray-400">
                        실시간 응모 현황: <span className="text-gray-700 font-extrabold">{gift.applicants}</span>
                      </div>
                      
                      <button
                        type="button"
                        disabled={isApplied}
                        onClick={() => handleApply(gift.name)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                          isApplied
                            ? 'bg-gray-100 text-gray-400 cursor-default'
                            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.97] text-white shadow-sm'
                        }`}
                      >
                        {isApplied ? '응모 완료 ✓' : '즉시 응모하기'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4. 유의사항 영역 */}
            <div className="px-5 mt-6">
              <div className="bg-gray-100 p-4 rounded-xl text-[10.5px] text-gray-500 font-medium space-y-1">
                <p className="font-extrabold text-gray-700 mb-1">■ 데일리 드로우 유의사항</p>
                <p>• 데일리 드로우 응모볼은 회원 등급 및 이벤트 미션 달성에 따라 차등 지급됩니다.</p>
                <p>• 매일 자정에 당첨자 개별 알림 및 푸시 메시지가 발송되며 마이페이지에서 당첨을 확인하실 수 있습니다.</p>
                <p>• 부정한 방법으로 응모 시 당첨이 취소될 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (payload.type === 'notifications') {
        return (
          <div className="w-full h-full bg-white flex flex-col">
            <TopBarNav title="알림 내역" />
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {[
                { icon: Calendar, title: '예약이 확정되었습니다 (예약번호: B77891)', time: '1시간 전', color: 'text-green-500', bg: 'bg-green-50', action: () => pushView('bookingDetail', MOCK_BOOKINGS[0]) },
                { icon: MessageSquare, title: '내 게시글에 새로운 댓글이 달렸습니다', time: '3시간 전', color: 'text-blue-500', bg: 'bg-blue-50', action: () => pushView('postDetail', MOCK_COMMUNITY[0]) },
                { icon: Heart, title: '회원님이 설정한 조건에 맞는 특가티가 등록되었습니다', time: '어제', color: 'text-red-500', bg: 'bg-red-50', action: () => pushView('bookingDetail', MOCK_BOOKINGS[1]) },
              ].map((noti, i) => (
                <div key={i} onClick={noti.action} className="p-4 flex gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className={`w-12 h-12 shrink-0 ${noti.bg} rounded-full flex items-center justify-center`}><noti.icon size={20} className={noti.color}/></div>
                  <div className="flex-1 min-w-0 py-1">
                    <p className="font-bold text-gray-900 text-sm leading-snug mb-1">{noti.title}</p>
                    <p className="text-xs text-gray-500">{noti.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
    if (payload.type === 'bookings') {
        return (
          <div className="w-full h-full bg-gray-50 flex flex-col">
            <TopBarNav title="나의 예약" />
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex gap-2 mb-6">
     <button className="flex-1 bg-gray-900 text-white font-bold py-2 rounded-lg text-sm">예약 완료</button>
     <button className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-2 rounded-lg text-sm">라운딩 종료</button>
     <button className="flex-1 bg-white border border-gray-200 text-gray-600 font-bold py-2 rounded-lg text-sm">예약 취소</button>
   </div>
   <h3 className="font-bold text-gray-900">다가오는 라운딩</h3>
              <div onClick={() => pushView('bookingDetail', MOCK_BOOKINGS[0])} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col cursor-pointer hover:border-green-300 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded">예약확정</span>
                  <span className="text-gray-400 text-xs">내일 오전</span>
                </div>
                <h4 className="font-black text-xl text-gray-900 mb-1">{MOCK_BOOKINGS[0].name}</h4>
                <p className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-1"><MapPin size={14}/> {MOCK_BOOKINGS[0].location} • {MOCK_BOOKINGS[0].time}</p>
                <button className="w-full py-3 bg-gray-50 text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">예약 상세보기</button>
              </div>
              <h3 className="font-bold text-gray-900 pt-4">지난 내역</h3>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center opacity-80 cursor-pointer hover:bg-gray-50" onClick={() => pushView('bookingDetail', MOCK_BOOKINGS[2])}>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{MOCK_BOOKINGS[2].name}</h4>
                  <p className="text-xs text-gray-500">2023.10.15 완료</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); pushView('empty', { type: 'default', title: '새 글 작성' }); }} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">리뷰 작성</button>
              </div>
            </div>
          </div>
        );
    }
    if (payload.type === 'posts') {
        return (
          <div className="w-full h-full bg-gray-50 flex flex-col">
            <TopBarNav title="작성한 글" />
            <div className="flex-1 overflow-y-auto p-5">
              <div onClick={() => pushView('postDetail', MOCK_COMMUNITY[1])} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:border-green-300">
                <div className="flex gap-3 mb-3">
                  <img src={MOCK_COMMUNITY[1].image} className="w-16 h-16 rounded-xl object-cover shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-relaxed">{MOCK_COMMUNITY[1].content}</p>
                    <p className="text-xs text-gray-400 mt-1">{MOCK_COMMUNITY[1].time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 border-t border-gray-50 pt-3 text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-1"><Heart size={14}/> {MOCK_COMMUNITY[1].likes}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={14}/> {MOCK_COMMUNITY[1].comments}</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
    if (payload.type === 'points') {
        return (
          <div className="w-full h-full bg-white flex flex-col">
            <TopBarNav title="포인트 내역" />
            <div className="p-8 text-center bg-gray-50 border-b border-gray-100 shrink-0">
              <p className="text-sm font-bold text-gray-500 mb-2">보유 포인트</p>
              <h2 className="text-4xl font-black text-green-600">15,000<span className="text-xl ml-1">P</span></h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 bg-white flex justify-between items-center border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0"><Plus size={18}/></div>
                  <div><p className="font-bold text-sm text-gray-900">리뷰 작성 보상</p><p className="text-xs text-gray-400">오늘</p></div>
                </div>
                <span className="font-bold text-green-600">+500 P</span>
              </div>
              <div className="p-4 bg-white flex justify-between items-center border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0"><CheckCircle2 size={18}/></div>
                  <div><p className="font-bold text-sm text-gray-900">티타임 결제 사용</p><p className="text-xs text-gray-400">10.15</p></div>
                </div>
                <span className="font-bold text-red-500">-10,000 P</span>
              </div>
            </div>
          </div>
        );
    }
    if (payload.type === 'search') {
      return (
        <div className="w-full h-full bg-white flex flex-col">
            <TopBarNav title="검색 결과" />
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              <h3 className="font-bold text-gray-900 mb-3">검색된 골프장 (3건)</h3>
              <div className="space-y-3 mb-6">
                {MOCK_BOOKINGS.slice(0, 3).map((b, i) => (
                  <div key={i} onClick={() => pushView('bookingDetail', b)} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3 cursor-pointer hover:shadow-md">
                    <img src={b.image} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-900">{b.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{b.location} • {b.price}원</p>
                    </div>
                  </div>
                ))}
              </div>
              <h3 className="font-bold text-gray-900 mb-3">커뮤니티 게시글 (2건)</h3>
              <div className="space-y-3">
                {MOCK_COMMUNITY.slice(0, 2).map((p, i) => (
                  <div key={i} onClick={() => pushView('postDetail', p)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md">
                    <p className="text-sm font-bold mb-1 truncate">{p.author}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{p.content}</p>
                  </div>
                ))}
              </div>
            </div>
        </div>
      )
    }
    
    switch (payload.title) {
      case '월간 BEST 스크린 골프 대회':
      case '무료 응모권':
      case '무료 응모볼':
      case '할인 쿠폰':
        return (
          <div className="w-full h-full bg-white flex flex-col">
            <TopBarNav title="이벤트 상세" />
            <div className="flex-1 overflow-y-auto pb-6">
              <div className="w-full aspect-video bg-gray-900 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-blue-600 opacity-50"></div>
                 <h2 className="text-white text-3xl font-black relative z-10 text-center">BEST 스크린 골프<br/>전국 대회 오픈</h2>
              </div>
              <div className="p-6">
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">진행중</span>
                <h3 className="text-2xl font-black text-gray-900 mt-2 mb-4">총 상금 1,000만원!<br/>숨은 고수를 찾습니다.</h3>
                <p className="text-sm text-gray-600 leading-relaxed">참여 기간: 2026.05.01 ~ 2026.05.31<br/>참여 방법: 전국 모든 스크린 골프장에서 '에브리골프 대회' 채널 입장 후 18홀 완주<br/><br/>우승자에게는 500만원의 상금과 푸짐한 골프 용품을 드립니다. 지금 바로 도전하세요!</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 shrink-0 pb-safe">
              <button onClick={() => { showToast('대회 참여 신청이 완료되었습니다.'); setTimeout(() => pushView('success', { message: '대회 신청 완료!', subMessage: '스크린 골프 대회 참가 신청이 성공적으로 접수되었습니다.' }), 500); }} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-md hover:bg-gray-800 transition-colors">대회 참여하기</button>
            </div>
          </div>
        );
      case 'NEW 신규 파트너를 소개합니다':
        return (
          <div className="w-full h-full bg-gray-50 flex flex-col">
            <TopBarNav title="이달의 신규 파트너" />
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {MOCK_PARTNERS.map((p, i) => (
                <div key={i} onClick={() => pushView('partnerDetail', p)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:border-green-300 transition-colors">
                  <img src={p.avatar} className="w-16 h-16 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{p.author}</h4>
                    <p className="text-xs text-gray-500 mb-1">{p.location} • {p.age}</p>
                    <p className="text-sm text-gray-700 font-medium line-clamp-1">{p.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case '프리미엄 관':
      case '베스트 리뷰':
        const isReview = payload.title === '베스트 리뷰';
        return (
          <div className="w-full h-full bg-gray-50 flex flex-col">
            <TopBarNav title={payload.title} />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isReview ? MOCK_COMMUNITY.map((p, i) => (
                <div key={i} onClick={() => pushView('postDetail', p)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-orange-300 transition-colors">
                  <p className="text-xs font-bold text-orange-500 mb-1">BEST 리뷰</p>
                  <p className="text-sm text-gray-900 font-medium mb-2 line-clamp-2">{p.content}</p>
                  <p className="text-xs text-gray-400 font-bold">{p.author}</p>
                </div>
              )) : MOCK_BOOKINGS.filter(b => parseInt(b.price.replace(/,/g, '')) > 180000).map((b, i) => (
                <div key={i} onClick={() => pushView('bookingDetail', b)} className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 cursor-pointer flex gap-4 hover:border-purple-300 transition-colors">
                  <img src={b.image} className="w-20 h-20 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded font-bold">PREMIUM</span>
                    <h4 className="font-bold text-gray-900 mt-1 truncate">{b.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{b.price}원</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
            case '조인 내역':
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
                <input type="range" min="100000" max="400000" step="10000" className="w-full accent-green-500" onChange={(e) => { if(e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.innerHTML = Number(e.target.value).toLocaleString()+'원'; }}/>
                <p className="text-center font-black text-green-600 mt-2 text-xl">250,000원</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 shrink-0 pb-safe">
              <button onClick={() => { showToast('선호 조건이 저장되었습니다.'); popView(); }} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">저장하기</button>
            </div>
          </div>
        );
      case '새 글 작성':
        return (
          <div className="w-full h-full bg-white flex flex-col">
            <TopBarNav title="게시글 작성" />
            <div className="flex-1 overflow-y-auto p-5">
              <textarea placeholder="오늘의 라운딩은 어떠셨나요? 골프 친구들과 스토리를 공유해 보세요!" className="w-full h-40 outline-none text-base resize-none text-gray-800"></textarea>
              <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => showToast('앨범 열기')}>
                <Plus size={24} />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 shrink-0 pb-safe">
              <button onClick={() => { showToast('게시글이 성공적으로 등록되었습니다.'); popView(); }} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">작성 완료</button>
            </div>
          </div>
        );
      case '동반자 모집글 작성': {
        const [courseName, setCourseName] = useState('');
        const [region, setRegion] = useState('인천');
        const [date, setDate] = useState('05/28 (목)');
        const [time, setTime] = useState('07:00');
        const [price, setPrice] = useState('180,000');
        const [needed, setNeeded] = useState(1);
        const [gender, setGender] = useState('무관');
        const [age, setAge] = useState('무관');
        const [smoke, setSmoke] = useState('무관');
        const [license, setLicense] = useState('무관');
        const [handicap, setHandicap] = useState(120);
        const [description, setDescription] = useState('');

        const handlePublish = () => {
          if (!courseName.trim()) {
            showToast('골프장 이름을 입력해주세요.');
            return;
          }
          const newPost = {
            id: Date.now(),
            title: `[${region}] ${courseName} ${needed}명 급구합니다!`,
            author: userProfile ? '김골프' : '나홀로골퍼',
            time: `${time} 티오프`,
            location: region,
            name: courseName,
            needed: needed,
            gender: gender,
            age: age,
            status: '모집중',
            views: 0,
            avatar: 'https://picsum.photos/seed/myprofile/100/100',
            smoke: smoke,
            license: license,
            maxHandicap: handicap,
            cost: '1/N 결제',
            date: date,
            price: price,
            description: description || `${courseName}에서 즐거운 명랑 라운딩 함께 하실 분들 구합니다!`,
            hostProfile: {
              gender: userProfile?.gender || '남성',
              age: userProfile ? `${Math.floor(userProfile.age / 10) * 10}대` : '30대',
              handicap: userProfile?.handicap || 95,
              smoke: userProfile?.smoke || '비흡연',
              license: userProfile?.license || '미보유'
            }
          };
          setPartnerList(prev => [newPost, ...prev]);
          showToast('동반자 모집글이 등록되었습니다!');
          popView();
        };

        return (
          <div className="w-full h-full bg-white flex flex-col">
            <TopBarNav title="동반자 모집 공고 작성" />
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h4 className="font-black text-gray-900 text-sm border-b border-gray-100 pb-2">기본 라운딩 정보</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">골프장명</label>
                    <input 
                      type="text" 
                      placeholder="예: 스카이72 CC" 
                      value={courseName}
                      onChange={e => setCourseName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:border-green-500 border border-transparent font-bold text-sm text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">지역</label>
                    <select 
                      value={region} 
                      onChange={e => setRegion(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:border-green-500 border border-transparent font-bold text-sm text-gray-900"
                    >
                      {['인천', '경기', '서울', '강원', '충청', '경상', '전라', '제주'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">날짜</label>
                    <select 
                      value={date} 
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-3 py-3 bg-gray-50 rounded-xl outline-none focus:border-green-500 border border-transparent font-bold text-xs text-gray-900"
                    >
                      {['05/28 (목)', '05/29 (금)', '05/30 (토)', '05/31 (일)', '06/01 (월)', '06/02 (화)', '06/03 (수)'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">티오프 시간</label>
                    <input 
                      type="text" 
                      placeholder="예: 07:15" 
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full px-3 py-3 bg-gray-50 rounded-xl outline-none focus:border-green-500 border border-transparent font-bold text-xs text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">그린피 (원)</label>
                    <input 
                      type="text" 
                      placeholder="예: 180,000" 
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      className="w-full px-3 py-3 bg-gray-50 rounded-xl outline-none focus:border-green-500 border border-transparent font-bold text-xs text-gray-900" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">모집 인원 (명)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(num => (
                      <button 
                        key={num}
                        type="button"
                        onClick={() => setNeeded(num)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${needed === num ? 'bg-green-600 border-green-600 text-white font-extrabold' : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'}`}
                      >
                        {num}명
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 필터 기준 설정 */}
              <div className="space-y-4 pt-2">
                <h4 className="font-black text-gray-900 text-sm border-b border-gray-100 pb-2">모집 동반자 조건 설정</h4>
                
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1.5 block">성별 조건</label>
                  <div className="flex gap-2">
                    {['무관', '남성', '여성'].map(g => (
                      <button 
                        key={g} 
                        type="button"
                        onClick={() => setGender(g)} 
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${gender === g ? 'bg-green-600 border-green-600 text-white font-extrabold' : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">연령대 조건</label>
                    <select 
                      value={age} 
                      onChange={e => setAge(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:border-green-500 border border-transparent font-bold text-xs text-gray-900"
                    >
                      {['무관', '20대', '30대', '40대', '50대 이상', '20~30대', '30~40대', '40~50대'].map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">평균 타수 제한</label>
                    <select 
                      value={handicap} 
                      onChange={e => setHandicap(parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:border-green-500 border border-transparent font-bold text-xs text-gray-900"
                    >
                      <option value={120}>제한 없음 (120타 이하)</option>
                      <option value={100}>백돌이 이하 (100타 이하)</option>
                      <option value={90}>보기 플레이어 이하 (90타 이하)</option>
                      <option value={80}>싱글 이하 (80타 이하)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1.5 block">흡연 조건</label>
                    <div className="flex gap-2">
                      {['무관', '비흡연'].map(s => (
                        <button 
                          key={s} 
                          type="button"
                          onClick={() => setSmoke(s)} 
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${smoke === s ? 'bg-green-600 border-green-600 text-white font-extrabold' : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1.5 block">자격증 조건 (프로인증)</label>
                    <div className="flex gap-2">
                      {['무관', '보유'].map(l => (
                        <button 
                          key={l} 
                          type="button"
                          onClick={() => setLicense(l)} 
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${license === l ? 'bg-green-600 border-green-600 text-white font-extrabold' : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'}`}
                        >
                          {l === '보유' ? '프로만' : '무관'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 모집 내용 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 mb-1 block">모집 상세 내용 (사연)</label>
                <textarea 
                  placeholder="모집 사연이나 특별한 선호 조건(예: 식사는 각자 대접, 명랑 골프 지향 등)을 적어주세요." 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full h-32 outline-none text-sm p-4 bg-gray-50 rounded-xl border border-transparent focus:border-green-500 transition-colors resize-none text-gray-800"
                ></textarea>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 shrink-0 pb-safe">
              <button 
                onClick={handlePublish} 
                className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-md transition-colors"
              >
                모집글 등록하기
              </button>
            </div>
          </div>
        );
      }
      case '프로필 편집':
        return (
          <div className="w-full h-full bg-white flex flex-col">
            <TopBarNav title="프로필 수정" />
            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex justify-center mb-6">
                <div className="relative cursor-pointer group" onClick={() => showToast('프로필 사진 변경')}>
                  <img src="https://picsum.photos/seed/myprofile/200/200" className="w-24 h-24 rounded-full object-cover border border-gray-100" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm group-hover:bg-gray-50"><Plus size={16} className="text-gray-600"/></div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">닉네임</label>
                  <input type="text" defaultValue="김골프" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:border-green-500 border border-transparent transition-colors font-bold text-gray-900" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">한 줄 소개</label>
                  <input type="text" placeholder="나를 표현할 한 줄을 적어주세요." className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:border-green-500 border border-transparent transition-colors text-sm text-gray-800" />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 shrink-0 pb-safe">
              <button onClick={() => { showToast('프로필이 저장되었습니다.'); popView(); }} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">저장하기</button>
            </div>
          </div>
        );
      case '결제 수단 관리':
        return (
          <div className="w-full h-full bg-gray-50 flex flex-col">
            <TopBarNav title="결제 수단 관리" />
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <p className="text-xs font-bold text-gray-300 mb-6">주 결제 카드</p>
                <div className="flex justify-between items-end">
                  <h3 className="text-xl font-bold tracking-widest text-gray-100">**** **** **** 1234</h3>
                  <span className="font-black italic text-gray-300">VISA</span>
                </div>
              </div>
              <div onClick={() => showToast('새 카드 등록 화면으로 이동합니다.')} className="bg-white border border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Plus size={24} className="mx-auto text-gray-400 mb-2"/>
                <p className="text-sm font-bold text-gray-600">새 결제 수단 등록</p>
              </div>
            </div>
          </div>
        );
      case '이벤트':
      case '공지사항':
        const isNotice = payload.title === '공지사항';
        return (
          <div className="w-full h-full bg-white flex flex-col">
            <TopBarNav title={payload.title} />
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {[1,2,3,4,5].map(i => (
                <div key={i} onClick={() => showToast('상세 내용을 불러옵니다.')} className="p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded mb-2 inline-block ${isNotice ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-500'}`}>{isNotice ? '안내' : '이벤트'}</span>
                  <p className="font-bold text-gray-900 mb-1 leading-snug">{isNotice ? `에브리골프 서비스 약관 개정 안내 (V1.${i})` : `[종료 임박] 5월 특별한 친구 초대 혜택! (${i}차)`}</p>
                  <p className="text-xs text-gray-400 font-medium">2026.05.0{i}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case '고객센터 / 1:1 문의':
        return (
          <div className="w-full h-full bg-gray-50 flex flex-col">
            <TopBarNav title="고객센터" />
            <div className="flex-1 overflow-y-auto p-5">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">자주 묻는 질문 (FAQ)</h3>
              <div className="space-y-3">
                {['예약 취소는 어떻게 하나요?', '조인 신청 후 취소 위약금이 있나요?', '포인트 적립 기준이 궁금합니다.', '파트너 등록은 어떻게 하나요?'].map((q, i) => (
                  <div key={i} onClick={() => showToast('답변 상세가 펼쳐집니다.')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <p className="text-sm font-bold text-gray-800">{q}</p>
                    <ChevronDown size={16} className="text-gray-400 shrink-0"/>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-white shrink-0 pb-safe shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
              <button onClick={() => showToast('상담원 1:1 채팅으로 연결됩니다.')} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-md"><MessageSquare size={18}/> 1:1 문의하기</button>
            </div>
          </div>
        );
      case '계정 설정':
        return (
          <div className="w-full h-full bg-gray-50 flex flex-col">
            <TopBarNav title="환경설정" />
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-500 mb-3 ml-2">알림 설정</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800">푸시 알림 수신</span>
                    <div className="w-12 h-7 bg-green-500 rounded-full relative cursor-pointer transition-colors" onClick={(e) => { e.currentTarget.classList.toggle('bg-green-500'); e.currentTarget.classList.toggle('bg-gray-300'); e.currentTarget.children[0].classList.toggle('translate-x-5'); }}><div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform translate-x-5 shadow-sm"></div></div>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800">마케팅 정보 수신 동의</span>
                    <div className="w-12 h-7 bg-gray-300 rounded-full relative cursor-pointer transition-colors" onClick={(e) => { e.currentTarget.classList.toggle('bg-gray-300'); e.currentTarget.classList.toggle('bg-green-500'); e.currentTarget.children[0].classList.toggle('translate-x-5'); }}><div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm"></div></div>
                  </div>
                  <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => { showToast('로그아웃 되었습니다.'); popView(); }}>
                    <span className="text-sm font-bold text-gray-800">로그아웃</span>
                  </div>
                  <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => showToast('회원 탈퇴 처리 화면')}>
                    <span className="text-sm font-bold text-red-500">회원 탈퇴</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case '나의 라운딩 통계':
        return (
          <div className="w-full h-full bg-gray-50 flex flex-col">
            <TopBarNav title="나의 라운딩 통계" />
            <div className="flex-1 overflow-y-auto p-5">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center mb-4">
                <p className="text-sm font-bold text-gray-500 mb-2">올해의 평균 스코어</p>
                <h2 className="text-5xl font-black text-gray-900">88<span className="text-xl font-bold text-gray-400 ml-1">타</span></h2>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                   <p className="text-xs font-bold text-gray-500 mb-1">최고 타수</p>
                   <p className="text-2xl font-black text-green-600">79</p>
                 </div>
                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                   <p className="text-xs font-bold text-gray-500 mb-1">라운딩 횟수</p>
                   <p className="text-2xl font-black text-blue-600">12<span className="text-sm text-gray-400 font-bold ml-0.5">회</span></p>
                 </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                 <h3 className="text-sm font-bold text-gray-900 mb-4">최근 스코어 트렌드</h3>
                 <div className="h-32 flex items-end justify-between gap-2 border-b border-gray-100 pb-2">
                   {[92, 95, 88, 89, 85, 79, 82].map((s, i) => (
                     <div key={i} className="flex flex-col items-center flex-1">
                       <span className="text-[10px] font-bold text-gray-400 mb-1">{s}</span>
                       <div className="w-full bg-green-100 rounded-t-md" style={{ height: `${(100-s)*3}px` }}></div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-white flex flex-col items-center justify-center">
            <TopBarNav title={payload.title || '안내'} />
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <h2 className="text-xl font-bold text-gray-900">{payload.title}</h2>
              <p className="text-gray-500 mt-2 text-sm text-center">정상적으로 화면이 로드되었습니다.</p>
            </div>
          </div>
        );
    }
  };

  // --- [Depth 1 Views] ---

  const MapView = ({ payload }: { payload?: any }) => {
    const isJoinMode = payload?.type === 'join';
    const isCommunityMode = payload?.type === 'community';
    const [selectedPin, setSelectedPin] = useState<string | null>(null);
    const [scale, setScale] = useState(1);
    const mapRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    const sourceData = isCommunityMode ? partnerList : (isJoinMode ? MOCK_JOINS : MOCK_BOOKINGS);
    
    const groupedMap = new globalThis.Map<string, { name: string; location: string; count: number; items: any[] }>();
    
    sourceData.forEach(item => {
      if (!groupedMap.has(item.name)) {
        groupedMap.set(item.name, {
          name: item.name,
          location: item.location,
          count: 0,
          items: []
        });
      }
      const group = groupedMap.get(item.name)!;
      group.count += 1;
      group.items.push(item);
    });

    const groupedList = Array.from(groupedMap.values()) as any[];

    const getLocationCoords = (location: string, name: string) => {
      const loc = location.trim();
      let jitterX = 0;
      let jitterY = 0;
      const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      jitterX = (hash % 7 - 3) * 0.45;
      jitterY = (hash % 5 - 2) * 0.45;

      let top = 40;
      let left = 48;

      if (loc.includes('인천')) { top = 36; left = 43; }
      else if (loc.includes('양주')) { top = 31; left = 46; }
      else if (loc.includes('이천')) { top = 39; left = 48; }
      else if (loc.includes('여주')) { top = 39; left = 50; }
      else if (loc.includes('파주')) { top = 30; left = 44; }
      else if (loc.includes('용인')) { top = 38; left = 47; }
      else if (loc.includes('안성')) { top = 40; left = 48; }
      else if (loc.includes('태안')) { top = 45; left = 38; }
      else if (loc.includes('세종')) { top = 46; left = 46; }
      else if (loc.includes('가평')) { top = 32; left = 49; }
      else if (loc.includes('군포')) { top = 37; left = 44; }
      else if (loc.includes('시흥')) { top = 36; left = 43; }
      else if (loc.includes('춘천')) { top = 32; left = 53; }
      else if (loc.includes('홍천')) { top = 34; left = 56; }
      
      return { 
        top: `${top + jitterY}%`, 
        left: `${left + jitterX}%` 
      };
    };

    const pins = groupedList.map((group, index) => {
      const coords = getLocationCoords(group.location, group.name);
      return {
        id: `pin-${index}`,
        top: coords.top,
        left: coords.left,
        group
      };
    });

    const totalTeetimes = sourceData.length;
    const totalGolfCourses = groupedList.length;

    const zoomIn = () => setScale(s => Math.min(s + 0.4, 2.5));
    const zoomOut = () => setScale(s => Math.max(s - 0.4, 0.6));
    
    const locateMe = () => {
      controls.start({ x: 0, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } });
      setScale(1);
    };

    useEffect(() => {
      controls.start({ scale, transition: { type: 'spring', damping: 25, stiffness: 200 } });
    }, [scale, controls]);

    const activePinData = pins.find(p => p.id === selectedPin)?.group;

    return (
      <div className="w-full h-full bg-[#f4f4f4] flex flex-col relative overflow-hidden" ref={mapRef}>
        <div className="absolute top-12 inset-x-4 z-40 bg-white rounded-2xl shadow-lg border border-gray-200/60 p-1.5 flex items-center gap-2">
          <button onClick={popView} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={22} />
          </button>
          <div className="flex-1 text-left py-1 px-1 text-sm font-bold text-gray-800 focus:outline-none flex items-center gap-2 select-none">
            <span className="text-[#2db400] font-black text-base tracking-tight">NAVER</span>
            <span className="text-gray-900 font-extrabold text-sm">지도</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500 font-medium text-[11px] truncate">
              {isCommunityMode ? '나홀로조인 동반자 검색' : (isJoinMode ? '실시간 조인 골프장 검색' : '실시간 부킹 골프장 검색')}
            </span>
          </div>
          <button className="p-2 text-[#2db400] hover:bg-green-50 rounded-full transition-colors mr-1">
            <Search size={18} strokeWidth={3} />
          </button>
        </div>

        <div className="absolute top-28 inset-x-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-md border border-gray-100/80 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-[#2db400] font-extrabold uppercase tracking-wider">
              {isCommunityMode ? '네이버 지도 동반자 모집 현황' : (isJoinMode ? '네이버 지도 조인 현황' : '네이버 지도 부킹 현황')}
            </span>
            <h3 className="text-xs font-black text-gray-800 leading-tight">
              골프장 <span className="text-[#2db400]">{totalGolfCourses}곳</span> 
              {' / 총 '}<span className="text-[#2db400]">{totalTeetimes}개</span> 
              {isCommunityMode ? '모집글 조회됨' : (isJoinMode ? '매칭 대기' : '티타임 조회됨')}
            </h3>
          </div>
          <div className="bg-[#2db400]/10 text-[#2db400] text-[9px] px-2 py-1 rounded-lg font-black border border-[#2db400]/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#2db400] rounded-full animate-ping"></span>
            LIVE
          </div>
        </div>

        <div className="absolute inset-0 top-0 overflow-hidden bg-[#eaf4fc]">
          <motion.div 
            drag 
            dragConstraints={mapRef}
            dragElastic={0.15}
            animate={controls}
            initial={{ x: 0, y: 0, scale: 1 }}
            className="absolute w-[1600px] h-[1600px] left-1/2 top-1/2 -ml-[800px] -mt-[800px] cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
          >
            <img 
              src="image/naver_map.png" 
              className="w-full h-full object-contain opacity-105 saturate-100 select-none pointer-events-none" 
              alt="naver map"
            />
            
            <div className="absolute top-[36%] left-[45%] z-10 flex items-center justify-center">
              <div className="w-5 h-5 bg-[#2db400] rounded-full border-4 border-white shadow-md relative z-10"></div>
              <motion.div 
                className="w-12 h-12 bg-[#2db400]/30 rounded-full absolute pointer-events-none"
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
              />
            </div>
            
            {pins.map(pin => (
              <motion.div 
                key={pin.id} 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-full cursor-pointer z-20"
                style={{ 
                  top: pin.top, 
                  left: pin.left,
                  scale: Math.max(0.45, 1 / Math.pow(scale, 1.15))
                }}
                onClick={() => setSelectedPin(pin.id)}
              >
                <div className={`px-2 py-1 rounded-lg text-[9.5px] font-black shadow-md border whitespace-nowrap mb-1 transition-all flex items-center gap-1.5 ${
                  selectedPin === pin.id 
                    ? 'bg-[#2db400] text-white border-[#249000] scale-105' 
                    : 'bg-white text-gray-800 border-gray-200'
                }`}>
                  <span>{pin.group.name.replace(/골프\s?&\s?리조트|GC|CC/g, '').trim()}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${
                    selectedPin === pin.id ? 'bg-white text-[#2db400]' : 'bg-[#2db400] text-white'
                  }`}>
                    {pin.group.count}
                  </span>
                </div>
                
                <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-all ${
                  selectedPin === pin.id 
                    ? 'bg-[#2db400] scale-110 rotate-12' 
                    : 'bg-[#2db400] hover:scale-105'
                }`}>
                  <Flag size={14} className="text-white fill-current" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="absolute right-4 bottom-28 flex flex-col gap-3 z-30">
          <div className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden border border-gray-200/80">
            <button onClick={zoomIn} className="p-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center font-black"><Plus size={18} strokeWidth={2.5}/></button>
            <button onClick={zoomOut} className="p-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center font-black"><Minus size={18} strokeWidth={2.5}/></button>
          </div>
          <button onClick={locateMe} className="p-3 bg-white text-gray-700 rounded-full shadow-md border border-gray-200/80 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center">
            <Crosshair size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Bottom Detail Drawer */}
        <AnimatePresence>
          {selectedPin && activePinData && (
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              transition={{ type: 'spring', damping: 25 }}
              className="absolute bottom-5 inset-x-5 bg-white rounded-3xl shadow-2xl p-5 border border-gray-200/50 z-50 flex flex-col max-h-[40%]"
            >
              <div className="flex justify-between items-start mb-3 gap-2 relative">
                <div className="flex-1">
                  <span className="bg-[#2db400]/10 text-[#2db400] text-[10px] font-black px-2.5 py-1 rounded-lg inline-block border border-[#2db400]/20 mb-1.5">
                    {isCommunityMode ? '네이버 지도 나홀로조인' : (isJoinMode ? '네이버 지도 조인 모집' : '네이버 지도 실시간 예약')}
                  </span>
                  <h4 className="font-extrabold text-gray-900 text-lg leading-tight">{activePinData.name}</h4>
                  <p className="text-xs text-gray-400 font-bold mt-0.5">{activePinData.location} • 총 {activePinData.count}개 {isCommunityMode ? '모집글' : '티타임'} 발견</p>
                </div>
                <button onClick={() => setSelectedPin(null)} className="p-1.5 text-gray-400 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"><X size={16}/></button>
              </div>

              {/* Teetimes inside this golf course list */}
              <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1 min-h-[80px] max-h-[140px] hide-scrollbar">
                {(activePinData as any).items.map((item: any, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setSelectedPin(null);
                      pushView(isCommunityMode ? 'partnerDetail' : (isJoinMode ? 'joinDetail' : 'bookingDetail'), item);
                    }} 
                    className="p-3 bg-gray-50 hover:bg-green-50/50 hover:border-green-200 border border-gray-100 rounded-2xl flex justify-between items-center transition-all cursor-pointer group"
                  >
                    <div>
                      <span className="text-xs font-black text-gray-800 flex items-center gap-1.5">
                        <Clock size={12} className="text-gray-400" />
                        {isCommunityMode ? `${item.time}` : `${item.time} 티오프`}
                      </span>
                      {isCommunityMode ? (
                        <p className="text-[10px] text-gray-500 font-semibold mt-1">
                          구함 {item.needed}명 • {item.gender} • {item.age}
                        </p>
                      ) : isJoinMode ? (
                        <p className="text-[10px] text-gray-500 font-semibold mt-1">
                          구함 {item.needed}명 • {item.gender} • {item.age}
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-500 font-semibold mt-1">
                          그린피 {item.price}원
                        </p>
                      )}
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const BookingDetailView = ({ payload: booking }: { payload: any }) => (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="relative w-full aspect-[4/3] shrink-0 bg-gray-200">
        <button onClick={popView} className="absolute top-12 left-4 z-20 w-10 h-10 bg-black/30 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <button onClick={() => showToast('찜 목록에 추가되었습니다.')} className="absolute top-12 right-4 z-20 w-10 h-10 bg-black/30 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors">
          <Heart size={20} />
        </button>
        <img src={booking.image} className="w-full h-full object-cover absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shrink-0">{booking.type}</span>
            <span className="flex items-center gap-1 text-xs font-bold"><Star size={12} fill="currentColor"/> {booking.rating}</span>
          </div>
          <h2 className="text-3xl font-black mb-1">{booking.name}</h2>
          <p className="text-sm font-medium opacity-90 flex items-center gap-1"><MapPin size={14}/> {booking.location}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 bg-white space-y-6">
        <div>
          <h3 className="font-bold text-gray-900 mb-3 text-lg">티타임 정보</h3>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-900 font-bold shadow-sm border border-gray-100 shrink-0"><Calendar size={20}/></div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-0.5">일정</p>
                <p className="font-bold text-gray-900 text-sm">오늘, {booking.time}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 line-through block">{booking.originalPrice}원</span>
              <span className="font-black text-xl text-red-500">{booking.price}원</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-3 text-lg">코스 / 요금 안내</h3>
          <ul className="text-sm text-gray-600 space-y-2 leading-relaxed">
            <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0"></div> 그린피: {booking.price}원 (1인 기준)</li>
            <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0"></div> 카트비: 100,000원 (팀당)</li>
            <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0"></div> 캐디피: 150,000원 (현장 결제)</li>
          </ul>
        </div>
      </div>
      <div className="p-4 bg-white border-t border-gray-100 shrink-0 pb-safe flex gap-3">
        <button onClick={() => showToast('동반자에게 카카오톡으로 공유합니다.')} className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-600 hover:bg-gray-100 shrink-0">
          <Share2 size={24}/>
        </button>
        <button onClick={() => pushView('checkout', booking)} className="flex-1 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-colors">
          예약 진행하기
        </button>
      </div>
    </div>
  );

  const PostDetailView = ({ payload: post }: { payload: any }) => (
    <div className="w-full h-full bg-white flex flex-col">
      <TopBarNav title="게시글" />
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 flex items-center gap-3 border-b border-gray-50">
          <img src={post.avatar} className="w-10 h-10 rounded-full object-cover bg-gray-100 shrink-0"/>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900">{post.author}</span>
              {post.role === 'PRO' && <span className="text-[10px] bg-gray-900 text-white px-2 py-0.5 rounded-full font-bold">PRO</span>}
            </div>
            <span className="text-xs text-gray-400">{post.time}</span>
          </div>
        </div>
        <img src={post.image} className="w-full aspect-square object-cover bg-gray-100" />
        <div className="p-5 border-b border-gray-100">
          <div className="flex gap-4 mb-4">
            <button onClick={() => toggleLike(post.id)} className={`transition-colors ${likedPosts.includes(post.id) ? 'text-red-500' : 'text-gray-800'}`}>
               <Heart size={26} fill={likedPosts.includes(post.id) ? "currentColor" : "none"} />
            </button>
            <button className="text-gray-800"><MessageSquare size={26} /></button>
            <button onClick={() => showToast('공유하기')} className="text-gray-800 ml-auto"><Share2 size={24} /></button>
          </div>
          <p className="font-bold text-sm mb-2">좋아요 {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}개</p>
          <p className="text-sm text-gray-800 leading-relaxed">{post.content}</p>
        </div>
        <div className="p-5 space-y-5">
           <div className="flex gap-3">
             <img src="https://picsum.photos/seed/c1/50/50" className="w-8 h-8 rounded-full shrink-0"/>
             <div>
               <p className="text-sm"><span className="font-bold mr-2">골프초보</span>완전 공감되네요 ㅠㅠ 저도 요즘 폼이 이상해요.</p>
               <div className="flex gap-3 text-xs text-gray-400 mt-1 font-medium">
                 <span>1시간 전</span><span>답글 달기</span>
               </div>
             </div>
           </div>
           <div className="flex gap-3">
             <img src="https://picsum.photos/seed/c2/50/50" className="w-8 h-8 rounded-full shrink-0"/>
             <div>
               <p className="text-sm"><span className="font-bold mr-2">버디잡는매</span>그린 스피드 2.8 부럽습니다!</p>
               <div className="flex gap-3 text-xs text-gray-400 mt-1 font-medium">
                 <span>3시간 전</span><span>답글 달기</span>
               </div>
             </div>
           </div>
        </div>
      </div>
      <div className="p-3 bg-white border-t border-gray-100 shrink-0 pb-safe flex items-center gap-3">
        <img src="https://picsum.photos/seed/myprofile/50/50" className="w-8 h-8 rounded-full shrink-0"/>
        <input type="text" placeholder={`${post.author}님에게 댓글 달기...`} className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-green-500" />
        <button onClick={() => showToast('댓글이 등록되었습니다.')} className="text-green-600 font-bold text-sm px-2 shrink-0">게시</button>
      </div>
    </div>
  );

  const PartnerDetailView = ({ payload: partner }: { payload: any }) => (
    <div className="w-full h-full bg-white flex flex-col">
      <TopBarNav title="동반자 모집" />
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <img src={partner.avatar} className="w-14 h-14 rounded-full object-cover shadow-sm border border-gray-100 shrink-0"/>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 truncate">{partner.author}</h3>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">매너온도 38.5°C</span>
               <span className="text-xs text-gray-400">인증회원</span>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex gap-2 mb-3">
             <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded">모집중</span>
             <span className="text-gray-400 text-xs flex items-center font-medium">{partner.time} 작성 • 조회 {partner.views}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">{partner.title}</h2>
          
          <div className="bg-gray-50 rounded-2xl p-5 space-y-4 mb-6">
             <div className="flex items-center gap-3">
               <MapPin size={18} className="text-gray-400 shrink-0"/><span className="text-sm font-bold text-gray-800">{partner.location}</span>
             </div>
             <div className="flex items-center gap-3">
               <Calendar size={18} className="text-gray-400 shrink-0"/><span className="text-sm font-bold text-gray-800">{partner.date || '이번주 토요일'} {partner.time}</span>
             </div>
             <div className="flex items-center gap-3">
               <Users size={18} className="text-gray-400 shrink-0"/>
               <div className="flex gap-2">
                 <span className="text-sm font-bold text-gray-800">{partner.gender}</span>
                 <span className="text-sm font-bold text-gray-800">· {partner.age}</span>
               </div>
             </div>
          </div>
          <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100/80">
            {partner.description || '동반자 모집 상세 내용이 없습니다.'}
          </div>
        </div>
      </div>
      <div className="p-4 bg-white border-t border-gray-100 shrink-0 pb-safe flex gap-3">
        <button onClick={() => pushView('chat', partner)} className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-colors">
          채팅으로 연락하기
        </button>
      </div>
    </div>
  );

    const UserProfileDetailView = ({ payload }: { payload: any }) => {
      const hostProfile = payload.hostProfile || {
        gender: payload.gender === '무관' ? '남성' : payload.gender,
        age: payload.age === '무관' ? '30대' : (payload.age.includes('대') ? payload.age : '30대'),
        handicap: payload.maxHandicap || 95,
        smoke: payload.smoke || '비흡연',
        license: payload.license || '미보유'
      };
      
      const mannerTemperature = payload.mannerTemperature || 37.8;
      const mannerPercent = ((mannerTemperature - 30) / (99 - 30)) * 100;

      return (
        <div className="w-full h-full bg-gray-50 flex flex-col">
          <TopBarNav title={`${payload.author}님의 프로필`} />
          <div className="flex-1 overflow-y-auto bg-white p-6">
            <div className="flex flex-col items-center mb-6">
              <img src={payload.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-md mb-3"/>
              <h3 className="font-bold text-xl text-gray-900">{payload.author} 님</h3>
              <span className="text-xs text-gray-400 font-bold mt-1">인증 회원</span>
            </div>

            {/* 매너 온도 */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-black text-gray-700">매너온도 🌡️</span>
                <span className="text-sm font-black text-orange-500">{mannerTemperature}°C</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" 
                  style={{ width: `${mannerPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-[10px] text-gray-400 font-bold">첫 온도 36.5°C</p>
                <span className="text-[10px] text-orange-500 font-extrabold">😀 매너 우수</span>
              </div>
            </div>

            {/* 프로필 상세 정보 */}
            <h4 className="font-black text-gray-900 text-base mb-3">골퍼 정보</h4>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                <p className="text-xs text-gray-400 mb-1 font-bold">성별</p>
                <p className="font-black text-gray-800 text-sm">{hostProfile.gender}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                <p className="text-xs text-gray-400 mb-1 font-bold">연령대</p>
                <p className="font-black text-gray-800 text-sm">{hostProfile.age}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                <p className="text-xs text-gray-400 mb-1 font-bold">평균 타수</p>
                <p className="font-black text-gray-800 text-sm">{hostProfile.handicap}타</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                <p className="text-xs text-gray-400 mb-1 font-bold">흡연 여부</p>
                <p className="font-black text-gray-800 text-sm">{hostProfile.smoke}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100/50 col-span-2">
                <p className="text-xs text-gray-400 mb-1 font-bold">자격증 보유 여부</p>
                <p className="font-black text-gray-800 text-sm">
                  {hostProfile.license === '보유' ? '🏌️‍♂️ 프로인증 자격증 보유' : '미보유'}
                </p>
              </div>
            </div>
            
            <div className="bg-green-50/50 border border-green-100 p-4 rounded-xl">
              <p className="text-xs text-green-800 font-bold leading-relaxed">
                * 에브리골프의 본인 인증을 완료한 골퍼입니다. 허위 프로필 또는 비매너 행위 신고 시 제재를 받을 수 있습니다.
              </p>
            </div>
          </div>
          <div className="p-4 bg-white border-t border-gray-100 shrink-0 pb-safe">
            <button 
              onClick={() => {
                showToast(`${payload.author}님에게 동반자 매칭 신청을 보냈습니다.`);
                popView();
              }}
              className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-md transition-colors"
            >
              신청하기
            </button>
          </div>
        </div>
      );
    };

    const InfluencerProfileView = ({ payload }: { payload?: any }) => {
    const data = payload || MOCK_INFLUENCERS[0];
    return (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      <div className="relative w-full aspect-[4/3] shrink-0 bg-gray-200">
        <button onClick={popView} className="absolute top-12 left-4 z-20 w-10 h-10 bg-black/30 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <button onClick={() => showToast('링크가 복사되었습니다.')} className="absolute top-12 right-4 z-20 w-10 h-10 bg-black/30 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors">
          <Share2 size={20} />
        </button>
        <img src={data.cover} className="w-full h-full object-cover absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-10 left-5 flex items-end gap-4 z-20 pointer-events-none">
           <img src={data.avatar} className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg bg-white pointer-events-auto" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pt-14 pb-5 bg-white">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
             <h2 className="text-2xl font-black text-gray-900">{data.name}</h2>
             <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">인플루언서</span>
          </div>
          <p className="text-gray-500 font-medium mb-3">{data.title}</p>
          <div className="flex gap-2 flex-wrap mb-4">
            {data.tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-bold">{tag}</span>
            ))}
          </div>
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
            {data.description}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3 mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2"><Calendar size={18} className="text-green-600"/> 진행 일정</h3>
          <p className="text-sm text-gray-700 font-medium flex items-center gap-2"><MapPin size={16} className="text-gray-400"/> {data.schedule.location}</p>
          <p className="text-sm text-gray-700 font-medium flex items-center gap-2"><Clock size={16} className="text-gray-400"/> {data.schedule.time}</p>
          <p className="text-sm text-gray-700 font-medium flex items-center gap-2"><Users size={16} className="text-gray-400"/> 총 {data.schedule.count}명 모집 (선착순)</p>
        </div>
      </div>
      <div className="p-4 bg-white border-t border-gray-100 shrink-0 pb-safe">
        <button onClick={() => pushView('storyForm', data)} className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all">
          {data.name}와 라운딩 신청하기
        </button>
      </div>
    </div>
    );
  };

  const InfluencerListView = () => {
    return (
      <div className="w-full h-full bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-30 w-full bg-white border-b border-gray-50 px-4 pt-12 pb-4 flex items-center justify-between">
          <button onClick={popView} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-base font-extrabold text-gray-900">인플루언서 라운딩 응모</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4 flex gap-3 items-start">
            <div className="w-9 h-9 bg-green-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">👑</div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-sm">무료 라운딩 응모란?</h3>
              <p className="text-xs text-gray-500 mt-1 font-bold leading-relaxed">에브리골프 공식 골프 인플루언서 및 프로들과 100% 무료로 함께 라운딩을 즐길 수 있는 기회입니다. 프로필을 누르고 사연을 적어 응모해보세요!</p>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            {MOCK_INFLUENCERS.map((inf) => (
              <div 
                key={inf.id} 
                onClick={() => pushView('influencerProfile', inf)} 
                className="w-full bg-white border border-gray-100/80 rounded-2.5xl p-5 shadow-sm cursor-pointer hover:border-green-300 hover:shadow-md transition-all flex flex-col gap-4 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl"></div>

                <div className="flex justify-between items-start z-10">
                  <div className="flex items-center gap-3">
                    <img src={inf.avatar} className="w-11 h-11 rounded-xl object-cover shadow-sm border border-gray-100 group-hover:scale-105 transition-transform" />
                    <div className="flex flex-col">
                      <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                        {inf.name} 
                        <span className="bg-green-50 text-green-600 text-[8.5px] font-bold px-1.5 py-0.5 rounded-md border border-green-100">
                          PRO
                        </span>
                      </h3>
                      <span className="text-[10px] text-gray-400 font-bold mt-0.5">{inf.title.replace(/"/g, '')}</span>
                    </div>
                  </div>
                  
                  <span className="bg-rose-500 text-white px-2.5 py-1 rounded-lg text-[9.5px] font-black shadow-sm shrink-0">
                    무료 응모 지원
                  </span>
                </div>

                <p className="text-xs text-gray-500 font-medium leading-relaxed break-words whitespace-pre-line z-10">
                  {inf.description.split('\n\n')[0] || inf.description}
                </p>

                <div className="flex justify-between items-center pt-3 border-t border-gray-50 z-10">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold">
                      <MapPin size={10} className="text-green-600 shrink-0" />
                      <span className="truncate max-w-[150px]">{inf.schedule.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9.5px] text-gray-400 font-medium">
                      <Clock size={10} className="text-gray-450 shrink-0" />
                      <span className="truncate max-w-[150px]">{inf.schedule.time.split('티오프')[0]} 티오프</span>
                    </div>
                  </div>
                  
                  <button className="bg-green-600 hover:bg-green-700 active:scale-95 text-white px-4 py-2.5 rounded-xl text-[10.5px] font-black shadow-sm transition-all shrink-0">
                    신청 사연 작성
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const StoryFormView = ({ payload }: { payload?: any }) => {
    const data = payload || MOCK_INFLUENCERS[0];
    const [story, setStory] = useState('');
    const [name, setName] = useState('김골퍼');
    const [phone, setPhone] = useState('010-1234-5678');
    const [handicap, setHandicap] = useState('90타');
    const [agreed, setAgreed] = useState(true);

    const handleSubmit = () => {
      if (story.trim().length < 10) {
        showToast('사연을 최소 10자 이상 작성해 주세요.');
        return;
      }
      if (!agreed) {
        showToast('개인정보 제공에 동의해 주세요.');
        return;
      }
      if (userBalls < 300) {
        showToast('보유하신 응모볼이 부족합니다. (300볼 필요)');
        return;
      }
      setUserBalls(prev => prev - 300);
      showToast('300볼이 사용되어 신청이 접수되었습니다. ⚡');
      setTimeout(() => {
        pushView('success', { 
          message: '라운딩 신청 완료!', 
          subMessage: `${data.name} 프로암 라운딩 신청과 함께 작성하신 정성스러운 사연이 제출되었습니다. 응모 신청으로 300볼이 차감되었습니다. 인플루언서 매칭 시 작성하신 연락처(${phone})로 개별 안내드리겠습니다.` 
        });
      }, 500);
    };

    return (
      <div className="w-full h-full bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-30 w-full bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <button onClick={popView} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-black text-gray-900">신청 사연 작성</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24">
          {/* Target Influencer Card Info */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-950 rounded-2xl p-4 text-white shadow-md relative overflow-hidden flex items-center gap-4">
            <img src={data.avatar} className="w-16 h-16 rounded-full border-2 border-white object-cover shadow-sm bg-white shrink-0" />
            <div className="z-10">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] bg-green-500 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">신청 대상</span>
                <span className="text-[9px] bg-amber-500 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">🟡 300볼 사용</span>
              </div>
              <h2 className="text-base font-bold mt-1 leading-tight">{data.name} 프로</h2>
              <p className="text-[11px] text-gray-300 font-medium truncate max-w-[200px] mt-0.5">{data.schedule.location}</p>
            </div>
            <div className="absolute right-[-10px] bottom-[-15px] opacity-10 text-white font-black text-6xl select-none">⛳</div>
          </div>

          {/* Tips Box */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
            <h3 className="text-sm font-extrabold text-green-800 flex items-center gap-1.5 mb-1.5">
              <Sparkles size={16} className="text-green-600 fill-current animate-pulse" /> 
              어떤 사연을 적어야 하나요?
            </h3>
            <ul className="text-xs text-green-700 leading-relaxed list-disc pl-4 space-y-1 font-medium">
              <li>인플루언서와 함께하고 싶은 특별한 이유와 열정을 담아주세요.</li>
              <li>현재 자신의 골프 고민이나 레슨이 필요한 점을 적어보세요.</li>
              <li>재미있거나 진정성 있는 사연일수록 선정 확률이 높아집니다.</li>
            </ul>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-700 mb-1.5">신청자 정보</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl px-3 py-2">
                  <span className="block text-[9px] text-gray-400 font-bold mb-0.5">이름</span>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-sm font-extrabold text-gray-800 focus:outline-none bg-transparent"
                  />
                </div>
                <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 col-span-2">
                  <span className="block text-[9px] text-gray-400 font-bold mb-0.5">연락처</span>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm font-extrabold text-gray-800 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 mb-1.5">희망 핸디캡</label>
              <div className="bg-white border border-gray-200 rounded-xl px-3 py-2">
                <span className="block text-[9px] text-gray-400 font-bold mb-0.5">평균 타수</span>
                <input 
                  type="text" 
                  value={handicap} 
                  onChange={(e) => setHandicap(e.target.value)}
                  className="w-full text-sm font-extrabold text-gray-800 focus:outline-none bg-transparent"
                  placeholder="예: 95타"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-black text-gray-700">라운딩 신청 사연 ✍️</label>
                <span className={`text-[10px] font-bold ${story.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                  {story.length}/500자
                </span>
              </div>
              <div className="relative bg-white border border-gray-200 rounded-2xl p-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value.slice(0, 500))}
                  placeholder="캐디와니님과 라운딩을 통해 필드 숏게임을 교정받고 싶어요! 2년 동안 백돌이를 벗어나지 못했는데, 실전 꿀팁을 전수받고 인생 샷도 남기고 싶습니다!"
                  className="w-full min-h-[140px] text-sm text-gray-800 font-medium placeholder-gray-300 resize-none focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-2.5 pt-2" onClick={() => setAgreed(!agreed)}>
              <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${agreed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 bg-white'}`}>
                {agreed && <CheckCircle2 size={12} strokeWidth={3} />}
              </div>
              <div className="cursor-pointer select-none">
                <span className="text-xs font-bold text-gray-600">개인정보 수집 및 인플루언서 제공 동의</span>
                <p className="text-[10px] text-gray-400 font-medium">선정자 개별 연락 및 예약 진행을 위해 인플루언서 및 운영자 측에 개인정보(이름, 연락처)가 제공됩니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shrink-0 pb-safe z-30">
          <button 
            onClick={handleSubmit} 
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>사연 등록 후 라운딩 신청하기</span>
          </button>
        </div>
      </div>
    );
  };

  const ProfileInputView = () => {
    const [gender, setGender] = useState<'남성' | '여성'>(userProfile?.gender || '남성');
    const [age, setAge] = useState<string>(userProfile?.age?.toString() || '');
    const [handicap, setHandicap] = useState<string>(userProfile?.handicap?.toString() || '');
    const [smoke, setSmoke] = useState<'흡연' | '비흡연'>(userProfile?.smoke || '비흡연');
    const [license, setLicense] = useState<'보유' | '미보유'>(userProfile?.license || '미보유');

    const handleSave = () => {
      if (!age || isNaN(Number(age)) || Number(age) <= 0) {
        showToast('올바른 나이를 입력해주세요.');
        return;
      }
      if (!handicap || isNaN(Number(handicap)) || Number(handicap) < 0) {
        showToast('올바른 평균 타수를 입력해주세요.');
        return;
      }
      
      setUserProfile({
        gender,
        age: Number(age),
        handicap: Number(handicap),
        smoke,
        license
      });
      
      showToast('프로필이 저장되었으며 맞춤 모집글로 매칭되었습니다! 🏌️‍♂️');
      popView();
    };

    return (
      <div className="w-full h-full bg-white flex flex-col relative z-50">
        <TopBarNav title="매칭 프로필 설정" />
        <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-28">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100 flex gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">스마트 동반자 매칭</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                성별, 나이, 타수, 흡연 여부 및 자격증 프로필을 입력하시면 나에게 꼭 맞는 필드 동반자 모집글만 자동으로 골라 보여줍니다.
              </p>
            </div>
          </div>

          {/* 성별 선택 */}
          <div>
            <label className="text-sm font-bold text-gray-900 mb-2 block">성별</label>
            <div className="grid grid-cols-2 gap-3">
              {(['남성', '여성'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-3.5 rounded-xl font-bold border text-sm transition-all ${
                    gender === g 
                      ? 'border-green-600 bg-green-50 text-green-600 shadow-sm font-black' 
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* 나이 & 타수 입력 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-900 mb-2 block">나이 (세)</label>
              <input
                type="number"
                placeholder="예: 32"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-green-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-900 mb-2 block">평균 타수 (핸디캡)</label>
              <input
                type="number"
                placeholder="예: 95"
                value={handicap}
                onChange={e => setHandicap(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-green-500 bg-gray-50"
              />
            </div>
          </div>

          {/* 흡연 여부 */}
          <div>
            <label className="text-sm font-bold text-gray-900 mb-2 block">흡연 여부</label>
            <div className="grid grid-cols-2 gap-3">
              {(['비흡연', '흡연'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSmoke(s)}
                  className={`py-3.5 rounded-xl font-bold border text-sm transition-all ${
                    smoke === s 
                      ? 'border-green-600 bg-green-50 text-green-600 shadow-sm font-black' 
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 자격증 보유 여부 */}
          <div>
            <label className="text-sm font-bold text-gray-900 mb-2 block">프로 자격증 보유 여부</label>
            <div className="grid grid-cols-2 gap-3">
              {(['미보유', '보유'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLicense(l)}
                  className={`py-3.5 rounded-xl font-bold border text-sm transition-all ${
                    license === l 
                      ? 'border-green-600 bg-green-50 text-green-600 shadow-sm font-black' 
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {l === '보유' ? '프로/티칭 자격증 있음' : '자격증 없음'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 하트 고정 하단 저장 버튼 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shrink-0 pb-safe z-10">
          <button
            onClick={handleSave}
            className="w-full py-4.5 bg-gray-900 text-white font-black text-base rounded-2xl shadow-xl hover:bg-gray-800 transition-colors"
          >
            프로필 등록 및 매칭 시작하기
          </button>
        </div>
      </div>
    );
  };

  const LoginView = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginType, setLoginType] = useState<string | null>(null);

    const handleSocialLogin = (platform: string) => {
      setIsLoading(true);
      setLoginType(platform);
      setTimeout(() => {
        setIsLoading(false);
        setLoginType(null);
        showToast(`${platform} 계정으로 로그인이 완료되었습니다! 🎉`);
        popView();
        setTimeout(() => {
          pushView('success', { 
            message: '웰컴 혜택 지급 완료!', 
            subMessage: '신규 가입 혜택으로 무료 응모볼 1,000볼과 첫 부킹 1만원 할인 쿠폰이 발급되었습니다. 마이페이지에서 확인해보세요!' 
          });
        }, 300);
      }, 1500);
    };

    const handleEmailLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim() || !password.trim()) {
        showToast('이메일과 비밀번호를 모두 입력해 주세요.');
        return;
      }
      setIsLoading(true);
      setLoginType('이메일');
      setTimeout(() => {
        setIsLoading(false);
        setLoginType(null);
        showToast('이메일 로그인이 완료되었습니다!');
        popView();
      }, 1500);
    };

    return (
      <div className="w-full h-full bg-white flex flex-col relative">
        {/* Header */}
        <div className="sticky top-0 z-30 w-full bg-white border-b border-gray-50 px-4 pt-12 pb-4 flex items-center justify-between">
          <button onClick={popView} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-base font-extrabold text-gray-900">로그인</h1>
          <button onClick={popView} className="p-2 -mr-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between">
          <div>
            {/* Branding / Logo */}
            <div className="text-center mb-8">
              <span className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent tracking-tighter">
                everygolf
              </span>
              <p className="text-xs text-gray-500 font-bold mt-2">골프 라이프의 시작, 애브리골프</p>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-500">이메일 주소</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="golf@everygolf.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-500">비밀번호</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 mt-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                {isLoading && loginType === '이메일' ? '로그인 중...' : '이메일로 로그인'}
              </button>
            </form>

            <div className="flex justify-center items-center gap-4 text-xs font-semibold text-gray-400 mt-5">
              <span className="cursor-pointer hover:text-gray-600" onClick={() => showToast('기능 준비 중입니다.')}>이메일 찾기</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="cursor-pointer hover:text-gray-600" onClick={() => showToast('기능 준비 중입니다.')}>비밀번호 재설정</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="cursor-pointer hover:text-gray-600" onClick={() => showToast('기능 준비 중입니다.')}>회원가입</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-gray-100"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">간편 SNS 로그인</span>
              <div className="flex-1 h-[1px] bg-gray-100"></div>
            </div>

            <div className="space-y-2.5">
              {/* Kakao */}
              <button 
                type="button"
                onClick={() => handleSocialLogin('카카오')}
                disabled={isLoading}
                className="w-full py-3.5 bg-[#FEE500] text-[#191919] font-extrabold text-sm rounded-2xl active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-sm hover:brightness-95"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 3.185-9 7.11 0 2.553 1.7 4.796 4.25 5.966-.175.64-.633 2.316-.725 2.666-.112.428.148.42.31.312.128-.085 2.036-1.386 2.853-1.94 1 .28 2.052.43 3.125.43 4.97 0 9-3.185 9-7.11S16.97 3 12 3z"/>
                </svg>
                <span>카카오로 시작하기</span>
              </button>

              {/* Naver */}
              <button 
                type="button"
                onClick={() => handleSocialLogin('네이버')}
                disabled={isLoading}
                className="w-full py-3.5 bg-[#03C75A] text-white font-extrabold text-sm rounded-2xl active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-sm hover:brightness-95"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M16.2 3H21v18h-4.8l-7.4-10.8V21H4V3h4.8l7.4 10.8V3z"/>
                </svg>
                <span>네이버로 시작하기</span>
              </button>

              {/* Google */}
              <button 
                type="button"
                onClick={() => handleSocialLogin('구글')}
                disabled={isLoading}
                className="w-full py-3.5 bg-white text-gray-700 font-extrabold text-sm border border-gray-200 rounded-2xl active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-sm hover:bg-gray-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.585 0-6.5-2.915-6.5-6.5s2.915-6.5 6.5-6.5c1.637 0 3.13.608 4.28 1.613l3.053-3.052C19.167 2.14 15.937 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c5.83 0 10.74-4.225 11-10H12.24z"/>
                </svg>
                <span>구글로 시작하기</span>
              </button>

              {/* Apple */}
              <button 
                type="button"
                onClick={() => handleSocialLogin('애플')}
                disabled={isLoading}
                className="w-full py-3.5 bg-black text-white font-extrabold text-sm rounded-2xl active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-sm hover:bg-zinc-900"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.8 16.32 3.1 9.58 7.37 9.27c1.32.1 2.37.84 3.05.84.68 0 2.05-.9 3.75-.7 1.83.1 2.8.94 3.25 1.7-3.9 2.38-2.6 7.4 1.1 8.87-.73 1.86-1.52 3.8-1.47 3.3zM14.75 6.2c.75-.9 1.25-2.2 1.1-3.5-1.12.05-2.5.76-3.3 1.7-.68.8-1.28 2.05-1.1 3.32 1.24.1 2.53-.62 3.3-1.52z"/>
                </svg>
                <span>Apple로 시작하기</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Spinner overlay when loading */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-black text-green-700 animate-pulse">{loginType} 계정으로 로그인하는 중...</p>
          </div>
        )}
      </div>
    );
  };

  const FilterSelectorModal = () => {
    if (!showDetailedFilterModal) return null;

    const filterOptions = [
      {
        key: 'cost',
        label: '비용 부담',
        options: ['전체', '1/N 결제', '호스트 부담']
      },
      {
        key: 'gender',
        label: '모집 성별',
        options: ['전체', '남성', '여성', '무관']
      },
      {
        key: 'age',
        label: '모집 연령대',
        options: ['전체', '20대', '30대', '40대', '50대 이상', '20~30대', '30~40대', '40~50대']
      },
      {
        key: 'region',
        label: '선호 지역',
        options: ['전체', '서울', '인천', '경기', '강원', '충청', '경상', '전라', '제주']
      },
      {
        key: 'smoke',
        label: '흡연 여부',
        options: ['전체', '비흡연', '흡연']
      }
    ];

    const handleSaveFavorite = () => {
      if (!favNameInput.trim()) {
        showToast('즐겨찾기 이름을 입력해주세요.');
        return;
      }
      const hasActiveFilter = Object.values(partnerFilters).some(v => v !== '전체');
      if (!hasActiveFilter) {
        showToast('최소 한 개의 필터 조건을 지정해야 저장할 수 있습니다.');
        return;
      }
      const newFav = {
        id: `fav-${Date.now()}`,
        name: favNameInput.trim(),
        filters: { ...partnerFilters }
      };
      setFavoriteFilters(prev => [newFav, ...prev]);
      showToast(`'${favNameInput}' 조건이 즐겨찾기에 추가되었습니다! ⭐`);
      setFavNameInput('');
    };

    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-[9999]"
          onClick={() => setShowDetailedFilterModal(false)}
        >
          <motion.div 
            initial={{ y: '100%' }} 
            animate={{ y: 0 }} 
            exit={{ y: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="w-full sm:max-w-[390px] bg-white rounded-t-[30px] p-5 shadow-2xl flex flex-col max-h-[85vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 shrink-0"></div>
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-1.5">
                <Filter size={20} className="text-green-600 shrink-0" />
                <span>통합 상세 조건 설정</span>
              </h3>
              <button onClick={() => setShowDetailedFilterModal(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* 필터 세부 항목 스크롤 영역 */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-5 py-2 hide-scrollbar">
              {filterOptions.map((group) => (
                <div key={group.key} className="space-y-2">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider block">
                    {group.label}
                  </h4>
                  
                  {group.key === 'cost' ? (
                    <div className="space-y-3 pt-1 w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500">라운딩 비용 (금액 한도)</span>
                        <span className="text-sm font-black text-green-600">
                          {partnerFilters.cost >= 300000 ? '30만원 이상 (전체)' : `${(partnerFilters.cost / 10000).toLocaleString()}만원 이하`}
                        </span>
                      </div>
                      <input 
                        type="range"
                        min="50000"
                        max="300000"
                        step="10000"
                        value={partnerFilters.cost > 300000 ? 300000 : partnerFilters.cost}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setPartnerFilters(prev => ({
                            ...prev,
                            cost: val === 300000 ? 350000 : val
                          }));
                        }}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 focus:outline-none"
                      />
                      <div className="flex justify-between text-[9px] text-gray-400 font-black px-0.5">
                        <span>5만원</span>
                        <span>15만원</span>
                        <span>30만원+</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {group.options.map((opt) => {
                        const isSelected = partnerFilters[group.key as keyof PartnerFilters] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setPartnerFilters(prev => ({ ...prev, [group.key as keyof PartnerFilters]: opt }));
                            }}
                            className={`px-3 py-2 rounded-xl font-bold text-[11px] border transition-all ${
                              isSelected 
                                ? 'border-green-600 bg-green-50 text-green-600 font-extrabold shadow-sm scale-[1.02]' 
                                : 'border-gray-100 bg-gray-50/50 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {/* 필터 즐겨찾기 저장 내장 섹션 */}
              <div className="bg-amber-50/40 border border-amber-100/50 rounded-2xl p-4 mt-6 space-y-3">
                <h4 className="text-xs font-black text-amber-800 flex items-center gap-1.5">
                  <Star size={14} className="text-amber-500 fill-amber-500 shrink-0" />
                  <span>현재 설정으로 즐겨찾기 등록</span>
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="예: 경기 30대 1/N"
                    value={favNameInput}
                    onChange={e => setFavNameInput(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-medium outline-none focus:border-green-500 bg-white"
                    maxLength={15}
                  />
                  <button
                    type="button"
                    onClick={handleSaveFavorite}
                    className="bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0"
                  >
                    등록
                  </button>
                </div>
              </div>
            </div>

            {/* 하단 제어 버튼 팩 */}
            <div className="pt-4 border-t border-gray-100 shrink-0 pb-safe flex gap-2.5">
              <button 
                type="button"
                onClick={() => {
                  setPartnerFilters({
                    cost: 350000,
                    gender: '전체',
                    age: '전체',
                    region: '전체',
                    smoke: '전체'
                  });
                  showToast('필터 조건이 전체 초기화되었습니다.');
                }}
                className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-250 text-gray-700 font-bold rounded-xl text-xs transition-colors border border-gray-200/50"
              >
                초기화
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowDetailedFilterModal(false);
                  showToast('필터가 정상적으로 적용되었습니다! ⛳');
                }}
                className="flex-1 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-extrabold rounded-xl text-xs transition-colors shadow-md"
              >
                조건 적용하기
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const SaveFavoriteModal = () => {
    return null;
  };


  // --- [Main Navigation Views] ---
  // (Main views inside activeTab)

    const HomeView = () => (
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
        <div className="relative w-full aspect-[16/9.5] rounded-3xl overflow-hidden shadow-lg select-none">
          <AnimatePresence mode="wait">
            {activeBannerIndex === 0 ? (
              <motion.div
                key="banner-influencer"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onClick={() => pushView('influencerList')}
                className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-800 p-5 text-white flex flex-col justify-between cursor-pointer group active:scale-[0.99] transition-all"
              >
                <div className="absolute right-[-20px] bottom-[-20px] w-36 h-36 bg-white/10 rounded-full border border-white/10 shrink-0"></div>
                <div className="absolute right-[40px] bottom-[-40px] w-24 h-24 bg-white/5 rounded-full shrink-0"></div>
                
                <div className="relative z-10">
                  <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded mb-2.5 shadow-sm">
                    스페셜 매칭 EVENT ⛳
                  </span>
                  <h3 className="text-lg font-black leading-snug tracking-tight">
                    인플루언서 & 프로와 함께하는<br/>100% 무료 라운딩 매칭!
                  </h3>
                  <p className="text-[10.5px] text-green-100 font-bold mt-2.5 opacity-90">
                    인플루언서 공고 확인하고 지금 사연을 응모하세요!
                  </p>
                </div>
                
                <div className="relative z-10 flex justify-between items-center mt-3 pt-2.5 border-t border-white/10">
                  <span className="text-[9.5px] text-white/80 font-extrabold flex items-center gap-1">
                    에브리골프 단독 특별 혜택
                  </span>
                  <span className="text-[10.5px] font-black text-white flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    공고 보러가기 <ChevronRight size={13} />
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="banner-prize"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onClick={() => pushView('empty', { type: 'drawEvent', title: '데일리 경품 응모' })}
                className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-800 p-5 text-white flex flex-col justify-between cursor-pointer group active:scale-[0.99] transition-all"
              >
                <div className="absolute right-[-10px] bottom-[-15px] w-40 h-40 bg-white/10 rounded-full border border-white/5 shrink-0"></div>
                <div className="absolute right-[50px] bottom-[-30px] w-20 h-20 bg-white/5 rounded-full shrink-0"></div>
                
                <div className="relative z-10">
                  <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded mb-2.5 shadow-sm">
                    데일리 경품 DRAW 🎁
                  </span>
                  <h3 className="text-lg font-black leading-snug tracking-tight">
                    매일매일 쏟아지는 골프 경품!<br/>거리측정기 & 프리미엄 골프공
                  </h3>
                  <p className="text-[10.5px] text-indigo-100 font-bold mt-2.5 opacity-90">
                    보유하신 응모볼로 매일 즉시 응모하세요!
                  </p>
                </div>
                
                <div className="relative z-10 flex justify-between items-center mt-3 pt-2.5 border-t border-white/10">
                  <span className="text-[9.5px] text-white/80 font-extrabold flex items-center gap-1">
                    매일 새로운 경품 100% 추첨
                  </span>
                  <span className="text-[10.5px] font-black text-white flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    응모하러 가기 <ChevronRight size={13} />
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 슬라이드 Indicator Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
            <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeBannerIndex === 0 ? 'bg-white scale-125' : 'bg-white/40'}`}></span>
            <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeBannerIndex === 1 ? 'bg-white scale-125' : 'bg-white/40'}`}></span>
          </div>
        </div>
      </div>
      


      <div className="px-5 mt-6 grid grid-cols-4 gap-3 w-full">
        {[
          { 
            icon: CalendarCheck, 
            label: '부킹', 
            color: 'bg-green-50 text-green-600 hover:bg-green-100', 
            action: () => { 
              setActiveTab('booking'); 
              setBookingMode('부킹'); 
              showToast('실시간 부킹 매칭으로 이동합니다.'); 
            } 
          },
          { 
            icon: UserPlus, 
            label: '조인', 
            color: 'bg-orange-50 text-orange-600 hover:bg-orange-100', 
            action: () => { 
              setActiveTab('booking'); 
              setBookingMode('조인'); 
              showToast('실시간 조인 매칭으로 이동합니다.'); 
            } 
          },
          { 
            icon: User, 
            label: '나홀로조인', 
            color: 'bg-purple-50 text-purple-600 hover:bg-purple-100', 
            action: () => { 
              setActiveTab('community'); 
              showToast('동반자 구하기 게시판으로 이동합니다.'); 
            } 
          },
          { 
            icon: Sparkles, 
            label: '당일특가티', 
            color: 'bg-rose-50 text-rose-500 hover:bg-rose-100', 
            action: () => { 
              setActiveTab('booking'); 
              setBookingMode('부킹'); 
              setSelectedDate('05/28 (목)'); 
              setIsDiscountSpecialOnly(true);
              setGroupByGolfCourse(false);
              setShowSearchFilter(false);
              showToast('금일~익일 마감 임박 특가 티타임을 검색합니다. ⚡'); 
            } 
          },
        ].map((item, idx) => (
          <div key={idx} onClick={item.action} className="flex flex-col items-center gap-2 cursor-pointer group w-full">
            <div className={`w-full aspect-square max-w-[80px] rounded-2xl flex items-center justify-center ${item.color} transition-all shadow-sm active:scale-95 shrink-0 border border-gray-100/50`}>
              <item.icon size={28} strokeWidth={2.2}/>
            </div>
            <span className="text-xs font-black text-gray-700 whitespace-nowrap text-center group-hover:text-gray-900 transition-colors">{item.label}</span>
          </div>
        ))}
      </div>



      <div className="px-5 mt-6 mb-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-1.5 tracking-tight">
              보이스캐디 단독 특가 기획전
            </h3>
            <p className="text-[11px] text-gray-400 font-bold mt-0.5">공식 온라인 파트너 단독 최저가 진행 중</p>
          </div>
          <button 
            onClick={() => window.open('https://www.voicecaddie.co.kr/product/1174819?utm_source=caddie&utm_medium=video&utm_campaign=event', '_blank')}
            className="text-[11px] text-green-600 font-black hover:underline"
          >
            전체보기
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {[
            {
              id: 1,
              name: '보이스캐디 T-Ultra GPS',
              desc: '신개념 OLED 탑재 거리측정기',
              originalPrice: '450,000',
              price: '389,000',
              discount: '13%',
              image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=300',
            },
            {
              id: 2,
              name: '보이스캐디 TL1 레이저',
              desc: '0.1초 정밀 핀 스캔 및 거리 측정',
              originalPrice: '520,000',
              price: '429,000',
              discount: '17%',
              image: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&q=80&w=300',
            }
          ].map((prod) => (
            <div 
              key={prod.id} 
              onClick={() => {
                showToast('보이스캐디 공식 판매처로 이동합니다! 🛍️');
                setTimeout(() => {
                  window.open('https://www.voicecaddie.co.kr/product/1174819?utm_source=caddie&utm_medium=video&utm_campaign=event', '_blank');
                }, 500);
              }}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-green-300 transition-all cursor-pointer flex flex-col group"
            >
              <div className="aspect-square bg-gray-50 relative overflow-hidden shrink-0">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">{prod.discount} OFF</span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm line-clamp-1 group-hover:text-green-600 transition-colors leading-tight">{prod.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 line-clamp-1 leading-none">{prod.desc}</p>
                </div>
                <div className="mt-3">
                  <span className="text-[10px] text-gray-400 line-through font-bold block leading-none">{prod.originalPrice}원</span>
                  <p className="font-black text-rose-500 text-sm sm:text-base tracking-tight leading-none mt-1">{prod.price}<span className="text-xs font-bold text-gray-500 ml-0.5">원</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>




    </div>
  );

  const renderBookingTabView = () => {
    const getDummyDistance = (loc: string, id: number) => {
      const locStr = loc || '';
      if (locStr.includes('인천')) return `${(30 + (id % 5) * 3).toFixed(0)}km`;
      if (locStr.includes('양주')) return `${(40 + (id % 3) * 4).toFixed(0)}km`;
      if (locStr.includes('이천')) return `${(65 + (id % 4) * 5).toFixed(0)}km`;
      if (locStr.includes('여주')) return `${(75 + (id % 3) * 6).toFixed(0)}km`;
      if (locStr.includes('파주')) return `${(35 + (id % 4) * 3).toFixed(0)}km`;
      if (locStr.includes('용인')) return `${(45 + (id % 5) * 4).toFixed(0)}km`;
      if (locStr.includes('안성')) return `${(80 + (id % 2) * 5).toFixed(0)}km`;
      if (locStr.includes('태안')) return `${(130 + (id % 3) * 10).toFixed(0)}km`;
      if (locStr.includes('세종')) return `${(120 + (id % 2) * 8).toFixed(0)}km`;
      if (locStr.includes('가평')) return `${(60 + (id % 4) * 5).toFixed(0)}km`;
      if (locStr.includes('군포')) return `${(25 + (id % 3) * 2).toFixed(0)}km`;
      if (locStr.includes('시흥')) return `${(28 + (id % 3) * 3).toFixed(0)}km`;
      if (locStr.includes('춘천')) return `${(85 + (id % 4) * 6).toFixed(0)}km`;
      if (locStr.includes('홍천')) return `${(95 + (id % 2) * 10).toFixed(0)}km`;
      return `${(50 + (id % 10) * 8).toFixed(0)}km`;
    };




    // 달력 날짜 목록 (오늘 기준 7일 가로 스크롤용) - 참조 사용



    // 전역 상수 timeOptions, regionOptions 참조 사용

    // 실시간 필터링 로직 (선택된 날짜, 시간대, 지역, 검색어, 가격 상한선, 캐디 조건 매칭)
    const getFilteredItems = () => {
      let rawData: any[] = bookingMode === '부킹' ? MOCK_BOOKINGS : MOCK_JOINS;
      
      // 날짜 변경 시 리스트 셔플링 시뮬레이션 (동적 효과 부여)
      const dateIdx = dates.indexOf(selectedDate);
      if (dateIdx !== -1) {
        rawData = [...rawData].filter((_, idx) => (idx + dateIdx) % 3 !== 2);
      }

      const filtered = rawData.filter(item => {
        // 특가 전용 모드 시 가격 제한 (18만원 이하)
        if (isDiscountSpecialOnly && bookingMode === '부킹') {
          const priceVal = parseInt(item.price.replace(/,/g, ''));
          if (priceVal > 180000) return false;
        }
        // 시간대 필터링 (1부/오전, 2부/오후, 3부/야간)
        if (selectedTime !== '전체 시간') {
          const hour = parseInt(item.time.split(':')[0]);
          if (selectedTime.includes('1부') || selectedTime.includes('오전')) {
            if (hour < 6 || hour >= 11) return false;
          } else if (selectedTime.includes('2부') || selectedTime.includes('오후')) {
            if (hour < 11 || hour >= 16) return false;
          } else if (selectedTime.includes('3부') || selectedTime.includes('야간')) {
            if (hour < 16) return false;
          }
        }

        // 지역 필터링
        if (selectedRegion !== '전체 지역') {
          const loc = item.location || '';
          if (selectedRegion === '서울/경기') {
            if (!loc.includes('서울') && !loc.includes('경기') && !loc.includes('인천')) return false;
          } else if (selectedRegion === '충청') {
            if (!loc.includes('충청') && !loc.includes('세종') && !loc.includes('충남') && !loc.includes('충북')) return false;
          } else {
            if (!loc.includes(selectedRegion)) return false;
          }
        }

        // 골프장명 검색
        if (searchQuery.trim() !== '') {
          if (!item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        }



        // 캐디 형태 필터링
        if (selectedCaddieType !== '전체') {
          const caddieType = item.id % 4 === 0 ? '노캐디' : item.id % 4 === 1 ? '일반캐디' : item.id % 4 === 2 ? '드라이빙캐디' : '인턴캐디';
          if (caddieType !== selectedCaddieType) return false;
        }

        // 조인 서브 필터링 (전체/커플/남성/여성/1인/2인)
        if (bookingMode === '조인' && selectedJoinFilter !== '전체') {
          if (selectedJoinFilter === '남성') {
            if (item.gender !== '남성') return false;
          } else if (selectedJoinFilter === '여성') {
            if (item.gender !== '여성') return false;
          } else if (selectedJoinFilter === '1인') {
            if (item.needed !== 1) return false;
          } else if (selectedJoinFilter === '2인') {
            if (item.needed !== 2) return false;
          } else if (selectedJoinFilter === '커플') {
            // 커플은 남녀무관(무관)이면서 2명 구함
            if (item.needed !== 2 || item.gender !== '무관') return false;
        }

        // 1. 플레이 인원 필터링 (selectedMinPlayers)
        if (selectedMinPlayers !== '전체') {
          const neededNum = item.needed || (item.id % 3 === 0 ? 2 : item.id % 3 === 1 ? 3 : 4);
          const minRequired = selectedMinPlayers === '2인이상' ? 2 : selectedMinPlayers === '3인이상' ? 3 : 4;
          if (neededNum < minRequired) return false;
        }

        // 2. 추가 혜택/조건 필터링 (selectedFeatures)
        if (selectedFeatures.length > 0) {
          for (const feat of selectedFeatures) {
            if (feat === '식사포함') {
              if (item.id % 2 !== 0) return false;
            }
            if (feat === '양잔디') {
              if (item.id % 3 !== 0) return false;
            }
          }
        }
      }

      return true;
      });

      return [...filtered].sort((a, b) => {
        let compareVal = 0;
        if (sortBy === '거리순') {
          const distA = parseFloat(getDummyDistance(a.location, a.id));
          const distB = parseFloat(getDummyDistance(b.location, b.id));
          compareVal = distA - distB;
        } else if (sortBy === '금액순') {
          const priceA = parseInt(a.price.replace(/,/g, ''));
          const priceB = parseInt(b.price.replace(/,/g, ''));
          compareVal = priceA - priceB;
        } else {
          compareVal = a.time.localeCompare(b.time);
        }
        return sortOrder === 'asc' ? compareVal : -compareVal;
      });
    };

    const filteredItems = getFilteredItems();

    const getGroupedItems = () => {
      const groups: { [key: string]: {
        name: string;
        location: string;
        distance: string;
        minPrice: number;
        totalTees: number;
        isClosed: boolean;
        items: any[];
      } } = {};

      filteredItems.forEach(item => {
        if (!item) return;
        const courseName = item.name || '알수없음';
        let priceNum = 0;
        if (item.price) {
          const priceStr = String(item.price);
          if (priceStr.includes('만')) {
            priceNum = (parseInt(priceStr.replace(/[^0-9]/g, '')) || 0) * 10000;
          } else {
            priceNum = parseInt(priceStr.replace(/,/g, '')) || 0;
          }
        }

        if (!groups[courseName]) {
          groups[courseName] = {
            name: courseName,
            location: item.location || '',
            distance: getDummyDistance(item.location || '', item.id || 0),
            minPrice: priceNum,
            totalTees: 0,
            isClosed: false,
            items: []
          };
        }

        if (priceNum < groups[courseName].minPrice) {
          groups[courseName].minPrice = priceNum;
        }

        groups[courseName].items.push(item);
      });

      return Object.values(groups).map(g => {
        g.totalTees = g.items.length;
        g.isClosed = g.totalTees === 0 || (g.name.length % 5 === 0);
        return g;
      });
    };

    const renderInlineDetail = (item: any, mode: '부킹' | '조인', caddieType: string) => {
      const viewsCount = mode === '부킹' ? item.id * 4 + 3 : item.id * 5 + 4;
      const channels = ['세종 매니저', '지원 매니저', '제휴 매니저', '김팀장 매니저', '민지 매니저', '김이사 매니저'];
      const managerName = channels[item.id % channels.length] || '에브리골프 매니저';
      
      return (
        <div className="border-t border-gray-100 pt-4 mt-3 w-full text-left space-y-3.5 animate-in fade-in slide-in-from-top-1 duration-150" onClick={(e) => e.stopPropagation()}>
          
          {/* 매니저 코멘트 블록 */}
          <div className="bg-gray-50/70 rounded-xl p-3.5 border border-gray-100 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6.5 h-6.5 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-[10px] font-black shrink-0">
                  {managerName[0]}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-800 font-extrabold">{managerName} 추천사</span>
                  <span className="text-[8.5px] text-gray-400 font-bold">추천 티타임 · {caddieType}</span>
                </div>
              </div>
              <span className="text-[8.5px] text-gray-450 font-bold shrink-0">
                👁️ {viewsCount}명 확인
              </span>
            </div>
            
            <p className="text-gray-650 text-xs font-bold leading-relaxed whitespace-pre-wrap pl-0.5">
              "{item.name || '골프장'}의 잔디 상태 및 그린 컨디션이 매우 우수한 골프장입니다. 편리하고 신속한 실시간 부킹 조율을 약속드리며, 아래 직통 버튼으로 문의 시 즉각 확정 예약을 도와드립니다."
            </p>
          </div>
          
          {/* 직통 연락처 액션 버튼 */}
          <div className="grid grid-cols-2 gap-2.5">
            <a 
              href="tel:010-4043-1307"
              onClick={(e) => { e.stopPropagation(); showToast('매니저 유선 연결 중...'); }}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.98] text-gray-700 py-3 rounded-xl text-[11px] font-black transition-all shadow-sm"
            >
              <Phone size={13} className="text-gray-450 shrink-0" />
              <span>매니저 직통 통화</span>
            </a>
            <button 
              onClick={() => showToast('1:1 메시지 상담으로 이동합니다.')}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white py-3 rounded-xl text-[11px] font-black transition-all shadow-sm"
            >
              <Mail size={13} className="text-white shrink-0" />
              <span>실시간 채팅 문의</span>
            </button>
          </div>
          
          {/* 위약 규정 카드 */}
          <div className="bg-gray-50/60 rounded-xl p-3.5 border border-gray-100 space-y-2.5">
            <div className="flex items-center gap-1.5 text-gray-700 font-extrabold text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></span>
              <span>이용 및 위약 규정 안내</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
              <div className="bg-white p-2.5 rounded-lg border border-gray-100 flex flex-col shadow-sm">
                <span className="text-gray-400 font-bold text-[9px]">주중 취소 기한</span>
                <span className="text-gray-800 font-black mt-0.5"><strong className="text-red-500">5일 전</strong>까지 무료취소</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-gray-100 flex flex-col shadow-sm">
                <span className="text-gray-400 font-bold text-[9px]">주말 취소 기한</span>
                <span className="text-gray-800 font-black mt-0.5"><strong className="text-red-500">8일 전</strong>까지 무료취소</span>
              </div>
            </div>
            
            <ul className="text-[10px] text-gray-500 space-y-1.5 pl-0.5 list-none font-bold">
              <li className="flex items-start gap-1">
                <span className="text-gray-355 mt-0.5 shrink-0">•</span>
                <span>해당 요금은 18홀 정상 라운드 종료시에만 유효하게 적용됩니다.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-gray-355 mt-0.5 shrink-0">•</span>
                <span>기상 악화 시에는 정상 요금을 기준으로 홀별 정산됩니다.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-gray-355 mt-0.5 shrink-0">•</span>
                <span>본 특가는 기타 제휴 혜택 및 중복 할인이 적용되지 않습니다.</span>
              </li>
            </ul>
          </div>
          
        </div>
      );
    };






    return (
      <div className={`bg-gray-50 flex flex-col w-full relative ${showSearchFilter ? 'pb-16 min-h-full overflow-y-auto' : 'flex-1 min-h-0 overflow-hidden'}`}>
        {showSearchFilter ? (
          <>
          {/* 상단 타이틀 */}
          <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 shadow-sm shrink-0 flex items-center justify-between">
            {/* 좌측: 애브리골프 로고 (클릭 시 필터 초기화) */}
            <h1 
              onClick={() => {
                resetFilters();
                showToast('검색 조건이 초기화되었습니다.');
              }}
              className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent tracking-tighter cursor-pointer shrink-0 active:scale-95 transition-all select-none"
              title="검색 조건 초기화"
            >
              everygolf
            </h1>
          </div>

          {/* 필터 입력 영역 (하단 패딩 최소화) */}
          <div className="flex-1 p-5 pb-4 space-y-5">
            {isDiscountSpecialOnly && (
              <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl p-4 shadow-md flex items-center justify-between shrink-0">
                <div>
                  <h4 className="text-xs font-black flex items-center gap-1.5">
                    <Sparkles size={14} className="shrink-0" />
                    <span>실시간 당일/익일 마감특가 선별 중</span>
                  </h4>
                  <p className="text-[10px] opacity-90 font-bold mt-1">
                    18만원 이하의 금일(05/28) & 익일(05/29) 초특가 티타임만 노출됩니다.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsDiscountSpecialOnly(false);
                    setGroupByGolfCourse(true);
                    showToast('일반 부킹 모드로 전환되었습니다.');
                  }}
                  className="bg-white/20 hover:bg-white/35 active:scale-95 text-white font-extrabold text-[9px] px-2.5 py-1.5 rounded-lg transition-all shrink-0"
                >
                  해제
                </button>
              </div>
            )}
            <div>
              <h2 className="text-lg font-black text-gray-800 leading-tight">어디로 라운딩을 떠나시나요?</h2>
              <p className="text-xs text-gray-400 mt-1 font-bold">원하시는 날짜, 시간, 장소를 입력해 주세요.</p>
            </div>

            {/* 필수 필터 섹션 (드롭다운 노출을 위해 overflow-visible 설정) */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4 overflow-visible">
              <h4 className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">필수 입력 요소</h4>
              
              {/* 서비스 구분 (부킹 / 조인 모드 선택) */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-400">서비스 구분</span>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-1.5 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => { 
                      setBookingMode('부킹'); 
                      setIsDiscountSpecialOnly(false); 
                      setGroupByGolfCourse(true);
                      showToast('부킹 모드로 설정되었습니다.');
                    }}
                    className={`flex-1 py-2.5 text-xs font-black rounded-lg transition-all text-center ${
                      bookingMode === '부킹' 
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    부킹
                  </button>
                  <button
                    type="button"
                    onClick={() => { 
                      setBookingMode('조인'); 
                      setIsDiscountSpecialOnly(false); 
                      setGroupByGolfCourse(true);
                      showToast('조인 모드로 설정되었습니다.');
                    }}
                    className={`flex-1 py-2.5 text-xs font-black rounded-lg transition-all text-center ${
                      bookingMode === '조인' 
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    조인
                  </button>
                </div>
              </div>

              {/* 1. 날짜 선택 */}
              <div className="space-y-1.5 relative">
                <span className="text-xs font-bold text-gray-400">희망 날짜</span>
                <div 
                  onClick={() => {
                    setShowCalendarModal(prev => !prev);
                    setShowTimeFilter(false);
                    setShowRegionFilter(false);
                  }}
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 flex items-center justify-between text-sm font-black text-gray-800 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-green-600"/>
                    {selectedDate}
                  </span>
                  <ChevronRight size={16} className={`text-gray-400 transition-transform ${showCalendarModal ? 'rotate-90' : ''}`}/>
                </div>
                

              </div>

              {/* 2. 시간대 선택 */}
              <div className="space-y-1.5 relative">
                <span className="text-xs font-bold text-gray-400">티오프 시간대</span>
                <div 
                  onClick={() => {
                    setShowTimeFilter(prev => !prev);
                    setShowCalendarModal(false);
                    setShowRegionFilter(false);
                  }} 
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 flex items-center justify-between text-sm font-black text-gray-800 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-green-600"/>
                    {selectedTime}
                  </span>
                  <ChevronRight size={16} className={`text-gray-400 transition-transform ${showTimeFilter ? 'rotate-90' : ''}`}/>
                </div>

                {/* 시간대 드롭다운 */}
                {showTimeFilter && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-2xl z-30 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                    {timeOptions.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedTime(opt);
                          setShowTimeFilter(false);
                          showToast(`시간대: ${opt} 적용`);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center justify-between ${
                          selectedTime === opt 
                            ? 'bg-green-50 text-green-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedTime === opt && <CheckCircle2 size={14} className="text-green-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. 라운딩 장소 (지역) */}
              <div className="space-y-1.5 relative">
                <span className="text-xs font-bold text-gray-400">골프장 지역</span>
                <div 
                  onClick={() => {
                    setShowRegionFilter(prev => !prev);
                    setShowCalendarModal(false);
                    setShowTimeFilter(false);
                  }} 
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 flex items-center justify-between text-sm font-black text-gray-800 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-green-600"/>
                    {selectedRegion}
                  </span>
                  <ChevronRight size={16} className={`text-gray-400 transition-transform ${showRegionFilter ? 'rotate-90' : ''}`}/>
                </div>

                {/* 지역 드롭다운 */}
                {showRegionFilter && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-2xl z-30 py-1 overflow-hidden max-h-48 overflow-y-auto hide-scrollbar animate-in fade-in slide-in-from-top-1 duration-150">
                    {regionOptions.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedRegion(opt);
                          setShowRegionFilter(false);
                          showToast(`지역: ${opt} 적용`);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center justify-between ${
                          selectedRegion === opt 
                            ? 'bg-green-50 text-green-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedRegion === opt && <CheckCircle2 size={14} className="text-green-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>



              {/* 골프장명 직접 검색 */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-400">골프장명 직접 검색 (선택)</span>
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between text-sm text-gray-800 focus-within:border-gray-300">
                  <input 
                    type="text" 
                    placeholder="골프장 이름 입력 (예: 스카이72)" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                    className="bg-transparent border-none outline-none w-full font-bold text-gray-800 placeholder:text-gray-400 min-w-0" 
                  />
                  <Search size={16} className="text-gray-400 shrink-0"/>
                </div>
              </div>
            </div>

            {/* 상세 필터 섹션 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button 
                onClick={() => setShowDetailFilterSection(prev => !prev)}
                className="w-full px-5 py-4 flex items-center justify-between font-bold text-sm text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-green-600" />
                  <span>더 정확한 검색을 원하세요? (상세 필터)</span>
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${showDetailFilterSection ? 'rotate-180' : ''}`} />
              </button>

              {showDetailFilterSection && (
                <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-4">


                  {/* 캐디 형태 */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-400">캐디 형태 선택</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['전체', '노캐디', '일반캐디', '드라이빙캐디', '인턴캐디'].map(caddie => (
                        <button
                          key={caddie}
                          type="button"
                          onClick={() => setSelectedCaddieType(caddie)}
                          className={`px-3 py-2 text-xs font-bold rounded-lg border text-center transition-all flex-1 min-w-[70px] ${
                            selectedCaddieType === caddie 
                              ? 'bg-green-600 text-white border-green-600 shadow-sm' 
                              : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          {caddie}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 플레이 인원 (단일 선택형) */}
                  {bookingMode !== '조인' && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-gray-400">플레이 인원 설정</span>
                      <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 gap-1 select-none">
                        {(['전체', '2인이상', '3인이상', '4인이상'] as const).map(opt => {
                          const isSelected = selectedMinPlayers === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setSelectedMinPlayers(opt);
                                showToast(`인원: ${opt} 적용`);
                              }}
                              className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${
                                isSelected 
                                  ? 'bg-white text-green-600 shadow-sm font-extrabold border border-gray-100' 
                                  : 'text-gray-500 hover:text-gray-900 border border-transparent'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 추가 필터 옵션 (아이콘 연계, 다중 선택형) */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-gray-400">추가 옵션 선택 (중복 가능)</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: Award, label: '식사포함' },
                        { icon: Sparkles, label: '양잔디' }
                      ].map(feat => {
                        const isSelected = selectedFeatures.includes(feat.label);
                        return (
                          <button
                            key={feat.label}
                            type="button"
                            onClick={() => {
                              setSelectedFeatures(prev => 
                                prev.includes(feat.label) 
                                  ? prev.filter(f => f !== feat.label) 
                                  : [...prev, feat.label]
                              );
                              showToast(`옵션: ${feat.label} ${!isSelected ? '선택' : '해제'}`);
                            }}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-[11px] font-black transition-all ${
                              isSelected 
                                ? 'bg-green-600 text-white border-green-600 shadow-sm' 
                                : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                            }`}
                          >
                            <feat.icon size={13} className={isSelected ? 'text-white' : 'text-gray-400'} />
                            <span className="truncate">{feat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 하단 검색하기 버튼 (고정 해제하여 스크롤 흐름에 맞춤) */}
          <div className="w-full p-5 bg-white border-t border-gray-100 mt-4 shadow-sm relative z-10">
            <button 
              onClick={() => {
                try {
                  console.log("검색 버튼 클릭 시작");
                  setShowSearchFilter(false);
                  showToast('선택한 조건으로 티를 검색했습니다.');
                } catch (err: any) {
                  alert("검색 클릭 핸들러 에러: " + err.message);
                }
              }}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black rounded-2xl shadow-lg hover:from-green-700 hover:to-emerald-700 transition-colors text-base"
            >
              검색하기
            </button>
          </div>
        </>
      ) : (
        <div ref={scrollRef} className="flex-1 w-full overflow-y-auto hide-scrollbar bg-gray-50 flex flex-col pb-32">
          {/* 상단 헤더 영역 (탭 + 날짜 + 시간대/조인) */}
          <div className="bg-white flex flex-col shrink-0">
             
          </div>

          <div className="bg-white flex flex-col shrink-0">
            {/* 상단 헤더 영역 (로고 + 부킹/조인 탭) */}
            <div className="bg-white px-5 pt-12 pb-0 border-b border-gray-100 flex items-center justify-between">
              {/* 좌측: 애브리골프 로고 (클릭 시 필터 메인화면으로 이동) */}
              <h1 
                onClick={() => {
                  setShowSearchFilter(true);
                  showToast('메인 검색 화면으로 이동했습니다.');
                }}
                className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent tracking-tighter cursor-pointer shrink-0 active:scale-95 transition-all select-none"
                title="메인 검색 화면으로 이동"
              >
                everygolf
              </h1>

              {/* 우측: 부킹/조인 모드 전환 버튼 */}
              <div className="flex gap-3.5 select-none items-center">
                <button 
                  onClick={() => {
                    setBookingMode('부킹');
                    setIsDiscountSpecialOnly(true);
                    setSelectedDate('05/28 (목)');
                    setGroupByGolfCourse(false);
                    setShowSearchFilter(false);
                    showToast('금일~익일 마감 임박 특가 티타임을 검색합니다. ⚡');
                  }}
                  className={`pb-3 text-sm font-black border-b-[3px] transition-all flex items-center gap-0.5 active:scale-95 ${
                    (bookingMode === '부킹' && isDiscountSpecialOnly) 
                      ? 'border-rose-500 text-rose-500' 
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Sparkles size={14} className={(bookingMode === '부킹' && isDiscountSpecialOnly) ? 'text-rose-500 fill-current' : 'text-gray-400'} />
                  <span>특가티</span>
                </button>
                <button 
                  onClick={() => {
                    setBookingMode('부킹');
                    setIsDiscountSpecialOnly(false);
                    setGroupByGolfCourse(true);
                  }} 
                  className={`pb-3 text-sm font-black border-b-[3px] transition-all flex items-center gap-0.5 active:scale-95 ${
                    (bookingMode === '부킹' && !isDiscountSpecialOnly) 
                      ? 'border-gray-900 text-gray-900' 
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Flag size={14} className={(bookingMode === '부킹' && !isDiscountSpecialOnly) ? 'text-gray-900 fill-current' : 'text-gray-400'} />
                  <span>부킹</span>
                </button>
                <button 
                  onClick={() => {
                    setBookingMode('조인');
                    setIsDiscountSpecialOnly(false);
                    setGroupByGolfCourse(true);
                  }} 
                  className={`pb-3 text-sm font-black border-b-[3px] transition-all flex items-center gap-0.5 active:scale-95 ${
                    (bookingMode === '조인') 
                      ? 'border-gray-900 text-gray-900' 
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <UserPlus size={14} className={bookingMode === '조인' ? 'text-gray-900' : 'text-gray-400'} />
                  <span>조인</span>
                </button>
              </div>
            </div>

            {/* 가로 스크롤 캘린더 칩 (빠른 날짜 변경) */}
            <div className="bg-white border-b border-gray-100 relative overflow-visible">
            <div className="flex items-center overflow-x-auto hide-scrollbar px-2 py-1.5 w-full">
              {!isDiscountSpecialOnly && (
                <button 
                  onClick={() => {
                    setShowCalendarModal(prev => !prev);
                    setShowTimeFilter(false);
                    setShowRegionFilter(false);

                  }}
                  className="min-w-[50px] h-[52px] flex items-center justify-center bg-white border border-gray-100 rounded-xl mx-0.5 text-gray-600 hover:bg-gray-50 shrink-0"
                >
                  <Calendar size={18} />
                </button>
              )}
              {(isDiscountSpecialOnly ? [dates[3], dates[4]] : dates).map((date) => {
                const isSelected = selectedDate === date;
                const isWeekend = date.includes('토') || date.includes('일');
                return (
                  <button 
                    key={date} 
                    onClick={() => setSelectedDate(date)}
                    className={`h-[52px] flex flex-col items-center justify-center rounded-xl mx-0.5 transition-all ${
                      isDiscountSpecialOnly ? 'flex-1' : 'min-w-[50px] shrink-0'
                    } ${isSelected ? 'bg-gray-900 text-white shadow-md' : 'bg-white hover:bg-gray-50 border border-gray-100'} ${isWeekend && !isSelected ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    <span className={`font-black leading-none ${isDiscountSpecialOnly ? 'text-xs' : 'text-[9.5px] font-medium mb-1'}`}>
                      {isDiscountSpecialOnly 
                        ? (date === dates[3] ? `오늘(${date.split(' ')[0]})` : `내일(${date.split(' ')[0]})`) 
                        : date.split(' ')[0]}
                    </span>
                    {!isDiscountSpecialOnly && (
                      <span className={`text-[11px] font-black leading-none ${isSelected ? 'text-white' : 'text-gray-900'} ${isWeekend && !isSelected ? 'text-red-500' : ''}`}>
                        {date.split(' ')[1]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 시간대 빠른 선택 칩 바 (가로폭 꽉 차게 4등분 배치 및 큼직하게 조정) */}
          <div className="bg-white px-4 py-2.5 flex flex-col gap-2 border-b border-gray-50 shrink-0">
            <div className="flex items-center gap-2">
              {[
                { label: '전체', value: '전체 시간' },
                { label: '오전', value: '오전' },
                { label: '오후', value: '오후' },
                { label: '야간', value: '야간' }
              ].map(item => {
                const isSelected = selectedTime === item.value || (item.value === '전체 시간' && selectedTime === '전체 시간') || (item.value === '오전' && selectedTime.includes('1부')) || (item.value === '오후' && selectedTime.includes('2부')) || (item.value === '야간' && (selectedTime.includes('3부') || selectedTime.includes('야간')));
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setSelectedTime(item.value);
                      showToast(`시간대: ${item.label} 적용`);
                    }}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-black transition-all text-center ${
                      isSelected
                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* 조인 전용 서브 조건 필터 칩 바 (전체/커플/남성/여성/1인/2인) */}
            {bookingMode === '조인' && (
              <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pt-1.5 border-t border-gray-100/50">
                {[
                  { label: '전체', value: '전체' },
                  { label: '커플', value: '커플' },
                  { label: '남성', value: '남성' },
                  { label: '여성', value: '여성' },
                  { label: '1인', value: '1인' },
                  { label: '2인', value: '2인' }
                ].map(item => {
                  const isSelected = selectedJoinFilter === item.value;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setSelectedJoinFilter(item.value);
                        showToast(`조인 조건: ${item.label} 적용`);
                      }}
                      className={`px-3.5 py-1.5 rounded-full border text-[11px] font-black transition-all text-center shrink-0 min-w-[56px] ${
                        isSelected
                          ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          </div>

          {/* 목록 및 필터 바 영역 (스크롤 없이 통합) */}
          <div className="flex-1 w-full bg-gray-50 flex flex-col min-h-0">

          {/* 필터 및 정렬 바 (1열 & 2열 구조) */}
          <div className="bg-white border-b border-gray-100 px-4 py-3 space-y-2.5 overflow-visible">
            {/* 1열: 통합 필터 및 정렬/지도로보기 통합 라인 (2열 제거로 화면 극적 확보) */}
            <div className="flex items-center justify-between w-full select-none pb-0.5 overflow-visible gap-2">
              {/* 좌측 영역: 필터 버튼 & 적용된 필터 요약 칩 */}
              <div className="flex items-center gap-1.5 shrink min-w-0 overflow-visible">
                <button
                  type="button"
                  onClick={() => setShowDetailFilterSection(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-black transition-all shrink-0 shadow-sm active:scale-[0.97] ${
                    hasActiveFilters()
                      ? 'bg-green-600 text-white border-green-600 font-extrabold'
                      : 'bg-gray-50 text-gray-700 border-gray-150 hover:bg-gray-100'
                  }`}
                >
                  <SlidersHorizontal size={11} className={hasActiveFilters() ? 'text-white' : 'text-gray-500'} />
                  <span>필터 {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}</span>
                </button>

                {/* 적용된 필터 조건 요약 칩 바 */}
                {hasActiveFilters() && (
                  <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar text-[9px] font-bold text-gray-400 shrink min-w-0 whitespace-nowrap py-0.5 max-w-[120px]">
                    {getActiveFilterSummary().map((sumText, sIdx) => (
                      <span key={sIdx} className="bg-green-50 text-green-600 px-2 py-0.5 rounded-md border border-green-100 shrink-0">
                        {sumText}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 우측 영역: 추천순 정렬 & 지도로보기 */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* 2. 추천순 정렬 드롭다운 */}
                <div className="relative z-35">
                  <button
                    type="button"
                    onClick={() => setShowSortDropdown(prev => !prev)}
                    className="flex items-center gap-1 bg-gray-50 border border-gray-100 hover:bg-gray-100 px-3 py-1.5 rounded-xl text-gray-700 font-extrabold shadow-sm transition-all active:scale-[0.97] inline-flex text-[11px]"
                  >
                    <SlidersHorizontal size={11} className="text-gray-500" />
                    <span>{sortBy}</span>
                    {sortBy !== '추천순' && (
                      sortOrder === 'asc' ? <ArrowDown size={11} className="text-green-600" /> : <ArrowUp size={11} className="text-green-600" />
                    )}
                    <ChevronDown size={11} className={`text-gray-400 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showSortDropdown && (
                      <>
                        {/* 드롭다운 닫기용 백드롭 */}
                        <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)}></div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-1.5 w-28 bg-white border border-gray-150 rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden"
                        >
                          {['추천순', '거리순', '시간순', '금액순'].map((sortOption) => {
                            const isSelected = sortBy === sortOption;
                            return (
                              <button
                                key={sortOption}
                                type="button"
                                onClick={() => {
                                  if (isSelected && sortOption !== '추천순') {
                                    const nextOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                                    setSortOrder(nextOrder);
                                    showToast(`${sortOption} ${nextOrder === 'asc' ? '낮은순' : '높은순'} 적용`);
                                  } else {
                                    setSortBy(sortOption as any);
                                    setSortOrder('asc');
                                    showToast(`${sortOption} 적용`);
                                  }
                                  setShowSortDropdown(false);
                                }}
                                className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-all flex items-center justify-between ${
                                  isSelected 
                                    ? 'bg-green-50 text-green-600 font-black' 
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <span>{sortOption}</span>
                                {isSelected && sortOption !== '추천순' && (
                                  sortOrder === 'asc' ? <ArrowDown size={11} className="text-green-600 shrink-0" /> : <ArrowUp size={11} className="text-green-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. 지도로 보기 */}
                <button 
                  onClick={() => {
                    pushView('map', { type: activeTab });
                    showToast('지도 뷰로 이동합니다.');
                  }}
                  className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 hover:bg-gray-100 px-3 py-1.5 rounded-xl text-gray-700 font-extrabold shadow-sm transition-all active:scale-[0.97] shrink-0 inline-flex text-[11px] animate-in fade-in slide-in-from-right-1 duration-150"
                >
                  <Map size={11} className="text-green-600" />
                  <span>지도로보기</span>
                </button>
              </div>
            </div>
          </div>


          {/* 실시간 필터 매칭 결과 목록 (골팡 스타일 적용) */}
          <div className="bg-white px-5 py-4 shadow-sm min-h-[400px]">
            <div className="flex justify-between items-center mb-4">
              {(() => {
                const uniqueCoursesCount = new Set(filteredItems.map(item => item.name.split(' ')[0])).size;
                return (
                  <h3 className="font-black text-gray-900 text-base">
                    {uniqueCoursesCount}개 골프장 · {filteredItems.length}개 티타임
                  </h3>
                );
              })()}
              {/* 우측: 2열에서 이동 장착된 골프장별보기 토글 스위치 (캡슐형) */}
              <button
                type="button"
                onClick={() => {
                  setGroupByGolfCourse(prev => !prev);
                  setExpandedGroup(null);
                  showToast(!groupByGolfCourse ? '골프장별 보기 적용' : '티타임별 보기 적용');
                }}
                className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 hover:text-gray-900 transition-all shrink-0 select-none bg-gray-50 border border-gray-150 px-2.5 py-1.5 rounded-xl shadow-sm hover:bg-gray-100 active:scale-[0.97]"
              >
                <div className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${groupByGolfCourse ? 'bg-green-600' : 'bg-gray-200'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out transform ${groupByGolfCourse ? 'translate-x-3' : 'translate-x-0'}`} />
                </div>
                <span>골프장별보기</span>
              </button>
            </div>
            
            {filteredItems.length > 0 ? (
              <div className="space-y-3.5">
                {groupByGolfCourse ? (
                  // 골프장별 보기 그룹핑 뷰
                  getGroupedItems().map((group, i) => {
                    const isGroupExpanded = expandedGroup === group.name;
                    const isGroupLiked = likedGolfCourses.includes(group.name);
                    return (
                      <div key={i} className="border-b border-gray-100 pb-1 text-left">
                        {/* 골프장 그룹 헤더 */}
                        <div 
                          onClick={() => setExpandedGroup(prev => prev === group.name ? null : group.name)}
                          className="flex justify-between items-center py-3.5 px-1 hover:bg-gray-50/50 cursor-pointer transition-all"
                        >
                          {/* 좌측: 골프장명 + 거리 */}
                          <div className="flex flex-col text-left">
                            <h4 className="font-extrabold text-gray-900 text-[15px] flex items-center gap-1">
                              <span>{group.name}</span>
                            </h4>
                            <span className="text-[10.5px] text-gray-500 font-bold flex items-center gap-0.5 mt-0.5">
                              <MapPin size={10} className="text-green-600 shrink-0" />
                              <span>{group.distance}</span>
                            </span>
                          </div>

                          {/* 우측: 최저가 + 잔여 티 개수 배지 + 하트 찜하기 + 펼치기 */}
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end text-right">
                              <span className="text-[12px] font-black text-green-600">
                                {group.minPrice.toLocaleString()}~
                              </span>
                              <div className="mt-1">
                                {group.isClosed ? (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-500 border border-red-100">마감</span>
                                ) : (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-50 text-green-600 border border-green-100">남은 티 {group.totalTees}개</span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setLikedGolfCourses(prev => {
                                  const isLiked = prev.includes(group.name);
                                  showToast(isLiked ? `${group.name} 찜하기를 취소했습니다.` : `${group.name}을(를) 찜 목록에 추가했습니다.`);
                                  return isLiked ? prev.filter(c => c !== group.name) : [...prev, group.name];
                                });
                              }}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Heart 
                                size={14} 
                                className={isGroupLiked ? 'text-red-500 fill-current' : ''} 
                              />
                            </button>

                            <ChevronDown 
                              size={14} 
                              className={`text-gray-400 transition-transform duration-200 shrink-0 ${isGroupExpanded ? 'rotate-180' : ''}`} 
                            />
                          </div>
                        </div>

                        {/* 아코디언 확장 시 개별 티타임 목록 */}
                        {isGroupExpanded && (
                          <div className="pl-4 pr-1 py-2 bg-gray-50/50 rounded-xl mt-1 space-y-2 border border-gray-100/50 animate-in fade-in slide-in-from-top-1 duration-200">
                            {group.items.map((item, idx) => {
                              const itemKey = bookingMode === '부킹' ? `booking-${item.id}` : `join-${item.id}`;
                              const isExpanded = expandedItemId === itemKey;
                              const caddieType = item.id % 4 === 0 ? '노캐디' : item.id % 4 === 1 ? '일반캐디' : item.id % 4 === 2 ? '드라이빙캐디' : '인턴캐디';
                              const channels = ['세종 매니저', '지원 매니저', '제휴 매니저', '김팀장 매니저', '민지 매니저', '김이사 매니저'];
                              const channelName = channels[item.id % channels.length];

                              return (
                                <div 
                                  key={idx}
                                  id={itemKey}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedItemId(prev => prev === itemKey ? null : itemKey);
                                  }}
                                  className={`bg-white transition-all cursor-pointer flex flex-col ${
                                    isExpanded 
                                      ? 'p-4 border border-green-300 ring-1 ring-green-300 shadow-md rounded-2xl my-2' 
                                      : 'p-3 border-b border-gray-100/70 rounded-lg hover:bg-gray-100/50'
                                  }`}
                                >
                                  <div className="flex justify-between items-center w-full py-0.5 text-left">
                                    <div className="flex flex-col w-[30%] shrink-0">
                                      <span className="text-[12.5px] text-gray-800 font-black">
                                        {item.time}
                                      </span>
                                      <span className="text-[9.5px] text-gray-400 font-bold mt-0.5">{isDiscountSpecialOnly ? (item.id % 2 === 0 ? '05/28 (목)' : '05/29 (금)') : selectedDate.split(' ')[0]}</span>
                                    </div>
                                    <div className="flex flex-col items-center text-center w-[40%] shrink-0">
                                      <div className="flex items-center gap-1 justify-center">
                                        <span className="text-[11px] text-gray-600 font-bold">{channelName}</span>
                                      </div>
                                      {bookingMode === '부킹' && (
                                        <span className="text-[10px] text-gray-400 font-medium mt-0.5">{caddieType}</span>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-end text-right w-[30%] shrink-0">
                                      {isDiscountSpecialOnly && bookingMode === '부킹' ? (
                                        <div className="flex flex-col items-end">
                                          <p className="text-[9.5px] text-gray-400 font-bold line-through leading-none mb-0.5">
                                            {item.price}원
                                          </p>
                                          <p className="font-black text-rose-500 text-[13.5px] leading-tight">
                                            {(parseInt(item.price.replace(/,/g, '')) - 10000).toLocaleString()}<span className="text-xs font-bold text-gray-500 ml-0.5">원</span>
                                          </p>
                                          <span className="text-[8.5px] font-black bg-rose-50 text-rose-600 px-1 py-0.5 rounded mt-0.5 shrink-0 block w-max">
                                            1만P 적립 (체감가)
                                          </span>
                                        </div>
                                      ) : (
                                        <p className="font-black text-blue-500 text-[14px]">
                                          {item.price}<span className="text-xs font-bold text-gray-500 ml-0.5">원</span>
                                        </p>
                                      )}
                                      {bookingMode === '조인' && (
                                        <span className="text-[10.5px] font-bold text-orange-500 mt-0.5">
                                          {item.needed}명 · {item.gender === '무관' ? '성별무관' : item.gender}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* 공통 인라인 상세 컴포넌트 호출 */}
                                  {isExpanded && renderInlineDetail(item, bookingMode, caddieType)}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  // 기존 렌더링 방식 (bookingMode === '부킹' ? ... : ... )
                  bookingMode === '부킹' ? (
                    filteredItems.map((booking, i) => {
                      const isExpanded = expandedItemId === `booking-${booking.id}`;
                      const caddieType = booking.id % 4 === 0 ? '노캐디' : booking.id % 4 === 1 ? '일반캐디' : booking.id % 4 === 2 ? '드라이빙캐디' : '인턴캐디';
                      return (
                        <div 
                          key={i} 
                          id={`booking-${booking.id}`}
                          onClick={() => setExpandedItemId(prev => prev === `booking-${booking.id}` ? null : `booking-${booking.id}`)} 
                          className={`bg-white transition-all cursor-pointer flex flex-col ${
                            isExpanded 
                              ? 'p-4 border border-green-300 ring-1 ring-green-300 shadow-md rounded-2xl my-2' 
                              : 'p-3.5 border-b border-gray-100 rounded-none shadow-none hover:bg-gray-50/50'
                          }`}
                        >
                          {(() => {
                            const channels = ['세종 매니저', '지원 매니저', '제휴 매니저', '김팀장 매니저', '민지 매니저', '김이사 매니저'];
                            const channelName = channels[booking.id % channels.length];
                            return (
                              <div className="flex justify-between items-center w-full py-1 text-left">
                                <div className="flex flex-col gap-1 w-[32%] shrink-0">
                                  <h4 className="font-bold text-gray-900 text-[15px] truncate leading-tight">{booking.name.split(' ')[0]}</h4>
                                  <span className="text-[10.5px] text-gray-500 font-bold flex items-center gap-0.5">
                                    <MapPin size={10} className="text-green-600 shrink-0" />
                                    <span>{getDummyDistance(booking.location, booking.id)}</span>
                                  </span>
                                </div>
                                <div className="flex flex-col gap-1 items-center text-center w-[38%] shrink-0">
                                  <span className="text-[12px] text-gray-800 font-black">
                                    {isDiscountSpecialOnly ? (booking.id % 2 === 0 ? '05/28' : '05/29') : selectedDate.split(' ')[0]}<span className="text-gray-400 font-bold">{isDiscountSpecialOnly ? (booking.id % 2 === 0 ? '(목)' : '(금)') : selectedDate.split(' ')[1]}</span> {booking.time}
                                  </span>
                                  <div className="flex items-center gap-1 justify-center">
                                    <span className="text-[11px] text-gray-600 font-bold">{channelName}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1 items-end text-right w-[30%] shrink-0">
                                  <div className="flex items-center gap-1 justify-end">
                                    <span className="text-[11px] text-gray-500 font-bold">{caddieType}</span>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLikeBooking(`booking-${booking.id}`, booking.name);
                                      }}
                                      className="p-1 -mr-1 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                      <Heart 
                                        size={13} 
                                        className={likedBookings.includes(`booking-${booking.id}`) ? 'text-red-500 fill-current' : ''} 
                                      />
                                    </button>
                                  </div>
                                  {isDiscountSpecialOnly && bookingMode === '부킹' ? (
                                    <div className="flex flex-col items-end">
                                      <p className="text-[9.5px] text-gray-400 font-bold line-through leading-none mb-0.5">
                                        {booking.price}원
                                      </p>
                                      <p className="font-black text-rose-500 text-[14px] leading-tight">
                                        {(parseInt(booking.price.replace(/,/g, '')) - 10000).toLocaleString()}<span className="text-xs font-bold text-gray-500 ml-0.5">원</span>
                                      </p>
                                      <span className="text-[8.5px] font-black bg-rose-50 text-rose-600 px-1 py-0.5 rounded mt-0.5 shrink-0 block w-max">
                                        1만P 적립 (체감가)
                                      </span>
                                    </div>
                                  ) : (
                                    <p className="font-black text-blue-500 text-[14.5px]">
                                      {booking.price}<span className="text-xs font-bold text-gray-500 ml-0.5">원</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                          {/* 공통 인라인 상세 컴포넌트 호출 */}
                          {isExpanded && renderInlineDetail(booking, bookingMode, caddieType)}
                        </div>
                      );
                    })
                  ) : (
                    filteredItems.map((join, i) => {
                      const isExpanded = expandedItemId === `join-${join.id}`;
                      const caddieType = join.id % 4 === 0 ? '노캐디' : join.id % 4 === 1 ? '일반캐디' : join.id % 4 === 2 ? '드라이빙캐디' : '인턴캐디';
                      return (
                         <div 
                          key={i} 
                          id={`join-${join.id}`}
                          onClick={() => setExpandedItemId(prev => prev === `join-${join.id}` ? null : `join-${join.id}`)} 
                          className={`bg-white transition-all cursor-pointer flex flex-col ${
                            isExpanded 
                              ? 'p-4 border border-green-300 ring-1 ring-green-300 shadow-md rounded-2xl my-2' 
                              : 'p-3.5 border-b border-gray-100 rounded-none shadow-none hover:bg-gray-50/50'
                          }`}
                        >
                          {(() => {
                            const channels = ['세종 매니저', '지원 매니저', '제휴 매니저', '김팀장 매니저', '민지 매니저', '김이사 매니저'];
                            const channelName = channels[join.id % channels.length];
                            return (
                              <div className="flex justify-between items-center w-full py-1 text-left">
                                <div className="flex flex-col gap-1 w-[32%] shrink-0">
                                  <h4 className="font-bold text-gray-900 text-[15px] truncate leading-tight">{join.name.split(' ')[0]}</h4>
                                  <span className="text-[10.5px] text-gray-500 font-bold flex items-center gap-0.5">
                                    <MapPin size={10} className="text-green-600 shrink-0" />
                                    <span>{getDummyDistance(join.location, join.id)}</span>
                                  </span>
                                </div>
                                <div className="flex flex-col gap-1 items-center text-center w-[38%] shrink-0">
                                  <span className="text-[12px] text-gray-800 font-black">
                                    {isDiscountSpecialOnly ? (join.id % 2 === 0 ? '05/28' : '05/29') : selectedDate.split(' ')[0]}<span className="text-gray-400 font-bold">{isDiscountSpecialOnly ? (join.id % 2 === 0 ? '(목)' : '(금)') : selectedDate.split(' ')[1]}</span> {join.time}
                                  </span>
                                  <div className="flex items-center gap-1 justify-center">
                                    <span className="text-[11px] text-gray-600 font-bold">{channelName}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1 items-end text-right w-[30%] shrink-0">
                                  <div className="flex items-center gap-1 justify-end">
                                    <span className="text-[11px] text-orange-500 font-bold">{(join as any).needed}명 · {join.gender === '무관' ? '성별무관' : join.gender}</span>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLikeBooking(`join-${join.id}`, join.name);
                                      }}
                                      className="p-1 -mr-1 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                      <Heart 
                                        size={13} 
                                        className={likedBookings.includes(`join-${join.id}`) ? 'text-red-500 fill-current' : ''} 
                                      />
                                    </button>
                                  </div>
                                  <p className="font-black text-blue-500 text-[14.5px]">
                                    {join.price}<span className="text-xs font-bold text-gray-500 ml-0.5">원</span>
                                  </p>
                                </div>
                              </div>
                            );
                          })()}
                          {/* 공통 인라인 상세 컴포넌트 호출 */}
                          {isExpanded && renderInlineDetail(join, bookingMode, caddieType)}
                        </div>
                      );
                    })
                  )
                )}
              </div>
            ) : (
              // 필터링 결과가 없을 때의 Empty State
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3 border border-gray-100">
                  <Search size={28} />
                </div>
                <p className="font-bold text-gray-800 text-sm">해당 조건에 맞는 티타임이 없습니다.</p>
                <p className="text-xs text-gray-400 mt-1 font-medium">검색어나 필터 조건을 변경해 보세요.</p>
                <p onClick={resetFilters} className="mt-4 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 inline-block cursor-pointer">
                  전체보기
                </p>
              </div>
            )}
          </div>
        </div>
      </div>)}






        {/* 티 상세 정보 바텀 시트 (골팡 스타일) */}
        <AnimatePresence>
          {activeDetailItem && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-end justify-center"
              onClick={() => setActiveDetailItem(null)}
            >
              <motion.div 
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-full bg-white rounded-t-[30px] p-6 shadow-2xl max-h-[85vh] flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5 shrink-0"></div>
                
                <div className="flex justify-between items-start mb-4 shrink-0">
                  <div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border shrink-0 ${activeDetailItem.type === '조인' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                      {activeDetailItem.type === '조인' ? `${activeDetailItem.data.needed}명 모집중` : '일반 부킹'}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 mt-2">{activeDetailItem.data.name}</h3>
                    <p className="text-xs text-gray-500 font-bold mt-1 flex items-center gap-1"><MapPin size={12}/> {activeDetailItem.data.location}</p>
                  </div>
                  <button onClick={() => setActiveDetailItem(null)} className="p-1 bg-gray-50 text-gray-400 rounded-full"><X size={18}/></button>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-5 py-2">
                  {/* 이미지 */}
                  {activeDetailItem.data.image && (
                    <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
                      <img src={activeDetailItem.data.image} className="w-full h-full object-cover" alt="golf course" />
                    </div>
                  )}

                  {/* 일정 및 가격 정보 카드 */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-900 font-bold shadow-sm border border-gray-100"><Clock size={18} className="text-green-600"/></div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold mb-0.5">티오프 시간</p>
                        <p className="font-black text-gray-800 text-sm">{isDiscountSpecialOnly ? (activeDetailItem.data.id % 2 === 0 ? '05/28 (목)' : '05/29 (금)') : selectedDate.split(' ')[0]} {activeDetailItem.data.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {activeDetailItem.data.originalPrice && (
                        <span className="text-xs text-gray-400 line-through block font-medium">{activeDetailItem.data.originalPrice}원</span>
                      )}
                      <span className="font-black text-xl text-red-500">{activeDetailItem.data.price}원</span>
                    </div>
                  </div>

                  {/* 세부 비용 및 안내 */}
                  <div className="space-y-3">
                    <h4 className="font-black text-gray-900 text-sm">코스 / 요금 상세 안내</h4>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50 text-xs text-gray-600 space-y-2.5 font-bold">
                      <div className="flex justify-between">
                        <span className="text-gray-400">그린피 (1인 기준)</span>
                        <span className="text-gray-800">{activeDetailItem.data.price}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">카트비 (팀당)</span>
                        <span className="text-gray-800">100,000원</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">캐디피 (현장 정산)</span>
                        <span className="text-gray-800">150,000원</span>
                      </div>
                    </div>
                  </div>

                  {/* 조인 글일 경우 호스트 및 성별/나이 조건 노출 */}
                  {activeDetailItem.type === '조인' && (
                    <div className="space-y-3">
                      <h4 className="font-black text-gray-900 text-sm">동반 조인 조건</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100/50"><span className="text-gray-400 block mb-1">모집 연령</span><span className="text-gray-800 text-sm">{activeDetailItem.data.age}</span></div>
                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100/50"><span className="text-gray-400 block mb-1">모집 성별</span><span className="text-gray-800 text-sm">{activeDetailItem.data.gender}</span></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 하단 버튼 액션 */}
                <div className="pt-4 border-t border-gray-100 shrink-0 pb-safe flex gap-3">
                  <button 
                    onClick={() => {
                      showToast('카카오톡으로 일정을 공유합니다.');
                    }}
                    className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-600 hover:bg-gray-100 shrink-0"
                  >
                    <Share2 size={22}/>
                  </button>
                  {activeDetailItem.type === '부킹' ? (
                    <button 
                      onClick={() => {
                        setActiveDetailItem(null);
                        pushView('checkout', activeDetailItem.data);
                      }}
                      className="flex-1 bg-gray-900 text-white font-black rounded-2xl shadow-lg hover:bg-gray-800 transition-colors text-base"
                    >
                      예약 진행하기
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setActiveDetailItem(null);
                        showToast('조인 신청이 호스트에게 전달되었습니다.');
                        setTimeout(() => pushView('success', { message: '조인 신청 완료!', subMessage: '호스트에게 메시지를 발송했습니다. 수락 시 푸시로 알려 드립니다.' }), 400);
                      }}
                      className="flex-1 bg-green-600 text-white font-black rounded-2xl shadow-lg hover:bg-green-700 transition-colors text-base"
                    >
                      조인 신청하기
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

    const CommunityTabView = () => {
      const hasActivePartnerFilters = () => {
        return (
          partnerFilters.cost < 300000 ||
          partnerFilters.gender !== '전체' ||
          partnerFilters.age !== '전체' ||
          partnerFilters.region !== '전체' ||
          partnerFilters.smoke !== '전체'
        );
      };

      const getActivePartnerFilterCount = () => {
        let count = 0;
        if (partnerFilters.cost < 300000) count++;
        if (partnerFilters.gender !== '전체') count++;
        if (partnerFilters.age !== '전체') count++;
        if (partnerFilters.region !== '전체') count++;
        if (partnerFilters.smoke !== '전체') count++;
        return count;
      };

      const getActivePartnerFilterSummary = () => {
        const summary: string[] = [];
        if (partnerFilters.cost < 300000) summary.push(`${partnerFilters.cost / 10000}만 이하`);
        if (partnerFilters.gender !== '전체') summary.push(partnerFilters.gender);
        if (partnerFilters.age !== '전체') summary.push(partnerFilters.age);
        if (partnerFilters.region !== '전체') summary.push(partnerFilters.region);
        if (partnerFilters.smoke !== '전체') summary.push(partnerFilters.smoke);
        return summary;
      };

      const handleAcceptApplicant = (partnerId: number, applicantId: number) => {
        setPartnerList(prev => prev.map(p => {
          if (p.id === partnerId) {
            const updatedApplicants = p.applicants.map((a: any) => 
              a.id === applicantId ? { ...a, status: '참여 확정' } : a
            );
            const nextNeeded = Math.max(0, (p.needed || 1) - 1);
            const nextStatus = nextNeeded === 0 ? '마감' : p.status;
            
            showToast('지원자의 동반자 신청을 수락하였습니다! ⛳');
            return { 
              ...p, 
              applicants: updatedApplicants,
              needed: nextNeeded,
              status: nextStatus
            };
          }
          return p;
        }));
      };

      const handleRejectApplicant = (partnerId: number, applicantId: number) => {
        setPartnerList(prev => prev.map(p => {
          if (p.id === partnerId) {
            const updatedApplicants = p.applicants.map((a: any) => 
              a.id === applicantId ? { ...a, status: '거절됨' } : a
            );
            showToast('지원자의 신청을 거절 처리하였습니다.');
            return { 
              ...p, 
              applicants: updatedApplicants 
            };
          }
          return p;
        }));
      };

      const getCCName = (partner: any) => {
        if (partner.name) return partner.name;
        const title = partner.title || '';
        const closeBraceIdx = title.indexOf(']');
        if (closeBraceIdx !== -1) {
          const afterBrace = title.substring(closeBraceIdx + 1).trim();
          const match = afterBrace.match(/(.+?)\s+\d+명/);
          if (match) return match[1].trim();
          return afterBrace;
        }
        return '골프 CC';
      };

      const getFormattedDate = (dateStr: string) => {
        const dateVal = dateStr || '오늘';
        if (dateVal === '오늘' || dateVal === '05/28 (목)') {
          return '오늘';
        }
        if (dateVal === '내일' || dateVal === '05/29 (금)') {
          return '05/29 (금)';
        }
        if (dateVal === '이번주 주말' || dateVal === '05/30 (토)') {
          return '05/30 (토)';
        }
        return dateVal;
      };

      // ageMatch removed to resolve TS6133

    const getAgeDecades = (ageStr: string): number[] => {
      if (ageStr === '전체' || ageStr === '무관') return [20, 30, 40, 50];
      if (ageStr === '50대 이상') return [50, 60, 70];
      const decades: number[] = [];
      const match = ageStr.match(/(\d+)(?:~(\d+))?대/);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = match[2] ? parseInt(match[2], 10) : start;
        for (let i = start; i <= end; i += 10) {
          decades.push(i);
        }
      }
      return decades;
    };

    const isAgeFilterMatch = (filterAge: string, partnerAge: string) => {
      if (filterAge === '전체' || partnerAge === '무관') return true;
      const filterDecades = getAgeDecades(filterAge);
      const partnerDecades = getAgeDecades(partnerAge);
      return filterDecades.some(d => partnerDecades.includes(d));
    };

    const isRegionFilterMatch = (filterRegion: string, partnerLocation: string) => {
      if (filterRegion === '전체' || filterRegion === '지역 전체' || filterRegion === '전체 지역' || filterRegion === '골프장 지역') return true;
      if (filterRegion === '경기') {
        return partnerLocation.includes('경기');
      }
      if (filterRegion === '충청') {
        return partnerLocation.includes('충청') || partnerLocation.includes('충남') || partnerLocation.includes('충북') || partnerLocation.includes('세종');
      }
      if (filterRegion === '경상') {
        return partnerLocation.includes('경상') || partnerLocation.includes('경남') || partnerLocation.includes('경북') || partnerLocation.includes('대구') || partnerLocation.includes('부산') || partnerLocation.includes('울산');
      }
      if (filterRegion === '전라') {
        return partnerLocation.includes('전라') || partnerLocation.includes('전남') || partnerLocation.includes('전북') || partnerLocation.includes('광주');
      }
      return partnerLocation.includes(filterRegion);
    };

    const filteredPartners = partnerList.filter(partner => {
      // 1. 상세 조건 필터 (partnerFilters)
      // 비용 필터링 (슬라이더 수치 비교)
      if (partnerFilters.cost < 300000) {
        const priceStr = partner.price ? partner.price.replace(/,/g, '') : '0';
        const partnerPrice = parseInt(priceStr, 10);
        if (partnerPrice > partnerFilters.cost) return false;
      }
      if (partnerFilters.gender !== '전체' && partner.gender !== partnerFilters.gender) return false;
      if (!isAgeFilterMatch(partnerFilters.age, partner.age)) return false;
      if (!isRegionFilterMatch(partnerFilters.region, partner.location)) return false;
      if (partnerFilters.smoke !== '전체' && (partner as any).smoke !== partnerFilters.smoke) return false;

      // 3. 상단 공통 필터 연동 (selectedDate, selectedRegion)
      if (selectedDate && selectedDate !== '전체' && selectedDate !== '오늘' && selectedDate !== '내일' && selectedDate !== '금일 익일티' && selectedDate !== '희망 날짜') {
        const dateMatch = partner.date && partner.date.includes(selectedDate.split(' ')[0]);
        if (!dateMatch) return false;
      }
      if (selectedRegion && selectedRegion !== '전체' && selectedRegion !== '지역 전체' && selectedRegion !== '전체 지역' && selectedRegion !== '골프장 지역') {
        if (!isRegionFilterMatch(selectedRegion, partner.location)) return false;
      }
      if (selectedTime && selectedTime !== '전체 시간') {
        const timePart = partner.time || '';
        const hourMatch = timePart.match(/(\d+):/);
        if (hourMatch) {
          const hour = parseInt(hourMatch[1], 10);
          if (selectedTime.includes('오전') || selectedTime.includes('1부')) {
            if (hour < 6 || hour >= 11) return false;
          } else if (selectedTime.includes('오후') || selectedTime.includes('2부')) {
            if (hour < 11 || hour >= 16) return false;
          } else if (selectedTime.includes('야간') || selectedTime.includes('3부')) {
            if (hour < 16) return false;
          }
        }
      }

      return true;
    });

    return (
      <div className="pb-32 bg-gray-50 min-h-full flex flex-col w-full overflow-hidden">
        <div className="bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm shrink-0">
          <div className="px-5 pt-12 pb-4 flex justify-between items-center">
             <h2 className="text-2xl font-black text-gray-900 tracking-tight">나 홀로 조인</h2>
             <button 
                onClick={() => {
                  pushView('empty', { type: 'partnerWrite', title: '동반자 모집글 작성' });
                }} 
                className="text-gray-900 bg-gray-50 w-9 h-9 shrink-0 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors shadow-sm"
              >
                <Plus size={20} />
              </button>
          </div>

          {/* 가로 스크롤 캘린더 칩 (빠른 날짜 변경) */}
          <div className="bg-white border-b border-gray-100 relative overflow-visible">
            <div className="flex items-center overflow-x-auto hide-scrollbar px-2 py-1.5 w-full">
              <button 
                onClick={() => {
                  setShowCalendarModal(prev => !prev);
                  setShowTimeFilter(false);
                  setShowRegionFilter(false);
                }}
                className="min-w-[50px] h-[52px] flex items-center justify-center bg-white border border-gray-100 rounded-xl mx-0.5 text-gray-600 hover:bg-gray-50 shrink-0"
              >
                <Calendar size={18} />
              </button>
              {dates.map((date: string) => {
                const isSelected = selectedDate === date;
                const isWeekend = date.includes('토') || date.includes('일');
                return (
                  <button 
                    key={date} 
                    onClick={() => setSelectedDate(date)}
                    className={`h-[52px] flex flex-col items-center justify-center rounded-xl mx-0.5 transition-all min-w-[50px] shrink-0 ${
                      isSelected ? 'bg-gray-900 text-white shadow-md' : 'bg-white hover:bg-gray-50 border border-gray-100'
                    } ${isWeekend && !isSelected ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    <span className="font-black leading-none text-[9.5px] font-medium mb-1">
                      {date.split(' ')[0]}
                    </span>
                    <span className={`text-[11px] font-black leading-none ${isSelected ? 'text-white' : 'text-gray-900'} ${isWeekend && !isSelected ? 'text-red-500' : ''}`}>
                      {date.split(' ')[1]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 시간대 빠른 선택 칩 바 */}
          <div className="bg-white px-4 py-2.5 flex flex-col gap-2 border-b border-gray-50 shrink-0">
            <div className="flex items-center gap-2">
              {[
                { label: '전체', value: '전체 시간' },
                { label: '오전', value: '오전' },
                { label: '오후', value: '오후' },
                { label: '야간', value: '야간' }
              ].map(item => {
                const isSelected = selectedTime === item.value || (item.value === '전체 시간' && selectedTime === '전체 시간') || (item.value === '오전' && selectedTime.includes('1부')) || (item.value === '오전' && selectedTime.includes('오전')) || (item.value === '오후' && selectedTime.includes('2부')) || (item.value === '오후' && selectedTime.includes('오후')) || (item.value === '야간' && (selectedTime.includes('3부') || selectedTime.includes('야간')));
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setSelectedTime(item.value);
                      showToast(`시간대: ${item.label} 적용`);
                    }}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-black transition-all text-center ${
                      isSelected
                        ? 'bg-green-600 text-white border-green-600 shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 필터 및 정렬 요약 바 */}
          <div className="bg-white border-b border-gray-100 px-4 py-3 overflow-visible">
            <div className="flex items-center justify-between w-full select-none pb-0.5 overflow-visible gap-2">
              {/* 좌측 영역: 필터 버튼 & 적용된 필터 요약 칩 */}
              <div className="flex items-center gap-1.5 shrink min-w-0 overflow-visible">
                <button
                  type="button"
                  onClick={() => setShowDetailedFilterModal(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-black transition-all shrink-0 shadow-sm active:scale-[0.97] ${
                    hasActivePartnerFilters()
                      ? 'bg-green-600 text-white border-green-600 font-extrabold'
                      : 'bg-gray-50 text-gray-700 border-gray-150 hover:bg-gray-100'
                  }`}
                >
                  <SlidersHorizontal size={11} className={hasActivePartnerFilters() ? 'text-white' : 'text-gray-500'} />
                  <span>필터 {getActivePartnerFilterCount() > 0 && `(${getActivePartnerFilterCount()})`}</span>
                </button>

                {/* 적용된 필터 조건 요약 칩 바 */}
                {hasActivePartnerFilters() && (
                  <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar text-[9px] font-bold text-gray-400 shrink min-w-0 whitespace-nowrap py-0.5 max-w-[200px]">
                    {getActivePartnerFilterSummary().map((sumText: string) => (
                      <span key={sumText} className="bg-green-50 text-green-600 px-2 py-0.5 rounded-md border border-green-100 shrink-0">
                        {sumText}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 우측 영역: 초기화 버튼 및 지도로보기 */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button 
                  type="button"
                  onClick={() => {
                    setPartnerFilters({
                      cost: 350000,
                      gender: '전체',
                      age: '전체',
                      region: '전체',
                      smoke: '전체'
                    });
                    showToast('필터가 모두 초기화되었습니다.');
                  }} 
                  className="p-1.5 bg-gray-50 border border-gray-100 hover:bg-gray-100 rounded-xl shrink-0 transition-colors inline-flex items-center justify-center shadow-sm h-8 w-8"
                  title="필터 초기화"
                >
                  <RotateCcw size={11} className="text-gray-655" />
                </button>

                <button 
                  type="button"
                  onClick={() => {
                    pushView('map', { type: activeTab });
                    showToast('지도 뷰로 이동합니다.');
                  }}
                  className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 hover:bg-gray-100 px-3 py-1.5 rounded-xl text-gray-700 font-extrabold shadow-sm transition-all active:scale-[0.97] shrink-0 inline-flex text-[11px] animate-in fade-in slide-in-from-right-1 duration-150"
                >
                  <Map size={11} className="text-green-600" />
                  <span>지도로보기</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full overflow-y-auto hide-scrollbar p-5 flex flex-col gap-3">
          {filteredPartners.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm w-full py-16">
              <p className="text-gray-400 font-bold">매칭된 모집글이 없습니다.</p>
              <p className="text-xs text-gray-400 mt-1">프로필 매칭 설정을 수정하거나 초기화해보세요.</p>
              <button onClick={() => pushView('profileInput')} className="mt-4 bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-xl">매칭 설정 수정</button>
            </div>
          ) : (
             filteredPartners.map((partner, i) => {
               const isExpanded = expandedPartnerId === partner.id;
               const hostInfo = partner.hostProfile || { gender: '남성', age: '30대', handicap: 95, smoke: '비흡연', license: '미보유' };
               return (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }} 
                   animate={{ opacity: 1, y: 0 }} 
                   transition={{ delay: i * 0.05 }} 
                   key={partner.id} 
                   onClick={() => setExpandedPartnerId(isExpanded ? null : partner.id)} 
                   className={"bg-white transition-all cursor-pointer flex flex-col " + (
                     isExpanded 
                       ? 'p-4 border border-green-300 ring-1 ring-green-300 shadow-md rounded-2xl my-2' 
                       : 'p-3.5 border-b border-gray-100 rounded-none shadow-none hover:bg-gray-50/50'
                   )}
                 >
                   <div className="flex justify-between items-center w-full py-1 text-left">
                     {/* 1. 구장 정보 (좌측) */}
                     <div className="flex flex-col gap-1 w-[32%] shrink-0">
                       <h4 className="font-bold text-gray-900 text-[14px] truncate leading-tight">{getCCName(partner)}</h4>
                       <span className="text-[10.5px] text-gray-500 font-bold flex items-center gap-0.5">
                         <MapPin size={10} className="text-green-600 shrink-0" />
                         <span>{partner.location}</span>
                       </span>
                     </div>

                     {/* 2. 일정 및 인적사항 (중앙) */}
                     <div className="flex flex-col gap-1 items-center text-center w-[40%] shrink-0">
                       <span className="text-[11.5px] text-gray-850 font-black">
                         {(() => {
                            const formatted = getFormattedDate(partner.date);
                            const dateText = formatted.split(' ')[0];
                            const dayText = formatted.split(' ')[1] || '';
                            return (
                              <>{dateText}<span className="text-gray-400 font-bold">{dayText}</span> {partner.time.split(' ')[0]}</>
                            );
                          })()}
                       </span>
                       <span className="text-[10px] text-gray-500 font-bold truncate max-w-full">
                         {hostInfo.gender} · {hostInfo.age} · {hostInfo.handicap}타
                       </span>
                     </div>

                     {/* 3. 상태 및 비용 (우측) */}
                     <div className="flex flex-col gap-1 items-end text-right w-[28%] shrink-0">
                       
                        <span className="text-[13px] text-green-600 font-black">
                         {partner.price || '180,000'}원
                       </span>
                       <span className={"text-[8.5px] shrink-0 font-bold px-1.5 py-0.5 rounded border " + (
                         partner.status === '모집중' 
                           ? 'bg-green-50 text-green-600 border-green-100' 
                           : partner.status === '마감임박' 
                             ? 'bg-red-50 text-red-600 border-red-100' 
                             : 'bg-gray-100 text-gray-500 border-gray-200'
                       )}>
                         {partner.status} {partner.status === '마감' ? '4/4' : `${4 - (partner.needed || 1)}/4`}
                       </span>
                     </div>
                   </div>
                   
                   {/* 드롭바 형식의 상세 공고글 영역 */}
                   <AnimatePresence>
                     {isExpanded && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         transition={{ duration: 0.2 }}
                         className="overflow-hidden border-t border-gray-100 mt-3 pt-3.5 flex flex-col gap-3"
                       >
                         {/* 공고글 제목 */}
                         <div className="bg-green-50/40 border border-green-100/50 p-3 rounded-xl">
                           <h5 className="font-extrabold text-gray-900 text-xs leading-snug break-words">
                             {partner.title}
                           </h5>
                         </div>
                         
                         {/* 공고글 사연/내용 */}
                         <p className="text-xs text-gray-600 leading-relaxed font-bold bg-gray-50 p-3.5 rounded-xl border border-gray-100/80 whitespace-pre-wrap">
                           {partner.description}
                         </p>

                         {/* 흡연/라이센스 세부 정보 및 작성자 프로필 */}
                         <div className="flex items-center justify-between gap-2 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50 text-[10px]">
                           <div className="flex gap-1.5 text-gray-500 font-bold">
                             <span>🚭 {hostInfo.smoke || '비흡연'}</span>
                             <span>·</span>
                             <span>🏌️‍♂️ 프로인증: {hostInfo.license === '보유' ? '유' : '무'}</span>
                           </div>
                           <div 
                             onClick={(e) => { 
                               e.stopPropagation(); 
                               pushView('userProfileDetail', partner); 
                             }} 
                             className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                           >
                             <img src={partner.avatar} className="w-5 h-5 bg-gray-100 rounded-full object-cover border border-gray-200"/>
                             <span className="font-bold text-gray-800">{partner.author} 님 (조회 {partner.views})</span>
                           </div>
                         </div>

                         {/* 버튼 팩 */}
                         <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                           <button 
                             onClick={() => { 
                               if (!userProfile) {
                                 showToast('매칭 프로필 설정 후 신청이 가능합니다.');
                                 pushView('profileInput');
                               } else {
                                 showToast(partner.author + "님의 모집글에 동반자 신청을 완료했습니다! ⛳");
                               }
                             }} 
                             className="flex-1 py-3 bg-green-600 text-white rounded-xl text-xs font-black shadow-md hover:bg-green-700 transition-colors"
                           >
                             신청하기
                           </button>
                           <button 
                             onClick={() => pushView('chat', partner)} 
                             className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-xs font-black shadow-md hover:bg-gray-800 transition-colors"
                           >
                             1:1 채팅하기
                           </button>
                         </div>

                          {/* 지원자 현황 */}
                          {partner.applicants && partner.applicants.length > 0 && (
                            <div className="mt-3 pt-3.5 border-t border-gray-100 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                              <span className="text-[11px] font-black text-gray-700">
                                👥 지원자 현황 ({partner.applicants.length}명)
                              </span>
                              <div className="flex flex-col gap-2">
                                {partner.applicants.map((app: any) => (
                                  <div 
                                    key={app.id} 
                                    className="bg-gray-50/60 p-2 rounded-xl border border-gray-150/40 flex items-center justify-between gap-3 text-xs"
                                  >
                                    <div className="flex items-center gap-2">
                                      <img 
                                        src={app.avatar} 
                                        style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} 
                                        className="shrink-0 shadow-sm border border-gray-100/50" 
                                      />
                                      <div className="flex flex-col">
                                        <span className="font-extrabold text-gray-800 text-[11px]">
                                          {app.name} <span className="text-[9px] text-gray-400 font-bold">({app.gender || '남성'} · {app.age || '30대'})</span>
                                        </span>
                                        <span className="text-[9px] text-gray-500 font-bold mt-0.5">
                                          평균 {app.handicap}타 · {app.experience || '구력 3년'}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-1.5">
                                      {app.status === '대기중' ? (
                                        <>
                                          <button 
                                            onClick={() => handleAcceptApplicant(partner.id, app.id)}
                                            className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[9px] font-black transition-all shadow-sm"
                                          >
                                            수락
                                          </button>
                                          <button 
                                            onClick={() => handleRejectApplicant(partner.id, app.id)}
                                            className="px-2.5 py-1 bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-lg text-[9px] font-black transition-all shadow-sm"
                                          >
                                            거절
                                          </button>
                                        </>
                                      ) : (
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                                          app.status === '참여 확정' 
                                            ? 'bg-green-50 text-green-600 border border-green-100' 
                                            : 'bg-gray-100 text-gray-400 border border-gray-150'
                                        }`}>
                                          {app.status}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </motion.div>
               );
             })
          )}
        </div>
      </div>
    );
  };

  const ChatTabView = () => {
    // 에이전트 상담이 삭제되고 동반자 채팅방 목록만 고정 노출
    const filteredRooms = chatRooms.filter(room => room.type === 'partner');

    return (
      <div className="pb-32 bg-gray-50 min-h-full flex flex-col w-full overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm shrink-0">
          <div className="px-5 pt-12 pb-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">메시지</h2>
          </div>

        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 hide-scrollbar">
          {filteredRooms.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm py-16">
              <p className="text-gray-400 font-bold">진행 중인 대화방이 없습니다.</p>
            </div>
          ) : (
            filteredRooms.map(room => (
              <div 
                key={room.id}
                onClick={() => {
                  setChatRooms(prev => prev.map(r => r.id === room.id ? { ...r, unreadCount: 0 } : r));
                  pushView('chatRoom', room);
                }}
                className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-3.5 cursor-pointer hover:border-green-300 hover:shadow-sm transition-all"
              >
                {room.type === 'agent' ? (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-lg font-black shrink-0 shadow-sm">
                    {room.avatar}
                  </div>
                ) : (
                  <img src={room.avatar} className="w-12 h-12 rounded-xl object-cover shrink-0 bg-gray-100 border border-gray-100" />
                )}

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm text-gray-800">{room.name}</span>
                      {room.type === 'agent' && (
                        <span className="text-[8.5px] font-bold text-green-600 bg-green-50 border border-green-100 px-1 py-0.5 rounded">
                          직통 에이전트
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold shrink-0">{room.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium truncate pr-4">
                    {room.lastMessage}
                  </p>
                </div>

                {room.unreadCount > 0 && (
                  <div className="self-center w-5 h-5 rounded-full bg-red-500 text-white text-[9.5px] font-black flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                    {room.unreadCount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const ChatRoomView = ({ payload }: { payload: any }) => {
    const room = chatRooms.find(r => r.id === payload.id) || payload;
    const [messages, setMessages] = useState<any[]>(room.initialMessages || []);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [repliesUsed, setRepliesUsed] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = () => {
      if (!inputValue.trim()) return;

      const userMsg = {
        id: Date.now(),
        sender: 'me' as const,
        text: inputValue,
        time: '오후 ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }).replace('AM', '').replace('PM', '').trim().split(' ').pop()
      };

      const updatedMsgs = [...messages, userMsg];
      setMessages(updatedMsgs);
      setInputValue('');

      setChatRooms(prev => prev.map(r => r.id === room.id ? { 
        ...r, 
        lastMessage: userMsg.text, 
        time: userMsg.time,
        initialMessages: updatedMsgs 
      } : r));

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyText = room.autoReplies && room.autoReplies[repliesUsed]
          ? room.autoReplies[repliesUsed]
          : '요청 확인했습니다. 에이전트 담당 매니저가 신속하게 추가 검토 후 직접 연락드리겠습니다! ⛳';

        const replyMsg = {
          id: Date.now() + 1,
          sender: 'other' as const,
          text: replyText,
          time: '오후 ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }).replace('AM', '').replace('PM', '').trim().split(' ').pop()
        };

        const finalMsgs = [...updatedMsgs, replyMsg];
        setMessages(finalMsgs);
        setRepliesUsed(prev => prev + 1);

        setChatRooms(prev => prev.map(r => r.id === room.id ? { 
          ...r, 
          lastMessage: replyMsg.text, 
          time: replyMsg.time,
          initialMessages: finalMsgs 
        } : r));

      }, 1500);
    };

    return (
      <div className="w-full h-full bg-white flex flex-col relative overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 pt-12 pb-3.5 flex justify-between items-center shrink-0 z-10 shadow-sm">
          <button onClick={popView} className="p-1 hover:bg-gray-50 rounded-lg text-gray-700">
            <ChevronLeft size={22} />
          </button>
          <div className="flex flex-col items-center">
            <span className="font-extrabold text-sm text-gray-800 flex items-center gap-1.5">
              {room.name}
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
            </span>
            <span className="text-[8px] text-gray-400 font-bold mt-0.5">
              {room.type === 'agent' ? '실시간 상담 서비스' : '동반자 매칭 채널'}
            </span>
          </div>
          <a 
            href="tel:010-4043-1307"
            onClick={() => showToast('유선 상담 전화를 연결합니다...')}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-800 shadow-sm transition-colors"
          >
            <Phone size={14} className="text-green-600 fill-current" />
          </a>
        </div>

        {/* Message Panel */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-3 hide-scrollbar">
          {messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div 
                key={msg.id}
                className={`flex w-full items-end gap-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <div className="w-7 h-7 rounded-lg bg-green-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm mr-0.5">
                    {room.name[0]}
                  </div>
                )}
                
                {isMe && <span className="text-[8px] text-gray-400 font-bold mb-0.5">{msg.time}</span>}

                <div 
                  className={`max-w-[70%] px-3.5 py-2.5 rounded-2xl text-[11.5px] font-bold leading-relaxed shadow-sm ${
                    isMe 
                      ? 'bg-green-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-700 rounded-tl-none border border-gray-150/50'
                  }`}
                >
                  {msg.text}
                </div>

                {!isMe && <span className="text-[8px] text-gray-400 font-bold mb-0.5">{msg.time}</span>}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex w-full items-end gap-1.5 justify-start">
              <div className="w-7 h-7 rounded-lg bg-green-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm mr-0.5 animate-bounce">
                {room.name[0]}
              </div>
              <div className="bg-white text-gray-400 px-4 py-2.5 rounded-2xl rounded-tl-none border border-gray-150/50 text-xs font-bold shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Panel */}
        <div className="bg-white p-3 border-t border-gray-100 flex gap-2 items-center shrink-0 pb-safe">
          <input 
            type="text"
            placeholder="메시지를 입력하세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-150/60 rounded-xl text-xs font-bold outline-none focus:border-green-600 focus:bg-white transition-all text-gray-800"
          />
          <button 
            onClick={handleSendMessage}
            className="p-3 bg-green-600 hover:bg-green-700 active:scale-95 text-white rounded-xl shadow-md transition-all flex items-center justify-center shrink-0"
          >
            <Send size={14} className="fill-current" />
          </button>
        </div>
      </div>
    );
  };

const MyPageTabView = () => {
      const mannerTemperature = 38.2;
      const mannerPercent = ((mannerTemperature - 30) / (99 - 30)) * 100;

      const mockReviews = [
        { id: 1, text: "시간 약속을 잘 지켜요 ⏰", count: 5, date: "최근" },
        { id: 2, text: "동반자를 배려하고 유쾌해요 🏌️‍♂️", count: 4, date: "최근" },
        { id: 3, text: "그린 매너가 훌륭해요 ⛳", count: 3, date: "1주 전" }
      ];

      return (
        <div className="pb-32 bg-gray-50 min-h-full flex flex-col w-full overflow-hidden">
          {/* Header */}
          <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 shadow-sm sticky top-0 z-10 flex justify-between items-center shrink-0">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">마이페이지</h2>
            <button onClick={() => pushView('empty', { type: 'notifications', title: '알림 내역' })} className="text-gray-600 hover:text-gray-900 p-2 shrink-0 bg-gray-50 rounded-full"><Bell size={20}/></button>
          </div>
          
          {/* Profile Card */}
          <div className="bg-white p-6 mb-2 shadow-sm shrink-0 w-full space-y-6">
            <div className="flex items-center gap-5 cursor-pointer group" onClick={() => pushView('empty', { type: 'default', title: '프로필 편집' })}>
              <div className="relative shrink-0">
                <img src="https://picsum.photos/seed/myprofile/200/200" className="w-14 h-14 shrink-0 bg-gray-200 rounded-full object-cover border-2 border-white shadow-md group-hover:border-green-100 transition-colors"/>
                <div className="absolute -bottom-0.5 -right-0.5 bg-gray-900 text-white w-5 h-5 rounded-full border border-white flex items-center justify-center shadow-sm shrink-0">
                  <Star size={10} fill="currentColor" className="shrink-0"/>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 truncate">김골프 님</h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] shrink-0 font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2.5 py-0.5 rounded shadow-sm">VIP 멤버십</span>
                      <span className="text-[10px] shrink-0 text-gray-400 font-bold hover:text-gray-700 transition-colors underline underline-offset-2">프로필 보기</span>
                    </div>
                  </div>
                  <button className="text-gray-400 shrink-0 group-hover:text-gray-800 group-hover:bg-gray-100 bg-gray-50 p-2 rounded-full transition-colors"><ChevronRight size={16}/></button>
                </div>
              </div>
            </div>
            
            {/* 당근마켓 스타일 매너온도 영역 */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-gray-700">매너온도 🌡️</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-orange-500">{mannerTemperature}°C</span>
                </div>
              </div>
              
              {/* Manner Temperature Gauge Bar */}
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" 
                  style={{ width: `${mannerPercent}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <p className="text-[10px] text-gray-400 font-bold">첫 온도 36.5°C</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm">😀</span>
                  <span className="text-[10px] text-orange-500 font-extrabold">매너 최고</span>
                </div>
              </div>
            </div>

            {/* 2분할 카드 (무료 응모권 & 받은 후기) */}
            <div className="flex gap-3 w-full">
              <div onClick={() => pushView('empty', { type: 'drawEvent', title: '데일리 경품 응모' })} className="flex-1 min-w-0 bg-gray-50 border border-gray-100 p-4 rounded-2xl text-center cursor-pointer hover:bg-white hover:border-green-300 hover:shadow-md transition-all">
                <p className="text-[11px] sm:text-xs font-bold text-gray-500 mb-1.5 truncate">보유 응모볼</p>
                <p className="font-black text-xl sm:text-2xl text-green-600 truncate">{userBalls}<span className="text-xs sm:text-sm font-medium text-gray-500 ml-0.5">볼</span></p>
              </div>
              <div onClick={() => pushView('empty', { type: 'default', title: '매너 평가 후기' })} className="flex-1 min-w-0 bg-gray-50 border border-gray-100 p-4 rounded-2xl text-center cursor-pointer hover:bg-white hover:border-green-300 hover:shadow-md transition-all">
                <p className="text-[11px] sm:text-xs font-bold text-gray-500 mb-1.5 truncate">받은 매너 후기</p>
                <p className="font-black text-xl sm:text-2xl text-orange-500 truncate">12<span className="text-xs sm:text-sm font-medium text-gray-500 ml-0.5">개</span></p>
              </div>
            </div>
          </div>

          {/* 마이페이지 메뉴 */}
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
          
          {/* 당근마켓 스타일 최근 받은 매너 후기 목록 */}
          <div className="bg-white p-5 mb-2 shadow-sm shrink-0 w-full">
            <h3 className="font-black text-gray-900 text-sm mb-4">최근 받은 매너 후기</h3>
            <div className="space-y-3.5">
              {mockReviews.map((review) => (
                <div key={review.id} className="flex justify-between items-start gap-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5 flex-1">
                    <p className="text-xs font-bold text-gray-800 leading-snug">{review.text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] text-[#2db400] bg-green-50 font-black px-1.5 py-0.5 rounded border border-green-100/50">선택한 동반자 {review.count}명</span>
                      <span className="text-[9.5px] text-gray-400 font-medium">{review.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
  );
};
  // --- [Main Stack Router] ---

  const renderView = (view: ViewState) => {
    switch (view.type) {
      case 'main':
        return (
          <div className="w-full h-full flex flex-col relative bg-white overflow-hidden">
            {activeTab === 'booking' ? (
              renderBookingTabView()
            ) : (
              <div ref={scrollRef} className="flex-1 w-full overflow-y-auto overflow-x-hidden hide-scrollbar">
                <AnimatePresence mode="wait">
                  {activeTab === 'home' && <HomeView key="home" />}
                  {activeTab === 'community' && <CommunityTabView key="community" />}
                  {activeTab === 'chat' && <ChatTabView key="chat" />}
                  {activeTab === 'mypage' && <MyPageTabView key="mypage" />}
                </AnimatePresence>
              </div>
            )}
            <AiAgentButton />
            <AiAgentModal />
            <BottomNav />
          </div>
        );
      case 'map': return <MapView payload={view.payload} />;
      case 'bookingDetail': return <BookingDetailView payload={view.payload} />;
      case 'chatRoom': return <ChatRoomView payload={view.payload} />;
      case 'postDetail': return <PostDetailView payload={view.payload} />;
      case 'partnerDetail': return <PartnerDetailView payload={view.payload} />;
      case 'influencerProfile': return <InfluencerProfileView payload={view.payload} />;
      case 'influencerList': return <InfluencerListView />;
      case 'storyForm': return <StoryFormView payload={view.payload} />;
      case 'regionList': return <RegionListView payload={view.payload} />;
      case 'joinDetail': return <JoinDetailView payload={view.payload} />;
      case 'empty': return <EmptyStateView payload={view.payload} />;
      case 'checkout': return <CheckoutView payload={view.payload} />;
      case 'success': return <SuccessView payload={view.payload} />;
      case 'chat': return <ChatView payload={view.payload} />;
      case 'login': return <LoginView />;
      case 'profileInput': return <ProfileInputView />;
      case 'userProfileDetail': return <UserProfileDetailView payload={view.payload} />;
      default: return null;
    }
  };

  const AdminLoginView = () => {
    const [adminId, setAdminId] = useState('');
    const [adminPw, setAdminPw] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleAdminLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (adminId.trim() === 'ogam' && adminPw === '1234') {
        sessionStorage.setItem('admin_auth', 'true');
        setIsAdminLoggedIn(true);
        showToast('관리자 인증에 성공하였습니다! ⛳');
      } else {
        setErrorMsg('아이디 또는 비밀번호가 올바르지 않습니다.');
        showToast('로그인 실패: 아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    };

    return (
      <div className="w-full h-full bg-gray-950 flex flex-col justify-between p-6 relative font-sans text-white">
        {/* Top Logo */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="mb-10 text-center">
            <span className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent tracking-tighter">
              everygolf
            </span>
            <p className="text-xs text-gray-400 font-bold mt-2.5">관리자 보안 검증 시스템</p>
          </div>

          <form onSubmit={handleAdminLogin} className="w-full space-y-4">
            <div>
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">Admin ID</label>
              <input 
                type="text" 
                placeholder="아이디를 입력하세요" 
                value={adminId}
                onChange={e => { setAdminId(e.target.value); setErrorMsg(''); }}
                className="w-full px-4 py-3.5 bg-gray-900 border border-gray-800 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-bold text-sm text-white placeholder-gray-600 transition-all" 
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">Password</label>
              <input 
                type="password" 
                placeholder="비밀번호를 입력하세요" 
                value={adminPw}
                onChange={e => { setAdminPw(e.target.value); setErrorMsg(''); }}
                className="w-full px-4 py-3.5 bg-gray-900 border border-gray-800 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-bold text-sm text-white placeholder-gray-600 transition-all" 
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 font-bold text-center mt-2 animate-pulse">{errorMsg}</p>
            )}

            <button 
              type="submit" 
              className="w-full py-4 mt-6 bg-green-500 hover:bg-green-600 active:scale-[0.98] text-black font-black rounded-xl text-sm shadow-lg shadow-green-500/10 transition-all"
            >
              시스템 접속 승인
            </button>
          </form>
        </div>

        {/* Footer Notice */}
        <div className="text-center shrink-0 py-4">
          <p className="text-[10px] text-gray-600 font-bold leading-relaxed">
            * 본 시스템은 외부인의 접근이 엄격히 금지됩니다.<br />
            IP 로그 및 접속 기록이 내부 보안 정책에 의해 모니터링됩니다.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full relative font-sans selection:bg-green-100 selection:text-green-900 bg-black overflow-hidden">
      {!isAdminLoggedIn ? (
        <AdminLoginView />
      ) : (
        <>
          <AnimatePresence initial={false}>
        {viewStack.map((view, index) => {
          const isTop = index === viewStack.length - 1;
          const isBottom = index === 0;

          return (
            <motion.div
              key={view.id}
              initial={isBottom ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 w-full h-full bg-white flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.1)]"
              style={{ zIndex: index * 10, pointerEvents: isTop ? 'auto' : 'none' }}
            >
              {renderView(view)}
            </motion.div>
          );
        })}
      </AnimatePresence>
      <GlobalToast />
      
      {/* 캘린더 모달 (골팡 스타일 전체 달력) */}
      <AnimatePresence>
        {showCalendarModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center"
            style={{ zIndex: 9999 }}
            onClick={() => setShowCalendarModal(false)}
          >
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-full bg-white rounded-t-[30px] p-6 shadow-2xl max-h-[55vh] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5 shrink-0"></div>
              <div className="flex justify-between items-center mb-5 shrink-0">
                <h3 className="text-lg font-black text-gray-900">예약 날짜 선택</h3>
                <button onClick={() => setShowCalendarModal(false)} className="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors"><X size={18}/></button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 hide-scrollbar">
                {/* 5월 달력 */}
                <div className="mb-6">
                  <h4 className="font-black text-gray-900 text-sm mb-3 text-center border-b border-gray-50 pb-2">2026년 5월</h4>
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 mb-2">
                    <div className="text-red-500">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div className="text-blue-500">토</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={`empty-5-${i}`} className="aspect-square"></div>
                    ))}
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={`past-5-${i}`} className="aspect-square flex items-center justify-center text-gray-200 text-xs font-medium cursor-not-allowed">
                        {i + 1}
                      </div>
                    ))}
                    {calendarDays.filter(d => d.isCurrentMonth).map((d) => {
                      const dayNum = d.date.split('/')[1];
                      const dateStr = `${d.date} (${d.dayName})`;
                      const isSelected = selectedDate === dateStr;
                      const isSunday = d.dayName === '일';
                      const isSaturday = d.dayName === '토';
                      return (
                        <button 
                          key={d.date}
                          type="button"
                          onClick={() => {
                            setSelectedDate(dateStr);
                            setShowCalendarModal(false);
                            showToast(`${dateStr} 날짜가 선택되었습니다.`);
                          }}
                          className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${isSelected ? 'bg-green-600 text-white font-black shadow-md' : 'hover:bg-gray-50'}`}
                        >
                          <span className={`text-xs font-bold ${isSelected ? 'text-white' : isSunday ? 'text-red-500' : isSaturday ? 'text-blue-500' : 'text-gray-800'}`}>{dayNum}</span>
                          <span className={`text-[8px] mt-0.5 ${isSelected ? 'text-green-200' : 'text-gray-400'}`}>티 가능</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* 6월 달력 */}
                <div>
                  <h4 className="font-black text-gray-900 text-sm mb-3 text-center border-b border-gray-50 pb-2">2026년 6월</h4>
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 mb-2">
                    <div className="text-red-500">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div className="text-blue-500">토</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.filter(d => !d.isCurrentMonth).map((d) => {
                      const dayNum = d.date.split('/')[1];
                      const dateStr = `${d.date} (${d.dayName})`;
                      const isSelected = selectedDate === dateStr;
                      const isSunday = d.dayName === '일';
                      const isSaturday = d.dayName === '토';
                      return (
                        <button 
                          key={d.date}
                          type="button"
                          onClick={() => {
                            setSelectedDate(dateStr);
                            setShowCalendarModal(false);
                            showToast(`${dateStr} 날짜가 선택되었습니다.`);
                          }}
                          className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${isSelected ? 'bg-green-600 text-white font-black shadow-md' : 'hover:bg-gray-50'}`}
                        >
                          <span className={`text-xs font-bold ${isSelected ? 'text-white' : isSunday ? 'text-red-500' : isSaturday ? 'text-blue-500' : 'text-gray-800'}`}>{dayNum}</span>
                          <span className={`text-[8px] mt-0.5 ${isSelected ? 'text-green-200' : 'text-gray-400'}`}>티 가능</span>
                        </button>
                      );
                    })}
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={`future-6-${i}`} className="aspect-square flex items-center justify-center text-gray-200 text-xs font-medium cursor-not-allowed">
                        {i + 11}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 shrink-0 pb-safe">
                <button 
                  onClick={() => setShowCalendarModal(false)}
                  className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition-colors"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <FilterSelectorModal />
      <SaveFavoriteModal />
        {/* 상세 필터 통합 바텀 시트 */}
        <AnimatePresence>
          {showDetailFilterSection && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200"
              onClick={() => setShowDetailFilterSection(false)}
            >
              <motion.div 
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-full bg-white rounded-t-[30px] p-6 shadow-2xl max-h-[75vh] flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5 shrink-0"></div>
                
                <div className="flex justify-between items-center mb-5 shrink-0">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-green-600" />
                    <span>상세 검색 필터</span>
                  </h3>
                  <button onClick={() => setShowDetailFilterSection(false)} className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-all active:scale-95 shrink-0 flex items-center justify-center">
                    <X size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-5 pr-1 hide-scrollbar">
                  {/* 1. 지역 선택 */}
                  <div className="space-y-2 text-left">
                    <span className="text-xs font-bold text-gray-400">지역 선택</span>
                    <div className="grid grid-cols-3 gap-2">
                      {regionOptions.map(opt => {
                        const isSel = selectedRegion === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setSelectedRegion(opt);
                              showToast(`지역: ${opt} 선택`);
                            }}
                            className={`py-2.5 rounded-xl border text-xs font-black text-center transition-all ${
                              isSel 
                                ? 'bg-green-600 text-white border-green-600 shadow-sm' 
                                : 'bg-gray-50 text-gray-655 border-gray-100 hover:bg-gray-100'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. 캐디 형태 선택 */}
                  <div className="space-y-2 text-left">
                    <span className="text-xs font-bold text-gray-400">캐디 형태 선택</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['전체', '노캐디', '일반캐디', '드라이빙캐디', '인턴캐디'].map(opt => {
                        const isSel = selectedCaddieType === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setSelectedCaddieType(opt);
                              showToast(`캐디: ${opt} 선택`);
                            }}
                            className={`py-2.5 rounded-xl border text-xs font-black text-center transition-all ${
                              isSel 
                                ? 'bg-green-600 text-white border-green-600 shadow-sm' 
                                : 'bg-gray-50 text-gray-655 border-gray-100 hover:bg-gray-100'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. 플레이 인원 설정 */}
                  {bookingMode !== '조인' && (
                    <div className="space-y-2 text-left">
                      <span className="text-xs font-bold text-gray-400">플레이 인원 설정</span>
                      <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 gap-1 select-none">
                        {(['전체', '2인이상', '3인이상', '4인이상'] as const).map(opt => {
                          const isSelected = selectedMinPlayers === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setSelectedMinPlayers(opt);
                                showToast(`인원: ${opt} 선택`);
                              }}
                              className={`flex-1 py-2 rounded-lg text-[10.5px] font-black transition-all ${
                                isSelected 
                                  ? 'bg-white text-green-600 shadow-sm font-extrabold border border-gray-100' 
                                  : 'text-gray-500 hover:text-gray-900 border border-transparent'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 4. 추가 조건 선택 (식사포함, 양잔디 등) */}
                  <div className="space-y-2 text-left">
                    <span className="text-xs font-bold text-gray-400">추가 혜택/조건 선택 (중복 가능)</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: 'Award', label: '식사포함' },
                        { icon: 'Sparkles', label: '양잔디' }
                      ].map(feat => {
                        const isSelected = selectedFeatures.includes(feat.label);
                        const IconComponent = feat.icon === 'Award' ? Award : Sparkles;
                        return (
                          <button
                            key={feat.label}
                            type="button"
                            onClick={() => {
                              setSelectedFeatures(prev => 
                                prev.includes(feat.label) 
                                  ? prev.filter(f => f !== feat.label) 
                                  : [...prev, feat.label]
                              );
                              showToast(`옵션: ${feat.label} ${!isSelected ? '선택' : '해제'}`);
                            }}
                            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-black transition-all ${
                              isSelected 
                                ? 'bg-green-600 text-white border-green-600 shadow-sm' 
                                : 'bg-white text-gray-655 border-gray-100 hover:bg-gray-50'
                            }`}
                          >
                            <IconComponent size={13} className={isSelected ? 'text-white' : 'text-gray-400'} />
                            <span>{feat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. 골프장명 직접 검색 */}
                  <div className="space-y-2 text-left">
                    <span className="text-xs font-bold text-gray-400">골프장명 직접 검색</span>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between text-sm text-gray-800 focus-within:border-gray-300">
                      <input 
                        type="text" 
                        placeholder="골프장 이름 입력 (예: 스카이72)" 
                        value={searchQuery} 
                        onChange={e => setSearchQuery(e.target.value)} 
                        className="bg-transparent border-none outline-none w-full font-bold text-gray-850 placeholder:text-gray-400 min-w-0" 
                      />
                      <Search size={16} className="text-gray-450 shrink-0"/>
                    </div>
                  </div>
                </div>

                {/* 하단 액션 버튼 그룹 */}
                <div className="pt-4 border-t border-gray-100 flex gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      resetFilters();
                      setShowDetailFilterSection(false);
                    }}
                    className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 active:scale-[0.98] text-gray-600 font-extrabold text-sm rounded-xl transition-all"
                  >
                    필터 초기화
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDetailFilterSection(false);
                      showToast('상세 필터가 적용되었습니다.');
                    }}
                    className="flex-[2] py-3.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-black text-sm rounded-xl transition-all shadow-md shadow-green-150"
                  >
                    검색 결과 적용
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center font-sans py-8 px-4 relative overflow-hidden">
      <div className="w-full h-[100dvh] sm:w-[390px] sm:h-[844px] sm:max-w-[390px] bg-white relative sm:rounded-[40px] sm:border-[8px] sm:border-gray-900 sm:shadow-2xl overflow-hidden flex flex-col ring-1 ring-gray-900/5 mx-auto">
        <div className="hidden sm:block absolute top-0 inset-x-0 h-7 z-[200] pointer-events-none">
          <div className="w-[120px] h-7 bg-gray-900 mx-auto rounded-b-[20px]"></div>
        </div>
        <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col bg-white" style={{ transform: 'translate3d(0,0,0)' }}>
          <EveryGolfApp />
        </div>
        <div className="hidden sm:block absolute bottom-1 inset-x-0 h-1.5 z-[200] pointer-events-none flex justify-center">
          <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* 내부 관계자용 배포/유출 금지 안내 배너 (우측 하단 배치) */}
      <div className="hidden sm:block absolute bottom-6 right-6 w-full max-w-[280px] bg-gray-900/90 backdrop-blur-sm border border-gray-850 rounded-2xl p-4.5 shadow-xl z-[300]">
        <p className="text-xs font-black text-amber-400 flex items-center gap-1.5 mb-1.5">
          <AlertTriangle size={14} className="text-amber-400 shrink-0" />
          <span>비인가자 배포 및 무단 유출 금지</span>
        </p>
        <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
          본 애플리케이션은 에브리골프 관계자 검토용 데모 제품입니다. 비인가자에 대한 무단 공유, 배포 및 상업적 유출을 엄격히 금지합니다.
        </p>
      </div>
    </div>
  );
}
