/* ============ MICROPHONE + PITCH DETECTION ============ */
let MIC=null;
async function startMic(onPitch){
 ac();stopMic();
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error('This browser can’t use the microphone. Try Chrome, Safari or Firefox.');
 const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
 const src=AC.createMediaStreamSource(stream),an=AC.createAnalyser();an.fftSize=2048;src.connect(an);
 const buf=new Float32Array(an.fftSize),hist=[];
 MIC={stream,src,an,timer:setInterval(()=>{
  an.getFloatTimeDomainData(buf);const r=yin(buf,AC.sampleRate);
  if(r.f>0){hist.push(r.f);if(hist.length>3)hist.shift()}else hist.length=0;
  const f=hist.length>=2?[...hist].sort((a,b)=>a-b)[hist.length>>1]:-1;
  onPitch(f,r.rms)},40)};
 return MIC}
function stopMic(){if(!MIC)return;clearInterval(MIC.timer);MIC.stream.getTracks().forEach(t=>t.stop());try{MIC.src.disconnect()}catch(e){}MIC=null;if(window._droneWasOn){window._droneWasOn=false;setDrone(true)}}
/* YIN pitch estimate, limited to the singing range (70–1000 Hz) */
function yin(buf,sr){
 let rms=0;for(let i=0;i<buf.length;i++)rms+=buf[i]*buf[i];rms=Math.sqrt(rms/buf.length);
 if(rms<0.012)return{f:-1,rms};
 const maxTau=Math.min(Math.floor(sr/70),buf.length>>1),minTau=Math.floor(sr/1000),W=buf.length-maxTau,d=new Float32Array(maxTau+1);
 for(let tau=1;tau<=maxTau;tau++){let s=0;for(let i=0;i<W;i++){const x=buf[i]-buf[i+tau];s+=x*x}d[tau]=s}
 let run=0;d[0]=1;for(let tau=1;tau<=maxTau;tau++){run+=d[tau];d[tau]=run?d[tau]*tau/run:1}
 let tau=-1;for(let t=minTau;t<maxTau;t++){if(d[t]<0.15){while(t+1<maxTau&&d[t+1]<d[t])t++;tau=t;break}}
 if(tau<0)return{f:-1,rms};
 const a=d[tau-1],b=d[tau],c=d[tau+1]||b,den=a-2*b+c,shift=den?(a-c)/(2*den):0;
 return{f:sr/(tau+shift),rms}}
const NAMES12=['S','R1','R2','G2','G3','M1','M2','P','D1','D2','N2','N3'];
function centsFold(f,target){const c=1200*Math.log2(f/target);return ((c%1200)+1800)%1200-600}
function describe(f){const semi=12*Math.log2(f/basePitch()),n=Math.round(semi),cents=Math.round((semi-n)*100),pc=((n%12)+12)%12,oct=Math.floor(n/12);
 return{name:NAMES12[pc],sw:NAMES12[pc][0],oct,cents}}
function micError(e){return e&&e.name==='NotAllowedError'?'Microphone access was blocked. Allow it in your browser’s site settings, then try again.':(e&&e.message)||'The microphone could not start.'}
function muteDroneForMic(){if(S.drone){window._droneWasOn=true;setDrone(false)}}

/* ============ SING EXERCISE ============ */
const TOL=40,HOLD=0.55;
function singHTML(e){const target=parse(e.seq).filter(t=>!t.k);
 return `<div class="kind">Sing</div><h2>${e.q}</h2>
  <p class="muted" style="margin:-8px 0 0">Hold each swara steady until the ring fills. Any octave counts, so sing where it’s comfortable. Headphones help.</p>
  <div class="row"><button class="playbtn" id="sHear">${I.play} Hear it</button><button class="playbtn big" id="sMic">${I.mic} Start singing</button></div>
  <div class="singrow" id="sTargets">${target.map((t,i)=>`<span class="stgt" data-st="${i}">${swHTML(t)}</span>`).join('')}</div>
  <div class="meter" aria-live="polite">
   <div class="ring" id="sRing"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="rtrack"/><circle cx="60" cy="60" r="52" class="rfill" id="sFill" stroke-dasharray="327" stroke-dashoffset="327"/></svg><span id="sNow">${swHTML(target[0])}</span></div>
   <div class="track"><span class="zone" style="left:${50-TOL/2}%;width:${TOL}%"></span><span class="needle" id="sNeedle" hidden></span><span class="tl">flat</span><span class="tr">sharp</span></div>
   <p id="sMsg" class="smsg">Press <b>Start singing</b> and allow the microphone.</p>
  </div>
  <button class="linkbtn" id="sSkip">I can’t sing right now, skip this one</button>`}
