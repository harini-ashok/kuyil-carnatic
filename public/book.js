/* ============ CURRICULUM: follows the contents page of Sadhakam (Suresh Narayanan) ============
   Theory (pp. 8–21) → Basic Lessons (pp. 22–36) → Geethas (pp. 37–49) → Lakshana Geetham (p. 51).
   Lesson ids from earlier versions are kept so finished lessons stay finished. */
const escB=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ARO="S R G M | P D | N S' ||",AVA="S' N D P | M G | R S ||";
/* Sarali varisas 1–16 (pp. 23–24) */
const SARALI={
 1:`S R S R | S R | G M || ${ARO} S' N S' N | S' N | D P || ${AVA}`,
 2:`S R G S | R G | S R || ${ARO} S' N D S' | N D | S' N || ${AVA}`,
 3:`S R G M | S R | G M || ${ARO} S' N D P | S' N | D P || ${AVA}`,
 4:`S R G M | P , | S R || ${ARO} S' N D P | M , | S' N || ${AVA}`,
 5:`S R G M | P D | S R || ${ARO} S' N D P | M G | S' N || ${AVA}`,
 6:`S R G M | P D | N , || ${ARO} S' N D P | M G | R , || ${AVA}`,
 7:`S R G M | P M | G R || ${ARO} S' N D P | M P | D N || ${AVA}`,
 8:`S R G M | P M | D P || ${ARO} S' N D P | M P | G M || ${AVA}`,
 9:`S R G M | R G | M P || ${ARO} S' N D P | N D | P M || ${AVA}`,
 10:`S R G M | S M | G R || ${ARO} S' N D P | S' P | D N || ${AVA}`,
 11:`S G R M | G P | M G || ${ARO} S' D N P | D M | P D || ${AVA}`,
 12:`S R S G | R G | M G || ${ARO} S' N S' D | N D | P D || ${AVA}`,
 13:`R S G R | M G | P M || ${ARO} N S' D N | P D | M P || ${AVA}`,
 14:`G R S M | G R | P M || ${ARO} D N S' P | D N | M P || ${AVA}`,
 15:`M G R S | P M | G R || ${ARO} P D N S' | M P | D N || ${AVA}`,
 16:`S R G M | S' N | D P || ${ARO} P D N S' | M G | R S || ${AVA}`
};
/* Sthayi varisas (pp. 24–26) */
const MADHYA={
 1:"S R G M | P , | G M || P , , , | P , | , , || G M P D | N D | P M || G M P G | M G | R S ||",
 2:"S' , N D | N , | D P || D , P M | P , | P , || G M P D | N D | P M || G M P G | M G | R S ||",
 3:"S' S' N D | N N | D P || D D P M | P , | P , || G M P D | N D | P M || G M P G | M G | R S ||",
 4:"S R G R | G , | G M || P M P , | D P | D , || M P D P | D N | D P || M P D P | M G | R S ||",
 5:"S R G M | P , | P , || D D P , | M M | P , || D N S' , | S' N | D P || S' N D P | M G | R S ||"
};
const T_IN=`${ARO} S' , , , | S' , | , , ||`,T_OUT=`D N S' R' | S' N | D P || ${AVA}`,T_MID="S' R' S' N | D P | M P ||";
const THARA={
 1:`${T_IN} ${T_OUT}`,
 2:`${T_IN} D N S' R' | S' S' | R' S' || ${T_MID} ${T_OUT}`,
 3:`${T_IN} D N S' R' | G' R' | S' R' || ${T_MID} D N S' R' | S' S' | R' S' || ${T_MID} ${T_OUT}`,
 4:`${T_IN} D N S' R' | G' M' | G' R' || ${T_MID} D N S' R' | G' R' | S' R' || ${T_MID} D N S' R' | S' S' | R' S' || ${T_MID} ${T_OUT}`,
 5:`${T_IN} D N S' R' | G' M' | P' M' || G' R' S' N | D P | M P || D N S' R' | G' M' | G' R' || ${T_MID} D N S' R' | G' R' | S' R' || ${T_MID} D N S' R' | S' S' | R' S' || ${T_MID} ${T_OUT}`
};
const M_IN=`${AVA} S , , , | S , | , , ||`,M_OUT=`G R S N. | S R | G M || ${ARO}`,M_MID="S N. S R | G M | P M ||";
const MANDRA={
 1:`${M_IN} ${M_OUT}`,
 2:`${M_IN} G R S N. | S S | N. S || ${M_MID} ${M_OUT}`,
 3:`${M_IN} G R S N. | D. N. | S N. || ${M_MID} G R S N. | S S | N. S || ${M_MID} ${M_OUT}`,
 4:`${M_IN} G R S N. | D. P. | D. N. || ${M_MID} G R S N. | D. N. | S N. || ${M_MID} G R S N. | S S | N. S || ${M_MID} ${M_OUT}`,
 5:`${M_IN} G R S N. | D. P. | M. P. || D. N. S R | G M | P M || G R S N. | D. P. | D. N. || ${M_MID} G R S N. | D. N. | S N. || ${M_MID} G R S N. | S S | N. S || ${M_MID} ${M_OUT} ${AVA} S , , , | S , | , , ||`
};
/* Janta, Vakra Janta, Dhattu and the alankaras come from basics.js (BOOK) */
const ex=(sec,n)=>BOOK[sec][n].join(' ');
const JANTA=Object.fromEntries(Object.keys(BOOK.janta).map(k=>[k,ex('janta',k)]));
const ALANKARA_THALA={1:'dhruva',2:'matya',3:'rupaka',4:'jhampa',5:'tisra',6:'ata',7:'eka'};
const lines=(seq,n)=>seq.split('||').map(x=>x.trim()).filter(Boolean).slice(0,n).join(' || ')+' ||';

