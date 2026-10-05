/* ============ STATE + persistence ============ */
const PITCHES=[['C','1',261.63],['C#','1½',277.18],['D','2',293.66],['D#','2½',311.13],['E','3',329.63],['F','4',349.23],['F#','4½',369.99],['G','5',392.0],['G#','5½',415.3],['A','6',220.0],['A#','6½',233.08],['B','7',246.94]];
const DEFAULTS={xp:0,done:{},streak:0,last:null,pitch:'C',names:'short',saHz:null,strict:'gentle',calSkipped:false};
let S={...DEFAULTS,drone:false},ME=null,saveTimer=null;
async function api(path,opts={}){
 const r=await fetch(path,{method:opts.method||'GET',headers:{'Content-Type':'application/json'},body:opts.body?JSON.stringify(opts.body):undefined,credentials:'same-origin',keepalive:!!opts.keepalive});
 let data={};try{data=await r.json()}catch(e){}
 if(!r.ok){const err=new Error(data.error||'Could not reach the server. Check your connection and try again.');err.status=r.status;throw err}
 return data}
function progressPayload(){return {xp:S.xp,done:S.done,streak:S.streak,last:S.last,pitch:S.pitch,names:S.names,saHz:S.saHz||null,strict:S.strict||'gentle',calSkipped:!!S.calSkipped}}
function save(){if(!ME)return;clearTimeout(saveTimer);saveTimer=setTimeout(flush,600)}
function flush(keepalive){clearTimeout(saveTimer);if(!ME)return;api('/api/progress',{method:'PUT',body:{progress:progressPayload()},keepalive}).then(()=>setSync('Saved')).catch(e=>setSync(e.status===401?'Logged out':'Not saved, retrying…',true))}
function setSync(msg,bad){const el=document.getElementById('sync');if(el){el.textContent=msg;el.dataset.bad=bad?'1':''}if(bad&&ME)setTimeout(save,5000)}
addEventListener('pagehide',()=>{if(saveTimer)flush(true)});
function signedIn(data){ME=data.user;S={...DEFAULTS,...(data.progress||{}),drone:S.drone};view='home';tab='learn';renderHome.scrolled=0;render()}
const dayStr=d=>{const x=d||new Date();return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
function liveStreak(){if(!S.last)return 0;const y=new Date();y.setDate(y.getDate()-1);return (S.last===dayStr()||S.last===dayStr(y))?S.streak:0}
function basePitch(){if(S.pitch==='mine'&&S.saHz)return S.saHz;return (PITCHES.find(p=>p[0]===S.pitch)||PITCHES[0])[2]}

/* ============ AUDIO ============ */
let AC=null,master,revIn,droneBus,noiseBuf,cur=null;
function ac(){
 if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();
  const comp=AC.createDynamicsCompressor();comp.connect(AC.destination);
  master=AC.createGain();master.gain.value=.85;master.connect(comp);
  const conv=AC.createConvolver();const len=AC.sampleRate*1.6,b=AC.createBuffer(2,len,AC.sampleRate);
  for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2)}
  conv.buffer=b;revIn=AC.createGain();const rg=AC.createGain();rg.gain.value=.2;revIn.connect(conv);conv.connect(rg);rg.connect(comp);
  noiseBuf=AC.createBuffer(1,AC.sampleRate*.5,AC.sampleRate);const nd=noiseBuf.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
  droneBus=AC.createGain();droneBus.gain.value=.5;droneBus.connect(master);droneBus.connect(revIn);}
 if(AC.state!=='running')AC.resume().catch(()=>{});return AC}
/* Phones: iPhones mute Web Audio when the ring/silent switch is on unless the page
   is also playing a media element, and every browser keeps audio locked until a
   tap. On the first touch we start the context, play one silent sample, and loop a
   silent <audio> so the page counts as media playback. */
let unlocked=false,silentEl=null;
function silentWavUrl(){const n=4410,b=new ArrayBuffer(44+n*2),v=new DataView(b),w=(o,s)=>[...s].forEach((c,i)=>v.setUint8(o+i,c.charCodeAt(0)));
 w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);
 v.setUint32(24,44100,true);v.setUint32(28,88200,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
 return URL.createObjectURL(new Blob([b],{type:'audio/wav'}))}
function setAudioSession(type){try{if(navigator.audioSession)navigator.audioSession.type=type}catch(e){}}
function unlockAudio(){
 try{ac();const src=AC.createBufferSource();src.buffer=AC.createBuffer(1,1,22050);src.connect(AC.destination);src.start(0)}catch(e){}
 if(unlocked)return;unlocked=true;setAudioSession('playback');
 try{silentEl=document.createElement('audio');silentEl.src=silentWavUrl();silentEl.loop=true;silentEl.setAttribute('playsinline','');silentEl.volume=0.01;silentEl.play().catch(()=>{unlocked=false})}catch(e){unlocked=false}}
['pointerdown','touchend','keydown'].forEach(t=>addEventListener(t,unlockAudio,{capture:true,passive:true}));
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&AC&&AC.state!=='running')AC.resume().catch(()=>{})});
function newBus(){const g=AC.createGain();g.connect(master);g.connect(revIn);return g}
function freqOf(tok,raga){const r=RAGAS[raga]||RAGAS.mmg;let s=r.semi[tok.sw];if(s===undefined)s=RAGAS.mmg.semi[tok.sw];return basePitch()*Math.pow(2,(s+12*tok.o)/12)}
function voice(f,t,dur,out,vol=.3){
 const c=AC,end=t+Math.max(dur,.14),g=c.createGain();
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.025);g.gain.setTargetAtTime(vol*.72,t+.04,.18);g.gain.setTargetAtTime(0,end-.03,.045);
 const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(Math.min(5200,f*6),t);lp.frequency.setTargetAtTime(Math.min(3000,f*3.2),t+.05,.25);lp.Q.value=.8;
 const o1=c.createOscillator();o1.type='triangle';o1.frequency.value=f;
 const o2=c.createOscillator();o2.type='sawtooth';o2.frequency.value=f*1.002;const g2=c.createGain();g2.gain.value=.16;
 const o3=c.createOscillator();o3.type='sine';o3.frequency.value=f*2;const g3=c.createGain();g3.gain.value=.12;
 const lfo=c.createOscillator();lfo.frequency.value=5.3;const lg=c.createGain();lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(f*.005,t+.4);lfo.connect(lg);lg.connect(o1.frequency);lg.connect(o2.frequency);
 o1.connect(lp);o2.connect(g2);g2.connect(lp);o3.connect(g3);g3.connect(lp);lp.connect(g);g.connect(out);
 [o1,o2,o3,lfo].forEach(o=>{o.start(t);o.stop(end+.35)})}
