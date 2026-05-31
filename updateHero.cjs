const fs = require('fs');
let content = fs.readFileSync('./src/App.tsx', 'utf8');

// Ensure MOCK_INFLUENCERS is imported
if (!content.includes('MOCK_INFLUENCERS')) {
  content = content.replace(/import { MOCK_BOOKINGS, MOCK_JOINS, MOCK_COMMUNITY, MOCK_PARTNERS } from '\.\/mockData';/, "import { MOCK_BOOKINGS, MOCK_JOINS, MOCK_COMMUNITY, MOCK_PARTNERS, MOCK_INFLUENCERS } from './mockData';");
}

const newInfluencerProfileView = `  const InfluencerProfileView = ({ payload }: { payload?: any }) => {
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
        <button onClick={() => { 
          showToast('신청이 성공적으로 접수되었습니다.'); 
          setTimeout(() => pushView('success', { message: '라운딩 신청 완료!', subMessage: \`\${data.name} 프로암 라운딩 신청이 접수되었습니다. 개별 연락 드리겠습니다.\` }), 500);
        }} className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all">
          {data.name}와 라운딩 신청하기
        </button>
      </div>
    </div>
    );
  };`;

content = content.replace(/const InfluencerProfileView = \(\) => \([\s\S]*?\n  \);\n/m, newInfluencerProfileView + '\n');


const heroSectionReplacement = `      <div className="px-5 mt-5">
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">👑 인플루언서와 함께 라운딩</h2>
        </div>
        <div className="flex overflow-x-auto gap-4 snap-x hide-scrollbar pb-4">
          {MOCK_INFLUENCERS.map((inf) => (
            <div key={inf.id} onClick={() => pushView('influencerProfile', inf)} className="w-[280px] shrink-0 bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden cursor-pointer group aspect-[16/10] flex flex-col justify-end snap-start">
              <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: \`url('\${inf.cover}')\` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/50 to-transparent" />
              
              <div className="relative z-10 w-full">
                <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold w-fit mb-2 shadow-sm block">무료 라운딩 응모</span>
                <div className="flex items-center gap-3 mb-2">
                  <img src={inf.avatar} className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"/>
                  <div>
                    <h2 className="text-lg font-bold leading-none">{inf.name}</h2>
                    <span className="text-[10px] text-gray-300 font-medium">{inf.title.replace(/"/g, '')}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-gray-300 font-medium drop-shadow-md truncate max-w-[70%]">{inf.schedule.location}</p>
                  <button className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm hover:bg-white hover:text-gray-900 transition-colors">
                    프로필 보기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>`;

content = content.replace(/<div className="px-5 mt-5">\s*<div onClick=\{\(\) => pushView\('empty', \{ type: 'default', title: '월간 BEST 스크린 골프 대회' \}\)\}.*?\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/s, heroSectionReplacement);

// Make sure `renderView` passes `payload` to `influencerProfile`
content = content.replace(/case 'influencerProfile': return <InfluencerProfileView \/>;/, "case 'influencerProfile': return <InfluencerProfileView payload={view.payload} />;");

fs.writeFileSync('./src/App.tsx', content);
console.log('App.tsx hero section updated');
