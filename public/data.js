/* ============ DATA: ragas, thalas, curriculum (Sadhakam, Suresh Narayanan) ============ */
const RAGAS={
  mmg:{name:'Mayamalavagowla',semi:{S:0,R:1,G:4,M:5,P:7,D:8,N:11},aro:"S R G M P D N S'",ava:"S' N D P M G R S"},
  malahari:{name:'Malahari',semi:{S:0,R:1,G:4,M:5,P:7,D:8},aro:"S R M P D S'",ava:"S' D P M G R S"},
  mohanam:{name:'Mohanam',semi:{S:0,R:2,G:4,P:7,D:9},aro:"S R G P D S'",ava:"S' D P G R S"},
  suddhasaveri:{name:'Suddha Saveri',semi:{S:0,R:2,M:5,P:7,D:9},aro:"S R M P D S'",ava:"S' D P M R S"},
  shankara:{name:'Shankarabharanam',semi:{S:0,R:2,G:4,M:5,P:7,D:9,N:11},aro:"S R G M P D N S'",ava:"S' N D P M G R S"}
};
function parse(str){return String(str).trim().split(/\s+/).filter(t=>t&&t!=='|').map(t=>{if(t===',')return{k:1};let o=0;if(t.endsWith("'")){o=1;t=t.slice(0,-1)}else if(t.endsWith('.')){o=-1;t=t.slice(0,-1)}return{sw:t,o}})}
const L4=['clap','f1','f2','f3'],DR=['clap','wave'];
const THALAS={
  adi:{name:'Adi thala',acts:[...L4,...DR,...DR],angas:[4,2,2]},
  rupaka:{name:'Rupakam',acts:[...DR,...L4],angas:[2,4]},
  eka:{name:'Eka thala',acts:[...L4],angas:[4]},
  tisra:{name:'Tisra Triputa',acts:['clap','f1','f2',...DR,...DR],angas:[3,2,2]},
  dhruva:{name:'Dhruva thala',acts:[...L4,...DR,...L4,...L4],angas:[4,2,4,4]}
};
const ACT_LABEL={clap:'Clap',f1:'Little',f2:'Ring',f3:'Middle',wave:'Wave'};
const SW_LONG={S:'Shadjam',R:'Rishabham',G:'Gandharam',M:'Madhyamam',P:'Panchamam',D:'Dhaivatham',N:'Nishadham'};
const SW_SHORT={S:'Sa',R:'Ri',G:'Ga',M:'Ma',P:'Pa',D:'Dha',N:'Ni'};
const SW_HUE={S:'var(--kumkum)',R:'var(--marigold)',G:'var(--parrot)',M:'var(--peacock)',P:'var(--lotus)',D:'var(--marigold)',N:'var(--parrot)'};

const ARO="S R G M P D N S'",AVA="S' N D P M G R S";
const SARALI={
 1:`${ARO} ${AVA}`,
 2:`S R S R S R G M ${ARO} S' N S' N S' N D P ${AVA}`,
 3:`S R G S R G S R ${ARO} S' N D S' N D S' N ${AVA}`,
 4:`S R G M S R G M ${ARO} S' N D P S' N D P ${AVA}`,
 5:`S R G M P , S R ${ARO} S' N D P M , S' N ${AVA}`,
 6:`S R G M P D S R ${ARO} S' N D P M G S' N ${AVA}`,
 7:`S R G M P D N , ${ARO} S' N D P M G R , ${AVA}`,
 8:`S R G M P M G R ${ARO} S' N D P M P D N ${AVA}`,
 9:`S R G M P M D P ${ARO} S' N D P M P G M ${AVA}`,
 10:`S R G M P , G M P , , , P , , , G M P D N D P M G M P G M G R S`,
 11:`S R G M S M G R ${ARO} S' N D P S' P D N ${AVA}`,
 12:`S G R M G P M G ${ARO} S' D N P D M P D ${AVA}`
};
const JANTA={
 1:`S S R R G G M M P P D D N N S' S' S' S' N N D D P P M M G G R R S S`,
 2:`S S R R S S R R S S R R G G M M S S R R G G M M P P D D N N S' S' S' S' N N S' S' N N S' S' N N D D P P S' S' N N D D P P M M G G R R S S`
};
const SCALE=['S','R','G','M','P','D','N',"S'"];
function ekaAlankaram(){let o=[];for(let x=0;x<5;x++)o.push(SCALE.slice(x,x+4));for(let x=7;x>2;x--)o.push([SCALE[x],SCALE[x-1],SCALE[x-2],SCALE[x-3]]);return o.flat().join(' ')}
function dhruvaAlankaram(){const o=[];
 for(let x=0;x<5;x++){const s=i=>SCALE[x+i];o.push(s(0),s(1),s(2),s(3),s(2),s(1),s(0),s(1),s(2),s(1),s(0),s(1),s(2),s(3))}
 for(let x=7;x>2;x--){const s=i=>SCALE[x-i];o.push(s(0),s(1),s(2),s(3),s(2),s(1),s(0),s(1),s(2),s(1),s(0),s(1),s(2),s(3))}
 return o.join(' ')}