function perc(kind,t,out){
 const c=AC;
 if(kind==='f1'||kind==='f2'||kind==='f3'||kind==='tick'){const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=kind==='tick'?1900:1450;g.gain.setValueAtTime(.32,t);g.gain.exponentialRampToValueAtTime(.001,t+.06);o.connect(g);g.connect(out);o.start(t);o.stop(t+.08);return}
 const n=c.createBufferSource();n.buffer=noiseBuf;const f=c.createBiquadFilter(),g=c.createGain();
 if(kind==='clap'){f.type='bandpass';f.frequency.value=1300;f.Q.value=.9;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.9,t+.004);g.gain.exponentialRampToValueAtTime(.001,t+.14)}
 else{f.type='lowpass';f.frequency.value=700;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.5,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+.22)}
 n.connect(f);f.connect(g);g.connect(out);n.start(t);n.stop(t+.3)}
function stopAll(){if(!cur)return;cur.timers.forEach(clearTimeout);try{cur.bus.gain.setTargetAtTime(0,AC.currentTime,.02)}catch(e){}const b=cur.bus,cb=cur.onStop;setTimeout(()=>{try{b.disconnect()}catch(e){}},400);cur=null;cb&&cb()}
function playSeq(seq,o={}){
 ac();stopAll();
 const toks=parse(seq),spb=2**((o.kala||1)-1),slot=60/(o.bpm||70)/spb,bus=newBus(),t0=AC.currentTime+.12,timers=[];
 toks.forEach((tk,i)=>{if(tk.k)return;let n=1;while(toks[i+n]&&toks[i+n].k)n++;voice(freqOf(tk,o.raga||'mmg'),t0+i*slot,n*slot*.94,bus)});
 if(o.thala){const acts=THALAS[o.thala].acts,beats=Math.ceil(toks.length/spb);for(let b=0;b<beats;b++)perc(acts[b%acts.length],t0+b*spb*slot,bus)}
 const lead=(t0-AC.currentTime)*1000;
 if(o.onStep)toks.forEach((tk,i)=>timers.push(setTimeout(()=>o.onStep(i),lead+i*slot*1000)));
 const me={bus,timers,onStop:o.onStop};
 timers.push(setTimeout(()=>{if(cur===me){cur=null;o.onEnd&&o.onEnd()}},lead+toks.length*slot*1000+250));
 cur=me;return me}
function tapNote(tok,raga){ac();const b=newBus();voice(freqOf(tok,raga),AC.currentTime+.01,.42,b);setTimeout(()=>{try{b.disconnect()}catch(e){}},1500)}
function tapPerc(kind){ac();const b=newBus();perc(kind,AC.currentTime+.005,b);setTimeout(()=>{try{b.disconnect()}catch(e){}},800)}
/* tanpura drone: Pa(low) Sa Sa Sa(low) */
let droneTimer=null,droneNext=0,droneStep=0;
function pluck(f,t){const c=AC,g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(3200,t);lp.frequency.exponentialRampToValueAtTime(500,t+2.2);
 g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.16,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+3.2);
 [1,1.003,.997].forEach(m=>{const o=c.createOscillator();o.type='sawtooth';o.frequency.value=f*m;o.connect(lp);o.start(t);o.stop(t+3.3)});lp.connect(g);g.connect(droneBus)}
function droneTick(){const b=basePitch(),pat=[b*Math.pow(2,7/12)/2,b,b,b/2];while(droneNext<AC.currentTime+.3){pluck(pat[droneStep%4],droneNext);droneNext+=droneStep%4===3?1.1:.55;droneStep++}}
function setDrone(on){S.drone=on;if(on){ac();droneNext=AC.currentTime+.05;droneStep=0;droneTick();droneTimer=setInterval(droneTick,100)}else{clearInterval(droneTimer);droneTimer=null}
 document.querySelectorAll('[data-drone]').forEach(b=>b.setAttribute('aria-pressed',on))}

