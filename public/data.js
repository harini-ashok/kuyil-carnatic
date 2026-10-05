/* ============ DATA: ragas, thalas, curriculum (Sadhakam, Suresh Narayanan) ============ */
const RAGAS={
  mmg:{name:'Mayamalavagowla',semi:{S:0,R:1,G:4,M:5,P:7,D:8,N:11},aro:"S R G M P D N S'",ava:"S' N D P M G R S"},
  malahari:{name:'Malahari',semi:{S:0,R:1,G:4,M:5,P:7,D:8},aro:"S R M P D S'",ava:"S' D P M G R S"},
  mohanam:{name:'Mohanam',semi:{S:0,R:2,G:4,P:7,D:9},aro:"S R G P D S'",ava:"S' D P G R S"},
  kalyani:{name:'Kalyani',semi:{S:0,R:2,G:4,M:6,P:7,D:9,N:11},aro:"S R G M P D N S'",ava:"S' N D P M G R S"},
  suddhasaveri:{name:'Suddha Saveri',semi:{S:0,R:2,M:5,P:7,D:9},aro:"S R M P D S'",ava:"S' D P M R S"},
  arabhi:{name:'Arabhi',semi:{S:0,R:2,G:4,M:5,P:7,D:9,N:11},aro:"S R M P D S'",ava:"S' N D P M G R S"},
  saveri:{name:'Saveri',semi:{S:0,R:1,G:4,M:5,P:7,D:8,N:11},aro:"S R M P D S'",ava:"S' N D P M G R S"},
  bhairavi:{name:'Bhairavi',semi:{S:0,R:2,G:3,M:5,P:7,D:[9,8],N:10},aro:"S R G M P D N S'",ava:"S' N D P M G R S",note:'Dha is D2 going up and D1 coming down.'},
  kambhoji:{name:'Kambhoji',semi:{S:0,R:2,G:4,M:5,P:7,D:9,N:10},aro:"S R G M P D S'",ava:"S' N D P M G R S"},
  sri:{name:'Sri',semi:{S:0,R:2,G:3,M:5,P:7,D:9,N:10},aro:"S R M P N S'",ava:"S' N P M R G R S"},
  anandabhairavi:{name:'Anandabhairavi',semi:{S:0,R:2,G:3,M:5,P:7,D:9,N:10},aro:"S G R G M P D P S'",ava:"S' N D P M G R S"},
  harikedaragowla:{name:'Harikedaragowla',semi:{S:0,R:2,G:4,M:5,P:7,D:9,N:10},aro:"S R G M P D N S'",ava:"S' N D P M G R S"},
  shankara:{name:'Shankarabharanam',semi:{S:0,R:2,G:4,M:5,P:7,D:9,N:11},aro:"S R G M P D N S'",ava:"S' N D P M G R S"}
};
/* the twelve swarasthanas (dwadasa) and the sixteen names (shodasa) */
const VAR={R1:1,R2:2,R3:3,G1:2,G2:3,G3:4,M1:5,M2:6,D1:8,D2:9,D3:10,N1:9,N2:10,N3:11};
/* tokens: S R G M P D N, an optional variant digit (R2), then ' for the upper octave or . for the lower; "," holds the swara */
function parse(str){return String(str).trim().split(/\s+/).filter(t=>t&&!/^\|+$/.test(t)).map(t=>{if(t===',')return{k:1};let o=0;if(t.endsWith("'")){o=1;t=t.slice(0,-1)}else if(t.endsWith('.')){o=-1;t=t.slice(0,-1)}const v=/^[RGMDN][123]$/.test(t)?t[1]:'';return{sw:t[0],o,...(v?{v}:{})}})}
function semiOf(tok,raga){if(tok.v)return VAR[tok.sw+tok.v];const r=RAGAS[raga]||RAGAS.mmg;let s=r.semi[tok.sw];if(s===undefined)s=RAGAS.mmg.semi[tok.sw];return Array.isArray(s)?s[tok.down?1:0]:s}
/* a swara with two forms in a raga (Bhairavi's Dha) takes the lower one when the melody falls after it */
function withDir(toks,raga){const r=RAGAS[raga];if(!r||!Object.values(r.semi).some(Array.isArray))return toks;
 const notes=toks.filter(t=>!t.k);notes.forEach((t,i)=>{if(!Array.isArray(r.semi[t.sw]))return;const n=notes[i+1];if(!n)return;
  t.down=semiOf(n,raga)+12*n.o<r.semi[t.sw][0]+12*t.o});return toks}