/* exercise helpers */
const learn=(title,body,demo)=>({t:'learn',title,body,demo});
const mcq=(q,opts,a,o={})=>({t:'mcq',q,opts,a,...o});
const listen=(q,seq,opts,a,o={})=>({t:'mcq',q,opts,a,audio:{seq,raga:o.raga||'mmg',bpm:o.bpm||80,kala:o.kala||1,thala:o.thala||null},...o});
const order=(q,answer,o={})=>({t:'order',q,answer,...o});
const echo=(q,seq,pads,o={})=>({t:'echo',q,seq,pads,raga:o.raga||'mmg',bpm:o.bpm||75});
const sing=(q,seq,o={})=>({t:'sing',q,seq,raga:o.raga||'mmg'});
/* karnatik.com notation: lowercase = middle octave, capital = upper octave, "x." = lower octave */
function knk(str){return str.split(/\s+/).filter(t=>t&&!/^\|+$/.test(t)).map(t=>{if(t===',')return ',';
 if(t.endsWith('.'))return t[0].toUpperCase()+'.';return t===t.toUpperCase()?t+"'":t.toUpperCase()}).join(' ')}
const play=(title,note,seq,o={})=>({t:'play',title,note,seq,raga:o.raga||'mmg',thala:o.thala||'adi',kala:o.kala||1,bpm:o.bpm||70});
const thalaTap=(q,thala='adi',o={})=>({t:'thala',q,thala,hints:o.hints!==false,bpm:o.bpm||66});
const P_MID=['S','R','G','M','P','D','N',"S'"];