/* ============ ICONS + MASCOT ============ */
const I={
 mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
 play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
 stop:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2.5"/></svg>',
 star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
 heart:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8 3.6 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.8 1.3-1.7 2.9-2.8 4.9-2.8 3.5 0 5.6 3.5 4.4 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>',
 diya:'<svg viewBox="0 0 24 24"><path d="M12 2.5c2.2 2.6 2.9 4.5 2.9 6a2.9 2.9 0 0 1-5.8 0c0-1.5.7-3.4 2.9-6z" fill="var(--marigold)"/><path d="M12 6.2c1 1.3 1.3 2.2 1.3 2.9a1.3 1.3 0 0 1-2.6 0c0-.7.3-1.6 1.3-2.9z" fill="var(--kumkum)"/><path d="M2.5 13.5h19c-.8 4-4.6 6.5-9.5 6.5s-8.7-2.5-9.5-6.5z" fill="var(--marigold-deep)"/><path d="M5 13.5c1.6 1.2 4 1.8 7 1.8s5.4-.6 7-1.8" fill="none" stroke="var(--marigold)" stroke-width="1.4"/></svg>',
 note:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 17.5a3 3 0 1 1-2-2.83V5.2a1 1 0 0 1 .76-.97l10-2.5A1 1 0 0 1 19 2.7v12.8a3 3 0 1 1-2-2.83V7.3l-8 2v8.2z"/></svg>',
 drone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="17" r="4.5"/><path d="M12 12.5V2.5M10 2.5h4M9.5 15.5v3M14.5 15.5v3M12 14.8v4.4"/></svg>',
 tune:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
 close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 lock:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 10V8a5 5 0 0 1 10 0v2h.5A1.5 1.5 0 0 1 19 11.5v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-8A1.5 1.5 0 0 1 6.5 10H7zm2 0h6V8a3 3 0 0 0-6 0v2z"/></svg>',
 back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg>',
 clap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21l-3.5-5.5a2 2 0 0 1 .6-2.7l.4-.3 3 3.5V6a1.5 1.5 0 0 1 3 0v5-6.5a1.5 1.5 0 0 1 3 0V11V6a1.5 1.5 0 0 1 3 0v8.5c0 3.6-2.6 6.5-6 6.5z"/><path d="M4 4l1.5 1.5M8 2v2M2 8h2"/></svg>',
 finger:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13V4.5a1.5 1.5 0 0 1 3 0V12l4.2.9a2 2 0 0 1 1.6 2.2l-.6 4.2A2 2 0 0 1 16.2 21H11a2 2 0 0 1-1.6-.8L6 15.5a1.6 1.6 0 0 1 2.4-2z"/></svg>',
 wave:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 15V6.5a1.5 1.5 0 0 1 3 0V12 4.5a1.5 1.5 0 0 1 3 0V12 6a1.5 1.5 0 0 1 3 0v8c0 4-2.5 7-6 7-2.3 0-3.7-1-5-3l-2-3.5a1.6 1.6 0 0 1 2.7-1.6z"/><path d="M19 3c1.4.9 2.2 2.2 2.2 3.8M17.5 5.3c.6.4 1 1 1 1.8"/></svg>'
};
function kuyil(mood='happy'){
 const eye=mood==='sad'?'<circle cx="40" cy="40" r="6.5" fill="var(--kumkum)"/><path d="M36 41q4 -3 8 0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
  :mood==='wow'?'<circle cx="40" cy="39" r="7" fill="var(--kumkum)"/><circle cx="40" cy="39" r="4" fill="#141824"/><circle cx="41.6" cy="37.4" r="1.6" fill="#fff"/>'
  :'<circle cx="40" cy="40" r="6.5" fill="var(--kumkum)"/><path d="M36 41.5q4 -5 8 0" stroke="#141824" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
 return `<svg class="kuyil" viewBox="0 0 100 100" aria-hidden="true">
  <ellipse cx="54" cy="94" rx="24" ry="4" fill="var(--ink)" opacity=".08"/>
  <path d="M66 66 q22 6 28 22 q-14 2 -32 -12z" fill="var(--koel-deep)"/>
  <path d="M64 70 q18 12 18 26 q-12 -4 -24 -18z" fill="var(--koel)"/>
  <ellipse cx="52" cy="58" rx="25" ry="29" fill="var(--koel)"/>
  <ellipse cx="54" cy="68" rx="13" ry="15" fill="var(--koel-belly)"/>
  <path d="M60 50 q16 6 14 26 q-12 -4 -18 -18z" fill="var(--koel-deep)"/>
  <path d="M63 58 q6 4 7 12" stroke="var(--koel-belly)" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>
  ${eye}
  <circle cx="35" cy="51" r="4" fill="var(--kumkum)" opacity=".35"/>
  <path d="M28 43 l-13 5 l13 4z" fill="var(--beak)"/>
  <path d="M15 48 l13 -0.5 l0 4z" fill="var(--beak-deep)"/>
  <path d="M47 30 q2 -9 9 -8 q-3 3 -2 8" fill="var(--koel-deep)"/>
  <g transform="translate(70 14)" fill="var(--marigold)"><circle r="3.4"/><circle cx="3.4" cy="-1" r="3"/><circle cx="-3.4" cy="-1" r="3"/><circle cx="2" cy="3" r="3"/><circle cx="-2" cy="3" r="3"/><circle r="1.8" fill="var(--kumkum)"/></g>
  <path d="M46 86 v6 M57 86 v6" stroke="var(--beak-deep)" stroke-width="3" stroke-linecap="round"/>
 </svg>`}

/* ============ RENDER HELPERS ============ */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function swHTML(tk){if(tk.k)return '<span class="kv">,</span>';const lab=S.names==='long'?SW_SHORT[tk.sw]:tk.sw;return `<span class="sw${tk.o>0?' up':tk.o<0?' dn':''}">${lab}</span>`}
function tokLabel(str){const t=parse(str)[0];return swHTML(t)}
function tileLabel(s){const up=s.endsWith("'");return up?`<span class="sw up">${s.slice(0,-1)}</span>`:esc(s)}
function notationHTML(seq,thala,kala,off=0){
 const toks=parse(seq),spb=2**((kala||1)-1),T=THALAS[thala],per=T.acts.length,ends=[];let a=0;T.angas.forEach(n=>{a+=n;ends.push(a)});
 const beats=Math.ceil(toks.length/spb);let html='',b=0;
 while(b<beats){html+='<div class="av">';for(let k=0;k<per&&b<beats;k++,b++){
   html+=`<span class="beat" data-b="${b}">`;for(let j=0;j<spb;j++){const i=b*spb+j;if(toks[i])html+=`<span class="tok" data-i="${i+off}">${swHTML(toks[i])}</span>`}html+='</span>';
   const e=k+1;if(e===per)html+='<span class="sep">||</span>';else if(ends.includes(e))html+='<span class="sep">|</span>'}
  html+='</div>'}
 return html}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a}

/* ============ APP ============ */
let view='boot',tab='learn',openNode=null,L=null;
function render(){stopAll();stopMic();if(view==='auth')renderAuth();else if(view==='home')renderHome();else if(view==='lesson')renderEx();else if(view==='done')renderDone()}
function topBar(){
 return `<header class="top"><div class="brand">${kuyil()}<span>Kuyil</span></div>
  <span class="stat streak" title="Day streak">${I.diya}${liveStreak()}</span>
  <span class="stat xp" title="Total XP">${I.note}${S.xp}</span>
  <button class="iconbtn" data-drone aria-pressed="${S.drone}" aria-label="Tanpura drone" title="Tanpura drone">${I.drone}</button>
  <button class="iconbtn" id="tuneBtn" aria-label="Sruthi and settings" title="Sruthi and settings">${I.tune}</button></header>`}