function bindSing(e){
 const target=parse(e.seq).filter(t=>!t.k);let idx=0,hold=0,quietUntil=0;
 const msg=h=>$('#sMsg').innerHTML=h,fill=$('#sFill'),needle=$('#sNeedle');
 const mark=()=>{document.querySelectorAll('.stgt').forEach((x,i)=>{x.classList.toggle('ok',i<idx);x.classList.toggle('now',i===idx)});if(target[idx])$('#sNow').innerHTML=swHTML(target[idx])};
 mark();
 $('#sHear').onclick=()=>{quietUntil=performance.now()+(target.length*0.75+0.6)*1000;playSeq(e.seq,{raga:e.raga,bpm:80})};
 $('#sSkip').onclick=()=>{stopMic();L.checked=true;next()};
 $('#sMic').onclick=async()=>{
  if(MIC){stopMic();$('#sMic').innerHTML=`${I.mic} Start singing`;$('#sMic').classList.remove('playing');msg('Paused. Press <b>Start singing</b> to carry on.');return}
  try{muteDroneForMic();await startMic(onPitch);$('#sMic').innerHTML=`${I.stop} Stop`;$('#sMic').classList.add('playing');msg('Listening… sing the highlighted swara.')}
  catch(err){msg(esc(micError(err)))}};
 function onPitch(f,rms){
  if(idx>=target.length)return;
  if(performance.now()<quietUntil){msg('Listening to the example…');return}
  const tf=freqOf(target[idx],e.raga);
  if(f<0){needle.hidden=true;hold=Math.max(0,hold-0.04);msg(rms<0.012?'Sing a little louder.':'Listening…');draw();return}
  const c=centsFold(f,tf),d=describe(f);needle.hidden=false;needle.style.left=`${50+Math.max(-50,Math.min(50,c/2))}%`;
  const ok=Math.abs(c)<=TOL;needle.classList.toggle('good',ok);
  hold=ok?hold+0.04:Math.max(0,hold-0.08);
  msg(ok?`In tune! Hold it…`:`You’re on <b>${esc(d.name)}</b>, ${Math.abs(Math.round(c))}¢ ${c<0?'low: go a little higher':'high: come down a little'}.`);
  draw();
  if(hold>=HOLD){idx++;hold=0;tapChime();mark();
   if(idx>=target.length){stopMic();$('#sMic').disabled=true;msg('Every swara in tune. Sabash!');L.checked=true;showFeedback(true,'You sang it in tune.')}}}
 function draw(){fill.style.strokeDashoffset=String(327*(1-Math.min(1,hold/HOLD)))}}