const UNITS=[
{id:'u1',title:'Nada & Swara',blurb:'Hear your first notes and learn their names.',pages:'pp. 8–12',c:'parrot',lessons:[
 {id:'u1l1',title:'Hello, Sa',ex:[
  learn('Music starts with nada',`<p>The book opens with this idea: <b>Nada</b> (sound) gives us <b>Sruthi</b>, Sruthi gives us <b>Swaras</b>, and swaras give us <b>Ragas</b>.</p><p>Your first swara is <b>Sa</b>. It is "home". Every other note is heard in relation to it.</p>`,[{label:'Hear Sa',seq:'S'}]),
  learn('Sruthi is your pitch',`<p>In Carnatic music the note you pick as your Sa is your <b>sruthi</b>. You can change it with the tuning button at the top.</p><p>Try the tanpura drone too. It hums Pa and Sa underneath you so your ear always knows where home is.</p>`,[{label:'Hear Sa, then Pa',seq:'S P'}]),
  listen('Listen. Are these two notes the same?','S S',['Same','Different'],0),
  listen('And these two?','S P',['Same','Different'],1),
  mcq('What is the full name of Sa?',['Shadjam','Panchamam','Rishabham'],0),
  listen('Which note was higher?','P S',['The first one','The second one'],0),
  echo('Listen, then tap the same swaras.','S P S',['S','P']),
  sing('Now sing Sa. Use “Hear it” first if you like.','S')
 ]},
 {id:'u1l2',title:'Sa and Pa',ex:[
  learn('The two steady swaras',`<p><b>Sa</b> and <b>Pa</b> never change. The book calls them <b>Prakruthi swaras</b>.</p><p>The other five (Ri, Ga, Ma, Dha, Ni) each have more than one position. That is what makes one raga sound different from another.</p>`,[{label:'Sa Pa Sa',seq:"S P S'"}]),
  learn('Sa, one floor up',`<p>After Ni, Sa comes back, higher. We write it with a <b>dot above</b>: <span class="sw up">S</span>.</p><p>It is the same "home", just in a higher octave.</p>`,[{label:'Sa and upper Sa',seq:"S S'"}]),
  mcq('Which two swaras never change?',['Sa and Pa','Ri and Ga','Ma and Ni'],0),
  listen('What is the second note?',"S S'",['Upper Sa','Pa','The same Sa'],0),
  listen('What is the second note?','S P',['Upper Sa','Pa','The same Sa'],1),
  echo('Tap what you hear.',"S P S' P S",['S','P',"S'"]),
  echo('One more.',"S S' P S",['S','P',"S'"]),
  sing('Sing Sa, then Pa.','S P')
 ]},
 {id:'u1l3',title:'The seven swaras',ex:[
  learn('Saptha swaras',`<p>There are seven swaras. Their short names are what you sing.</p><table class="table"><tr><th>Sing</th><th>Full name</th><th>Western</th></tr><tr><td>Sa</td><td>Shadjam</td><td>C</td></tr><tr><td>Ri</td><td>Rishabham</td><td>D</td></tr><tr><td>Ga</td><td>Gandharam</td><td>E</td></tr><tr><td>Ma</td><td>Madhyamam</td><td>F</td></tr><tr><td>Pa</td><td>Panchamam</td><td>G</td></tr><tr><td>Dha</td><td>Dhaivatham</td><td>A</td></tr><tr><td>Ni</td><td>Nishadham</td><td>B</td></tr></table>`,[{label:'All seven, up and down',seq:`${ARO} ${AVA}`}]),
  order('Put the swaras in order, from low to high.',['Sa','Ri','Ga','Ma','Pa','Dha','Ni']),
  mcq('Ga is short for…',['Gandharam','Gauri','Gamakam'],0),
  mcq('Dha is short for…',['Dhaivatham','Dhrutham','Dhanyasi'],0),
  listen('How many different swaras before Sa comes back?',ARO,['Five','Seven','Twelve'],1),
  echo('Tap the first four swaras.','S R G M',['S','R','G','M','P']),
  echo('Now the top four.',"P D N S'",['M','P','D','N',"S'"]),
  sing('Sing the first four swaras.','S R G M')
 ]},
 {id:'u1l4',title:'Low, middle, high',ex:[
  learn('Sthayi means octave',`<p>The book uses dots to show which octave (<b>sthayi</b>) a swara is in:</p><p><span class="sw dn">N</span> one dot below: <b>Mandhra</b> (low)<br><span class="sw">N</span> no dot: <b>Madhya</b> (middle)<br><span class="sw up">N</span> one dot above: <b>Thara</b> (high)</p>`,[{label:'Low to high',seq:"P. D. N. S R G M P D N S' R' G'",bpm:110}]),
  mcq('A dot <b>above</b> a swara means…',['Thara sthayi (high)','Mandhra sthayi (low)','Hold it longer'],0),
  mcq('Which sthayi has no dot at all?',['Madhya','Mandhra','Thara'],0),
  listen('Which Ni is lower?','N. N',['The first one','The second one'],0),
  listen('Was the last note a low or high Sa?',"S N. S",['It went back to middle Sa','It jumped to upper Sa'],0),
  echo('Tap what you hear. Watch the dots!','N. S R S',['N.','S','R','G']),
  echo('Coming down from the top.',"S' N D P",['P','D','N',"S'"])
 ]}
]},
{id:'u2',title:'Raga & Thala',blurb:'Your first raga and how to keep time with your hand.',pages:'pp. 12–22',c:'marigold',lessons:[
 {id:'u2l1',title:'Mayamalavagowla',ex:[
  learn('What is a raga?',`<p>A <b>raga</b> is a family of swaras with its own mood and rules. There are <b>72 Melakartha</b> (parent) ragas and countless <b>Janya</b> (child) ragas.</p><p>Purandara Dasa, the "Pithamaha" of Carnatic music, chose <b>Mayamalavagowla</b>, the 15th Melakartha, as the raga every beginner starts with.</p>`,[{label:'Hear Mayamalavagowla',seq:`${ARO} ${AVA}`}]),
  learn('Going up and coming down',`<p><b>Arohana</b> is the ascending order of swaras. <b>Avarohana</b> is the descending order.</p><p>In Mayamalavagowla both use all seven swaras in a straight line.</p>`,[{label:'Arohana',seq:ARO},{label:'Avarohana',seq:AVA}]),
  learn('Its special flavour',`<p>The swara positions (swarasthanas) here are: Suddha Ri (R1), Anthara Ga (G3), Suddha Ma (M1), Suddha Dha (D1) and Kakali Ni (N3).</p><p>Listen for the <b>wide gap between Ri and Ga</b>. It gives this raga its glowing, temple-like sound.</p>`,[{label:'Sa Ri Ga',seq:'S R G'},{label:'Pa Dha Ni Sa',seq:"P D N S'"}]),
  mcq('Avarohana means…',['The descending order of swaras','The ascending order of swaras','A type of thala'],0),
  mcq('Mayamalavagowla is Melakartha number…',['15','29','72'],0),
  order('Build the avarohana.',["Sa'",'Ni','Dha','Pa','Ma','Ga','Ri','Sa'],{hint:"Sa' is upper Sa"}),
  echo('Sing it with your fingers: tap the arohana.',ARO,P_MID),
  sing('Now sing the arohana out loud.',ARO)
 ]},
 {id:'u2l2',title:'Adi thala',ex:[
  learn('Thala keeps the time',`<p>The book says "<b>Sruthi is the mother and Laya is the father</b>". Thala is how we count laya with our hands.</p><p><b>Adi thala</b> has 8 counts (aksharas): a <b>Laghu</b> (clap + 3 finger counts, starting from the little finger), then two <b>Dhrutham</b>s (clap + wave each).</p>`,[{label:'Hear Adi thala',seq:', , , , , , , , , , , , , , , ,',thala:'adi',bpm:72}]),
  learn('The thala symbols',`<p><b>|</b> Laghu: a clap and finger counts<br><b>O</b> Dhrutham: one clap and one wave (2 aksharas)<br><b>U</b> Anudhrutham: one clap (1 akshara)</p><p>So Adi thala is written <b>| O O</b>, which is 4 + 2 + 2 = 8.</p>`),
  order('Put one cycle of Adi thala in order.',['Clap','Little','Ring','Middle','Clap','Wave','Clap','Wave'],{note:'Finger counts start from the little finger.'}),
  mcq('How many aksharas are in one cycle of Adi thala?',['6','8','14'],1),
  mcq('A Dhrutham is…',['A clap and a wave','A clap and three finger counts','A single clap'],0),
  thalaTap('Your turn. Tap the right action on each beat.','adi')
 ]},
 {id:'u2l3',title:'Speeds (kalas)',ex:[
  learn('Three speeds',`<p>Carnatic students practise each exercise at several speeds, called <b>kalas</b>.</p><p><b>First kala:</b> 1 swara per akshara.<br><b>Second kala:</b> 2 swaras per akshara.<br><b>Third kala:</b> 4 swaras per akshara.</p><p>The thala stays the same. Only the swaras get faster.</p>`,[{label:'First kala',seq:`${ARO} ${AVA}`,thala:'adi',kala:1},{label:'Second kala',seq:`${ARO} ${AVA}`,thala:'adi',kala:2}]),
  play('Saptha swaras in Adi thala','Press play and watch the swaras line up with the thala. Try the speed buttons.',`${ARO} ${AVA}`),
  listen('Listen to the clicks. How many swaras fit in each beat?',`${ARO} ${AVA}`,['One','Two','Four'],1,{kala:2,thala:'adi',bpm:66}),
  mcq('In the third kala, how many swaras fit in one akshara?',['Two','Three','Four'],2),
  thalaTap('Keep the thala going, without the hints this time.','adi',{hints:false})
 ]}
]},
{id:'u3',title:'Sarali Varisai',blurb:'The famous first exercises, sung with the swara names.',pages:'pp. 23–24',c:'kumkum',lessons:[
 {id:'u3l1',title:'Sarali 1 to 3',ex:[
  learn('Warming up with Sarali',`<p><b>Sarali varisais</b> are the step-by-step exercises Purandara Dasa wrote for beginners. You sing the swara names, in Mayamalavagowla, in Adi thala.</p><p>Each one goes up to upper Sa and comes back down.</p>`),
  play('Sarali 1','The simplest: straight up, straight down. Sing along with the swara names.',SARALI[1]),
  echo('Tap the first half of Sarali 2.','S R S R S R G M',['S','R','G','M']),
  play('Sarali 2','"Sa Ri" three times, then climb.',SARALI[2]),
  echo('Tap the start of Sarali 3.','S R G S R G S R',['S','R','G','M']),
  play('Sarali 3','Groups of three: Sa Ri Ga, Sa Ri Ga, Sa Ri.',SARALI[3]),
  mcq('In Sarali 2, which pair repeats at the start?',['Sa Ri','Sa Pa','Ga Ma'],0),
  sing('Sing the opening of Sarali 3.','S R G S R G')
 ]},
 {id:'u3l2',title:'Sarali 4 to 6',ex:[
  learn('The comma is a held note',`<p>In the notation a comma <b>,</b> means: keep singing the previous swara for one more akshara.</p><p>So <b>P ,</b> is Pa held for two beats.</p>`,[{label:'P , then Sa Ri',seq:'S R G M P , S R'}]),
  play('Sarali 4','Four up, four again, then the full climb.',SARALI[4]),
  mcq('<span class="sw">P</span> <span class="kv">,</span> means…',['Hold Pa for one extra akshara','Skip Pa','Sing Pa softly'],0),
  echo('Tap the start of Sarali 5 (just the swaras, not the comma).','S R G M P S R',['S','R','G','M','P']),
  play('Sarali 5','Notice the pause on Pa.',SARALI[5]),
  play('Sarali 6','Climb to Dha, then back to Sa Ri.',SARALI[6]),
  listen('Which sarali was that?',SARALI[6].split(' ').slice(0,16).join(' '),['Sarali 4','Sarali 5','Sarali 6'],2,{bpm:100})
 ]},
 {id:'u3l3',title:'Sarali 7 to 9',ex:[
  play('Sarali 7','Hold Ni at the top of the first phrase.',SARALI[7]),
  echo('Tap the turn in Sarali 8.','P M G R',['R','G','M','P','D']),
  play('Sarali 8','Up to Pa, then turn back down.',SARALI[8]),
  play('Sarali 9','Pa Ma Dha Pa: a little zig-zag.',SARALI[9]),
  echo('Tap the zig-zag.','P M D P',['M','P','D','N']),
  mcq('Sarali 9 begins "S R G M P M…". What comes next?',['D P','G R','N S'],0)
 ]},
 {id:'u3l4',title:'Sarali 10 to 12',ex:[
  play('Sarali 10','Long held Pa notes. Keep counting the thala while you hold!',SARALI[10]),
  mcq('In Sarali 10, how many aksharas is "P , , ," held for?',['Two','Four','Eight'],1),
  play('Sarali 11','Sa Ri Ga Ma, then jump back to Sa.',SARALI[11]),
  echo('Tap the first phrase of Sarali 11.','S R G M S M G R',['S','R','G','M','P']),
  play('Sarali 12','A weaving pattern: Sa Ga Ri Ma Ga Pa…',SARALI[12]),
  thalaTap('Check your thala before the next unit.','adi',{hints:false})
 ]}
]},
{id:'u4',title:'Janta Varisai',blurb:'Doubled swaras that build strength and clarity.',pages:'p. 27',c:'peacock',lessons:[
 {id:'u4l1',title:'Janta 1 and 2',ex:[
  learn('Every swara twice',`<p><b>Janta</b> means "pair". Each swara is sung twice, and the second one gets a small push of breath so both are clear.</p><p>These are usually practised in the second kala.</p>`,[{label:'Hear Janta 1',seq:JANTA[1],kala:2,thala:'adi'}]),
  play('Janta Varisai 1','Straight up and down, in pairs.',JANTA[1],{kala:2}),
  sing('Sing the first pairs.','S S R R G G'),
  echo('Tap the first eight swaras.','S S R R G G M M',['S','R','G','M']),
  play('Janta Varisai 2','Like Sarali 2, but doubled.',JANTA[2],{kala:2}),
  listen('Janta or Sarali?','S S R R G G M M',['Janta','Sarali'],0),
  listen('And this one?','S R G M P D N S\'',['Janta','Sarali'],1)
 ]}
]},
{id:'u5',title:'Alankaras',blurb:'The seven-thala exercises, a tour of rhythm.',pages:'pp. 16, 33',c:'lotus',lessons:[
 {id:'u5l1',title:'Eka alankaram',ex:[
  learn('Saptha thala alankaras',`<p>The book lists the seven basic thalas: <b>Dhruva, Matya, Rupaka, Jhampa, Thriputa, Ata and Eka</b>.</p><p>Each laghu can come in 5 <b>jathis</b> (3, 4, 5, 7 or 9 counts), so 7 × 5 gives <b>35 thalas</b>.</p>`),
  mcq('How many thalas do the 7 thalas × 5 jathis make?',['12','35','72'],1),
  learn('Eka thala',`<p>The smallest one: just a single Laghu. In Chathurasra jathi that is <b>clap + 3 fingers = 4</b> aksharas.</p>`,[{label:'Hear Eka thala',seq:', , , , , , , ,',thala:'eka',bpm:72}]),
  play('Eka alankaram','Four swaras, sliding up one step at a time.',ekaAlankaram(),{thala:'eka'}),
  echo('Tap the first two groups.','S R G M R G M P',['S','R','G','M','P']),
  thalaTap('Tap Eka thala.','eka')
 ]},
 {id:'u5l2',title:'Dhruva alankaram',ex:[
  learn('Dhruva thala',`<p>Dhruva thala is <b>| O | |</b>: Laghu, Dhrutham, Laghu, Laghu.</p><p>In Chathurasra jathi that is 4 + 2 + 4 + 4 = <b>14 aksharas</b>, the longest of the seven.</p>`,[{label:'Hear Dhruva thala',seq:Array(14).fill(',').join(' '),thala:'dhruva',bpm:80}]),
  mcq('How many aksharas in Chathurasra Dhruva thala?',['8','10','14'],2),
  order('Build Dhruva thala from its angas.',['Laghu','Dhrutham','Laghu','Laghu']),
  play('Dhruva alankaram','Each line is 14 swaras: one full cycle of the thala.',dhruvaAlankaram(),{thala:'dhruva',bpm:76}),
  echo('Tap the first line.','S R G M G R S R G R S R G M',['S','R','G','M'])
 ]}
]},
{id:'u6',title:'Ragas & Masters',blurb:'Your first janya raga, ear training and the great composers.',pages:'pp. 17–21, 37, 41',c:'parrot',lessons:[
 {id:'u6l1',title:'Malahari',ex:[
  learn('A child raga',`<p><b>Malahari</b> is a janya of the 15th mela, Mayamalavagowla. The first geethams in the book, like <b>Sree Gananatha</b> by Purandara Dasa, are in Malahari.</p><p>Arohana: <b>S R M P D Ṡ</b><br>Avarohana: <b>Ṡ D P M G R S</b></p>`,[{label:'Arohana',seq:RAGAS.malahari.aro,raga:'malahari'},{label:'Avarohana',seq:RAGAS.malahari.ava,raga:'malahari'}]),
  mcq('Which swara does Malahari skip going up?',['Ga','Pa','Dha'],0),
  mcq('Which swara never appears in Malahari?',['Ni','Ma','Ri'],0),
  echo('Tap the Malahari arohana.',RAGAS.malahari.aro,['S','R','G','M','P','D',"S'"],{raga:'malahari'}),
  order('Build the Malahari avarohana.',["Sa'",'Dha','Pa','Ma','Ga','Ri','Sa']),
  sing('Sing the Malahari arohana.',RAGAS.malahari.aro,{raga:'malahari'}),
  mcq('Sree Gananatha geetham is set in which thala?',['Rupakam','Adi','Dhruva'],0)
 ]},
 {id:'u6l2',title:'Ear training',ex:[
  learn('Mohanam',`<p><b>Mohanam</b> uses only five swaras: <b>S R G P D</b>. It is a janya of Harikamboji (28th mela) and the book's geetham <b>Varaveena</b> is in this raga.</p><p>Five-note ragas sound open and joyful.</p>`,[{label:'Hear Mohanam',seq:`${RAGAS.mohanam.aro} ${RAGAS.mohanam.ava}`,raga:'mohanam'}]),
  listen('Which raga is this?',`${ARO} ${AVA}`,['Mayamalavagowla','Mohanam','Malahari'],0,{bpm:110}),
  listen('Which raga is this?',`${RAGAS.mohanam.aro} ${RAGAS.mohanam.ava}`,['Mayamalavagowla','Mohanam','Malahari'],1,{raga:'mohanam',bpm:110}),
  listen('Which raga is this?',`${RAGAS.malahari.aro} ${RAGAS.malahari.ava}`,['Mayamalavagowla','Mohanam','Malahari'],2,{raga:'malahari',bpm:110}),
  listen('Same swara names, different raga. Which one?',`${ARO} ${AVA}`,['Mayamalavagowla','Shankarabharanam'],1,{raga:'shankara',bpm:110}),
  mcq('How many swaras does Mohanam use?',['Five','Six','Seven'],0)
 ]},
 {id:'u6l3',title:'The masters',ex:[
  learn('Pithamaha',`<p><b>Purandara Dasa</b> (1484–1564) is the "Pithamaha" (grandfather) of Carnatic music. He wrote the varisais, alankaras and geethas you have been learning, in this exact order.</p>`),
  learn('The Musical Trinity',`<p>Three composers, all born in <b>Thiruvarur</b>:</p><p><b>Thyagaraja</b> (1767–1847), mudra "Thyagaraja"<br><b>Muthuswami Dikshitar</b> (1776–1835), mudra "Guruguha"<br><b>Syama Sastri</b> (1762–1827), mudra "Syamakrishna"</p><p>A <b>mudra</b> is the signature a composer hides inside the song.</p>`),
  mcq('Who is called the Pithamaha of Carnatic music?',['Purandara Dasa','Thyagaraja','Swathi Thirunal'],0),
  mcq('Which composer used the mudra "Guruguha"?',['Muthuswami Dikshitar','Syama Sastri','Thyagaraja'],0),
  mcq('Swathi Thirunal signed his songs with…',['Padmanabha','Guruguha','Syamakrishna'],0),
  mcq('Where were all three of the Trinity born?',['Thiruvarur','Thiruvananthapuram','Mysore'],0)
 ]}
]}
];