function bindTop(){$('[data-drone]').onclick=()=>setDrone(!S.drone);$('#tuneBtn').onclick=openSettings}
function lessonState(idx){const l=ALL_LESSONS[idx];if(S.done[l.id])return'done';const firstOpen=ALL_LESSONS.findIndex(x=>!S.done[x.id]);return idx===firstOpen?'current':'locked'}
function renderHome(){
 const app=$('#app');let html=topBar();
 html+=`<nav class="tabs" role="tablist"><button class="tab" role="tab" aria-selected="${tab==='learn'}" data-tab="learn">Learn</button><button class="tab" role="tab" aria-selected="${tab==='practice'}" data-tab="practice">Practice room</button></nav>`;
 if(tab==='learn'){
  let gi=0;const offs=[0,56,84,56,0,-56,-84,-56];
  UNITS.forEach((u,ui)=>{
   html+=`<section style="--u:var(--${u.c});--u-deep:var(--${u.c}-deep)"><div class="unit"><div class="ux"><div class="eyebrow">Unit ${ui+1}</div><h2>${u.title}</h2><p>${u.blurb}</p></div><span class="pg">Book ${u.pages}</span></div><div class="path">`;
   u.lessons.forEach((l,li)=>{const idx=gi++,st=lessonState(idx),off=offs[idx%8];
    const stars=S.done[l.id]||0;
    html+=`<div style="transform:translateX(${off}px);display:flex;flex-direction:column;align-items:center">
     <button class="node ${st==='locked'?'locked':''} ${st==='current'?'current':''}" data-node="${idx}" aria-label="${esc(l.title)}${st==='locked'?' (locked)':''}">
     ${st==='current'?'<span class="startbub">Start</span>':''}${st==='done'?I.check:st==='locked'?I.lock:I.star}
     ${st==='done'?`<span class="stars">${[1,2,3].map(k=>`<span style="opacity:${k<=stars?1:.25}">${I.star}</span>`).join('')}</span>`:''}</button></div>`;
    if(openNode===idx){html+=`<div class="pop"><h3>${esc(l.title)}</h3><p>${st==='locked'?'Finish the lessons before this one to unlock it.':`Lesson ${li+1} of ${u.lessons.length} · ${l.ex.length} steps`}</p>${st==='locked'?'':`<button class="btn wide" data-start="${idx}">${st==='done'?'Practise again +5 XP':'Start +10 XP'}</button>`}</div>`}
   });
   html+='</div></section>'});
  html+=`<div class="finale">${kuyil('wow')}<div><b>Next in the book: Swarajathis and Jathiswarams.</b><br>Finish the geethams and you have completed the beginner foundation that Purandara Dasa laid out.</div></div>
   <p class="credit">Lesson order follows <i>Sadhakam: Carnatic Music Sadhaka Sahayi & Lessons</i> by Suresh Narayanan. Geetham notation from <a href="https://www.karnatik.com/geetams.shtml" target="_blank" rel="noopener">karnatik.com</a>.</p>`;
 } else html+=practiceHTML();
 app.innerHTML=html;bindTop();
 app.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;openNode=null;render()});
 app.querySelectorAll('[data-node]').forEach(b=>b.onclick=()=>{const i=+b.dataset.node;openNode=openNode===i?null:i;renderHome()});
 app.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>{ac();startLesson(+b.dataset.start)});
 if(tab==='practice')bindPractice();
 if(tab==='learn'&&openNode===null){const c=app.querySelector('.node.current');if(c&&!renderHome.scrolled){renderHome.scrolled=1;c.scrollIntoView({block:'center'})}}
}

/* settings sheet */
function openSettings(){
 const d=document.createElement('div');d.className='sheet';
 d.innerHTML=`<div class="card" role="dialog" aria-label="Settings"><div class="row" style="justify-content:space-between"><h3>Sruthi & settings</h3><button class="iconbtn" id="sClose" aria-label="Close">${I.close}</button></div>
  <div class="settings">
   <label for="sPitch">Sruthi (your Sa) <select id="sPitch">${pitchOptions()}</select></label>
   <p class="muted" style="margin:-6px 0 0">Pick a Sa that feels easy to sing. Or press <b>Find my Sa</b> and sing, and Kuyil uses your own voice.</p>
   <label for="sStrict">Singing check <select id="sStrict">${Object.entries(LEVELS).map(([k,v])=>`<option value="${k}" ${k===(S.strict||'gentle')?'selected':''}>${v.label} (±${v.tol}¢)</option>`).join('')}</select></label>
   <label for="sNames">Swara labels <select id="sNames"><option value="short" ${S.names==='short'?'selected':''}>S R G M</option><option value="long" ${S.names==='long'?'selected':''}>Sa Ri Ga Ma</option></select></label>
   <div class="row"><button class="btn ghost" id="sTest">${I.play} Test Sa</button><button class="btn ghost" id="sFind">${I.mic} Find my Sa</button></div>
   <p class="muted" id="sFindMsg" style="margin:0">Find my Sa: sing a comfortable “saaa” for two seconds and Kuyil uses that exact pitch as your Sa.</p>
   <hr style="border:0;border-top:2px solid var(--line);width:100%;margin:4px 0">
   <div class="row" style="justify-content:space-between"><span>Signed in as <b>${esc(ME?ME.username:'')}</b> · <span id="sync" class="muted">Saved</span></span><button class="btn ghost" id="sOut">Log out</button></div>
   <div class="row"><button class="btn ghost" id="sReset">Reset progress</button></div>
   <p class="muted" id="sMsg" style="margin:0"></p>
  </div></div>`;
 document.body.appendChild(d);
 const close=()=>{stopMic();d.remove();render()};
 d.onclick=e=>{if(e.target===d)close()};$('#sClose').onclick=close;
 $('#sPitch').onchange=e=>{S.pitch=e.target.value;save();tapNote({sw:'S',o:0})};
 $('#sNames').onchange=e=>{S.names=e.target.value;save()};
 $('#sStrict').onchange=e=>{S.strict=e.target.value;save()};
 $('#sTest').onclick=()=>playSeq("S P S'",{bpm:80});
 $('#sFind').onclick=()=>findMySa($('#sFindMsg'),$('#sPitch'));
 $('#sOut').onclick=async()=>{flush();try{await api('/api/logout',{method:'POST'})}catch(e){}ME=null;S={...DEFAULTS,drone:S.drone};if(S.drone)setDrone(false);d.remove();view='auth';render()};
 let armed=false;$('#sReset').onclick=()=>{if(!armed){armed=true;$('#sMsg').textContent='Tap "Reset progress" again to erase your XP, streak and stars.';return}
  S.xp=0;S.done={};S.streak=0;S.last=null;save();$('#sMsg').textContent='Progress reset.';armed=false};
}