/* ============ TUNER (practice room) ============ */
function tunerHTML(){return `<div class="tuner"><div class="tbig" id="tuNote">–</div><div class="track"><span class="zone" style="left:${50-TOL/2}%;width:${TOL}%"></span><span class="needle" id="tuNeedle" hidden></span><span class="tl">flat</span><span class="tr">sharp</span></div><p class="smsg" id="tuMsg">Press start and sing.</p><button class="playbtn" id="tuBtn">${I.mic} Start tuner</button></div>`}
function bindTuner(){const b=$('#tuBtn');if(!b)return;
 b.onclick=async()=>{if(MIC){stopMic();b.innerHTML=`${I.mic} Start tuner`;$('#tuMsg').textContent='Tuner stopped.';return}
  try{muteDroneForMic();await startMic((f)=>{const n=$('#tuNeedle');if(!n)return stopMic();
    if(f<0){n.hidden=true;return}
    const d=describe(f);n.hidden=false;n.style.left=`${50+Math.max(-50,Math.min(50,d.cents/2))}%`;n.classList.toggle('good',Math.abs(d.cents)<=TOL);
    $('#tuNote').innerHTML=`<span class="sw${d.oct>0?' up':d.oct<0?' dn':''}">${esc(d.sw)}</span><small>${esc(d.name)}</small>`;
    $('#tuMsg').textContent=`${Math.round(f)} Hz · ${d.cents>0?'+':''}${d.cents}¢ from ${d.name}`});
   b.innerHTML=`${I.stop} Stop tuner`}catch(err){$('#tuMsg').textContent=micError(err)}}}

/* ============ FIND MY SA ============ */
async function findMySa(out,select){
 const got=[];out.textContent='Hum a comfortable low note now…';
 try{muteDroneForMic();await startMic(f=>{if(f>0)got.push(f)})}catch(e){out.textContent=micError(e);return}
 setTimeout(()=>{stopMic();
  if(got.length<10){out.textContent='Kuyil didn’t hear a steady note. Try again a little louder.';return}
  const f=got.sort((a,b)=>a-b)[got.length>>1];
  let best=PITCHES[0],bd=1e9;for(const p of PITCHES){const d=Math.abs(centsFold(f,p[2]));if(d<bd){bd=d;best=p}}
  S.pitch=best[0];save();if(select)select.value=best[0];
  out.textContent=`You hummed about ${Math.round(f)} Hz. Your Sa is now ${best[0]} (${best[1]} kattai).`;tapNote({sw:'S',o:0})},2600)}

/* ============ LOGIN / SIGN UP ============ */
let authMode='signup';
function renderAuth(){
 $('#app').innerHTML=`<div class="auth">${kuyil('wow')}<h1>Kuyil Carnatic</h1><p class="tagline">Learn Carnatic music one swara at a time: listen, tap, keep thala and sing, from Sa all the way to your first geethams.</p>
  <form class="card" id="authForm" novalidate>
   <div class="tabs" role="tablist" style="padding:0"><button type="button" class="tab" role="tab" data-am="signup" aria-selected="${authMode==='signup'}">Sign up</button><button type="button" class="tab" role="tab" data-am="login" aria-selected="${authMode==='login'}">Log in</button></div>
   <label class="field" for="aUser">Username<input id="aUser" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" required minlength="3" maxlength="24"></label>
   <label class="field" for="aPass">Password<input id="aPass" name="password" type="password" autocomplete="${authMode==='signup'?'new-password':'current-password'}" required minlength="8"></label>
   ${authMode==='signup'?'<p class="muted" style="margin:-4px 0 0">At least 8 characters. Your progress is saved to this account.</p>':''}
   <p class="err" id="aErr" role="alert" hidden></p>
   <button class="btn wide" id="aGo">${authMode==='signup'?'Create account':'Log in'}</button>
  </form></div>`;
 document.querySelectorAll('[data-am]').forEach(b=>b.onclick=()=>{authMode=b.dataset.am;renderAuth()});
 $('#authForm').onsubmit=async ev=>{ev.preventDefault();const err=$('#aErr'),go=$('#aGo');err.hidden=true;go.disabled=true;
  try{const data=await api(authMode==='signup'?'/api/signup':'/api/login',{method:'POST',body:{username:$('#aUser').value,password:$('#aPass').value}});signedIn(data)}
  catch(e){err.textContent=e.message;err.hidden=false;go.disabled=false}}}

async function boot(){
 try{signedIn(await api('/api/me'))}
 catch(e){view='auth';render();if(e.status&&e.status!==401){const x=$('#aErr');if(x){x.textContent=e.message;x.hidden=false}}}}
boot();
