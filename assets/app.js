const defaultQuests=[
 {id:'q1',title:'工場の安全・品質を高めたい',domain:'製造・工場DX',desc:'ヒヤリハット、設備異常、品質ばらつきを早期に検知し、現場改善PoCにする。'},
 {id:'q2',title:'介護施設の見守り負担を減らしたい',domain:'介護・ヘルスケアDX',desc:'夜間巡回、転倒リスク、声かけ、健康状態の把握をDX化する。'},
 {id:'q3',title:'観光地の混雑と回遊を改善したい',domain:'観光・地域DX',desc:'混雑、言語、移動、消費導線を可視化し、地域消費へ接続する。'},
 {id:'q4',title:'学校探究を企業共創に接続したい',domain:'教育・企業共創',desc:'生徒の発想と企業アセットを掛け合わせ、発表・評価・PoC候補へ変換する。'},
 {id:'q5',title:'店舗の顧客体験を改善したい',domain:'小売・商品開発DX',desc:'来店、滞在、購買、VOCをもとに新しい販促・売場体験を設計する。'},
 {id:'q6',title:'会員企業の交流を事業テーマ化したい',domain:'会員企業共創',desc:'名刺交換・アセット紹介を、実証テーマとDX人材育成に変換する。'}
];
const defaultCards=[
 {id:'if1',type:'IF',title:'人の接近を検知したら',domain:'センサー',desc:'人感センサー・カメラ・ビーコンで接近や滞在を検知する。'},
 {id:'if2',type:'IF',title:'温度・湿度が閾値を超えたら',domain:'環境センサー',desc:'室内・設備・倉庫の異常環境を条件化する。'},
 {id:'if3',type:'IF',title:'設備の振動が通常値から外れたら',domain:'製造DX',desc:'振動・電流・音の変化から予兆保全のトリガーを作る。'},
 {id:'if4',type:'IF',title:'転倒リスク行動を検知したら',domain:'介護DX',desc:'立ち上がり、長時間不動、ふらつきなどを見守り条件にする。'},
 {id:'if5',type:'IF',title:'混雑度が一定以上になったら',domain:'観光DX',desc:'人流・予約・滞在データから混雑を判定する。'},
 {id:'if6',type:'IF',title:'生徒が課題カードを選んだら',domain:'教育DX',desc:'探究テーマ選択を学習ログとして取得する。'},
 {id:'then1',type:'THEN',title:'ロボットが声かけする',domain:'ロボット',desc:'Kebbi等のロボットが案内・注意喚起・質問対応を行う。'},
 {id:'then2',type:'THEN',title:'スマホへ通知する',domain:'通知',desc:'担当者・先生・現場リーダーへ即時通知する。'},
 {id:'then3',type:'THEN',title:'照明・空調を自動制御する',domain:'設備制御',desc:'スマートリモコンや制御装置で環境を最適化する。'},
 {id:'then4',type:'THEN',title:'ダッシュボードに記録する',domain:'データ活用',desc:'発生時刻、場所、対応履歴、VOCを蓄積する。'},
 {id:'then5',type:'THEN',title:'代替ルートを提示する',domain:'観光DX',desc:'混雑回避、回遊促進、地域店舗送客につなげる。'},
 {id:'then6',type:'THEN',title:'PoC企画書を自動生成する',domain:'生成AI',desc:'課題、仮説、KPI、検証方法、必要アセットを整理する。'},
 {id:'as1',type:'ASSET',title:'ifLinkアセットカード',domain:'共創基盤',desc:'企業の機器・サービスをカード化し、組み合わせ可能にする。'},
 {id:'as2',type:'ASSET',title:'AIカリキュラムメーカー',domain:'教育OS',desc:'企業課題を学校・研修用教材へ変換する。'},
 {id:'as3',type:'ASSET',title:'Kebbi / 会話ロボット',domain:'ロボティクス',desc:'対話、案内、見守り、学習支援に活用する。'},
 {id:'as4',type:'ASSET',title:'会員企業テーマカード',domain:'企業共創',desc:'会員企業の課題・技術・人材育成テーマをカード化する。'}
];
let state={points:0,quests:[...defaultQuests],cards:[...defaultCards],selectedQuest:null,selected:{IF:[],THEN:[],ASSET:[]},ideas:[]};
const saved=localStorage.getItem('dxos_ifthen_v2'); if(saved){try{state={...state,...JSON.parse(saved)}}catch(e){}}
const $=id=>document.getElementById(id); const save=()=>localStorage.setItem('dxos_ifthen_v2',JSON.stringify(state));
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function render(){renderMetrics();renderQuests();renderCards();renderSlots();renderReport();save()}
function renderMetrics(){ $('points').textContent=state.points; $('usableCount').textContent=state.cards.length; $('recipeCount').textContent=state.selected.IF.length+state.selected.THEN.length+state.selected.ASSET.length; $('ideaCount').textContent=state.ideas.length; }
function renderQuests(){const box=$('questGrid');box.innerHTML='';state.quests.forEach(q=>{const el=document.createElement('article');el.className='quest'+(state.selectedQuest===q.id?' selected':'');el.innerHTML=`<span class="tag">${q.domain}</span><h4>${q.title}</h4><p>${q.desc}</p>`;el.onclick=()=>{state.selectedQuest=q.id;state.points+=10;toast('課題カードを選択 +10EX');render()};box.appendChild(el)})}
function renderCards(){const filter=document.querySelector('.filter.active')?.dataset.filter||'ALL';const keyword=$('search')?.value?.trim().toLowerCase()||'';const box=$('cardGrid');box.innerHTML='';state.cards.filter(c=>(filter==='ALL'||c.type===filter)&&(!keyword||(c.title+c.domain+c.desc).toLowerCase().includes(keyword))).forEach(c=>{const selected=(state.selected[c.type]||[]).includes(c.id);const el=document.createElement('article');el.className=`card ${c.type}${selected?' selected':''}`;el.dataset.type=c.type;el.innerHTML=`<span class="tag">${c.domain}</span><h4>${c.title}</h4><p>${c.desc}</p>`;el.onclick=()=>toggleCard(c);box.appendChild(el)})}
function toggleCard(c){if(c.type==='ASSET'){toggleArray(state.selected.ASSET,c.id,2)}else{toggleArray(state.selected[c.type],c.id,3)}state.points+=selectedHas(c.id)?8:0;toast(`${c.type}カードを${selectedHas(c.id)?'選択':'解除'}`);render()}
function toggleArray(arr,id,max){const i=arr.indexOf(id); if(i>=0)arr.splice(i,1); else{if(arr.length>=max)arr.shift();arr.push(id)}}
function selectedHas(id){return Object.values(state.selected).some(a=>a.includes(id))}
function titles(ids){return ids.map(id=>state.cards.find(c=>c.id===id)?.title).filter(Boolean)}
function renderSlots(){const q=state.quests.find(x=>x.id===state.selectedQuest);$('slotQuest').textContent=q?q.title:'未選択';$('slotIf').textContent=titles(state.selected.IF).join(' ／ ')||'未選択';$('slotThen').textContent=titles(state.selected.THEN).join(' ／ ')||'未選択';$('slotAsset').textContent=titles(state.selected.ASSET).join(' ／ ')||'任意'}
function generate(){const q=state.quests.find(x=>x.id===state.selectedQuest); const ifs=state.selected.IF.map(id=>state.cards.find(c=>c.id===id)); const thens=state.selected.THEN.map(id=>state.cards.find(c=>c.id===id)); const assets=state.selected.ASSET.map(id=>state.cards.find(c=>c.id===id)); if(!q||ifs.length===0||thens.length===0){toast('課題・IF・THENを最低1枚ずつ選択してください');return}
 const title=`${q.domain}｜${ifs[0].title} → ${thens[0].title}`; const idea={date:new Date().toLocaleString('ja-JP'),title,quest:q,ifs,thens,assets,kpi:makeKpi(q.domain)}; state.ideas.unshift(idea); state.points+=60; $('simStage').classList.remove('run'); void $('simStage').offsetWidth; $('simStage').classList.add('run'); $('solution').innerHTML=`<h4>${title}</h4><p><b>課題：</b>${q.title}</p><p><b>IF条件：</b>${ifs.map(x=>x.title).join('、')}</p><p><b>THEN実行：</b>${thens.map(x=>x.title).join('、')}</p><p><b>活用アセット：</b>${assets.map(x=>x.title).join('、')||'追加選択なし'}</p><p><b>PoC仮説：</b>${q.desc} これに対し、IFカードで現場データを取得し、THENカードで即時対応・記録・改善を実行する。研修では、受講者がKPIと運用条件を定義し、発表可能なPoC企画へ仕上げる。</p><p><b>KPI例：</b>${idea.kpi.join(' / ')}</p>`; toast('PoC候補を生成 +60EX'); render() }