/* ============ LESSON RUNNER ============ */
function startLesson(idx){
 const l=ALL_LESSONS[idx];L={idx,l,queue:l.ex.map((_,i)=>i),pos:0,hearts:5,graded:0,wrong:0,ans:null,checked:false,retry:new Set()};
 view='lesson';openNode=null;render()}
function curEx(){return L.l.ex[L.queue[L.pos]]}
function lessonHead(){const pct=Math.round(100*L.pos/L.queue.length);
 return `<div class="lhead"><button class="iconbtn" id="quit" aria-label="Leave lesson">${I.close}</button><div class="bar" role="progressbar" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div><span class="hearts" aria-label="${L.hearts} hearts left">${I.heart}${L.hearts}</span></div>`}
function renderEx(){
 const e=curEx(),u=L.l.unit;L.ans=null;L.checked=false;L.ready=false;
 let body='';
 if(e.t==='learn'){body=`<div class="kind">New idea</div><h2>${e.title}</h2><div class="say">${kuyil()}<div class="bubble">${e.body}</div></div>`;
  if(e.demo)body+=`<div class="demo">${e.demo.map((d,i)=>`<button class="playbtn" data-demo="${i}">${I.play}${esc(d.label)}</button>`).join('')}</div>`;L.ready=true}
 else if(e.t==='mcq'){body=`<div class="kind">${e.audio?'Listen':'Quiz'}</div><h2>${e.q}</h2>`;
  if(e.audio)body+=`<div><button class="playbtn big" id="hear">${I.play} Play again</button></div>`;
  body+=`<div class="opts">${e.opts.map((o,i)=>`<button class="opt" data-opt="${i}" aria-pressed="false"><span class="k">${i+1}</span><span>${o}</span></button>`).join('')}</div>`}
 else if(e.t==='order'){body=`<div class="kind">Arrange</div><h2>${e.q}</h2>${e.note||e.hint?`<p class="muted" style="margin:-8px 0 0">${esc(e.note||e.hint)}</p>`:''}<div class="answer" id="ansRow" data-ph="Tap the tiles below in order"></div><div class="bank" id="bank">${shuffle(e.answer.map((a,i)=>({a,i}))).map(x=>`<button class="tile" data-tile="${x.i}">${tileLabel(x.a)}</button>`).join('')}</div>`;L.ans=[]}
 else if(e.t==='echo'){const pads=e.pads.map(p=>parse(p)[0]);body=`<div class="kind">Echo</div><h2>${e.q}</h2><div class="row"><button class="playbtn big" id="hear">${I.play} Play again</button><button class="playbtn" id="undo">Undo</button></div><div class="typed" id="typed"></div><div class="pads">${pads.map((p,i)=>`<button class="pad" style="--h:${SW_HUE[p.sw]}" data-pad="${i}">${swHTML(p)}<small>${SW_SHORT[p.sw]}</small></button>`).join('')}</div>`;L.ans=[]}
 else if(e.t==='play'){body=`<div class="kind">Sing along</div><h2>${e.title}</h2><p class="muted" style="margin:-8px 0 0">${esc(e.note)}</p>${playerHTML(e)}`;L.ready=false}
 else if(e.t==='thala'){body=thalaHTML(e)}
 else if(e.t==='sing'){body=singHTML(e);L.ready=false}
 const foot=`<div class="foot" id="foot"><button class="btn wide" id="check" ${L.ready?'':'disabled'}>${e.t==='learn'||e.t==='play'||e.t==='thala'||e.t==='sing'?'Continue':'Check'}</button></div>`;
 $('#app').innerHTML=`<div class="lesson" style="--u:var(--${u.c});--u-deep:var(--${u.c}-deep)">${lessonHead()}<div class="ex">${body}</div>${foot}</div>`;
 $('#quit').onclick=()=>{stopAll();stopMic();view='home';L=null;render()};
 bindEx(e);window.scrollTo(0,0)}
function setReady(v){L.ready=v;const b=$('#check');if(b&&!L.checked)b.disabled=!v}
function bindEx(e){
 const chk=$('#check');chk.onclick=onCheck;
 if(e.t==='learn')$('#app').querySelectorAll('[data-demo]').forEach(b=>b.onclick=()=>{const d=e.demo[+b.dataset.demo];playSeq(d.seq,{raga:d.raga||'mmg',bpm:d.bpm||80,kala:d.kala||1,thala:d.thala||null})});
 if(e.t==='mcq'){const a=e.audio;if(a){const go=()=>playSeq(a.seq,a);$('#hear').onclick=go;setTimeout(go,250)}
  $('#app').querySelectorAll('[data-opt]').forEach(b=>b.onclick=()=>{if(L.checked)return;L.ans=+b.dataset.opt;$('#app').querySelectorAll('[data-opt]').forEach(x=>x.setAttribute('aria-pressed',x===b));setReady(true)})}
 if(e.t==='order'){const row=$('#ansRow'),bank=$('#bank');
  const redraw=()=>{row.innerHTML=L.ans.map((i,k)=>`<button class="tile" data-rm="${k}">${tileLabel(e.answer[i])}</button>`).join('');
   bank.querySelectorAll('[data-tile]').forEach(t=>t.classList.toggle('used',L.ans.includes(+t.dataset.tile)));
   row.querySelectorAll('[data-rm]').forEach(t=>t.onclick=()=>{if(L.checked)return;L.ans.splice(+t.dataset.rm,1);redraw()});
   setReady(L.ans.length===e.answer.length)};
  bank.querySelectorAll('[data-tile]').forEach(t=>t.onclick=()=>{if(L.checked)return;const i=+t.dataset.tile;if(!L.ans.includes(i)){L.ans.push(i);redraw()}})}
 if(e.t==='echo'){const target=parse(e.seq).filter(t=>!t.k),pads=e.pads.map(p=>parse(p)[0]);
  const go=()=>playSeq(e.seq,{raga:e.raga,bpm:e.bpm});$('#hear').onclick=go;setTimeout(go,250);
  const redraw=()=>{$('#typed').innerHTML=L.ans.map(t=>`<span class="tk">${swHTML(t)}</span>`).join('');setReady(L.ans.length===target.length)};
  $('#undo').onclick=()=>{if(L.checked)return;L.ans.pop();redraw()};
  $('#app').querySelectorAll('[data-pad]').forEach(b=>b.onpointerdown=ev=>{ev.preventDefault();if(L.checked)return;const p=pads[+b.dataset.pad];tapNote(p,e.raga);if(L.ans.length<target.length){L.ans.push(p);redraw()}});
  $('#app').querySelectorAll('[data-pad]').forEach(b=>b.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();b.onpointerdown(ev)}})}
 if(e.t==='play')bindPlayer(e,()=>setReady(true));
 if(e.t==='thala')bindThala(e);
 if(e.t==='sing')bindSing(e)}