/* ===== Geethams (notation: karnatik.com; book pp. 37–43) ===== */
const GN={
 C:knk("m p | d S S R || R S | d p m p || r m | p d m p || d p | m g r s ||"),
 P:knk("s r | m , g r || s r | g r s , || r m | p d m p || d p | m g r s || s r | m , g r || s r | g r s , ||")};
const KG={
 C:knk("d p | m g r s || r m | p d m p || d R | R s d p || d p | m g r s ||"),
 P:knk("s , | r , r , || d p | m g r s || s r | m , g r || s r | g r s , ||")};
const KN={
 C:knk("d S S | d p | m p || d d p | m m | p , || d d S | d p | m p || d d p | m g | r s ||"),
 P:knk("s r r | s r | s r || d d p | m g | r s || d p d | s , | d p || d d p | m g | r s ||")};
const PN={
 P:knk("r s d. | s , | s , || m g r | m m | p , || s d , | d p | m p || d d p | m g | r s || r s d. | s , | s , || m g r | m m | p , || s d , | d p | m p || d d p | m g | r s ||"),
 A:knk("p m p | d S | d S || R S d | d S | d p || d , p | p , | p m || r m m | p , | , , || d d p | p , | p m || r , m | m g | r s || s , s | d d | d p || p , p | m g | r s ||"),
 C:knk("d S , | d p | m p || d d p | m g | r s || d S , | d p | m p || d d p | m g | r s || p m p | d S | d S || R S d | d S | d p || d d p | p , | p m || r m m | p , | p , || d d p | p , | p m || r , m | m g | r s || s , s | d d | d p || p , p | m g | r s ||")};