/* one lesson per geetham, built from the transcribed notes in geethams.js */
const RAGA_LINK={malahari:'a janya of Mayamalavagowla (15th mela)',mohanam:'a janya of Harikamboji (28th mela)',kalyani:'Mechakalyani, the 65th mela',suddhasaveri:'a janya of Shankarabharanam (29th mela)',arabhi:'a janya of Shankarabharanam (29th mela)',saveri:'a janya of Mayamalavagowla (15th mela)',bhairavi:'a janya of Natabhairavi (20th mela)',kambhoji:'a janya of Harikamboji (28th mela)',sri:'a janya of Kharaharapriya (22nd mela)',anandabhairavi:'a janya of Natabhairavi (20th mela)',harikedaragowla:'a janya of Harikamboji (28th mela)'};
const GEETHAM_LIB=[];
function geethamLesson(id,key,o){
 const g=GEETHAMS[key],r=RAGAS[o.raga],th=THALAS[o.thala];
 const secs=g.sections.map(s=>({label:s.name,seq:s.lines.map(l=>l.sw).join(' '),sa:s.lines.map(l=>l.sa).join(' ')}));
 const first=secs[0],firstLine={...first,seq:g.sections[0].lines[0].sw,sa:g.sections[0].lines[0].sa};
 const opt={raga:o.raga,thala:o.thala,bpm:o.bpm||80};
 const pads=[...new Set(parse(firstN(first.seq,6)).map(t=>t.sw+(t.o>0?"'":t.o<0?'.':'')))].sort((a,b)=>semiOf(parse(a)[0],o.raga)+12*parse(a)[0].o-semiOf(parse(b)[0],o.raga)-12*parse(b)[0].o);
 const others=Object.keys(RAGA_LINK).filter(k=>k!==o.raga).slice(0,6);const wrong=[others[(o.num*2)%others.length],others[(o.num*2+3)%others.length]].filter((x,i,a)=>a.indexOf(x)===i);
 const ragaOpts=[o.raga,...wrong];const shuf=(o.num%3);const rot=[...ragaOpts.slice(shuf),...ragaOpts.slice(0,shuf)];
 const ex=[
  learn(o.title,`<p>${o.intro}</p><p><b>Raga:</b> ${r.name}, ${RAGA_LINK[o.raga]}.<br><b>Thala:</b> ${th.name} (${th.angas.reduce((a,b)=>a+b)} aksharas).${g.composer?`<br><b>Composer:</b> ${escB(g.composer)}`:''}</p>${g.meaning?`<p class="muted">${escB(g.meaning)}</p>`:''}`,[{label:'Arohana',seq:r.aro,raga:o.raga},{label:'Avarohana',seq:r.ava,raga:o.raga},{label:'Hear the opening',seq:firstLine.seq,raga:o.raga,thala:o.thala,bpm:84}]),
  ...(o.pre||[]),
  play(`${first.label}: line 1`,`Swaras first, the traditional way. The words sit under each swara: “${g.sections[0].lines[0].sa.replace(/ - /g,' ').replace(/\s+-$/,'')}”.`,firstLine.seq,{...opt}),
 ];
 ex[ex.length-1].sa=firstLine.sa;
 ex.push(echo('Tap the opening swaras.',firstN(first.seq,Math.min(6,pads.length+2)),pads,{raga:o.raga}),
  sing('Sing the opening.',firstN(first.seq,4),{raga:o.raga}),
  playSong('The whole geetham',o.whole||'Sing along with the swaras, then try it again with the words underneath.',secs,{...opt}),
  mcq(`${o.short} is in which raga?`,rot.map(k=>RAGAS[k].name),rot.indexOf(o.raga)),
  ...(o.post||[]));
 GEETHAM_LIB.push({label:`Geetham: ${o.short}`,seq:secs.map(x=>x.seq).join(' '),thala:o.thala,raga:o.raga});
 return {id,title:o.short,ex}}