function grade(e){
 if(e.t==='mcq')return L.ans===e.a;
 if(e.t==='order')return L.ans.every((i,k)=>e.answer[i]===e.answer[k]);
 if(e.t==='echo'){const target=parse(e.seq).filter(t=>!t.k);return L.ans.every((t,k)=>t.sw===target[k].sw&&t.o===target[k].o)}
 return true}
function rightAnswer(e){
 if(e.t==='mcq')return e.opts[e.a];
 if(e.t==='order')return e.answer.map(tileLabel).join(' ');
 if(e.t==='echo')return parse(e.seq).filter(t=>!t.k).map(swHTML).join(' ');
 return ''}
const PRAISE=['Sabash!','Wonderful!','Bale!','Nice ear!','Perfect!','Super!'];
function onCheck(){
 const e=curEx();
 if(L.checked||e.t==='learn'||e.t==='play'||e.t==='thala'||e.t==='sing'){if(e.t==='thala'&&!L.checked){finishThalaGrade();return}return next()}
 const ok=grade(e);L.checked=true;L.graded++;
 if(!ok){L.wrong++;L.hearts--;if(!L.retry.has(L.pos)){L.queue.push(L.queue[L.pos]);L.retry.add(L.queue.length-1)}}
 if(e.t==='mcq')$('#app').querySelectorAll('[data-opt]').forEach(b=>{const i=+b.dataset.opt;if(i===e.a)b.classList.add('right');else if(i===L.ans)b.classList.add('wrong')});
 if(e.t==='echo'){const target=parse(e.seq).filter(t=>!t.k);$('#typed').querySelectorAll('.tk').forEach((x,k)=>x.classList.add(L.ans[k].sw===target[k].sw&&L.ans[k].o===target[k].o?'ok':'no'))}
 showFeedback(ok,ok?'':`Correct answer: ${rightAnswer(e)}`)}
function showFeedback(ok,msg){
 const f=$('#foot');f.className='foot '+(ok?'good':'bad');
 const title=ok?PRAISE[Math.random()*PRAISE.length|0]:(L.hearts<=0?'Out of hearts':'Not quite');
 f.innerHTML=`<div class="fb">${ok?`<span style="width:40px;height:40px;display:grid;place-items:center;border-radius:50%;background:var(--good);color:var(--good-bg)">${I.check}</span>`:kuyil('sad')}<div><h3>${title}</h3>${msg?`<p>${msg}</p>`:''}</div></div><button class="btn wide ${ok?'':'bad'}" id="check">${L.hearts<=0?'Try the lesson again':'Continue'}</button>`;
 $('#check').onclick=()=>{if(L.hearts<=0){startLesson(L.idx);return}next()};
 if(ok)tapChime()}
function tapChime(){ac();const b=newBus(),t=AC.currentTime;voice(basePitch()*Math.pow(2,7/12)*2,t,.12,b,.12);voice(basePitch()*4,t+.1,.25,b,.12)}
function next(){stopAll();stopMic();L.pos++;if(L.pos>=L.queue.length)return finishLesson();renderEx()}
function finishLesson(){
 const acc=L.graded?Math.round(100*(L.graded-L.wrong)/L.graded):100;
 const stars=acc>=95?3:acc>=75?2:1,first=!S.done[L.l.id];
 const xp=(first?10:5)+(L.wrong===0?5:0);
 S.done[L.l.id]=Math.max(S.done[L.l.id]||0,stars);S.xp+=xp;
 const today=dayStr(),y=new Date();y.setDate(y.getDate()-1);
 if(S.last!==today){S.streak=S.last===dayStr(y)?S.streak+1:1;S.last=today}
 save();L.result={acc,xp,stars};view='done';render()}
function renderDone(){
 const r=L.result;
 $('#app').innerHTML=`<div class="done">${kuyil('wow')}<h2>Lesson complete!</h2><p style="margin:0;color:var(--ink-soft)">${esc(L.l.title)}</p>
  <div class="tiles3"><div class="tilestat" style="--c:var(--marigold)"><b>XP</b><span>+${r.xp}</span></div><div class="tilestat" style="--c:var(--parrot)"><b>Accuracy</b><span>${r.acc}%</span></div><div class="tilestat" style="--c:var(--kumkum)"><b>Streak</b><span>${S.streak}</span></div></div>
  <div style="display:flex;gap:4px;color:var(--marigold)">${[1,2,3].map(k=>`<span style="width:40px;opacity:${k<=r.stars?1:.25}">${I.star}</span>`).join('')}</div>
  <button class="btn wide" id="home">Continue</button></div>`;
 $('#home').onclick=()=>{view='home';L=null;renderHome.scrolled=0;render()};
 confetti();
 ac();const b=newBus(),t=AC.currentTime+.05;["S","G","P","S'"].forEach((s,i)=>voice(freqOf(parse(s)[0],'mmg'),t+i*.12,.3,b,.18))}