const AN=knk("R M R | R S | d S || S , S | d p | m p || d d S | d , | d p || p m r | d , | d p || p , m | d , | d p || p , p | m p | d p || p m r | s r | s r || p m p | s r | s r || p p d | p p | m r || r s r | m , | m , || d p d | S , | S , || R R S | d p | m p || d d S | d , | d p || p m r | d , | d p || p , m | d , | d p || p , p | m p | d p || p m r | s r | s r || p m p | s r | s r || p p d | p p | m r ||");
const playSong=(title,note,sections,o)=>({...play(title,note,sections.map(x=>x.seq).join(' '),o),sections});
const firstN=(seq,n)=>parse(seq).filter(t=>!t.k).slice(0,n).map(t=>t.sw+(t.o>0?"'":t.o<0?'.':'')).join(' ');
UNITS.push({id:'u7',title:'Geethams',blurb:'Your first real songs, by Purandara Dasa, learned through their swaras.',pages:'pp. 37–43',c:'kumkum',lessons:[
 {id:'u7l1',title:'Sree Gananatha',ex:[
  learn('Your first geetham',`<p>A <b>geetham</b> is a short, simple song. It is sung straight through, with no repeated variations, so it is the bridge from exercises to real music.</p><p><b>Sree Gananatha</b> (also called <b>Lambodara</b>) by Purandara Dasa is in raga <b>Malahari</b> and <b>Rupakam</b> thala.</p><p>We learn it the traditional way: <b>swaras first</b>, then the words.</p>`,[{label:'Hear the opening',seq:GN.C,raga:'malahari',thala:'rupaka',bpm:84}]),
  learn('Rupakam thala',`<p>In this book Rupakam is a <b>Dhrutham then a Laghu</b>: clap, wave, then clap and three finger counts. That makes <b>6 aksharas</b>.</p>`,[{label:'Hear Rupakam',seq:Array(12).fill(',').join(' '),thala:'rupaka',bpm:72}]),
  thalaTap('Tap Rupakam thala.','rupaka'),
  play('Charanam: “Sree gananatha”','The verse. It climbs to upper Sa and Ri, then settles back down.',GN.C,{raga:'malahari',thala:'rupaka'}),
  echo('Tap the first phrase.',firstN(GN.C,6),['M','P','D',"S'","R'"],{raga:'malahari'}),
  play('Pallavi: “Lambodara”','The refrain you return to after every verse.',GN.P,{raga:'malahari',thala:'rupaka'}),
  echo('Tap the “Lambodara” phrase.',firstN(GN.P,5),['S','R','G','M'],{raga:'malahari'}),
  sing('Sing the “Lambodara” phrase.',firstN(GN.P,5),{raga:'malahari'}),
  playSong('The whole geetham','Verse 1, refrain, verse 2 (“Siddha charana”), refrain, verse 3 (“Sakala vidya”), refrain.',[{label:'Charanam 1 · Sree gananatha',seq:GN.C},{label:'Pallavi · Lambodara',seq:GN.P},{label:'Charanam 2 · Siddha charana',seq:GN.C},{label:'Pallavi · Lambodara',seq:GN.P},{label:'Charanam 3 · Sakala vidya',seq:GN.C},{label:'Pallavi · Lambodara',seq:GN.P}],{raga:'malahari',thala:'rupaka',bpm:80}),
  mcq('All three verses of Sree Gananatha use…',['The same swaras with different words','Different swaras each time','No swaras at all'],0)
 ]},
 {id:'u7l2',title:'Kundagaura',ex:[
  learn('Kundagaura (Mandara)',`<p>The second Malahari geetham by Purandara Dasa, also in <b>Rupakam</b>. Its refrain begins with long notes: <b>s , r , r ,</b>.</p><p>Notice that the second line of its refrain is the same as Sree Gananatha’s “Lambodara” line.</p>`,[{label:'Hear the refrain',seq:KG.P,raga:'malahari',thala:'rupaka',bpm:84}]),
  play('Charanam: “Kundagaura”','Starts on Dha and walks down to Sa.',KG.C,{raga:'malahari',thala:'rupaka'}),
  echo('Tap the opening walk down.',firstN(KG.C,6),['S','R','G','M','P','D'],{raga:'malahari'}),
  play('Pallavi: “Mandara”','Long Sa and Ri, then the familiar phrase.',KG.P,{raga:'malahari',thala:'rupaka'}),
  listen('Which line is this?',KG.P.split(' ').slice(12).join(' '),['The “Lambodara” line from Sree Gananatha','A brand-new phrase'],0,{raga:'malahari',bpm:90}),
  sing('Sing the opening walk down.',firstN(KG.C,6),{raga:'malahari'}),
  playSong('The whole geetham','Verse, refrain, two more verses (“Hema” and “Chanda”), each followed by the refrain.',[{label:'Charanam 1 · Kundagaura',seq:KG.C},{label:'Pallavi · Mandara',seq:KG.P},{label:'Charanam 2 · Hema',seq:KG.C},{label:'Pallavi · Mandara',seq:KG.P},{label:'Charanam 3 · Chanda',seq:KG.C},{label:'Pallavi · Mandara',seq:KG.P}],{raga:'malahari',thala:'rupaka',bpm:80})
 ]},
 {id:'u7l3',title:'Kereya Neeranu',ex:[
  learn('A new thala: Tisra Triputa',`<p><b>Kereya Neeranu</b> moves to <b>Tisra jathi Triputa</b> thala: a Laghu of <b>3</b> (clap and two fingers), then two Dhruthams.</p><p>3 + 2 + 2 = <b>7 aksharas</b>. It has a lilting, uneven swing.</p>`,[{label:'Hear Tisra Triputa',seq:Array(14).fill(',').join(' '),thala:'tisra',bpm:72}]),
  mcq('How many aksharas in Tisra Triputa?',['6','7','8'],1),
  thalaTap('Tap Tisra Triputa.','tisra'),
  play('Charanam: “Kereya neeranu”','Starts high on upper Sa.',KN.C,{raga:'malahari',thala:'tisra'}),
  echo('Tap the start.',firstN(KN.C,7),['M','P','D',"S'"],{raga:'malahari'}),
  play('Pallavi: “Hariya”','The refrain.',KN.P,{raga:'malahari',thala:'tisra'}),
  sing('Sing the refrain’s opening.',firstN(KN.P,4),{raga:'malahari'}),
  playSong('The whole geetham','Verse, refrain, second verse, refrain.',[{label:'Charanam 1 · Kereya neeranu',seq:KN.C},{label:'Pallavi · Hariya',seq:KN.P},{label:'Charanam 2 · Sree purandara',seq:KN.C},{label:'Pallavi · Hariya',seq:KN.P}],{raga:'malahari',thala:'tisra',bpm:80})
 ]},
 {id:'u7l4',title:'Padumanabha',ex:[
  learn('Three sections',`<p><b>Padumanabha</b> is the last of the four Malahari geethams, in Tisra Triputa. It is longer, with a <b>pallavi</b>, an <b>anupallavi</b> and a <b>charanam</b>.</p><p>It also dips below Sa into the lower octave: <span class="sw dn">D</span>.</p>`,[{label:'Hear the opening',seq:PN.P.split(' ').slice(0,14).join(' '),raga:'malahari',thala:'tisra',bpm:84}]),
  play('Pallavi','Watch for the lower Dha in the first beat.',PN.P,{raga:'malahari',thala:'tisra'}),
  echo('Tap the opening, including the low Dha.',firstN(PN.P,4),['D.','S','R','G'],{raga:'malahari'}),
  play('Anupallavi','This section rises into the upper octave.',PN.A,{raga:'malahari',thala:'tisra'}),
  play('Charanam','The longest section. Then the pallavi returns.',PN.C,{raga:'malahari',thala:'tisra'}),
  mcq('Which section comes right after the pallavi?',['Anupallavi','Charanam','Swarajathi'],0),
  sing('Sing the opening.',firstN(PN.P,3),{raga:'malahari'}),
  playSong('The whole geetham','Pallavi, anupallavi, charanam, then back to the pallavi.',[{label:'Pallavi',seq:PN.P},{label:'Anupallavi',seq:PN.A},{label:'Charanam',seq:PN.C},{label:'Pallavi',seq:PN.P}],{raga:'malahari',thala:'tisra',bpm:84})
 ]},
 {id:'u7l5',title:'Analekara',ex:[
  learn('A new raga: Suddha Saveri',`<p><b>Analekara</b> leaves Malahari behind. It is in <b>Suddha Saveri</b>, a janya of Shankarabharanam (29th mela), with only five swaras: <b>S R2 M1 P D2</b>.</p><p>There is no Ga and no Ni at all.</p>`,[{label:'Arohana & avarohana',seq:`${RAGAS.suddhasaveri.aro} ${RAGAS.suddhasaveri.ava}`,raga:'suddhasaveri'}]),
  mcq('Which two swaras are missing from Suddha Saveri?',['Ga and Ni','Ri and Dha','Ma and Pa'],0),
  listen('Malahari or Suddha Saveri?',`${RAGAS.suddhasaveri.aro} ${RAGAS.suddhasaveri.ava}`,['Malahari','Suddha Saveri'],1,{raga:'suddhasaveri',bpm:110}),
  echo('Tap the opening.',firstN(AN,5),['S','R','M','P','D',"S'","R'","M'"],{raga:'suddhasaveri'}),
  sing('Sing the Suddha Saveri arohana.',RAGAS.suddhasaveri.aro,{raga:'suddhasaveri'}),
  play('Analekara','One continuous song in Tisra Triputa. Sing along with the swaras.',AN,{raga:'suddhasaveri',thala:'tisra',bpm:84}),
  mcq('You have finished the four Malahari geethams and Analekara. The book’s next step is…',['Swarajathis and Jathiswarams','Sarali varisai','Learning Sa'],0)
 ]}
]});
const ALL_LESSONS=UNITS.flatMap(u=>u.lessons.map(l=>({...l,unit:u})));