const UNITS=[
/* ---------------- THEORY ---------------- */
{id:'t1',part:'Theory',title:'Music, Nada & Sruthi',blurb:'Where music comes from, and your first swaras.',pages:'pp. 8–9',c:'parrot',lessons:[
 {id:'u1l1',title:'Hello, Sa',ex:[
  learn('Music starts with nada',`<p>The book opens with this idea: <b>Nada</b> (sound) gives us <b>Sruthi</b>, Sruthi gives us <b>Swaras</b>, and swaras give us <b>Ragas</b>.</p><p>Nada comes from vibration. The book divides it into <b>Ahatha</b> (struck, heard) and <b>Anahatha</b> (unstruck).</p>`,[{label:'Hear Sa',seq:'S'}]),
  learn('Sruthi is your pitch',`<p>The note you choose as your Sa is your <b>sruthi</b>. You can change it with the tuning button at the top.</p><p>Try the tanpura drone too. It hums Pa and Sa underneath you so your ear always knows where home is.</p>`,[{label:'Hear Sa, then Pa',seq:'S P'}]),
  listen('Listen. Are these two notes the same?','S S',['Same','Different'],0),
  listen('And these two?','S P',['Same','Different'],1),
  mcq('Which comes first, according to the book?',['Nada, then Sruthi, then Swara, then Raga','Raga, then Swara, then Nada','Swara, then Nada, then Raga'],0),
  listen('Which note was higher?','P S',['The first one','The second one'],0),
  echo('Listen, then tap the same swaras.','S P S',['S','P']),
  sing('Now sing Sa. Use “Hear it” first if you like.','S')
 ]},
 {id:'th_sruthi',title:'22 sruthis and the swara',ex:[
  learn('From three swaras to seven',`<p>Indian music goes back to Vedic times. The book says the oldest chant used just three swaras, <b>Ni, Sa, Ri</b>. Later it grew to five, and then to the seven we sing today.</p>`,[{label:'Ni Sa Ri',seq:'N. S R'}]),
  learn('22 sruthis',`<p>Between one Sa and the next there are many tiny, distinct pitches called <b>sruthis</b>. Bharatha's <i>Natya Sastra</i> lists <b>22</b>.</p><p>Sa owns 4 of them (Theevra, Kumudwathi, Mandha, Chandhovathi), Ri 3, Ga 2, Ma 4, Pa 4, Dha 3 and Ni 2.</p>`),
  learn('What makes a swara',`<p>A swara is defined as <b>“Swayam Ranjayathi Ithi Swaram”</b>: a sound that pleases the mind by itself.</p><p>Not every sruthi is that pleasing. The ones that are become the swaras we sing.</p>`,[{label:'Sa Ri Ga Ma',seq:'S R G M'}]),
  mcq('How many sruthis are commonly accepted?',['7','12','22'],2),
  mcq('“Swayam Ranjayathi Ithi Swaram” means a swara…',['pleases the mind by itself','is always the loudest note','is sung only once'],0),
  mcq('The oldest chant used which three swaras?',['Ni, Sa, Ri','Sa, Pa, Sa','Ga, Ma, Pa'],0),
  listen('How many different swaras did you hear?','N. S R',['Two','Three','Four'],1)
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
 ]}
]},
{id:'t2',part:'Theory',title:'Dwadasa & Shodasa Swaras',blurb:'Twelve swara places and their sixteen names.',pages:'pp. 10–11',c:'marigold',lessons:[
 {id:'u1l2',title:'Sa and Pa',ex:[
  learn('The two steady swaras',`<p><b>Sa</b> and <b>Pa</b> never change. The book calls them <b>Prakruthi swaras</b>.</p><p>The other five (Ri, Ga, Ma, Dha, Ni) each have more than one position. That is what makes one raga sound different from another.</p>`,[{label:'Sa Pa Sa',seq:"S P S'"}]),
  learn('Sa, one floor up',`<p>After Ni, Sa comes back, higher. We write it with a <b>dot above</b>: <span class="sw up">S</span>.</p><p>It is the same "home", just in a higher octave.</p>`,[{label:'Sa and upper Sa',seq:"S S'"}]),
  mcq('Which two swaras never change?',['Sa and Pa','Ri and Ga','Ma and Ni'],0),
  listen('What is the second note?',"S S'",['Upper Sa','Pa','The same Sa'],0),
  listen('What is the second note?','S P',['Upper Sa','Pa','The same Sa'],1),
  echo('Tap what you hear.',"S P S' P S",['S','P',"S'"]),
  sing('Sing Sa, then Pa.','S P')
 ]},
 {id:'th_dwadasa',title:'Twelve swara places',ex:[
  learn('Komala and Theevra',`<p>Ri, Ga, Ma, Dha and Ni each come in two kinds: a lower <b>Komala</b> and a higher <b>Theevra</b>. Add Sa and Pa and you get <b>12 swarasthanas</b>, the <b>Dwadasa swaras</b>.</p><table class="table"><tr><th>Komala</th><th>Theevra</th></tr><tr><td>Suddha Ri (R1)</td><td>Chathusruthi Ri (R2)</td></tr><tr><td>Sadharana Ga (G2)</td><td>Anthara Ga (G3)</td></tr><tr><td>Suddha Ma (M1)</td><td>Prathi Ma (M2)</td></tr><tr><td>Suddha Dha (D1)</td><td>Chathusruthi Dha (D2)</td></tr><tr><td>Kaisiki Ni (N2)</td><td>Kakali Ni (N3)</td></tr></table>`,[{label:'All twelve',seq:"S R1 R2 G2 G3 M1 M2 P D1 D2 N2 N3 S'",bpm:100}]),
  learn('On a keyboard',`<p>Take any key as your Sa. The very next key, black or white, is <b>Suddha Ri (R1)</b>, the one after is <b>R2</b>, and so on. Twelve keys make one octave.</p><p>Prathi Ma (M2) is the black key the West calls F sharp when Sa is C.</p>`,[{label:'Ma1 then Ma2',seq:'M1 M2'}]),
  listen('Which Ri is this, the lower or the higher?','S R1',['Suddha Ri (R1)','Chathusruthi Ri (R2)'],0),
  listen('And this one?','S R2',['Suddha Ri (R1)','Chathusruthi Ri (R2)'],1),
  listen('Which Ma did you hear?','G3 M2 P',['Suddha Ma (M1)','Prathi Ma (M2)'],1),
  mcq('How many swarasthanas are there in one octave?',['7','12','16'],1),
  mcq('Kakali Ni is…',['the higher Ni (N3)','the lower Ni (N2)','another name for Sa'],0)
 ]},
 {id:'th_shodasa',title:'Sixteen swara names',ex:[
  learn('Shodasa swaras',`<p>Sa, Pa, the two Ma's and <b>three</b> each of Ri, Ga, Dha and Ni give <b>16 names</b>: the <b>Shodasa swaras</b>.</p><p>But there are still only 12 places, so some names share a place:</p><p>Chathusruthi Ri (R2) = Suddha Ga (G1)<br>Shatsruthi Ri (R3) = Sadharana Ga (G2)<br>Chathusruthi Dha (D2) = Suddha Ni (N1)<br>Shatsruthi Dha (D3) = Kaisiki Ni (N2)</p>`,[{label:'R2 and G1: the same pitch',seq:'R2 G1'},{label:'D3 and N2: the same pitch',seq:'D3 N2'}]),
  mcq('Shodasa means…',['sixteen','twelve','seven'],0),
  mcq('Shatsruthi Ri (R3) sits in the same place as…',['Sadharana Ga (G2)','Suddha Ma (M1)','Kakali Ni (N3)'],0),
  listen('Same pitch or different?','R2 G1',['Same','Different'],0),
  listen('Same pitch or different?','R1 R2',['Same','Different'],1),
  mcq('Who built the 72 melakartha system on these 16 names?',['Venkatamakhi','Thyagaraja','Purandara Dasa'],0)
 ]}
]},
{id:'t3',part:'Theory',title:'Sthayi & Raga',blurb:'Octaves, ragas and the 72 melakarthas.',pages:'pp. 12–15',c:'kumkum',lessons:[
 {id:'u1l4',title:'Low, middle, high',ex:[
  learn('Sthayi means octave',`<p>A run of swaras from Sa to Ni is one <b>sthayi</b>. The book names five: Anumandhra, Mandhra, Madhya, Thara and Athithara. Songs mostly use the middle three.</p><p><span class="sw dn">N</span> one dot below: <b>Mandhra</b> (low)<br><span class="sw">N</span> no dot: <b>Madhya</b> (middle)<br><span class="sw up">N</span> one dot above: <b>Thara</b> (high)</p>`,[{label:'Low to high',seq:"P. D. N. S R G M P D N S' R' G'",bpm:110}]),
  mcq('A dot <b>above</b> a swara means…',['Thara sthayi (high)','Mandhra sthayi (low)','Hold it longer'],0),
  mcq('Which sthayi has no dot at all?',['Madhya','Mandhra','Thara'],0),
  listen('Which Ni is lower?','N. N',['The first one','The second one'],0),
  listen('Was the last note a low or high Sa?',"S N. S",['It went back to middle Sa','It jumped to upper Sa'],0),
  echo('Tap what you hear. Watch the dots!','N. S R S',['N.','S','R','G']),
  echo('Coming down from the top.',"S' N D P",['P','D','N',"S'"])
 ]},
 {id:'u2l1',title:'Raga & Mayamalavagowla',ex:[
  learn('What is a raga?',`<p>A <b>raga</b> is a beautiful combination of swaras with its own mood and rules. Ragas are either <b>Janaka</b> (parent) or <b>Janya</b> (child).</p><p>Purandara Dasa chose <b>Mayamalavagowla</b>, the 15th parent raga, as the one every beginner starts with.</p>`,[{label:'Hear Mayamalavagowla',seq:`${ARO} ${AVA}`}]),
  learn('Going up and coming down',`<p><b>Arohana</b> is the ascending order of swaras. <b>Avarohana</b> is the descending order.</p><p>In Mayamalavagowla both use all seven swaras in a straight line.</p>`,[{label:'Arohana',seq:ARO},{label:'Avarohana',seq:AVA}]),
  learn('Its special flavour',`<p>Its swarasthanas are Suddha Ri (R1), Anthara Ga (G3), Suddha Ma (M1), Suddha Dha (D1) and Kakali Ni (N3).</p><p>Listen for the <b>wide gap between Ri and Ga</b>. It gives this raga its glowing, temple-like sound.</p>`,[{label:'Sa Ri Ga',seq:'S R G'},{label:'Pa Dha Ni Sa',seq:"P D N S'"}]),
  mcq('Avarohana means…',['The descending order of swaras','The ascending order of swaras','A type of thala'],0),
  mcq('Mayamalavagowla is Melakartha number…',['15','29','72'],0),
  order('Build the avarohana.',["Sa'",'Ni','Dha','Pa','Ma','Ga','Ri','Sa'],{hint:"Sa' is upper Sa"}),
  echo('Tap the arohana.',"S R G M P D N S'",P_MID),
  sing('Now sing the arohana out loud.',"S R G M P D N S'")
 ]},
 {id:'th_mela',title:'The 72 melakarthas',ex:[
  learn('Janaka ragas',`<p>The <b>72 Melakartha</b> (Janaka) ragas use all seven swaras, in order, going up and coming down. That is why they are also called <b>Krama Sampurna</b> ragas.</p><p>The system, built on the 16 swara names, was laid out by <b>Venkatamakhi</b>.</p>`),
  learn('12 chakras of 6',`<p>The 72 are grouped into <b>12 chakras</b> of 6 ragas each: Indhu, Nethra, Agni, Vedha, Bana, Rithu, Rishi, Vasu, Brahma, Dhisi, Rudhra and Adhithya.</p><p>Ragas 1–36 (the <b>Purvamela</b>) use Suddha Ma. Ragas 37–72 (the <b>Uttharamela</b>) use Prathi Ma. Every Purvamela raga has a twin in the Uttharamela.</p>`,[{label:'Mayamalavagowla (15, Suddha Ma)',seq:"S R G M P D N S'"},{label:'Kalyani (65, Prathi Ma)',seq:"S R G M P D N S'",raga:'kalyani'}]),
  learn('Ragas you will meet',`<p><b>15</b> Mayamalavagowla · <b>20</b> Natabhairavi · <b>22</b> Kharaharapriya · <b>28</b> Harikamboji · <b>29</b> Dheerasankarabharanam · <b>65</b> Mechakalyani</p><p>The geethams later in the book are in these ragas or in their <b>janya</b> (child) ragas.</p>`),
  mcq('How many ragas are in each chakra?',['6','12','72'],0),
  mcq('Uttharamela ragas (37–72) use…',['Prathi Madhyamam (M2)','Suddha Madhyamam (M1)','no Ma at all'],0),
  mcq('“Krama Sampurna” means the raga…',['uses all seven swaras in order','skips Ga and Ni','has only five swaras'],0),
  listen('Same swara names, different raga. Which one?',"S R G M P D N S' S' N D P M G R S",['Mayamalavagowla','Shankarabharanam'],1,{raga:'shankara',bpm:110}),
  listen('And this one?',"S R G M P D N S' S' N D P M G R S",['Mayamalavagowla','Kalyani'],0,{bpm:110})
 ]}
]},
{id:'t4',part:'Theory',title:'Thala',blurb:'The six angas, five jathis and 35 thalas.',pages:'p. 16',c:'peacock',lessons:[
 {id:'u2l2',title:'Adi thala',ex:[
  learn('Thala keeps the time',`<p>The book says "<b>Sruthi is the mother and Laya is the father</b>". Thala is how we count laya with our hands.</p><p><b>Adi thala</b> has 8 counts (aksharas): a <b>Laghu</b> (clap + 3 finger counts, starting from the little finger), then two <b>Dhrutham</b>s (clap + wave each).</p>`,[{label:'Hear Adi thala',seq:', , , , , , , , , , , , , , , ,',thala:'adi',bpm:72}]),
  order('Put one cycle of Adi thala in order.',['Clap','Little','Ring','Middle','Clap','Wave','Clap','Wave'],{note:'Finger counts start from the little finger.'}),
  mcq('How many aksharas are in one cycle of Adi thala?',['6','8','14'],1),
  mcq('A Dhrutham is…',['A clap and a wave','A clap and three finger counts','A single clap'],0),
  thalaTap('Your turn. Tap the right action on each beat.','adi')
 ]},
 {id:'th_angas',title:'Angas, jathis & 35 thalas',ex:[
  learn('Six angas',`<p><b>U</b> Anudhrutham: one beat (1)<br><b>O</b> Dhrutham: a beat and a wave (2)<br><b>|</b> Laghu: a beat and finger counts<br><b>8</b> Guru (8), Plutham (12) and Kakapadham (16) are rarely used now.</p>`),
  learn('Five jathis of laghu',`<p>A laghu's length depends on its <b>jathi</b>:</p><p>Thisra <b>3</b> · Chathurasra <b>4</b> · Khanda <b>5</b> · Misra <b>7</b> · Sankeerna <b>9</b></p><p>Count the fingers from the little finger: little, ring, middle, index, thumb, then little again.</p>`,[{label:'Thisra laghu',seq:', , ,',thala:'eka',bpm:72}]),
  learn('Seven thalas × five jathis',`<p>The <b>Saptha thalas</b> are Dhruva, Matya, Rupaka, Jhampa, Thriputa, Ata and Eka. Each can take any of the 5 jathis, which gives <b>35 thalas</b>.</p><p>Adi thala is really <b>Chathurasra jathi Thriputa</b>: | O O = 4 + 2 + 2.</p>`,[{label:'Tisra Triputa (3+2+2)',seq:Array(14).fill(',').join(' '),thala:'tisra',bpm:72}]),
  mcq('What is the symbol for a Dhrutham?',['O','U','|'],0),
  mcq('A Misra jathi laghu has how many counts?',['5','7','9'],1),
  mcq('Adi thala is which jathi of Thriputa?',['Chathurasra','Thisra','Khanda'],0),
  mcq('How many thalas do the 7 thalas × 5 jathis make?',['12','35','72'],1),
  thalaTap('Tap Tisra Triputa: a laghu of 3, then two dhruthams.','tisra')
 ]}
]},
{id:'t5',part:'Theory',title:'The Great Composers',blurb:'The Trinity, Swathi Thirunal and the Pithamaha.',pages:'pp. 17–21',c:'lotus',lessons:[
 {id:'th_thyagaraja',title:'Thyagaraja',ex:[
  learn('Sri Thyagaraja (1767–1847)',`<p>Born in <b>Thiruvarur</b>, Thanjavur district. He composed about <b>2500 krithis</b>, including the famous <b>Pancharathna krithis</b>, and the musical dramas <i>Prahladha Bhakthivijayam</i> and <i>Nouka Charithram</i>.</p><p>He brought in the <b>sangathi</b>, a line sung again with growing variations.</p>`),
  learn('Mudra and krithis',`<p>His mudra (signature) is <b>Thyagaraja</b>.</p><p>Samajavaragamana (Hindolam) · Nagumomu (Abheri) · Mohanarama (Mohanam) · Swararagasudha (Shankarabharanam)</p>`),
  mcq('Roughly how many krithis did Thyagaraja compose?',['250','2500','25'],1),
  mcq('Which idea is Thyagaraja known for bringing into krithis?',['Sangathi','The melakartha table','Sarali varisai'],0),
  mcq('“Mohanarama” is in which raga?',['Mohanam','Hindolam','Abheri'],0)
 ]},
 {id:'th_dikshitar',title:'Muthuswami Dikshitar',ex:[
  learn('Sri Muthuswami Dikshitar (1776–1835)',`<p>Also born in <b>Thiruvarur</b>. He studied in Kasi for six years, then at Thiruthani composed his first krithi, <b>“Sree Naradhadhi Guruguho Jayathi”</b>, in Mayamalavagowla.</p><p>He wrote more than <b>500 krithis</b>, mostly in Sanskrit, including the <i>Kamalamba Navavaranam</i> and the Navagraha krithis. He was also a fine veena player.</p>`),
  learn('Mudra and krithis',`<p>His mudra is <b>Guruguha</b>.</p><p>Vathapi Ganapathim (Hamsadhwani) · Sree Saraswathi (Arabhi) · Mahaganapathim (Natta)</p>`),
  mcq('Dikshitar’s mudra is…',['Guruguha','Syamakrishna','Padmanabha'],0),
  mcq('Most of Dikshitar’s krithis are in…',['Sanskrit','Telugu','Tamil'],0),
  mcq('His first krithi was in which raga, the one you started with?',['Mayamalavagowla','Kalyani','Mohanam'],0)
 ]},
 {id:'th_syama',title:'Syama Sastri',ex:[
  learn('Sri Syama Sastri (1762–1827)',`<p>The eldest of the Trinity, also born in <b>Thiruvarur</b>. His name was Venkata Subrahmanyan; his pet name was <b>Syama Krishna</b>.</p><p>He wrote keerthanas, varnas and <b>swarajathis</b>. His Bhairavi swarajathi <b>“Kamakshi”</b> shows every mood of a raga in one song. You will meet it later in this book.</p>`),
  learn('Mudra and krithis',`<p>His mudra is <b>Syamakrishna</b>.</p><p>Himadrisuthe (Kalyani) · Marivere gathi (Anandabhairavi) · Durusuga (Saveri)</p>`),
  mcq('Syama Sastri’s mudra is…',['Syamakrishna','Guruguha','Thyagaraja'],0),
  mcq('His swarajathi “Kamakshi” is in which raga?',['Bhairavi','Mohanam','Kalyani'],0)
 ]},
 {id:'th_swathi',title:'Swathi Thirunal',ex:[
  learn('Sri Swathi Thirunal (1813–1847)',`<p>Born into the Travancore royal family as <b>Ramavarma</b> and crowned at 16, he was called “a musician among kings and a king among musicians”.</p><p>He composed krithis, varnams, padams and thillanas, and also Hindustani forms. The Swathi Thirunal Music College in Thiruvananthapuram is named after him.</p>`),
  learn('Mudra and krithis',`<p>His mudras are <b>Padmanabha</b>, Jalajanabha and Sarasijanabha.</p><p>Devadeva kalayamithe (Mayamalavagowla) · Sarasaksha (Panthuvarali) · Padmanabha pahi (Hindolam)</p>`),
  mcq('Swathi Thirunal signed his songs with…',['Padmanabha','Guruguha','Syamakrishna'],0),
  mcq('Swathi Thirunal was a king of…',['Travancore','Thanjavur','Mysore'],0)
 ]},
 {id:'u6l3',title:'Trinity & Pithamaha',ex:[
  learn('The Musical Trinity',`<p><b>Thyagaraja</b>, <b>Muthuswami Dikshitar</b> and <b>Syama Sastri</b> were all born in Thiruvarur, within a few years of each other. Together they are the Trinity of Carnatic music.</p>`),
  learn('Pithamaha',`<p><b>Purandara Dasa</b> (1484–1564), born in Purandaraghat in Karnataka, is the “Pithamaha” (grandfather) of Carnatic music.</p><p>He wrote the varisais, alankaras and geethams you are about to learn, chose <b>Mayamalavagowla</b> as the first raga, and was the first to sing keerthanas in concerts.</p>`),
  mcq('Who is called the Pithamaha of Carnatic music?',['Purandara Dasa','Thyagaraja','Swathi Thirunal'],0),
  mcq('Where were all three of the Trinity born?',['Thiruvarur','Thiruvananthapuram','Mysore'],0),
  mcq('Which composer is NOT one of the Trinity?',['Swathi Thirunal','Syama Sastri','Thyagaraja'],0),
  mcq('Arohana is…',['the ascending order of swaras','the descending order of swaras','a kind of thala'],0)
 ]}
]},
/* ---------------- BASIC LESSONS ---------------- */
{id:'b1',part:'Basic Lessons',title:'Saptha Swaras',blurb:'The seven swaras in four speeds, in Adi thala.',pages:'pp. 22–23',c:'parrot',lessons:[
 {id:'u2l3',title:'Four kalas',ex:[
  learn('One line, four speeds',`<p>The book’s first exercise is the plain scale of <b>Mayamalavagowla</b> in <b>Adi thala</b>, sung in four <b>kalas</b> (speeds).</p><p><b>1st kala:</b> 1 swara per akshara<br><b>2nd:</b> 2 per akshara<br><b>3rd:</b> 4 per akshara<br><b>4th:</b> 8 per akshara</p><p>The thala never speeds up. Only the swaras do.</p>`,[{label:'First kala',seq:`${ARO} ${AVA}`,thala:'adi',kala:1},{label:'Second kala',seq:`${ARO} ${AVA}`,thala:'adi',kala:2}]),
  play('Saptha swaras','Press play and watch the swaras line up with the thala. Try the speed buttons.',`${ARO} ${AVA}`),
  listen('Listen to the clicks. How many swaras fit in each beat?',`${ARO} ${AVA}`,['One','Two','Four'],1,{kala:2,thala:'adi',bpm:66}),
  mcq('In the third kala, how many swaras fit in one akshara?',['Two','Three','Four'],2),
  mcq('In the fourth kala, how many swaras fill one cycle of Adi thala?',['16','32','64'],2),
  sing('Sing the arohana.',"S R G M P D N S'"),
  thalaTap('Keep the thala going, without the hints this time.','adi',{hints:false})
 ]}
]},
{id:'b2',part:'Basic Lessons',title:'Sarali Varisas',blurb:'Sixteen step-by-step exercises, sung with the swara names.',pages:'pp. 23–24',c:'kumkum',lessons:[
 {id:'u3l1',title:'Sarali 1 to 4',ex:[
  learn('Warming up with Sarali',`<p><b>Sarali varisais</b> are the step-by-step exercises Purandara Dasa wrote for beginners. You sing the swara names, in Mayamalavagowla, in Adi thala.</p><p>Each one ends with the full climb to upper Sa and back down.</p>`),
  play('Sarali 1','“Sa Ri” three times, then climb.',SARALI[1]),
  echo('Tap the start of Sarali 2.','S R G S R G S R',['S','R','G','M']),
  play('Sarali 2','Groups of three: Sa Ri Ga, Sa Ri Ga, Sa Ri.',SARALI[2]),
  play('Sarali 3','Sa Ri Ga Ma, then Sa Ri Ga Ma again.',SARALI[3]),
  learn('The comma is a held note',`<p>In the notation a comma <b>,</b> means: keep singing the previous swara for one more akshara.</p><p>So <b>P ,</b> is Pa held for two beats.</p>`,[{label:'P , then Sa Ri',seq:'S R G M P , S R'}]),
  play('Sarali 4','Notice the pause on Pa.',SARALI[4]),
  mcq('<span class="sw">P</span> <span class="kv">,</span> means…',['Hold Pa for one extra akshara','Skip Pa','Sing Pa softly'],0),
  sing('Sing the opening of Sarali 2.','S R G S R G')
 ]},
 {id:'u3l2',title:'Sarali 5 to 8',ex:[
  play('Sarali 5','Climb to Dha, then back to Sa Ri.',SARALI[5]),
  play('Sarali 6','Hold Ni at the top of the first phrase.',SARALI[6]),
  echo('Tap the turn in Sarali 7.','P M G R',['R','G','M','P','D']),
  play('Sarali 7','Up to Pa, then turn back down.',SARALI[7]),
  play('Sarali 8','Pa Ma Dha Pa: a little zig-zag.',SARALI[8]),
  listen('Which sarali was that?',lines(SARALI[6],1),['Sarali 4','Sarali 5','Sarali 6'],2,{bpm:100})
 ]},
 {id:'u3l3',title:'Sarali 9 to 12',ex:[
  play('Sarali 9','Ri Ga Ma Pa in the middle.',SARALI[9]),
  play('Sarali 10','Sa Ri Ga Ma, then jump back to Sa.',SARALI[10]),
  echo('Tap the first phrase of Sarali 10.','S R G M S M G R',['S','R','G','M','P']),
  play('Sarali 11','A weaving pattern: Sa Ga Ri Ma Ga Pa…',SARALI[11]),
  play('Sarali 12','Sa Ri Sa Ga: back to Sa each time.',SARALI[12]),
  mcq('Sarali 11 begins…',['S G R M','S R G M','R S G R'],0)
 ]},
 {id:'u3l4',title:'Sarali 13 to 16',ex:[
  play('Sarali 13','Starts on Ri, not Sa.',SARALI[13]),
  play('Sarali 14','Ga Ri Sa Ma: starting from Ga.',SARALI[14]),
  play('Sarali 15','Ma Ga Ri Sa: a walk down before going up.',SARALI[15]),
  echo('Tap the start of Sarali 15.','M G R S P M G R',['S','R','G','M','P']),
  play('Sarali 16','Jumps to upper Sa straight away.',SARALI[16]),
  sing('Sing the start of Sarali 13.','R S G R'),
  thalaTap('Check your thala before the next unit.','adi',{hints:false})
 ]}
]},
{id:'b3',part:'Basic Lessons',title:'Sthayi Varisas',blurb:'Exercises in the middle, upper and lower octaves.',pages:'pp. 24–26',c:'marigold',lessons:[
 {id:'b_madhya',title:'Madhya sthayi',ex:[
  learn('Madhya sthayi varisas',`<p>Five exercises that stay in the <b>middle octave</b>, with long held notes. Keep counting the thala while you hold.</p>`,[{label:'Hear varisa 1',seq:MADHYA[1],thala:'adi'}]),
  play('Madhya sthayi 1','Pa held for six aksharas: keep the thala going.',MADHYA[1]),
  mcq('In “P , , , | P , | , ,” how many aksharas is Pa held in total?',['Two','Four','Eight'],2),
  play('Madhya sthayi 2','Starts on upper Sa.',MADHYA[2]),
  play('Madhya sthayi 3','Doubled swaras at the start.',MADHYA[3]),
  play('Madhya sthayi 4','Ri and Ga turn back on each other.',MADHYA[4]),
  play('Madhya sthayi 5','Climbs to upper Sa in the third line.',MADHYA[5]),
  sing('Sing the last line, which closes every one of them.','G M P G M G R S')
 ]},
 {id:'b_thara',title:'Thara sthayi',ex:[
  learn('Going above upper Sa',`<p>The <b>Thara sthayi</b> varisas climb past upper Sa to <span class="sw up">R</span>, <span class="sw up">G</span>, <span class="sw up">M</span> and even <span class="sw up">P</span>.</p><p>Each one adds one more step at the top than the one before.</p>`,[{label:'Upper Sa to upper Pa',seq:"S' R' G' M' P'"}]),
  play('Thara sthayi 1','Up, hold upper Sa, then touch upper Ri.',THARA[1]),
  play('Thara sthayi 2','Upper Sa and Ri, twice.',THARA[2]),
  play('Thara sthayi 3','Reaches upper Ga.',THARA[3]),
  play('Thara sthayi 4','Reaches upper Ma.',THARA[4]),
  play('Thara sthayi 5','All the way to upper Pa.',THARA[5]),
  echo('Tap the top of varisa 5.',"S' R' G' M' P'",["S'","R'","G'","M'","P'"]),
  mcq('Which is the highest swara in Thara sthayi varisa 5?',['Upper Pa','Upper Sa','Upper Ri'],0)
 ]},
 {id:'b_mandra',title:'Mandhra sthayi',ex:[
  learn('Going below Sa',`<p>The <b>Mandhra sthayi</b> varisas come down first, hold Sa, then dip into the lower octave: <span class="sw dn">N</span>, <span class="sw dn">D</span>, <span class="sw dn">P</span> and <span class="sw dn">M</span>.</p>`,[{label:'Sa down to lower Ma',seq:'S N. D. P. M.'}]),
  play('Mandhra sthayi 1','Down, hold Sa, touch lower Ni, then climb.',MANDRA[1]),
  play('Mandhra sthayi 2','Lower Ni twice.',MANDRA[2]),
  play('Mandhra sthayi 3','Reaches lower Dha.',MANDRA[3]),
  play('Mandhra sthayi 4','Reaches lower Pa.',MANDRA[4]),
  play('Mandhra sthayi 5','All the way to lower Ma.',MANDRA[5]),
  echo('Tap the bottom of varisa 5.','S N. D. P. M.',['M.','P.','D.','N.','S']),
  sing('Sing down to lower Dha and back.','S N. D. N. S')
 ]}
]},
{id:'b4',part:'Basic Lessons',title:'Janta Varisas',blurb:'Every swara twice, sung in the second kala.',pages:'pp. 27–28',c:'peacock',lessons:[
 {id:'u4l1',title:'Janta 1 to 4',ex:[
  learn('Every swara twice',`<p><b>Janta</b> means "pair". Each swara is sung twice, and the second one gets a small push of breath so both are clear.</p><p>The book writes them two swaras to an akshara, so they are sung in the <b>second kala</b>.</p>`,[{label:'Hear Janta 1',seq:JANTA[1],kala:2,thala:'adi'}]),
  play('Janta 1','Straight up and down, in pairs.',JANTA[1],{kala:2}),
  sing('Sing the first pairs.','S S R R G G'),
  play('Janta 2','Pairs in groups of four.',JANTA[2],{kala:2}),
  play('Janta 3','Up and back a step in pairs.',JANTA[3],{kala:2}),
  echo('Tap the first eight swaras of Janta 3.','S S R R G G R R',['S','R','G','M']),
  play('Janta 4','Pairs, then three single swaras.',JANTA[4],{kala:2}),
  listen('Janta or Sarali?','S S R R G G M M',['Janta','Sarali'],0),
  listen('And this one?',"S R G M P D N S'",['Janta','Sarali'],1)
 ]},
 {id:'b_janta2',title:'Janta 5 to 8',ex:[
  play('Janta 5','Sa Sa Ri, Sa Sa Ri: a skipping pair.',JANTA[5],{kala:2}),
  play('Janta 6','Each swara three times.',JANTA[6],{kala:2}),
  echo('Tap the start of Janta 6.','S S S R R R G G',['S','R','G','M']),
  play('Janta 7','A held swara between the pair: S , S.',JANTA[7],{kala:2}),
  play('Janta 8','The pair, then a pause: S S ,',JANTA[8],{kala:2}),
  mcq('In Janta 6 each swara is sung…',['three times','twice','once'],0)
 ]}
]},
{id:'b5',part:'Basic Lessons',title:'Vakra Janta Varisas',blurb:'Pairs that zig-zag instead of climbing straight.',pages:'pp. 29–30',c:'lotus',lessons:[
 {id:'b_vakra',title:'Vakra Janta 1 to 3',ex:[
  learn('Vakra means crooked',`<p>In a <b>vakra</b> phrase the swaras don’t go straight up or down; they turn back. These janta exercises jump ahead and walk back, still in pairs.</p>`,[{label:'Sa Sa Ma Ma Ga Ga Ri Ri',seq:'S S M M G G R R',kala:2,thala:'adi'}]),
  play('Vakra Janta 1','Jump to Ma, walk back to Ri.',ex('vakra',1),{kala:2}),
  echo('Tap the first phrase.','S S M M G G R R',['S','R','G','M']),
  play('Vakra Janta 2','Single swaras that zig-zag: Sa Ma Ga Ma Ri Ga Sa Ri.',ex('vakra',2),{kala:2}),
  play('Vakra Janta 3','The hardest one: holds and turns. Go slowly.',ex('vakra',3),{kala:2,bpm:56}),
  mcq('“Vakra” describes a phrase that…',['turns back on itself','is sung very fast','uses only Sa and Pa'],0)
 ]}
]},
{id:'b6',part:'Basic Lessons',title:'Dhattu Varisas',blurb:'Leaps between swaras that train your ear.',pages:'pp. 31–32',c:'parrot',lessons:[
 {id:'b_dhattu1',title:'Dhattu 1 to 3',ex:[
  learn('Dhattu means jump',`<p>In <b>dhattu varisas</b> the swaras leap over their neighbours: Sa straight to Ma, then back down. Hearing the leap before you sing it is the whole skill.</p>`,[{label:'Sa Ma Ga Ri',seq:'S M G R'}]),
  play('Dhattu 1','Sa Ma Ga Ri, then Sa Ri Ga Ma.',ex('dhattu',1)),
  echo('Tap the leap.','S M G R',['S','R','G','M','P']),
  play('Dhattu 2','Sa Ga Ri Ga.',ex('dhattu',2)),
  play('Dhattu 3','Two cycles to each line.',ex('dhattu',3)),
  sing('Sing the leap.','S M G R')
 ]},
 {id:'b_dhattu2',title:'Dhattu 4 to 6',ex:[
  play('Dhattu 4','Sa Ri Sa Ga, Ri Ma Ga Ri.',ex('dhattu',4)),
  play('Dhattu 5','Sa Ri Sa Ga, Ri Ga Ri Ma.',ex('dhattu',5)),
  play('Dhattu 6','Mixes the leaps of 1 and 2.',ex('dhattu',6)),
  listen('Which swara did the leap land on?','S M',['Ga','Ma','Pa'],1),
  echo('Tap Dhattu 4’s start.','S R S G R M G R',['S','R','G','M'])
 ]}
]},
{id:'b7',part:'Basic Lessons',title:'Saptha Thala Alankaras',blurb:'One exercise in each of the seven thalas.',pages:'pp. 33–36',c:'kumkum',lessons:[
 {id:'u5l2',title:'Dhruva thala',ex:[
  learn('Saptha thala alankaras',`<p>Seven alankaras, one in each of the seven thalas, in the book’s order: <b>Dhruva, Matya, Rupaka, Jhampa, Thriputa, Ata and Eka</b>.</p><p>Each pattern climbs up from Sa and then comes back down from upper Sa.</p>`),
  learn('Dhruva thala',`<p><b>Chathurasra jathi Dhruva</b>: | O | | = 4 + 2 + 4 + 4 = <b>14 aksharas</b>, the longest of the seven.</p>`,[{label:'Hear Dhruva thala',seq:Array(14).fill(',').join(' '),thala:'dhruva',bpm:80}]),
  thalaTap('Tap Dhruva thala.','dhruva'),
  play('Dhruva alankaram','Each line is one full cycle of 14.',ex('alankara',1),{thala:'dhruva',bpm:76}),
  echo('Tap the first line.','S R G M G R S R G R S R G M',['S','R','G','M']),
  mcq('How many aksharas in Chathurasra Dhruva thala?',['8','10','14'],2)
 ]},
 {id:'al_matya',title:'Matya thala',ex:[
  learn('Matya thala',`<p><b>Chathurasra jathi Matya</b>: | O | = 4 + 2 + 4 = <b>10 aksharas</b>.</p>`,[{label:'Hear Matya thala',seq:Array(10).fill(',').join(' '),thala:'matya',bpm:80}]),
  thalaTap('Tap Matya thala.','matya'),
  play('Matya alankaram','Ten swaras per cycle.',ex('alankara',2),{thala:'matya',bpm:76}),
  order('Build Matya thala from its angas.',['Laghu','Dhrutham','Laghu']),
  echo('Tap the first line.','S R G R S R S R G M',['S','R','G','M'])
 ]},
 {id:'al_rupaka',title:'Rupaka thala',ex:[
  learn('Rupaka thala',`<p><b>Chathurasra jathi Rupaka</b>: O | = 2 + 4 = <b>6 aksharas</b>, dhrutham first.</p><p>The book adds that in practice Rupakam is often kept as <b>two beats and a wave</b>.</p>`,[{label:'Hear Rupaka thala',seq:Array(12).fill(',').join(' '),thala:'rupaka',bpm:72}]),
  thalaTap('Tap Rupaka thala.','rupaka'),
  play('Rupaka alankaram','Six swaras per cycle.',ex('alankara',3),{thala:'rupaka',bpm:76}),
  mcq('Which anga comes first in this Rupaka thala?',['Dhrutham','Laghu','Anudhrutham'],0)
 ]},
 {id:'al_jhampa',title:'Jhampa thala',ex:[
  learn('Jhampa thala',`<p><b>Misra jathi Jhampa</b>: | U O = 7 + 1 + 2 = <b>10 aksharas</b>.</p><p>The laghu has 7 counts: clap, then little, ring, middle, index, thumb, little. Then a single clap (anudhrutham), then a clap and a wave.</p>`,[{label:'Hear Jhampa thala',seq:Array(10).fill(',').join(' '),thala:'jhampa',bpm:80}]),
  thalaTap('Tap Misra Jhampa.','jhampa'),
  play('Jhampa alankaram','Watch the single-beat anudhrutham.',ex('alankara',4),{thala:'jhampa',bpm:76}),
  mcq('The U (anudhrutham) is…',['one beat','a beat and a wave','a beat and finger counts'],0)
 ]},
 {id:'al_triputa',title:'Thriputa thala',ex:[
  learn('Thriputa thala',`<p><b>Thisra jathi Thriputa</b>: | O O = 3 + 2 + 2 = <b>7 aksharas</b>. Many geethams use this thala.</p>`,[{label:'Hear Thisra Thriputa',seq:Array(14).fill(',').join(' '),thala:'tisra',bpm:72}]),
  thalaTap('Tap Thisra Thriputa.','tisra'),
  play('Thriputa alankaram','Seven swaras per cycle.',ex('alankara',5),{thala:'tisra',bpm:76}),
  echo('Tap the first line.','S R G S R G M',['S','R','G','M'])
 ]},
 {id:'al_ata',title:'Ata thala',ex:[
  learn('Ata thala',`<p><b>Khanda jathi Ata</b>: | | O O = 5 + 5 + 2 + 2 = <b>14 aksharas</b>, with two laghus of five.</p>`,[{label:'Hear Khanda Ata',seq:Array(14).fill(',').join(' '),thala:'ata',bpm:80}]),
  thalaTap('Tap Khanda Ata.','ata'),
  play('Ata alankaram','Lots of held notes: count them out.',ex('alankara',6),{thala:'ata',bpm:76}),
  mcq('A Khanda laghu has how many counts?',['4','5','7'],1)
 ]},
 {id:'u5l1',title:'Eka thala',ex:[
  learn('Eka thala',`<p>The smallest one: just a single <b>Chathurasra laghu</b>, clap + 3 fingers = <b>4 aksharas</b>.</p>`,[{label:'Hear Eka thala',seq:', , , , , , , ,',thala:'eka',bpm:72}]),
  play('Eka alankaram','Four swaras, sliding up one step at a time.',ex('alankara',7),{thala:'eka'}),
  echo('Tap the first two groups.','S R G M R G M P',['S','R','G','M','P']),
  thalaTap('Tap Eka thala.','eka'),
  mcq('Which is the right order of the seven thalas in the book?',['Dhruva, Matya, Rupaka, Jhampa, Thriputa, Ata, Eka','Eka, Rupaka, Adi, Dhruva','Adi, Rupaka, Misra Chapu'],0)
 ]}
]}
];