/* ============ SING-ALONG PLAYER ============ */
function playerHTML(e){
 return `<div class="ctrls"><button class="playbtn big" data-pl="go">${I.play} Play</button>
  <span class="row" role="group" aria-label="Speed">${[1,2,3].map(k=>`<button class="chip" data-kala="${k}" aria-pressed="${k===(e.kala||1)}">${['1st','2nd','3rd'][k-1]} kala</button>`).join('')}</span>
  <label for="bpm_${e.thala}">Tempo <input type="range" id="bpm_${e.thala}" min="40" max="120" value="${e.bpm||70}" data-pl="bpm"></label>
  <label><input type="checkbox" data-pl="thala" checked> Thala clicks</label></div>
  <div class="muted" style="font-size:13px">${THALAS[e.thala].name}: ${THALAS[e.thala].acts.map(a=>ACT_LABEL[a]).join(' · ')}</div>
  <div class="nota" data-pl="nota">${notaFor(e,e.kala||1)}</div>`}
function notaFor(e,kala){if(!e.sections)return notationHTML(e.seq,e.thala,kala);let off=0;
 return e.sections.map(sec=>{const h=`<div class="seclab">${esc(sec.label)}</div>`+notationHTML(sec.seq,e.thala,kala,off);off+=parse(sec.seq).length;return h}).join('')}
function bindPlayer(e,onPlayed,root=document){
 let kala=e.kala||1,playing=false;const nota=root.querySelector('[data-pl="nota"]'),go=root.querySelector('[data-pl="go"]'),bpm=root.querySelector('[data-pl="bpm"]'),th=root.querySelector('[data-pl="thala"]');
 const setBtn=p=>{playing=p;go.innerHTML=p?`${I.stop} Stop`:`${I.play} Play`;go.classList.toggle('playing',p)};
 const clear=()=>nota.querySelectorAll('.on,.now').forEach(x=>x.classList.remove('on','now'));
 const spb=()=>2**(kala-1);
 go.onclick=()=>{if(playing){stopAll();return}
  setBtn(true);onPlayed&&onPlayed();
  playSeq(e.seq,{raga:e.raga,kala,bpm:+bpm.value,thala:th.checked?e.thala:null,
   onStep:i=>{clear();const t=nota.querySelector(`[data-i="${i}"]`);if(t){t.classList.add('on');t.parentElement.classList.add('now');if(i%spb()===0)t.scrollIntoView({block:'nearest',inline:'nearest'})}},
   onEnd:()=>{setBtn(false);clear()},onStop:()=>{setBtn(false);clear()}})};
 root.querySelectorAll('[data-kala]').forEach(b=>b.onclick=()=>{stopAll();kala=+b.dataset.kala;root.querySelectorAll('[data-kala]').forEach(x=>x.setAttribute('aria-pressed',x===b));nota.innerHTML=notaFor(e,kala)})}

/* ============ THALA TAP ============ */
function thalaHTML(e){const T=THALAS[e.thala];
 return `<div class="kind">Keep thala</div><h2>${e.q}</h2><p class="muted" style="margin:-8px 0 0">${T.name}. After the 4-beat count-in, tap Clap, Finger or Wave on each beat. Keys: 1, 2, 3.</p>
  <div class="countin" id="countin" aria-live="polite"></div>
  <div class="tcells" style="--n:${T.acts.length}">${T.acts.map((a,i)=>`<div class="tcell ${e.hints?'':'hidehint'}" data-c="${i}">${a==='clap'?I.clap:a==='wave'?I.wave:I.finger}<span>${ACT_LABEL[a]}</span></div>`).join('')}</div>
  <div class="row"><button class="playbtn big" id="tStart">${I.play} Start</button><span class="muted" id="tMsg"></span></div>
  <div class="tbtns"><button class="tbtn" data-act="clap">${I.clap}Clap</button><button class="tbtn" data-act="finger">${I.finger}Finger</button><button class="tbtn" data-act="wave">${I.wave}Wave</button></div>`}
let TH=null;
function bindThala(e){
 const T=THALAS[e.thala],n=T.acts.length,beat=60/e.bpm;
 const start=()=>{ac();stopAll();const bus=newBus(),t0=AC.currentTime+.2;
  TH={t0:t0+4*beat,beat,res:Array(n).fill(null),bus,timers:[]};
  for(let k=0;k<4;k++){perc('tick',t0+k*beat,bus);TH.timers.push(setTimeout(()=>{$('#countin').textContent=4-k},(t0-AC.currentTime+k*beat)*1000))}
  for(let b=0;b<n;b++){perc('tick',TH.t0+b*beat,bus);
   TH.timers.push(setTimeout(()=>{$('#countin').textContent='';document.querySelectorAll('.tcell').forEach(c=>c.classList.toggle('now',+c.dataset.c===b))},(TH.t0-AC.currentTime+b*beat-.05)*1000))}
  TH.timers.push(setTimeout(()=>finishThalaGrade(),(TH.t0-AC.currentTime+n*beat+.2)*1000));
  cur={bus,timers:TH.timers};$('#tStart').disabled=true;$('#tMsg').textContent='Listen for the count-in…';
  document.querySelectorAll('.tcell').forEach(c=>c.classList.remove('ok','no'))};
 $('#tStart').onclick=start;
 const hit=act=>{tapPerc(act==='finger'?'f1':act);if(!TH||TH.done)return;const t=AC.currentTime,b=Math.round((t-TH.t0)/TH.beat);
  if(b<0||b>=n||Math.abs(t-(TH.t0+b*TH.beat))>TH.beat*.45||TH.res[b]!==null)return;
  const want=T.acts[b].startsWith('f')?'finger':T.acts[b];TH.res[b]=act===want;
  const c=document.querySelector(`.tcell[data-c="${b}"]`);c.classList.add(TH.res[b]?'ok':'no');c.classList.remove('hidehint')};
 document.querySelectorAll('[data-act]').forEach(b=>b.onpointerdown=ev=>{ev.preventDefault();hit(b.dataset.act)});
 document.querySelectorAll('[data-act]').forEach(b=>b.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();hit(b.dataset.act)}});
 window.onkeydown=ev=>{if(view!=='lesson'||curEx().t!=='thala')return;const m={'1':'clap','2':'finger','3':'wave'}[ev.key];if(m)hit(m)};
 TH=null}