function makeKpi(domain){if(domain.includes('製造'))return['異常検知時間','停止時間削減率','不良率'];if(domain.includes('介護'))return['巡回工数','ヒヤリハット件数','対応時間'];if(domain.includes('観光'))return['混雑緩和率','回遊率','地域消費額'];if(domain.includes('教育'))return['発表完成率','IF-THEN理解度','企業提案件数'];return['参加者満足度','PoC化件数','VOC件数']}
function renderReport(){const lines=['# 共創DX人材育成OS PoC / 研修ログ','',`- EX POINT: ${state.points}` ,`- 生成PoC候補: ${state.ideas.length}`,''];state.ideas.forEach((i,n)=>{lines.push(`## ${n+1}. ${i.title}`,`- 生成日時: ${i.date}`,`- 課題: ${i.quest.title}`,`- IF: ${i.ifs.map(x=>x.title).join(' / ')}`,`- THEN: ${i.thens.map(x=>x.title).join(' / ')}`,`- ASSET: ${i.assets.map(x=>x.title).join(' / ')||'未選択'}`,`- KPI: ${i.kpi.join(' / ')}`,'')});$('reportBox').textContent=lines.join('\n')}
function addCard(e){e.preventDefault();const f=new FormData(e.target);const type=f.get('type');const obj={id:type.toLowerCase()+Date.now(),type:type==='QUEST'?'QUEST':type,title:f.get('title'),domain:f.get('domain'),desc:f.get('desc')};if(type==='QUEST'){state.quests.unshift({id:obj.id,title:obj.title,domain:obj.domain,desc:obj.desc});toast('課題カードを追加しました')}else{state.cards.unshift(obj);toast(`${type}カードを追加しました`)}state.points+=20;e.target.reset();render()}
function openPack(){const samples=[...defaultCards].sort(()=>Math.random()-.5).slice(0,3);samples.forEach(s=>{if(!state.cards.some(c=>c.title===s.title))state.cards.push({...s,id:s.id+'x'+Date.now()})});state.points+=30;toast('カードパック開封 +30EX');render()}
function download(){const blob=new Blob([$('reportBox').textContent],{type:'text/markdown'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='cocreation-dx-os-poc-report.md';a.click();URL.revokeObjectURL(a.href)}
document.addEventListener('click',e=>{if(e.target.dataset.scroll)$(e.target.dataset.scroll).scrollIntoView({behavior:'smooth'});if(e.target.classList.contains('filter')){document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');renderCards()}});
$('search').addEventListener('input',renderCards);$('generateBtn').onclick=generate;$('clearSelectionBtn').onclick=()=>{state.selected={IF:[],THEN:[],ASSET:[]};render();toast('選択を解除しました')};$('openPackBtn').onclick=openPack;$('randomQuestBtn').onclick=()=>{state.selectedQuest=state.quests[Math.floor(Math.random()*state.quests.length)].id;state.points+=10;render();toast('ランダム課題を出題 +10EX')};$('downloadBtn').onclick=download;$('cardForm').addEventListener('submit',addCard);$('resetBtn').onclick=()=>{if(confirm('保存データを初期化しますか？')){localStorage.removeItem('dxos_ifthen_v2');location.reload()}};render();