/* ---------------- GEETHAS ---------------- */
UNITS.push(
{id:'g1',part:'Geethas',title:'Malahari Geethas',blurb:'Purandara Dasa’s first four songs, all in raga Malahari.',pages:'pp. 37–40',c:'parrot',lessons:[
 {id:'u6l1',title:'Meet Malahari',ex:[
  learn('A child raga',`<p>A <b>geetham</b> is a short, simple song, sung straight through. It is the bridge from exercises to real music.</p><p>The first four in the book are in <b>Malahari</b>, a janya of Mayamalavagowla.</p><p>Arohana: <b>S R M P D Ṡ</b><br>Avarohana: <b>Ṡ D P M G R S</b></p>`,[{label:'Arohana',seq:RAGAS.malahari.aro,raga:'malahari'},{label:'Avarohana',seq:RAGAS.malahari.ava,raga:'malahari'}]),
  mcq('Which swara does Malahari skip going up?',['Ga','Pa','Dha'],0),
  mcq('Which swara never appears in Malahari?',['Ni','Ma','Ri'],0),
  echo('Tap the Malahari arohana.',RAGAS.malahari.aro,['S','R','G','M','P','D',"S'"],{raga:'malahari'}),
  order('Build the Malahari avarohana.',["Sa'",'Dha','Pa','Ma','Ga','Ri','Sa']),
  sing('Sing the Malahari arohana.',RAGAS.malahari.aro,{raga:'malahari'}),
  learn('Rupakam thala',`<p>The first two geethams are in <b>Rupakam</b>: a Dhrutham then a Laghu, 2 + 4 = <b>6 aksharas</b>.</p>`,[{label:'Hear Rupakam',seq:Array(12).fill(',').join(' '),thala:'rupaka',bpm:72}]),
  thalaTap('Tap Rupakam thala.','rupaka')
 ]},
 geethamLesson('u7l1','sree-gananatha',{num:1,raga:'malahari',thala:'rupaka',short:'Sree Gananatha',title:'1 · Sree Gananatha',intro:'Your first geetham, a prayer to Ganesha (also called <b>Lambodara</b>, after its refrain). The same three lines of swaras carry all three verses.'}),
 geethamLesson('u7l2','kunda-gaura',{num:2,raga:'malahari',thala:'rupaka',short:'Kundagaura',title:'2 · Kundagaura',intro:'A prayer to Shiva, the lord of Gowri, still in Malahari and Rupakam.'}),
 geethamLesson('u7l4','padumanaabhaa',{num:3,raga:'malahari',thala:'tisra',short:'Padhumanabha',title:'3 · Padhumanabha',intro:'Longer, with a pallavi, an anupallavi and a charanam, and it dips below Sa to lower Dha. It moves to <b>Thisra jathi Thriputa</b>, 3 + 2 + 2.',pre:[thalaTap('Tap Thisra Thriputa.','tisra')]}),
 geethamLesson('u7l3','kereya-neeranu',{num:4,raga:'malahari',thala:'tisra',short:'Kereyaneeranu',title:'4 · Kereyaneeranu',intro:'The last of the Malahari geethams, in Thisra Thriputa.'})
]},
{id:'g2',part:'Geethas',title:'Geethas in New Ragas',blurb:'Mohanam, Kalyani, Suddha Saveri, Arabhi and Saveri.',pages:'pp. 41–45',c:'marigold',lessons:[
 geethamLesson('g_varaveena','varaveena',{num:5,raga:'mohanam',thala:'rupaka',short:'Varaveena',title:'5 · Varaveena',intro:'A song to Saraswathi, goddess of music, holding the veena. <b>Mohanam</b> uses only five swaras, S R G P D, so it sounds open and joyful.',pre:[listen('Which raga is this?',`${RAGAS.mohanam.aro} ${RAGAS.mohanam.ava}`,['Malahari','Mohanam'],1,{raga:'mohanam',bpm:110})]}),
 geethamLesson('g_kamalajadala','kamalajaadala',{num:6,raga:'kalyani',thala:'tisra',short:'Kamalajadhala',title:'6 · Kamalajadhala',intro:'Your first song with <b>Prathi Madhyamam (M2)</b>: Kalyani is Mechakalyani, the 65th mela.',pre:[listen('Which Ma is this, M1 or M2?','G M P',['Suddha Ma (M1)','Prathi Ma (M2)'],1,{raga:'kalyani'})]}),
 geethamLesson('u7l5','aanalaekara',{num:7,raga:'suddhasaveri',thala:'tisra',short:'Analekara',title:'7 · Analekara',intro:'<b>Suddha Saveri</b> has five swaras, S R2 M1 P D2, with no Ga and no Ni. The song climbs up to upper Ma.',pre:[mcq('Which two swaras are missing from Suddha Saveri?',['Ga and Ni','Ri and Dha','Ma and Pa'],0)]}),
 geethamLesson('g_rere','rae-rae-sree-raama',{num:8,raga:'arabhi',thala:'tisra',short:'Rere Sreerama',title:'8 · Rere Sreerama',intro:'A call to Rama. <b>Arabhi</b> goes up like Suddha Saveri (S R M P D) but comes down through every swara, Ni and Ga included.'}),
 geethamLesson('g_janakasutha','janakasutaa',{num:9,raga:'saveri',thala:'rupaka',short:'Janakasutha',title:'9 · Janakasutha',intro:'A song to Rama, husband of Sita (Janaka’s daughter). <b>Saveri</b> is a janya of Mayamalavagowla: it skips Ga and Ni going up and uses them coming down. It reaches down to lower Ni and Dha.'})
]},
{id:'g3',part:'Geethas',title:'Longer Geethas',blurb:'Dhruva and Adi thala, in Bhairavi, Kambhoji, Sri and Anandabhairavi.',pages:'pp. 46–49',c:'kumkum',lessons:[
 geethamLesson('g_sreeramachandra','sree-raama-chandra-bhairavi',{num:10,raga:'bhairavi',thala:'dhruva',short:'Sreeramachandra',title:'10 · Sreeramachandra',intro:'In <b>Bhairavi</b>, which uses two different Dha’s: D2 going up and D1 coming down. Kuyil plays the right one for you. The thala is <b>Dhruva</b>, 14 aksharas.',pre:[thalaTap('Tap Dhruva thala.','dhruva')]}),
 geethamLesson('g_mandharadharare','mandaradhaarae',{num:11,raga:'kambhoji',thala:'adi',short:'Mandharadharare',title:'11 · Mandharadharare',intro:'A song to Krishna, who lifted Mount Mandara, in <b>Kambhoji</b> and <b>Adi</b> thala. It climbs up to upper Pa.'}),
 geethamLesson('g_meenakshi','meenaakshee-jaya-kaamaakshee',{num:12,raga:'sri',thala:'dhruva',short:'Meenakshi jaya',title:'12 · Meenakshi jaya',intro:'A song to the goddess Meenakshi, in <b>Sri</b> raga and Dhruva thala. Sri goes up S R M P N and comes down with a turn: N P M R G R S. It is the longest geetham so far.'}),
 geethamLesson('g_kamalasulochana','kamalasulochana',{num:13,raga:'anandabhairavi',thala:'adi',short:'Kamalasulochana',title:'13 · Kamalasulochana',intro:'The last geetham in the book, in <b>Anandabhairavi</b> and Adi thala. Its arohana zig-zags: S G R G M P D P S.'})
]},
{id:'g4',part:'Lakshana Geetham',title:'Lakshana Geetham',blurb:'A song that describes its own raga.',pages:'pp. 51–52',c:'peacock',lessons:[
 geethamLesson('g_sreenatha','sreenatha-lakshana',{num:14,raga:'harikedaragowla',thala:'tisra',short:'Sreenatha',title:'Sreenatha',intro:'A <b>lakshana geetham</b> describes the rules of its raga in its own words. This one names <b>Harikedaragowla</b> as the raganga (parent) and lists the ragas that grow from it, such as Kambhoji, Kannada and Surati. It reaches up to upper Pa.'})
]}
);
const ALL_LESSONS_BUILD=()=>UNITS.flatMap(u=>u.lessons.map(l=>({...l,unit:u})));
const ALL_LESSONS=ALL_LESSONS_BUILD();
/* chapters of the book that come after the geethas, shown at the end of the path */
const COMING=['Swarajathis (pp. 53–59)','Sthothra Geethas (p. 62)','Jathiswarams (pp. 65–67)','Adi Thala Varnams (pp. 68–100)','Padha Varnam (p. 102)','Ata Thala Varnams (pp. 105–123)','128 Janya Ragas (p. 126)'];