function finishThalaGrade(){
 if(!TH||TH.done){return}TH.done=true;cur=null;
 const n=TH.res.length,good=TH.res.filter(x=>x===true).length,pass=good>=Math.ceil(n*.75);
 document.querySelectorAll('.tcell').forEach(c=>{c.classList.remove('now','hidehint');const r=TH.res[+c.dataset.c];if(r===null)c.classList.add('no')});
 L.checked=true;L.graded++;if(!pass){L.wrong++;L.hearts--;if(!L.retry.has(L.pos)){L.queue.push(L.queue[L.pos]);L.retry.add(L.queue.length-1)}}
 showFeedback(pass,`${good} of ${n} beats right.${pass?'':' Watch the order: clap, then fingers, then clap and wave.'}`)}

/* ============ PRACTICE ROOM ============ */
const LIBRARY=[
 ...Object.keys(SARALI).map(k=>({label:`Sarali ${k}`,seq:SARALI[k],thala:'adi',raga:'mmg'})),
 ...Object.keys(JANTA).map(k=>({label:`Janta ${k}`,seq:JANTA[k],thala:'adi',raga:'mmg',kala:2})),
 {label:'Eka alankaram',seq:ekaAlankaram(),thala:'eka',raga:'mmg'},
 {label:'Dhruva alankaram',seq:dhruvaAlankaram(),thala:'dhruva',raga:'mmg'},
 ...Object.entries(RAGAS).map(([k,r])=>({label:`${r.name} arohana & avarohana`,seq:`${r.aro} ${r.ava}`,thala:'adi',raga:k}))];
let prRaga='mmg',prLib=0;
function practiceHTML(){
 const r=RAGAS[prRaga],pads=["P.","D.","N.",...P_MID,"R'","G'"].map(s=>parse(s)[0]).filter(t=>r.semi[t.sw]!==undefined);
 const it=LIBRARY[prLib];
 return `<div style="display:flex;flex-direction:column;gap:14px;padding-bottom:30px">
  <div class="card"><h3>Swara pads</h3><p class="sub">Play freely. Turn on the tanpura and find each swara against the drone.</p>
   <label class="muted" for="prRaga" style="display:flex;gap:8px;align-items:center">Raga <select id="prRaga">${Object.entries(RAGAS).map(([k,v])=>`<option value="${k}" ${k===prRaga?'selected':''}>${v.name}</option>`).join('')}</select></label>
   <div class="pads" id="prPads">${pads.map((p,i)=>`<button class="pad" style="--h:${SW_HUE[p.sw]}" data-pp="${i}">${swHTML(p)}<small>${SW_SHORT[p.sw]}</small></button>`).join('')}</div>
   <div class="row"><button class="playbtn" data-drone aria-pressed="${S.drone}">${I.drone} Tanpura</button><span class="muted">Sruthi: ${S.pitch==="mine"&&S.saHz?Math.round(S.saHz)+" Hz (your Sa)":S.pitch}</span></div></div>
  <div class="card"><h3>Swara tuner</h3><p class="sub">Sing any note and Kuyil shows which swara it is, against your sruthi.</p>
   ${tunerHTML()}</div>
  <div class="card" id="prPlayer"><h3>Sing-along library</h3><p class="sub">Every exercise from the lessons, ready to sing with.</p>
   <label class="muted" for="prLib" style="display:flex;gap:8px;align-items:center">Exercise <select id="prLib">${LIBRARY.map((x,i)=>`<option value="${i}" ${i===prLib?'selected':''}>${esc(x.label)}</option>`).join('')}</select></label>
   ${playerHTML(it)}</div></div>`}
function bindPractice(){
 const r=RAGAS[prRaga],pads=["P.","D.","N.",...P_MID,"R'","G'"].map(s=>parse(s)[0]).filter(t=>r.semi[t.sw]!==undefined);
 $('#prRaga').onchange=e=>{prRaga=e.target.value;renderHome()};
 bindTuner();
 $('#prLib').onchange=e=>{prLib=+e.target.value;renderHome()};
 document.querySelectorAll('[data-pp]').forEach(b=>b.onpointerdown=ev=>{ev.preventDefault();tapNote(pads[+b.dataset.pp],prRaga)});
 document.querySelectorAll('.card [data-drone]').forEach(b=>b.onclick=()=>setDrone(!S.drone));
 bindPlayer(LIBRARY[prLib],null,$('#prPlayer'))}

/* ============ CONFETTI ============ */
function confetti(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const cv=$('#confetti');cv.hidden=false;const ctx=cv.getContext('2d'),W=cv.width=innerWidth*devicePixelRatio,H=cv.height=innerHeight*devicePixelRatio;
 const cs=getComputedStyle(document.documentElement),cols=['--parrot','--marigold','--kumkum','--peacock','--lotus'].map(v=>cs.getPropertyValue(v).trim());
 const ps=Array.from({length:120},()=>({x:W/2+(Math.random()-.5)*W*.3,y:H*.35,vx:(Math.random()-.5)*18*devicePixelRatio,vy:(-Math.random()*16-6)*devicePixelRatio,r:Math.random()*6+4,c:cols[Math.random()*5|0],a:Math.random()*6,s:Math.random()<.5}));
 let f=0;(function step(){ctx.clearRect(0,0,W,H);ps.forEach(p=>{p.vy+=.5*devicePixelRatio;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.a+=.15;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.fillStyle=p.c;
   if(p.s){ctx.beginPath();ctx.arc(0,0,p.r*devicePixelRatio*.6,0,7);ctx.fill()}else ctx.fillRect(-p.r,-p.r/3,p.r*2*devicePixelRatio*.6,p.r*devicePixelRatio*.5);ctx.restore()});
  if(++f<130)requestAnimationFrame(step);else{ctx.clearRect(0,0,W,H);cv.hidden=true}})()}

window.addEventListener('keydown',ev=>{if(view!=='lesson'||!L)return;const e=curEx();
 if(e.t==='mcq'&&!L.checked&&/^[1-4]$/.test(ev.key)){const b=document.querySelector(`[data-opt="${+ev.key-1}"]`);b&&b.click()}
 if(ev.key==='Enter'&&ev.target.tagName!=='BUTTON'){const c=$('#check');c&&!c.disabled&&c.click()}});