const FINGERS=['f1','f2','f3','f4','f5','f6','f7','f8'],laghu=n=>['clap',...FINGERS.slice(0,n-1)],DR=['clap','wave'],ANU=['clap'];
const L4=laghu(4);
const THALAS={
  adi:{name:'Adi thala',acts:[...L4,...DR,...DR],angas:[4,2,2]},
  rupaka:{name:'Rupakam',acts:[...DR,...L4],angas:[2,4]},
  eka:{name:'Eka thala',acts:[...L4],angas:[4]},
  tisra:{name:'Tisra Triputa',acts:[...laghu(3),...DR,...DR],angas:[3,2,2]},
  dhruva:{name:'Dhruva thala',acts:[...L4,...DR,...L4,...L4],angas:[4,2,4,4]},
  matya:{name:'Matya thala',acts:[...L4,...DR,...L4],angas:[4,2,4]},
  jhampa:{name:'Misra Jhampa',acts:[...laghu(7),...ANU,...DR],angas:[7,1,2]},
  ata:{name:'Khanda Ata',acts:[...laghu(5),...laghu(5),...DR,...DR],angas:[5,5,2,2]}
};
const ACT_LABEL={clap:'Clap',f1:'Little',f2:'Ring',f3:'Middle',f4:'Index',f5:'Thumb',f6:'Little',f7:'Ring',f8:'Middle',wave:'Wave'};
const SW_LONG={S:'Shadjam',R:'Rishabham',G:'Gandharam',M:'Madhyamam',P:'Panchamam',D:'Dhaivatham',N:'Nishadham'};
const SW_SHORT={S:'Sa',R:'Ri',G:'Ga',M:'Ma',P:'Pa',D:'Dha',N:'Ni'};
const SW_HUE={S:'var(--kumkum)',R:'var(--marigold)',G:'var(--parrot)',M:'var(--peacock)',P:'var(--lotus)',D:'var(--marigold)',N:'var(--parrot)'};

/* exercise helpers */
const learn=(title,body,demo)=>({t:'learn',title,body,demo});
const mcq=(q,opts,a,o={})=>({t:'mcq',q,opts,a,...o});
const listen=(q,seq,opts,a,o={})=>({t:'mcq',q,opts,a,audio:{seq,raga:o.raga||'mmg',bpm:o.bpm||80,kala:o.kala||1,thala:o.thala||null},...o});
const order=(q,answer,o={})=>({t:'order',q,answer,...o});
const echo=(q,seq,pads,o={})=>({t:'echo',q,seq,pads,raga:o.raga||'mmg',bpm:o.bpm||75});
const sing=(q,seq,o={})=>({t:'sing',q,seq,raga:o.raga||'mmg'});
const play=(title,note,seq,o={})=>({t:'play',title,note,seq,raga:o.raga||'mmg',thala:o.thala||'adi',kala:o.kala||1,bpm:o.bpm||70});
const thalaTap=(q,thala='adi',o={})=>({t:'thala',q,thala,hints:o.hints!==false,bpm:o.bpm||66});
const P_MID=['S','R','G','M','P','D','N',"S'"];

const playSong=(title,note,sections,o)=>({...play(title,note,sections.map(x=>x.seq).join(' '),o),sections});
const firstN=(seq,n)=>parse(seq).filter(t=>!t.k).slice(0,n).map(t=>t.sw+(t.o>0?"'":t.o<0?'.':'')).join(' ');
