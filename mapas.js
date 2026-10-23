// ---------- MAPAS: mapa-múndi, cidades vistas de cima e mapas locais com grade ----------
// Os desenhos saem de código com semente fixa: cada mapa sai sempre igual.
// Descrições das salas e marcações secretas ficam só no Firebase (mestre/...), nunca neste arquivo.
const MAPAS=(()=>{
'use strict';
const M=()=>window.MESA;
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CEL=48;            // pixels por quadrado nos mapas locais (1 quadrado = 1,5 m)
const METROS=1.5;

// ================= dados =================
// Regiões do mapa-múndi (coordenadas de 0 a 1 sobre a imagem). Para abrir uma região nova, preencha "cidade".
const REGIOES=[
  {id:'limbo',nome:'Limbo',x:.19,y:.22,rx:.15,ry:.16},
  {id:'minos',nome:'Minos',x:.50,y:.17,rx:.15,ry:.12},
  {id:'luxuria',nome:'Luxúria',x:.80,y:.29,rx:.17,ry:.19},
  {id:'ganancia',nome:'Ganância',x:.38,y:.40,rx:.12,ry:.11},
  {id:'ira',nome:'Ira',x:.59,y:.40,rx:.12,ry:.11},
  {id:'gula',nome:'Gula',x:.15,y:.52,rx:.13,ry:.11},
  {id:'heresia',nome:'Heresia',x:.37,y:.58,rx:.12,ry:.09},
  {id:'violencia',nome:'Violência',x:.64,y:.58,rx:.15,ry:.11},
  {id:'fraude',nome:'Fraude',x:.48,y:.75,rx:.17,ry:.075,cidade:'velmira'},
  {id:'traicao',nome:'Traição',x:.53,y:.88,rx:.18,ry:.07,cidade:'kharvel'},
];
const CIDADES={
  velmira:{nome:"Vel'Mira",titulo:"Vel'Mira, a Cidade dos Espelhos",regiao:'Fraude',tema:'fraude',semente:6601,
    lema:'Engano, ilusão e trapaça. Nada é o que parece.',
    desc:'Torres roxas e vidro escuro. As ruas mudam de lugar de noite. Todo mundo usa máscara, e quem mostra o próprio rosto é tratado como presa.',
    cx:800,cy:500,rx:640,ry:410,portoes:[Math.PI/2,Math.PI,-0.35],
    rio:[[0,770],[300,730],[560,790],[860,770],[1160,640],[1400,560],[1600,520]],
    pontos:[
      {n:1,nome:'Portão das Mil Faces',x:.5,y:.905,marco:'portao'},
      {n:2,nome:'Mercado das Máscaras',x:.33,y:.6,marco:'mercado',local:'fr-mercado'},
      {n:3,nome:'A Taverna do Sorriso Costurado',x:.65,y:.42,marco:'taverna',local:'fr-taverna'},
      {n:4,nome:'Cartório das Almas Vendidas',x:.40,y:.33,marco:'cartorio'},
      {n:5,nome:'O Labirinto das Línguas Falsas',x:.53,y:.56,marco:'labirinto',local:'fr-labirinto'},
      {n:6,nome:'Ponte dos Reflexos',x:.725,y:.64,marco:'ponte',local:'fr-ponte'}]},
  kharvel:{nome:'Kharvel',titulo:'Kharvel, a Cidadela dos Juramentos Quebrados',regiao:'Traição',tema:'traicao',semente:9113,
    lema:'A pior de todas. Nem os traidores são confiáveis aqui.',
    desc:'A camada mais funda: gelo negro, ruínas e gente congelada até a cintura no chão. Uma fortaleza partida ao meio, porque os dois senhores dela se traíram.',
    cx:820,cy:470,rx:600,ry:390,portoes:[Math.PI/2+.3,-Math.PI/2+.5],
    fenda:[[560,40],[600,180],[700,300],[760,420],[880,560],[930,700],[1050,860],[1120,1000]],
    lagos:[{x:250,y:840,rx:220,ry:120}],
    pontos:[
      {n:1,nome:'Muralha Partida',x:.375,y:.10,marco:'muralha'},
      {n:2,nome:'A Taverna do Último Brinde',x:.30,y:.50,marco:'taverna',local:'tr-taverna'},
      {n:3,nome:'O Salão do Beijo',x:.68,y:.36,marco:'salao'},
      {n:4,nome:'Forca dos Irmãos',x:.66,y:.66,marco:'forca'},
      {n:5,nome:'O Fosso dos Traidores Congelados',x:.24,y:.27,marco:'fosso',local:'tr-fosso'},
      {n:6,nome:'Lago de Gelo Negro',x:.15,y:.84,marco:'lago',local:'tr-lago'}]},
};

// Plantas dos mapas locais. Legenda dos caracteres:
// # parede · . pedra · w madeira · _ tapete · p palco · , terra/neve · i gelo · l lago congelado · x gelo fino
// ~ líquido (mercúrio em Fraude, água negra em Traição) · = ponte · o buraco · c fenda · m parede de espelho
// D porta · S passagem secreta (parece parede) · espaço = rocha
const LOCAIS={
  'fr-taverna':{nome:'A Taverna do Sorriso Costurado',cidade:'velmira',tema:'fraude',amb:.4,
    planta:[
      '############################',
      '#ppppppwwwwwwwwwwww#wwwwwww#',
      '#ppppppwwwwwwwwwwwwDwwwwwww#',
      '#ppppppwwwwwwwwwwww#wwwwwww#',
      '#wwwwwwwwwwwwwwwwww#wwwwwww#',
      '#wwwwwwwwwwwwwwwwww#########',
      '#wwwwwwwwwwwwwwwwww#wwwwwww#',
      '#wwwwwwwwwwwwwwwwwwDwwwwwww#',
      'Dwwwwwwwwwwwwwwwwww#wwwwwww#',
      '#wwwwwwwwwwwwwwwwww#wwwwwww#',
      '#wwwwwwwwwwwwwwwwww#########',
      '#wwwwwwwwwwwwwwwwww#.......#',
      '#wwwwwwwwwwwwwwwwwwD.......#',
      '#########D##########.......#',
      '#.........#........#.......#',
      '#.........D........#.......#',
      '#.........#........#.......#',
      '#.........#........#.......#',
      '#.........#........#.......#',
      '############################'],
    objetos:[
      {t:'estante',x:12,y:1,w:6,h:1},{t:'barril',x:13,y:2},{t:'barril',x:14,y:2},{t:'barril',x:17,y:2},
      {t:'balcao',x:11,y:4,w:7,h:1},{t:'cadeira',x:12,y:5},{t:'cadeira',x:14,y:5},{t:'cadeira',x:16,y:5},
      {t:'mesa',x:2,y:7,w:2,h:2,r:1,jogo:1},{t:'mesa',x:6,y:7,w:2,h:2,r:1,jogo:1},{t:'mesa',x:2,y:10,w:3,h:1,jogo:1},{t:'mesa',x:7,y:10,w:3,h:1,jogo:1},
      {t:'mesa',x:12,y:8,w:2,h:2,r:1},{t:'mesa',x:15,y:9,w:2,h:2,r:1},
      {t:'cadeira',x:1,y:7},{t:'cadeira',x:4,y:8},{t:'cadeira',x:5,y:7},{t:'cadeira',x:8,y:8},{t:'cadeira',x:2,y:11},{t:'cadeira',x:4,y:11},{t:'cadeira',x:7,y:11},{t:'cadeira',x:9,y:11},
      {t:'cadeira',x:11,y:9},{t:'cadeira',x:14,y:8},{t:'cadeira',x:15,y:11},{t:'cadeira',x:17,y:10},
      {t:'vela',x:1,y:1},{t:'vela',x:5,y:1},{t:'corpo',x:3,y:2,a:.3},
      {t:'cama',x:25,y:1,w:1,h:2},{t:'caixote',x:21,y:1},{t:'tapete',x:21,y:3,w:3,h:1},
      {t:'cama',x:25,y:6,w:1,h:2},{t:'cadeira',x:21,y:8},{t:'espelho',x:22,y:6},
      {t:'barril',x:20,y:11},{t:'barril',x:21,y:11},{t:'barril',x:20,y:12},{t:'caixote',x:25,y:11},{t:'caixote',x:25,y:12},{t:'caixote',x:24,y:17},{t:'barril',x:26,y:17},{t:'ossos',x:22,y:15},
      {t:'lareira',x:3,y:14,w:3,h:1,acesa:1},{t:'mesa',x:3,y:16,w:3,h:1},{t:'barril',x:8,y:18},{t:'caixote',x:1,y:18},{t:'sangue',x:5,y:17},
      {t:'caixote',x:11,y:14},{t:'caixote',x:12,y:14},{t:'barril',x:18,y:14},{t:'alcapao',x:15,y:17},{t:'tapete',x:14,y:16,w:3,h:2},{t:'estante',x:11,y:18,w:4,h:1}],
    luzes:[{x:9.5,y:.6,r:5},{x:.6,y:5.5,r:5},{x:18.4,y:6,r:5},{x:9,y:12.4,r:5},{x:23.5,y:10.6,r:4},{x:23.5,y:5.4,r:3.5},{x:15,y:13.6,r:4}],
    salas:[
      {n:1,nome:'Salão',x:9,y:8,areas:[[1,1,18,12]]},
      {n:2,nome:'Balcão de osso',x:14,y:3,areas:[[1,1,18,12]]},
      {n:3,nome:'Mesas de dados viciados',x:4,y:9,areas:[[1,1,18,12]]},
      {n:4,nome:'Palco das mentiras',x:3,y:2,areas:[[1,1,18,12]]},
      {n:5,nome:'Quarto dos fundos I',x:23,y:2,areas:[[20,1,7,4]]},
      {n:6,nome:'Quarto dos fundos II',x:23,y:7,areas:[[20,6,7,4]]},
      {n:7,nome:'Depósito',x:23,y:14,areas:[[20,11,7,8]]},
      {n:8,nome:'Cozinha',x:6,y:17,areas:[[1,14,9,5]]},
      {n:9,nome:'Despensa',x:13,y:16,areas:[[11,14,8,5]]}]},

  'fr-mercado':{nome:'Mercado das Máscaras',cidade:'velmira',tema:'fraude',amb:.32,
    planta:[
      '##############################',
      '#......####.........###......#',
      '#......####.........###......#',
      '#............................#',
      '###........................###',
      '###....,,,,,,,,,,,,,,......###',
      '#......,,,,,,,,,,,,,,.......##',
      '#......,,,,,,,,,,,,,,........#',
      '#####..,,,,,,,,,,,,,,..####..#',
      '#####..,,,,,,,,,,,,,,..####..#',
      'D......,,,,,,,,,,,,,,..####..D',
      '#####..,,,,,,,,,,,,,,........#',
      '#......,,,,,,,,,,,,,,..#######',
      '#..###.,,,,,,,,,,,,,,..#.....#',
      '#..###.................###...#',
      '#..###..######..###.....#....#',
      '#.......######..###..####...##',
      '###.....######..###..#.......#',
      '#.....#.........###..#..###..#',
      '#.....#####..........#..###..#',
      '#.....#####..##########......#',
      '##############################'],
    objetos:[
      {t:'banca',x:8,y:5,w:3,h:2,a:.12},{t:'banca',x:12,y:5,w:3,h:2,a:-.08},{t:'banca',x:16,y:6,w:3,h:2,a:.2},
      {t:'banca',x:8,y:9,w:2,h:3,a:-.15},{t:'banca',x:17,y:10,w:3,h:2,a:-.22},{t:'banca',x:9,y:12,w:3,h:2,a:.1},{t:'banca',x:14,y:12,w:3,h:2,a:.25},
      {t:'fonte',x:12,y:8,w:3,h:3},{t:'caixote',x:2,y:1},{t:'caixote',x:3,y:2},{t:'barril',x:13,y:1},{t:'barril',x:14,y:1},
      {t:'corpo',x:3,y:18,a:1.2},{t:'sangue',x:4,y:19},{t:'ossos',x:26,y:18},{t:'espelho',x:24,y:13},{t:'espelho',x:28,y:13},
      {t:'cristal',x:26,y:6},{t:'cristal',x:1,y:13},{t:'caixote',x:11,y:19},{t:'barril',x:28,y:20}],
    luzes:[{x:13.5,y:9.5,r:7,cor:'#b58cff'},{x:5,y:3,r:5},{x:25,y:3,r:5},{x:4,y:11,r:4},{x:26,y:11,r:4},{x:12,y:17,r:4},{x:26,y:6,r:3,cor:'#b58cff'}],
    salas:[
      {n:1,nome:'Praça das bancas',x:13,y:7,areas:[[1,3,28,12]]},
      {n:2,nome:'Banca dos rostos verdadeiros',x:9,y:6,areas:[[1,3,28,12]]},
      {n:3,nome:'Fonte de mercúrio',x:13,y:9,areas:[[1,3,28,12]]},
      {n:4,nome:'Beco dos mascarados',x:3,y:18,areas:[[1,14,7,7]]},
      {n:5,nome:'Beco sem saída',x:28,y:18,areas:[[22,14,7,7],[24,13,5,1]]},
      {n:6,nome:'Becos do sul',x:14,y:17,areas:[[7,14,15,7]]},
      {n:7,nome:'Fundos do norte',x:15,y:1,areas:[[1,1,28,3]]}]},

  'fr-labirinto':{nome:'O Labirinto das Línguas Falsas',cidade:'velmira',tema:'fraude',amb:.5,gerar:'labirinto',semente:515,
    salas:[
      {n:1,nome:'Entrada',x:16,y:23,areas:[[13,21,7,3]]},
      {n:2,nome:'Sala espelhada do oeste',x:5,y:7,areas:[[2,5,7,5]]},
      {n:3,nome:'Sala espelhada do leste',x:27,y:7,areas:[[24,5,7,5]]},
      {n:4,nome:'Sala espelhada do sudoeste',x:5,y:17,areas:[[2,15,7,5]]},
      {n:5,nome:'Sala espelhada do sudeste',x:27,y:17,areas:[[24,15,7,5]]},
      {n:6,nome:'Cripta do Juiz das Mentiras',x:16,y:12,areas:[[12,9,9,7]]}]},

  'fr-ponte':{nome:'Ponte dos Reflexos',cidade:'velmira',tema:'fraude',amb:.28,gerar:'ponte',semente:8080,
    salas:[
      {n:1,nome:'Margem norte',x:6,y:3,areas:[[0,0,30,7]]},
      {n:2,nome:'A ponte',x:15,y:10,areas:[[12,4,6,13]]},
      {n:3,nome:'Rio de mercúrio',x:24,y:10,areas:[[0,6,30,9]]},
      {n:4,nome:'Margem sul',x:22,y:17,areas:[[0,14,30,6]]}]},

  'tr-taverna':{nome:'A Taverna do Último Brinde',cidade:'kharvel',tema:'traicao',amb:.4,
    planta:[
      '############################',
      'D..........#################',
      '##########.#################',
      '##########S#################',
      '#..................#.......#',
      '#..................#.......#',
      '#..................#.......#',
      '#..................#.......#',
      '#..................#.......#',
      '#..................D.......#',
      '#..................#.......#',
      '#..................#.......#',
      '#..................#.......#',
      '#..................#.......#',
      '#..................#.......#',
      '##########D#################',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,'],
    objetos:[
      {t:'lareira',x:9,y:4,w:3,h:1},{t:'tapete',x:3,y:5,w:13,h:8},
      {t:'mesa',x:4,y:6,w:11,h:1,banquete:1},{t:'mesa',x:4,y:10,w:11,h:1,banquete:1},
      ...[4,6,8,10,12,14].flatMap(x=>[{t:'cadeira',x,y:5},{t:'cadeira',x,y:7},{t:'cadeira',x,y:9},{t:'cadeira',x,y:11}]),
      {t:'trono',x:16,y:8,w:1,h:1},{t:'corpo',x:2,y:13,a:2.2},{t:'sangue',x:3,y:13},{t:'alma',x:17,y:13},{t:'alma',x:1,y:5},
      ...[[20,4],[21,4],[22,4],[24,4],[25,4],[26,4],[20,6],[20,7],[26,6],[26,7],[22,8],[23,8],[24,8],[22,11],[23,11],[24,11],[20,13],[21,13],[25,13],[26,13]].map(([x,y],i)=>({t:'barril',x,y,marca:i%3==0})),
      {t:'estatua',x:6,y:17},{t:'estatua',x:16,y:18},{t:'pedra',x:24,y:17},{t:'alma',x:11,y:18},{t:'alma',x:20,y:17}],
    luzes:[{x:3,y:4.4,r:5},{x:15,y:4.4,r:5},{x:1.4,y:9,r:4.5},{x:18.6,y:12,r:4.5},{x:23.5,y:9.5,r:3.5},{x:10.5,y:15.6,r:4},{x:4,y:1.5,r:2.5,cor:'#8fb8ff'}],
    salas:[
      {n:1,nome:'Salão dos banquetes de paz',x:9,y:8,areas:[[1,4,18,11]]},
      {n:2,nome:'Lareira apagada',x:10,y:5,areas:[[1,4,18,11]]},
      {n:3,nome:'Adega dos barris marcados',x:23,y:9,areas:[[20,4,7,11]]},
      {n:4,nome:'Passagem atrás da lareira',x:5,y:1,areas:[[0,1,11,3]]},
      {n:5,nome:'Pátio gelado',x:14,y:17,areas:[[0,16,28,4]]}]},

  'tr-fosso':{nome:'O Fosso dos Traidores Congelados',cidade:'kharvel',tema:'traicao',amb:.5,gerar:'fosso',semente:4242,
    salas:[
      {n:1,nome:'Boca do fosso',x:17,y:2,areas:[[12,0,11,5]]},
      {n:2,nome:'Galeria das almas presas',x:6,y:8,areas:[[1,4,12,8]]},
      {n:3,nome:'Pontes de gelo fino',x:17,y:12,areas:[[0,10,34,5]]},
      {n:4,nome:'Galeria leste',x:28,y:8,areas:[[22,4,12,7]]},
      {n:5,nome:'Lago congelado',x:17,y:20,areas:[[6,15,22,11]]}]},

  'tr-lago':{nome:'Lago de Gelo Negro',cidade:'kharvel',tema:'traicao',amb:.26,gerar:'lago',semente:777,
    salas:[
      {n:1,nome:'Margem nevada',x:3,y:3,areas:[[0,0,30,4],[0,0,4,20]]},
      {n:2,nome:'Gelo negro',x:15,y:10,areas:[[3,3,24,14]]},
      {n:3,nome:'Estátuas dos traidores',x:21,y:7,areas:[[3,3,24,14]]},
      {n:4,nome:'Margem sul',x:26,y:18,areas:[[0,16,30,4],[26,0,4,20]]}]},
};

// ================= utilidades de desenho =================
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const cv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
function hex(h){if(h.startsWith('rgb'))return h.match(/\d+/g).slice(0,3).map(Number);h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function tom(h,d){const [r,g,b]=hex(h);const f=v=>Math.max(0,Math.min(255,Math.round(v+d)));return `rgb(${f(r)},${f(g)},${f(b)})`;}
function rr(x,X,Y,W,H,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+W,Y,X+W,Y+H,r);x.arcTo(X+W,Y+H,X,Y+H,r);x.arcTo(X,Y+H,X,Y,r);x.arcTo(X,Y,X+W,Y,r);x.closePath();}
function pontos(x,R,w,h,n,cor,tam=1.2){x.fillStyle=cor;for(let i=0;i<n;i++){const s=R()*tam+.4;x.fillRect(R()*w,R()*h,s,s);}}
// manchas suaves: ruído pequeno ampliado com suavização
function manchas(R,w,h,escala,cor,alfa){const sw=Math.ceil(w/escala)+2,sh=Math.ceil(h/escala)+2,c=cv(sw,sh),x=c.getContext('2d'),d=x.createImageData(sw,sh),[r,g,b]=hex(cor);
  for(let i=0;i<sw*sh;i++){d.data[i*4]=r;d.data[i*4+1]=g;d.data[i*4+2]=b;d.data[i*4+3]=Math.pow(R(),2)*255*alfa;}x.putImageData(d,0,0);return c;}
function aplicarManchas(x,R,w,h,escala,cor,alfa){x.save();x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(manchas(R,w,h,escala,cor,alfa),0,0,(Math.ceil(w/escala)+2)*escala,(Math.ceil(h/escala)+2)*escala);x.restore();}
function rachaduras(x,R,w,h,n,cor,larg){x.strokeStyle=cor;x.lineWidth=larg;x.lineCap='round';
  for(let i=0;i<n;i++){let px=R()*w,py=R()*h,a=R()*Math.PI*2;x.beginPath();x.moveTo(px,py);const seg=3+R()*6|0;
    for(let k=0;k<seg;k++){a+=(R()-.5)*1.4;const l=6+R()*18;px+=Math.cos(a)*l;py+=Math.sin(a)*l;x.lineTo(px,py);}x.stroke();}}

const TEMAS={
  fraude:{piso:'#3d3547',madeira:'#4b3426',parede:'#120c18',topo:'#2a2135',borda:'rgba(190,160,240,.45)',vazio:'#060409',terra:'#2c2232',liq:'mercurio',
    nevoa:'#5a3e7a',grade:'rgba(215,195,255,.13)',escuro:'6,2,12',fundo:'#140d1b'},
  traicao:{piso:'#3e464f',madeira:'#3a2f28',parede:'#0b0f14',topo:'#27313b',borda:'rgba(215,235,255,.5)',vazio:'#04070a',terra:'#b7bfc7',liq:'aguanegra',
    nevoa:'#c7d6e4',grade:'rgba(225,238,255,.12)',escuro:'2,6,12',fundo:'#0c1218'},
};

// ---------- texturas (ladrilho de 4x4 quadrados) ----------
const T4=CEL*4;
function texPedra(T,R,base){const c=cv(T4,T4),x=c.getContext('2d');x.fillStyle=tom(base,-30);x.fillRect(0,0,T4,T4);
  for(let j=0;j<8;j++){const off=(j%2)*12;for(let i=-1;i<9;i++){const sx=i*24+off+R()*2,sy=j*24+R()*2,w=22+R()*2,h=21+R()*2;
    x.fillStyle=tom(base,(R()-.5)*24);rr(x,sx+1,sy+1,w-2,h-2,3);x.fill();x.fillStyle='rgba(255,255,255,.05)';x.fillRect(sx+3,sy+2,w-7,2);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(sx+3,sy+h-4,w-7,2);}}
  pontos(x,R,T4,T4,700,'rgba(0,0,0,.28)');pontos(x,R,T4,T4,250,'rgba(255,255,255,.06)');aplicarManchas(x,R,T4,T4,24,'#000000',.35);return c;}
function texMadeira(T,R,base){const c=cv(T4,T4),x=c.getContext('2d');x.fillStyle=tom(base,-25);x.fillRect(0,0,T4,T4);
  for(let j=0;j<16;j++){let sx=-R()*60;while(sx<T4){const w=50+R()*70;x.fillStyle=tom(base,(R()-.5)*26);x.fillRect(sx+1,j*12+1,w-2,10);
    x.strokeStyle='rgba(0,0,0,.18)';x.lineWidth=.7;for(let k=0;k<3;k++){x.beginPath();const yy=j*12+2.5+k*3+R();x.moveTo(sx+2,yy);x.bezierCurveTo(sx+w*.3,yy+R()*2-1,sx+w*.6,yy+R()*2-1,sx+w-2,yy);x.stroke();}
    x.fillStyle='rgba(0,0,0,.45)';x.fillRect(sx+4,j*12+5,1.5,1.5);x.fillRect(sx+w-6,j*12+5,1.5,1.5);sx+=w;}}
  aplicarManchas(x,R,T4,T4,30,'#000000',.3);return c;}
function texTerra(T,R,base){const c=cv(T4,T4),x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,T4,T4);aplicarManchas(x,R,T4,T4,16,'#000000',.35);aplicarManchas(x,R,T4,T4,10,'#ffffff',.12);
  for(let i=0;i<60;i++){x.fillStyle=tom(base,(R()-.6)*40);x.beginPath();x.ellipse(R()*T4,R()*T4,1+R()*3,1+R()*2,R()*3,0,7);x.fill();}pontos(x,R,T4,T4,600,'rgba(0,0,0,.22)');return c;}
function texGelo(T,R){const c=cv(T4,T4),x=c.getContext('2d');const g=x.createLinearGradient(0,0,T4,T4);g.addColorStop(0,'#9fb3c4');g.addColorStop(1,'#7e93a6');x.fillStyle=g;x.fillRect(0,0,T4,T4);
  aplicarManchas(x,R,T4,T4,20,'#ffffff',.35);aplicarManchas(x,R,T4,T4,14,'#2b3a48',.25);rachaduras(x,R,T4,T4,14,'rgba(255,255,255,.55)',1);rachaduras(x,R,T4,T4,8,'rgba(30,45,60,.45)',1);return c;}
function texLago(T,R,fino){const c=cv(T4,T4),x=c.getContext('2d');x.fillStyle=fino?'#2f4352':'#162430';x.fillRect(0,0,T4,T4);aplicarManchas(x,R,T4,T4,22,'#3d5a70',.6);aplicarManchas(x,R,T4,T4,12,'#000000',.4);
  for(let i=0;i<30;i++){x.fillStyle='rgba(220,240,255,.18)';x.beginPath();x.arc(R()*T4,R()*T4,.8+R()*1.6,0,7);x.fill();}
  rachaduras(x,R,T4,T4,fino?26:12,'rgba(225,240,255,.55)',fino?1.4:1);return c;}
function texMercurio(T,R){const c=cv(T4,T4),x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,T4);g.addColorStop(0,'#8e90a3');g.addColorStop(.5,'#5d5f73');g.addColorStop(1,'#83849a');x.fillStyle=g;x.fillRect(0,0,T4,T4);
  aplicarManchas(x,R,T4,T4,26,'#c7b8ff',.45);aplicarManchas(x,R,T4,T4,18,'#1b1426',.5);x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=1;
  for(let i=0;i<34;i++){x.beginPath();x.ellipse(R()*T4,R()*T4,6+R()*18,1.5+R()*3,(R()-.5)*.3,0,7);x.stroke();}return c;}
function texAguaNegra(T,R){const c=cv(T4,T4),x=c.getContext('2d');x.fillStyle='#060c12';x.fillRect(0,0,T4,T4);aplicarManchas(x,R,T4,T4,24,'#1d3344',.5);
  for(let i=0;i<10;i++){x.fillStyle='rgba(200,220,235,.22)';x.beginPath();const px=R()*T4,py=R()*T4;x.moveTo(px,py);for(let k=0;k<5;k++)x.lineTo(px+(R()-.5)*22,py+(R()-.5)*18);x.fill();}return c;}
function texTapete(T,R){const c=cv(T4,T4),x=c.getContext('2d');x.fillStyle='#4a1019';x.fillRect(0,0,T4,T4);aplicarManchas(x,R,T4,T4,12,'#000000',.45);
  x.strokeStyle='rgba(200,150,90,.18)';x.lineWidth=1;for(let i=0;i<T4;i+=12){x.beginPath();x.moveTo(i,0);x.lineTo(i+T4,T4);x.stroke();}pontos(x,R,T4,T4,400,'rgba(0,0,0,.3)');return c;}

function texturas(tema,R){const T=TEMAS[tema];return {
  '.':texPedra(T,R,T.piso),w:texMadeira(T,R,T.madeira),p:texMadeira(T,R,tom(T.madeira,22)),',':texTerra(T,R,T.terra),
  i:texGelo(T,R),l:texLago(T,R,false),x:texLago(T,R,false),_:texTapete(T,R),
  '~':T.liq==='mercurio'?texMercurio(T,R):texAguaNegra(T,R),'=':texMadeira(T,R,tom(T.madeira,-6)),
  parede:texPedra(T,R,T.topo),rocha:texTerra(T,R,T.vazio)};}

// ---------- objetos vistos de cima ----------
function sombra(x,b=10,oy=4){x.shadowColor='rgba(0,0,0,.6)';x.shadowBlur=b;x.shadowOffsetY=oy;x.shadowOffsetX=1;}
function semSombra(x){x.shadowColor='transparent';x.shadowBlur=0;x.shadowOffsetX=0;x.shadowOffsetY=0;}
function madeiraFill(x,X,Y,W,H,base){const g=x.createLinearGradient(X,Y,X+W,Y+H);g.addColorStop(0,tom(base,18));g.addColorStop(1,tom(base,-14));return g;}
function chama(x,X,Y,s){const g=x.createRadialGradient(X,Y,0,X,Y,s*2.4);g.addColorStop(0,'rgba(255,235,160,1)');g.addColorStop(.35,'rgba(255,140,40,.9)');g.addColorStop(1,'rgba(255,80,0,0)');x.fillStyle=g;x.beginPath();x.arc(X,Y,s*2.4,0,7);x.fill();}
function respingo(x,R,X,Y,s,cor){x.fillStyle=cor;x.beginPath();for(let k=0;k<12;k++){const a=k/12*Math.PI*2,r=s*(.55+R()*.6);x.lineTo(X+Math.cos(a)*r,Y+Math.sin(a)*r);}x.fill();
  for(let k=0;k<7;k++){const a=R()*7,d=s*(1+R()*1.3);x.beginPath();x.arc(X+Math.cos(a)*d,Y+Math.sin(a)*d,s*.08+R()*s*.12,0,7);x.fill();}}
function osso(x,X,Y,l,a){x.save();x.translate(X,Y);x.rotate(a);x.fillStyle='#d9cfb8';x.strokeStyle='rgba(60,40,20,.6)';x.lineWidth=.8;x.beginPath();x.rect(-l/2,-1.6,l,3.2);x.fill();x.stroke();
  for(const sx of [-l/2,l/2])for(const sy of [-2,2]){x.beginPath();x.arc(sx,sy,2.4,0,7);x.fill();x.stroke();}x.restore();}

const OBJ={
  mesa(x,o,R,T){const [X,Y,W,H]=o.px;sombra(x);x.fillStyle=madeiraFill(x,X,Y,W,H,T.madeira);
    if(o.r){x.beginPath();x.ellipse(X+W/2,Y+H/2,W/2-5,H/2-5,0,0,7);x.fill();}else{rr(x,X+5,Y+6,W-10,H-12,4);x.fill();}semSombra(x);
    x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=1;if(!o.r)for(let k=1;k<3;k++){x.beginPath();x.moveTo(X+6,Y+6+k*(H-12)/3);x.lineTo(X+W-6,Y+6+k*(H-12)/3);x.stroke();}
    const n=Math.max(2,(o.w||1)*(o.h||1)*1.5|0);
    for(let i=0;i<n;i++){const cx=X+10+R()*(W-20),cy=Y+10+R()*(H-20);
      if(o.jogo&&R()<.6){x.fillStyle='#eadfca';x.fillRect(cx-3,cy-3,6,6);x.fillStyle='#200';x.fillRect(cx-1,cy-1,2,2);}
      else if(o.banquete||R()<.5){x.fillStyle='#8c8f99';x.beginPath();x.arc(cx,cy,4,0,7);x.fill();x.fillStyle=R()<.5?'#5a0a08':'#2a1a10';x.beginPath();x.arc(cx,cy,2.6,0,7);x.fill();}
      else{x.fillStyle='#c9a24a';x.beginPath();x.arc(cx,cy,2,0,7);x.fill();}}
    if(o.banquete){x.fillStyle='#6d0f0b';x.beginPath();x.ellipse(X+W*.5,Y+H*.5,10,5,0,0,7);x.fill();}},
  cadeira(x,o,R,T){const [X,Y,W,H]=o.px;sombra(x,6,2);x.fillStyle=madeiraFill(x,X,Y,W,H,tom(T.madeira,8));rr(x,X+14,Y+14,W-28,H-28,3);x.fill();semSombra(x);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(X+14,Y+14,W-28,4);},
  banco(x,o,R,T){const [X,Y,W,H]=o.px;sombra(x,6,2);x.fillStyle=madeiraFill(x,X,Y,W,H,T.madeira);rr(x,X+4,Y+15,W-8,H-30,3);x.fill();semSombra(x);},
  barril(x,o,R,T){const [X,Y,W,H]=o.px,cx=X+W/2,cy=Y+H/2,r=Math.min(W,H)*.38;sombra(x,8,3);const g=x.createRadialGradient(cx-4,cy-4,2,cx,cy,r);g.addColorStop(0,tom(T.madeira,30));g.addColorStop(1,tom(T.madeira,-20));
    x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,7);x.fill();semSombra(x);x.strokeStyle='#1a1410';x.lineWidth=2;x.beginPath();x.arc(cx,cy,r-1,0,7);x.stroke();x.beginPath();x.arc(cx,cy,r*.62,0,7);x.stroke();
    x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=1;for(let k=-1;k<=1;k++){x.beginPath();x.moveTo(cx-r*.6,cy+k*r*.3);x.lineTo(cx+r*.6,cy+k*r*.3);x.stroke();}
    if(o.marca){x.strokeStyle='#b11a10';x.lineWidth=2.2;x.beginPath();x.moveTo(cx-5,cy-5);x.lineTo(cx+5,cy+5);x.moveTo(cx+5,cy-5);x.lineTo(cx-5,cy+5);x.stroke();}},
  caixote(x,o,R,T){const [X,Y,W,H]=o.px,s=Math.min(W,H)-14;sombra(x,8,3);x.fillStyle=madeiraFill(x,X,Y,W,H,tom(T.madeira,12));x.save();x.translate(X+W/2,Y+H/2);x.rotate((R()-.5)*.4);x.fillRect(-s/2,-s/2,s,s);semSombra(x);
    x.strokeStyle='rgba(0,0,0,.5)';x.lineWidth=2;x.strokeRect(-s/2+1,-s/2+1,s-2,s-2);x.beginPath();x.moveTo(-s/2,-s/2);x.lineTo(s/2,s/2);x.moveTo(s/2,-s/2);x.lineTo(-s/2,s/2);x.stroke();x.restore();},
  cama(x,o,R,T){const [X,Y,W,H]=o.px;sombra(x);x.fillStyle=madeiraFill(x,X,Y,W,H,T.madeira);rr(x,X+4,Y+3,W-8,H-6,3);x.fill();semSombra(x);
    x.fillStyle='#cfc4ad';rr(x,X+8,Y+7,W-16,14,4);x.fill();x.fillStyle='#4a1a22';rr(x,X+7,Y+24,W-14,H-31,3);x.fill();x.strokeStyle='rgba(0,0,0,.3)';x.beginPath();x.moveTo(X+8,Y+30);x.lineTo(X+W-8,Y+34);x.stroke();
    respingo(x,R,X+W*.55,Y+H*.62,7,'rgba(110,8,6,.85)');},
  balcao(x,o,R,T){const [X,Y,W,H]=o.px;sombra(x,12,5);const g=x.createLinearGradient(X,Y,X,Y+H);g.addColorStop(0,'#e3d8bf');g.addColorStop(1,'#a99877');x.fillStyle=g;rr(x,X+2,Y+10,W-4,H-20,6);x.fill();semSombra(x);
    x.fillStyle='#8c7b5c';for(let px=X+10;px<X+W-8;px+=16){x.beginPath();x.ellipse(px,Y+H/2,5,7,0,0,7);x.fill();x.fillStyle='#d6cab0';x.beginPath();x.arc(px,Y+H/2,2.4,0,7);x.fill();x.fillStyle='#8c7b5c';}
    x.fillStyle='rgba(110,10,8,.75)';x.beginPath();x.ellipse(X+W*.7,Y+H/2,9,4,0,0,7);x.fill();},
  estante(x,o,R,T){const [X,Y,W,H]=o.px;sombra(x,8,4);x.fillStyle=tom(T.madeira,-18);x.fillRect(X+2,Y+4,W-4,H-14);semSombra(x);
    for(let px=X+8;px<X+W-6;px+=7+R()*5){x.fillStyle=['#3b5a2a','#5a1010','#2a3a5a','#6a5a2a'][R()*4|0];x.beginPath();x.arc(px,Y+12+R()*8,2.5+R()*1.5,0,7);x.fill();}},
  lareira(x,o,R,T){const [X,Y,W,H]=o.px;sombra(x,10,4);x.fillStyle='#4a4a50';rr(x,X+2,Y+2,W-4,H+4,6);x.fill();semSombra(x);x.fillStyle='#16130f';rr(x,X+10,Y+8,W-20,H-6,4);x.fill();
    x.fillStyle='#55504a';for(let i=0;i<14;i++){x.beginPath();x.arc(X+12+R()*(W-24),Y+14+R()*(H-14),1+R()*2,0,7);x.fill();}
    if(o.acesa){chama(x,X+W/2,Y+H/2+4,7);chama(x,X+W/2-10,Y+H/2+6,4);chama(x,X+W/2+10,Y+H/2+5,4);}},
  tapete(x,o,R,T,tex){const [X,Y,W,H]=o.px;x.save();x.globalAlpha=.92;x.fillStyle=x.createPattern(tex._,'repeat');x.fillRect(X+6,Y+6,W-12,H-12);x.restore();
    x.strokeStyle='#a0753a';x.lineWidth=2;x.strokeRect(X+9,Y+9,W-18,H-18);respingo(x,R,X+W*.4,Y+H*.5,6,'rgba(30,0,0,.5)');},
  alcapao(x,o,R,T){const [X,Y,W,H]=o.px;x.fillStyle=tom(T.madeira,-10);x.fillRect(X+6,Y+6,W-12,H-12);x.strokeStyle='#111';x.lineWidth=2;x.strokeRect(X+6,Y+6,W-12,H-12);
    x.beginPath();x.arc(X+W/2,Y+H/2,5,0,7);x.stroke();},
  vela(x,o,R,T){const [X,Y]=o.px;for(let i=0;i<4;i++){const cx=X+12+R()*24,cy=Y+12+R()*24;x.fillStyle='#e8dcc0';x.beginPath();x.arc(cx,cy,3,0,7);x.fill();x.fillStyle='rgba(120,20,10,.6)';x.beginPath();x.arc(cx+2,cy+2,2,0,7);x.fill();chama(x,cx,cy,1.6);}},
  tocha(x,o,R,T){const [X,Y]=o.px;x.fillStyle='#2a1a10';x.fillRect(X+20,Y+20,8,8);chama(x,X+24,Y+24,4);},
  trono(x,o,R,T){const [X,Y,W,H]=o.px;sombra(x,12,4);x.fillStyle='#1b1d22';rr(x,X+4,Y+2,W-8,H-4,5);x.fill();semSombra(x);x.fillStyle='#6d0f12';rr(x,X+10,Y+12,W-20,H-18,3);x.fill();x.fillStyle='#c9cdd6';x.fillRect(X+8,Y+4,W-16,4);},
  estatua(x,o,R,T){const [X,Y,W,H]=o.px,cx=X+W/2,cy=Y+H/2;sombra(x,12,6);x.fillStyle='#5b636c';x.beginPath();x.arc(cx,cy,W*.42,0,7);x.fill();semSombra(x);
    x.fillStyle='#8a939c';x.beginPath();x.ellipse(cx,cy+2,W*.28,W*.16,R()*.6,0,7);x.fill();x.fillStyle='#a3acb5';x.beginPath();x.arc(cx,cy-2,W*.11,0,7);x.fill();
    x.strokeStyle='rgba(235,245,255,.6)';x.lineWidth=1;x.beginPath();x.arc(cx,cy,W*.42,3.6,5.6);x.stroke();},
  espelho(x,o,R,T){const [X,Y,W,H]=o.px,cx=X+W/2,cy=Y+H/2;sombra(x,10,3);x.fillStyle='#2a2030';x.beginPath();x.ellipse(cx,cy,W*.32,H*.42,0,0,7);x.fill();semSombra(x);
    const g=x.createLinearGradient(X,Y,X+W,Y+H);g.addColorStop(0,'#d9d4ef');g.addColorStop(.5,'#6e6690');g.addColorStop(1,'#c4bde6');x.fillStyle=g;x.beginPath();x.ellipse(cx,cy,W*.25,H*.35,0,0,7);x.fill();
    x.strokeStyle='rgba(255,255,255,.7)';x.beginPath();x.moveTo(cx-5,cy-8);x.lineTo(cx+3,cy+6);x.stroke();},
  banca(x,o,R,T){const [X,Y,W,H]=o.px;x.save();x.translate(X+W/2,Y+H/2);x.rotate(o.a||0);sombra(x,12,5);x.fillStyle='#2a1d22';x.fillRect(-W/2+4,-H/2+4,W-8,H-8);semSombra(x);
    const n=Math.max(3,(W/14)|0);for(let i=0;i<n;i++){x.fillStyle=i%2?'#2b1a3d':'#5b3a86';x.fillRect(-W/2+4+i*(W-8)/n,-H/2+4,(W-8)/n+.5,H*.45);}
    x.fillStyle='rgba(0,0,0,.3)';x.fillRect(-W/2+4,-H/2+4+H*.45-3,W-8,3);
    for(let i=0;i<5;i++){const mx=-W/2+12+R()*(W-24),my=H*.08+R()*(H*.3);x.fillStyle=['#e7dcc8','#c8b2e8','#d9b0a8','#f0f0f0'][R()*4|0];x.beginPath();x.ellipse(mx,my,4.5,6,0,0,7);x.fill();x.fillStyle='#111';x.fillRect(mx-3,my-2,2,1.6);x.fillRect(mx+1,my-2,2,1.6);x.fillStyle='#7a1010';x.fillRect(mx-2,my+2.5,4,1);}
    x.restore();},
  fonte(x,o,R,T,tex){const [X,Y,W,H]=o.px,cx=X+W/2,cy=Y+H/2,r=W*.44;sombra(x,14,5);x.fillStyle='#4a4352';x.beginPath();x.arc(cx,cy,r,0,7);x.fill();semSombra(x);
    x.save();x.beginPath();x.arc(cx,cy,r-8,0,7);x.clip();x.fillStyle=x.createPattern(tex['~'],'repeat');x.fillRect(X,Y,W,H);x.restore();
    x.fillStyle='#2e2836';x.beginPath();x.arc(cx,cy,r*.22,0,7);x.fill();x.fillStyle='#d9d1f2';x.beginPath();x.arc(cx,cy,r*.1,0,7);x.fill();},
  alma(x,o,R,T){const [X,Y,W,H]=o.px,cx=X+W/2,cy=Y+H/2;x.fillStyle='rgba(225,240,255,.35)';x.beginPath();x.ellipse(cx,cy+3,W*.36,H*.22,0,0,7);x.fill();
    x.fillStyle='#9aa7b4';x.beginPath();x.ellipse(cx,cy+3,W*.24,H*.14,0,0,7);x.fill();x.fillStyle='#b9c3cc';x.beginPath();x.arc(cx,cy-2,W*.11,0,7);x.fill();
    x.fillStyle='#1a1e22';x.beginPath();x.ellipse(cx,cy,2,2.6,0,0,7);x.fill();x.fillRect(cx-3.5,cy-4,2,1.4);x.fillRect(cx+1.5,cy-4,2,1.4);
    x.strokeStyle='#9aa7b4';x.lineWidth=2;x.beginPath();x.moveTo(cx-W*.2,cy+2);x.lineTo(cx-W*.34,cy-8);x.moveTo(cx+W*.2,cy+2);x.lineTo(cx+W*.36,cy-6);x.stroke();},
  cristal(x,o,R,T){const [X,Y,W,H]=o.px,cx=X+W/2,cy=Y+H/2;for(let i=0;i<5;i++){const a=R()*7,l=8+R()*12;x.fillStyle=i%2?'#7d4fc4':'#b38cff';x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(a-.25)*l*.5,cy+Math.sin(a-.25)*l*.5);x.lineTo(cx+Math.cos(a)*l,cy+Math.sin(a)*l);x.lineTo(cx+Math.cos(a+.25)*l*.5,cy+Math.sin(a+.25)*l*.5);x.fill();}},
  pedra(x,o,R,T){const [X,Y,W,H]=o.px,cx=X+W/2,cy=Y+H/2;sombra(x,10,4);x.fillStyle=T===TEMAS.traicao?'#5d6670':'#3a3242';x.beginPath();for(let k=0;k<9;k++){const a=k/9*7,r=W*(.3+R()*.15);x.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);}x.fill();semSombra(x);
    x.fillStyle='rgba(255,255,255,.12)';x.beginPath();x.ellipse(cx-3,cy-4,W*.15,W*.08,-.4,0,7);x.fill();},
  corpo(x,o,R,T){const [X,Y,W,H]=o.px,cx=X+W/2,cy=Y+H/2;respingo(x,R,cx,cy,W*.42,'rgba(90,6,4,.8)');x.save();x.translate(cx,cy);x.rotate(o.a||0);
    x.fillStyle='#5a4a42';x.beginPath();x.ellipse(0,0,W*.17,W*.32,0,0,7);x.fill();x.fillStyle='#c9b9a4';x.beginPath();x.arc(0,-W*.36,W*.1,0,7);x.fill();
    x.strokeStyle='#5a4a42';x.lineWidth=4;x.beginPath();x.moveTo(-W*.12,-W*.15);x.lineTo(-W*.34,W*.05);x.moveTo(W*.12,-W*.15);x.lineTo(W*.3,-W*.3);x.stroke();x.restore();},
  ossos(x,o,R,T){const [X,Y]=o.px;for(let i=0;i<3;i++)osso(x,X+10+R()*28,Y+10+R()*28,10+R()*8,R()*3);x.fillStyle='#d9cfb8';x.beginPath();x.arc(X+24,Y+26,5,0,7);x.fill();x.fillStyle='#222';x.fillRect(X+21,Y+24,2,2);x.fillRect(X+25,Y+24,2,2);},
  sangue(x,o,R){const [X,Y,W,H]=o.px;respingo(x,R,X+W/2,Y+H/2,W*.35,'rgba(100,6,4,.82)');},
  portafalsa(x,o,R,T){const [X,Y,W,H]=o.px;x.fillStyle=tom(T.madeira,-6);x.fillRect(X+8,Y+12,W-16,H-24);x.strokeStyle='#0a0a0a';x.lineWidth=2;x.strokeRect(X+8,Y+12,W-16,H-24);x.fillStyle='#b9a36a';x.beginPath();x.arc(X+W-14,Y+H/2,2.4,0,7);x.fill();},
};

// ---------- geração das plantas procedurais ----------
function vazia(w,h,c){return Array.from({length:h},()=>Array(w).fill(c));}
function genLabirinto(L){const R=rng(L.semente),W=33,H=25,g=vazia(W,H,'#');
  const vis=new Set(),pilha=[[1,1]];vis.add('1,1');g[1][1]='.';
  while(pilha.length){const [cx,cy]=pilha[pilha.length-1];const viz=[[2,0],[-2,0],[0,2],[0,-2]].map(([dx,dy])=>[cx+dx,cy+dy,dx,dy]).filter(([x,y])=>x>0&&y>0&&x<W-1&&y<H-1&&!vis.has(x+','+y));
    if(!viz.length){pilha.pop();continue;}const [nx,ny,dx,dy]=viz[R()*viz.length|0];g[cy+dy/2][cx+dx/2]='.';g[ny][nx]='.';vis.add(nx+','+ny);pilha.push([nx,ny]);}
  for(let k=0;k<60;k++){const x=1+(R()*(W-2)|0),y=1+(R()*(H-2)|0);if(g[y][x]==='#'&&((g[y][x-1]==='.'&&g[y][x+1]==='.')||(g[y-1]?.[x]==='.'&&g[y+1]?.[x]==='.')))g[y][x]='.';}
  const sala=(x0,y0,w,h,esp)=>{for(let y=y0-1;y<=y0+h;y++)for(let x=x0-1;x<=x0+w;x++){if(y<0||x<0||y>=H||x>=W)continue;const dentro=x>=x0&&x<x0+w&&y>=y0&&y<y0+h;if(dentro)g[y][x]='.';else if(esp&&g[y][x]==='#')g[y][x]='m';}};
  sala(3,6,5,3,1);sala(25,6,5,3,1);sala(3,16,5,3,1);sala(25,16,5,3,1);sala(13,10,7,5,0);
  for(let y=9;y<=15;y++)for(const x of [12,20])if(g[y][x]==='.')g[y][x]='#';for(let x=12;x<=20;x++)for(const y of [9,15])if(g[y][x]==='.')g[y][x]='#';
  g[9][16]='D';g[15][16]='D';g[12][12]='S';
  for(const [x,y] of [[5,5],[5,9],[27,5],[27,9],[5,15],[5,19],[27,15],[27,19],[2,7],[30,7],[2,17],[30,17]])if(g[y]&&g[y][x]==='m'&&R()<.6)g[y][x]='.';
  for(let x=14;x<=18;x++)for(let y=21;y<=23;y++)g[y][x]='.';g[24][16]='D';
  for(let y=16;y<=21;y++)if(g[y][16]==='#')g[y][16]='.';
  const ob=[{t:'trono',x:16,y:11},{t:'espelho',x:13,y:10},{t:'espelho',x:19,y:10},{t:'espelho',x:13,y:14},{t:'espelho',x:19,y:14},{t:'corpo',x:15,y:13,a:.6},{t:'ossos',x:17,y:13},{t:'sangue',x:16,y:12},
    {t:'cristal',x:4,y:7},{t:'cristal',x:28,y:7},{t:'cristal',x:4,y:17},{t:'cristal',x:28,y:17},{t:'espelho',x:6,y:7},{t:'espelho',x:26,y:17}];
  for(let k=0;k<26;k++){const x=1+(R()*(W-2)|0),y=1+(R()*(H-2)|0);if(g[y][x]!=='#')continue;const viz=[[0,1],[0,-1],[1,0],[-1,0]].filter(([dx,dy])=>g[y+dy]?.[x+dx]==='.');if(viz.length===1)ob.push({t:'portafalsa',x,y,parede:1});}
  for(let k=0;k<18;k++){const x=1+(R()*(W-2)|0),y=1+(R()*(H-2)|0);if(g[y][x]==='.')ob.push({t:R()<.5?'ossos':'sangue',x,y});}
  const luzes=[{x:16.5,y:12.5,r:5,cor:'#b58cff'},{x:5.5,y:7.5,r:3.5,cor:'#b58cff'},{x:27.5,y:7.5,r:3.5,cor:'#b58cff'},{x:5.5,y:17.5,r:3.5,cor:'#b58cff'},{x:27.5,y:17.5,r:3.5,cor:'#b58cff'},{x:16.5,y:22.5,r:4}];
  return {g,objetos:ob,luzes};}
function genPonte(L){const R=rng(L.semente),W=30,H=20,g=vazia(W,H,',');
  const centro=x=>10+2.2*Math.sin(x*.23+1)+(x>20?1:0);
  for(let x=0;x<W;x++){const c=centro(x);for(let y=0;y<H;y++)if(Math.abs(y-c)<3.6+Math.sin(x*.7)*.5)g[y][x]='~';}
  for(let y=0;y<H;y++)for(const x of [14,15])if(g[y][x]==='~'||(g[y-1]?.[x]==='~')||(g[y+1]?.[x]==='~'))g[y][x]='=';
  for(let k=0;k<7;k++){const cx=R()*W|0,cy=R()<.5?R()*4|0:16+(R()*4|0);for(let y=cy;y<cy+2;y++)for(let x=cx;x<cx+2+(R()*2|0);x++)if(g[y]&&g[y][x]===',')g[y][x]='#';}
  const ob=[];for(let k=0;k<10;k++){const x=R()*W|0,y=R()<.5?R()*5|0:15+(R()*5|0);if(g[y][x]===',')ob.push({t:R()<.5?'cristal':'pedra',x,y});}
  ob.push({t:'espelho',x:3,y:2},{t:'espelho',x:26,y:17},{t:'corpo',x:20,y:3,a:2},{t:'sangue',x:21,y:4},{t:'ossos',x:8,y:17},{t:'estatua',x:12,y:4},{t:'estatua',x:17,y:16});
  const luzes=[{x:14.5,y:5,r:4},{x:15.5,y:15,r:4},{x:6,y:10,r:6,cor:'#b58cff'},{x:24,y:11,r:6,cor:'#b58cff'}];
  return {g,objetos:ob,luzes,ponteBordas:[13.9,16.1]};}
function genFosso(L){const R=rng(L.semente),W=34,H=26;let g=vazia(W,H,'#');
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)g[y][x]=R()<.47?'#':'i';
  for(let it=0;it<5;it++){const n=vazia(W,H,'#');for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){let c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(g[y+dy][x+dx]==='#')c++;n[y][x]=c>=5?'#':'i';}g=n;}
  const cav=(x,y,r)=>{for(let yy=Math.floor(y-r);yy<=y+r;yy++)for(let xx=Math.floor(x-r);xx<=x+r;xx++)if(yy>0&&xx>0&&yy<H-1&&xx<W-1&&(xx-x)**2+(yy-y)**2<=r*r)g[yy][xx]='i';};
  let px=17,py=1;cav(17,2,2.5);const alvo=[[8,7],[16,9],[27,7],[17,12],[10,15],[17,19]];
  for(const [tx,ty] of alvo){while(Math.abs(px-tx)+Math.abs(py-ty)>1){if(R()<.5)px+=Math.sign(tx-px);else py+=Math.sign(ty-py);cav(px,py,1.3);}}
  cav(6,8,3);cav(28,7,3);
  for(let y=15;y<H-1;y++)for(let x=1;x<W-1;x++){const d=((x-17)/10)**2+((y-20)/4.6)**2;if(d<1)g[y][x]='l';else if(d<1.5&&g[y][x]==='#'&&R()<.6)g[y][x]='i';}
  for(let x=1;x<W-1;x++)for(const y of [12,13])g[y][x]='o';
  for(const bx of [7,17,27])for(let y=11;y<=14;y++){g[y][bx]='x';if(y===12||y===13)g[y][bx+1]='x';}
  const ob=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(g[y][x]!=='#')continue;const viz=[[0,1],[0,-1],[1,0],[-1,0]].some(([dx,dy])=>'il'.includes(g[y+dy]?.[x+dx]));if(viz&&R()<.16)ob.push({t:'alma',x,y,parede:1});}
  for(let k=0;k<14;k++){const x=1+(R()*(W-2)|0),y=1+(R()*(H-2)|0);if(g[y][x]==='i')ob.push({t:R()<.4?'ossos':R()<.6?'sangue':'pedra',x,y});}
  const luzes=[{x:17,y:2,r:4.5,cor:'#9cc4ff'},{x:6,y:8,r:4},{x:28,y:7,r:4},{x:17,y:20,r:7,cor:'#6fa8ff'}];
  return {g,objetos:ob,luzes};}
function genLago(L){const R=rng(L.semente),W=30,H=20,g=vazia(W,H,'l');
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const borda=Math.min(x,y,W-1-x,H-1-y)+Math.sin(x*.6+y*.3)*1.2+R()*.8;if(borda<2.6)g[y][x]=',';else if(borda<3.4)g[y][x]='i';}
  for(let k=0;k<6;k++){const cx=5+R()*20,cy=5+R()*10,r=.8+R()*1.4;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if((x-cx)**2+(y-cy)**2<r*r&&g[y][x]==='l')g[y][x]='o';}
  for(let k=0;k<40;k++){const x=R()*W|0,y=R()*H|0;if(g[y][x]==='l')g[y][x]='x';}
  const ob=[];const est=[[8,6],[13,5],[21,7],[18,12],[10,13],[24,13],[6,10],[15,9]];for(const [x,y] of est)if(g[y][x]!=='o')ob.push({t:'estatua',x,y});
  for(let k=0;k<12;k++){const x=R()*W|0,y=R()*H|0;if(g[y][x]===','||g[y][x]==='i')ob.push({t:R()<.5?'pedra':'alma',x,y});}
  ob.push({t:'corpo',x:12,y:16,a:1},{t:'sangue',x:13,y:16},{t:'ossos',x:22,y:4});
  return {g,objetos:ob,luzes:[{x:15,y:10,r:9,cor:'#7aa6d8'},{x:3,y:3,r:3.5},{x:27,y:17,r:3.5}]};}

function planta(id){const L=LOCAIS[id];if(L._p)return L._p;let p;
  if(L.gerar==='labirinto')p=genLabirinto(L);else if(L.gerar==='ponte')p=genPonte(L);else if(L.gerar==='fosso')p=genFosso(L);else if(L.gerar==='lago')p=genLago(L);
  else{const w=Math.max(...L.planta.map(r=>r.length));p={g:L.planta.map(r=>r.padEnd(w,' ').split('')),objetos:L.objetos,luzes:L.luzes};}
  p.W=p.g[0].length;p.H=p.g.length;L._p=p;return p;}

// ---------- desenho de um mapa local ----------
const PISOS='.wp,ilx~=_oDS'.split('');
const ORG=['~','l'];
const ehParede=c=>c==='#'||c==='m'||c==='S'||c===' ';
function desenharLocal(id){
  const L=LOCAIS[id],T=TEMAS[L.tema],p=planta(id),{W,H,g}=p,R=rng(L.semente||7777+id.length*31),tex=texturas(L.tema,R);
  const c=cv(W*CEL,H*CEL),x=c.getContext('2d');
  x.fillStyle=T.vazio;x.fillRect(0,0,c.width,c.height);
  const cel=(t,cx,cy)=>x.drawImage(t,(cx%4)*CEL,(cy%4)*CEL,CEL,CEL,cx*CEL,cy*CEL,CEL,CEL);
  // pisos
  for(let y=0;y<H;y++)for(let X=0;X<W;X++){const k=g[y][X];
    if(k==='D'){const viz=[g[y][X-1],g[y][X+1],g[y-1]?.[X],g[y+1]?.[X]].find(v=>v&&!ehParede(v)&&v!=='D')||'.';cel(tex[viz]||tex['.'],X,y);}
    else if(ORG.includes(k)||k==='o'){const v=[g[y][X-1],g[y][X+1],g[y-1]?.[X],g[y+1]?.[X]].find(v=>v&&!ORG.includes(v)&&v!=='o'&&!ehParede(v));cel(tex[v]||tex[k==='o'?(T.liq==='mercurio'?'~':'l'):k]||tex['.'],X,y);}
    else if(tex[k])cel(tex[k],X,y);
    else if(k===' ')cel(tex.rocha,X,y);}
  for(const k of ORG){const m=cv(c.width,c.height),mx=m.getContext('2d');let tem=false;
    for(let y=0;y<H;y++)for(let X=0;X<W;X++){const q=g[y][X];if(q===k||(k===(T.liq==='mercurio'?'~':'l')&&q==='o')||(k==='l'&&q==='x')){tem=true;mx.fillRect(X*CEL-2,y*CEL-2,CEL+4,CEL+4);}}
    if(!tem)continue;{const m2=cv(c.width,c.height),m2x=m2.getContext('2d');m2x.filter='blur(11px)';m2x.drawImage(m,0,0);m2x.filter='none';m2x.drawImage(m2,0,0);mx.clearRect(0,0,m.width,m.height);mx.drawImage(m2,0,0);}mx.globalCompositeOperation='source-in';mx.fillStyle=mx.createPattern(tex[k],'repeat');mx.fillRect(0,0,m.width,m.height);
    x.save();x.shadowColor='rgba(0,0,0,.6)';x.shadowBlur=8;x.drawImage(m,0,0);x.restore();}
  // buracos e fendas: escuro fundo com borda
  {const b=cv(c.width,c.height),bx=b.getContext('2d');bx.fillStyle='#010305';let tem=false;for(let y=0;y<H;y++)for(let X=0;X<W;X++)if(g[y][X]==='o'){tem=true;bx.fillRect(X*CEL+3,y*CEL+3,CEL-6,CEL-6);}
   if(tem){const b2=cv(c.width,c.height),b2x=b2.getContext('2d');b2x.filter='blur(7px)';b2x.drawImage(b,0,0);b2x.drawImage(b,0,0);b2x.filter='none';bx.clearRect(0,0,b.width,b.height);bx.drawImage(b2,0,0);bx.drawImage(b2,0,0);}
   if(tem){x.save();x.shadowColor=L.tema==='traicao'?'rgba(210,232,255,.85)':'rgba(200,180,255,.7)';x.shadowBlur=9;x.drawImage(b,0,0);x.restore();}}
  for(let y=0;y<H;y++)for(let X=0;X<W;X++)if(g[y][X]==='x'){x.save();x.translate(X*CEL+24,y*CEL+24);rachaduras(x,R,1,1,5,'rgba(235,245,255,.75)',1.5);x.restore();}
  // ponte: bordas
  if(p.ponteBordas){x.fillStyle='#24182c';for(const bx of p.ponteBordas){for(let y=0;y<H;y++)if(g[y][14]==='='){x.fillRect(bx*CEL-3,y*CEL,6,CEL);if(R()<.3){x.fillStyle='#120c16';x.fillRect(bx*CEL-4,y*CEL+R()*30,8,8);x.fillStyle='#24182c';}}}}
  // manchas de sangue e ossos espalhadas
  for(let y=0;y<H;y++)for(let X=0;X<W;X++){const k=g[y][X];if(ehParede(k)||k==='~'||k==='o')continue;const r=R();
    if(r<.035)respingo(x,R,X*CEL+R()*CEL,y*CEL+R()*CEL,6+R()*8,'rgba(95,6,4,.7)');else if(r<.05)osso(x,X*CEL+R()*CEL,y*CEL+R()*CEL,8+R()*6,R()*3);}
  // objetos
  const ob=(p.objetos||[]).map(o=>Object.assign({},o,{px:[o.x*CEL,o.y*CEL,(o.w||1)*CEL,(o.h||1)*CEL]}));
  const tapetes=ob.filter(o=>o.t==='tapete'||o.t==='alcapao'||o.t==='sangue');const resto=ob.filter(o=>!tapetes.includes(o)&&!o.parede);
  for(const o of tapetes.sort((a,b)=>a.t==='alcapao'?-1:1))OBJ[o.t]&&OBJ[o.t](x,o,R,T,tex);
  for(const o of resto)OBJ[o.t]&&OBJ[o.t](x,o,R,T,tex);
  // paredes com espessura e sombra
  const pa=cv(c.width,c.height),px=pa.getContext('2d');
  for(let y=0;y<H;y++)for(let X=0;X<W;X++){const k=g[y][X];if(!ehParede(k)||k===' ')continue;
    px.fillStyle=T.parede;px.fillRect(X*CEL,y*CEL,CEL,CEL);px.globalAlpha=.45;px.drawImage(tex.parede,(X%4)*CEL,(y%4)*CEL,CEL,CEL,X*CEL,y*CEL,CEL,CEL);px.globalAlpha=1;}
  x.save();x.shadowColor='rgba(0,0,0,.85)';x.shadowBlur=18;x.shadowOffsetY=7;x.drawImage(pa,0,0);x.restore();
  // contorno das paredes que tocam o chão
  for(let y=0;y<H;y++)for(let X=0;X<W;X++){const k=g[y][X];if(!ehParede(k)||k===' ')continue;
    for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0]]){const v=g[y+dy]?.[X+dx];if(!v||ehParede(v))continue;
      const ex=X*CEL+(dx===1?CEL:0),ey=y*CEL+(dy===1?CEL:0),hz=dy!==0;
      if(k==='m'){const gr=hz?x.createLinearGradient(ex,ey-dy*8,ex,ey):x.createLinearGradient(ex-dx*8,ey,ex,ey);gr.addColorStop(0,'rgba(200,185,255,0)');gr.addColorStop(1,'rgba(225,215,255,.85)');x.fillStyle=gr;
        if(hz)x.fillRect(X*CEL,ey-(dy>0?8:0),CEL,8);else x.fillRect(ex-(dx>0?8:0),y*CEL,8,CEL);}
      if(k!=='m'){const gr=hz?x.createLinearGradient(0,ey-dy*10,0,ey):x.createLinearGradient(ex-dx*10,0,ex,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(255,255,255,.13)');x.fillStyle=gr;if(hz)x.fillRect(X*CEL,ey-(dy>0?10:0),CEL,10);else x.fillRect(ex-(dx>0?10:0),y*CEL,10,CEL);}
      x.strokeStyle=k==='m'?'rgba(240,235,255,.9)':T.borda;x.lineWidth=k==='m'?2:1.4;x.beginPath();if(hz){x.moveTo(X*CEL,ey);x.lineTo(X*CEL+CEL,ey);}else{x.moveTo(ex,y*CEL);x.lineTo(ex,y*CEL+CEL);}x.stroke();
      if(k!=='m'&&R()<.35){x.fillStyle=tom(T.topo,-6);for(let q=0;q<3;q++){x.beginPath();x.arc(ex+(hz?R()*CEL:dx*(3+R()*6)),ey+(hz?dy*(3+R()*6):R()*CEL),1.5+R()*2.5,0,7);x.fill();}}}}
  for(const o of ob.filter(o=>o.parede))OBJ[o.t]&&OBJ[o.t](x,o,R,T,tex);
  // portas
  for(let y=0;y<H;y++)for(let X=0;X<W;X++){if(g[y][X]!=='D')continue;const hz=ehParede(g[y][X-1]||'#')&&ehParede(g[y][X+1]||'#');
    x.save();x.translate(X*CEL+24,y*CEL+24);if(!hz)x.rotate(Math.PI/2);sombra(x,6,2);x.fillStyle=madeiraFill(x,-22,-6,44,12,T.madeira);x.fillRect(-22,-6,44,12);semSombra(x);
    x.strokeStyle='#0b0806';x.lineWidth=2;x.strokeRect(-22,-6,44,12);x.beginPath();x.moveTo(-8,-6);x.lineTo(-8,6);x.moveTo(8,-6);x.lineTo(8,6);x.stroke();x.fillStyle='#b39a5a';x.beginPath();x.arc(14,0,2,0,7);x.fill();x.restore();}
  // passagens secretas: fissura discreta
  for(let y=0;y<H;y++)for(let X=0;X<W;X++)if(g[y][X]==='S'){x.strokeStyle='rgba(0,0,0,.6)';x.lineWidth=1.2;x.beginPath();x.moveTo(X*CEL+12,y*CEL+6);x.lineTo(X*CEL+20,y*CEL+22);x.lineTo(X*CEL+16,y*CEL+40);x.stroke();}
  // luz: escuridão com buracos nas tochas e brilho por cima
  const luzes=[...(p.luzes||[])];
  const lz=cv(c.width,c.height),lx=lz.getContext('2d');lx.fillStyle=`rgba(${T.escuro},${L.amb??.5})`;lx.fillRect(0,0,lz.width,lz.height);lx.globalCompositeOperation='destination-out';
  for(const l of luzes){const X=l.x*CEL,Y=l.y*CEL,r=l.r*CEL,gr=lx.createRadialGradient(X,Y,0,X,Y,r);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.6,'rgba(0,0,0,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');lx.fillStyle=gr;lx.beginPath();lx.arc(X,Y,r,0,7);lx.fill();}
  x.drawImage(lz,0,0);
  x.save();x.globalCompositeOperation='lighter';for(const l of luzes){const X=l.x*CEL,Y=l.y*CEL,r=l.r*CEL*.85,[cr,cg,cb]=hex(l.cor||'#ff8a2a'),gr=x.createRadialGradient(X,Y,0,X,Y,r);
    gr.addColorStop(0,`rgba(${cr},${cg},${cb},.32)`);gr.addColorStop(1,`rgba(${cr},${cg},${cb},0)`);x.fillStyle=gr;x.beginPath();x.arc(X,Y,r,0,7);x.fill();}x.restore();
  for(const l of luzes)if(!l.cor){const X=l.x*CEL,Y=l.y*CEL;x.fillStyle='#24160c';x.fillRect(X-4,Y-4,8,8);chama(x,X,Y,3.4);}
  // névoa do lugar
  x.save();x.globalAlpha=.4;aplicarManchas(x,rng(99),c.width,c.height,90,T.nevoa,.25);x.restore();
  // grade sobre o chão
  x.strokeStyle=T.grade;x.lineWidth=1;x.beginPath();
  for(let y=0;y<H;y++)for(let X=0;X<W;X++){if(ehParede(g[y][X]))continue;x.rect(X*CEL+.5,y*CEL+.5,CEL,CEL);}x.stroke();
  // vinheta
  const vg=x.createRadialGradient(c.width/2,c.height/2,Math.min(c.width,c.height)*.35,c.width/2,c.height/2,Math.max(c.width,c.height)*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');x.fillStyle=vg;x.fillRect(0,0,c.width,c.height);
  return c;}

// ---------- desenho das cidades ----------
function distSeg(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(px-ax-t*dx,py-ay-t*dy);}
function distLinha(px,py,l){let m=1e9;for(let i=1;i<l.length;i++)m=Math.min(m,distSeg(px,py,l[i-1][0],l[i-1][1],l[i][0],l[i][1]));return m;}
function anguloLinha(px,py,l){let m=1e9,a=0;for(let i=1;i<l.length;i++){const d=distSeg(px,py,l[i-1][0],l[i-1][1],l[i][0],l[i][1]);if(d<m){m=d;a=Math.atan2(l[i][1]-l[i-1][1],l[i][0]-l[i-1][0]);}}return a;}
function tortuosa(R,l,amp,passo=40){const out=[];for(let i=1;i<l.length;i++){const [ax,ay]=l[i-1],[bx,by]=l[i],n=Math.max(1,Math.hypot(bx-ax,by-ay)/passo|0);for(let k=0;k<n;k++){const t=k/n;out.push([ax+(bx-ax)*t+(R()-.5)*amp,ay+(by-ay)*t+(R()-.5)*amp]);}}out.push(l[l.length-1]);return out;}
function traco(x,l){x.beginPath();x.moveTo(l[0][0],l[0][1]);for(let i=1;i<l.length;i++)x.lineTo(l[i][0],l[i][1]);x.stroke();}
const CW=1600,CH=1000;
function desenharCidade(id){
  const C=CIDADES[id],T=TEMAS[C.tema],R=rng(C.semente),c=cv(CW,CH),x=c.getContext('2d'),fr=C.tema==='fraude';
  // chão
  x.fillStyle=fr?'#1a1222':'#aeb6be';x.fillRect(0,0,CW,CH);
  aplicarManchas(x,R,CW,CH,60,fr?'#3a2450':'#4a5662',.55);aplicarManchas(x,R,CW,CH,22,fr?'#000000':'#ffffff',.35);pontos(x,R,CW,CH,5000,fr?'rgba(0,0,0,.35)':'rgba(40,50,60,.25)',1.6);
  if(!fr){rachaduras(x,R,CW,CH,120,'rgba(30,40,50,.35)',1.2);for(let k=0;k<80;k++){x.fillStyle='rgba(30,30,36,.55)';x.beginPath();x.ellipse(R()*CW,R()*CH,3,2,0,0,7);x.fill();}}
  const dentro=(px,py,m=1)=>((px-C.cx)/(C.rx*m))**2+((py-C.cy)/(C.ry*m))**2<1;
  // muralha irregular
  const ang=[],N=72;for(let i=0;i<N;i++){const a=i/N*Math.PI*2,r=1+(R()-.5)*.06+Math.sin(a*3)*.025;ang.push([C.cx+Math.cos(a)*C.rx*r,C.cy+Math.sin(a)*C.ry*r]);}
  // lagos e rio
  for(const lg of C.lagos||[]){x.save();x.beginPath();x.ellipse(lg.x,lg.y,lg.rx,lg.ry,-.15,0,7);x.clip();x.fillStyle='#132230';x.fillRect(0,0,CW,CH);aplicarManchas(x,R,CW,CH,30,'#3a5a74',.6);rachaduras(x,R,CW,CH,90,'rgba(220,235,255,.45)',1.2);x.restore();
    x.strokeStyle='rgba(230,240,250,.7)';x.lineWidth=5;x.beginPath();x.ellipse(lg.x,lg.y,lg.rx,lg.ry,-.15,0,7);x.stroke();}
  let rio=null;if(C.rio){rio=tortuosa(R,C.rio,20);x.lineCap='round';x.lineJoin='round';x.strokeStyle='#120c18';x.lineWidth=86;traco(x,rio);
    const g=x.createLinearGradient(0,600,0,820);g.addColorStop(0,'#9b98b5');g.addColorStop(1,'#5f5a7a');x.strokeStyle=g;x.lineWidth=70;traco(x,rio);
    x.strokeStyle='rgba(235,225,255,.35)';x.lineWidth=2;for(let k=0;k<5;k++){x.setLineDash([20+R()*40,30+R()*50]);x.lineDashOffset=R()*100;traco(x,rio.map(([a,b])=>[a,b+(k-2)*10]));}x.setLineDash([]);}
  let fenda=null;if(C.fenda){fenda=tortuosa(R,C.fenda,26,26);}
  // ruas
  const ruas=[];const centro=[C.cx,C.cy];
  for(const a of C.portoes){ruas.push(tortuosa(R,[[C.cx+Math.cos(a)*C.rx*1.15,C.cy+Math.sin(a)*C.ry*1.15],[C.cx+Math.cos(a)*C.rx*.5,C.cy+Math.sin(a)*C.ry*.5],centro],18));}
  const anel=[];for(let i=0;i<=40;i++){const a=i/40*Math.PI*2;anel.push([C.cx+Math.cos(a)*C.rx*.62,C.cy+Math.sin(a)*C.ry*.62]);}ruas.push(tortuosa(R,anel,14));
  for(let k=0;k<7;k++){const a=R()*Math.PI*2,b=a+(R()-.5)*1.6;ruas.push(tortuosa(R,[[C.cx+Math.cos(a)*C.rx*.2,C.cy+Math.sin(a)*C.ry*.2],[C.cx+Math.cos(b)*C.rx*.92,C.cy+Math.sin(b)*C.ry*.92]],22));}
  for(const P of C.pontos)ruas.push(tortuosa(R,[[P.x*CW,P.y*CH],[C.cx+(P.x*CW-C.cx)*.55,C.cy+(P.y*CH-C.cy)*.55]],14));
  x.lineCap='round';x.lineJoin='round';
  for(const r of ruas){x.strokeStyle=fr?'#0d0911':'#5e6670';x.lineWidth=24;traco(x,r);}
  for(const r of ruas){x.strokeStyle=fr?'#3a3045':'#8c949c';x.lineWidth=17;traco(x,r);x.strokeStyle=fr?'rgba(0,0,0,.35)':'rgba(40,46,54,.3)';x.lineWidth=1;x.setLineDash([3,5]);traco(x,r);x.setLineDash([]);}
  // praça central
  x.fillStyle=fr?'#3a3045':'#8c949c';x.beginPath();x.arc(C.cx,C.cy,46,0,7);x.fill();
  // prédios
  const livre=(px,py)=>{if(!dentro(px,py,.93))return false;for(const r of ruas)if(distLinha(px,py,r)<26)return false;if(rio&&distLinha(px,py,rio)<52)return false;if(fenda&&distLinha(px,py,fenda)<40)return false;
    if(Math.hypot(px-C.cx,py-C.cy)<70)return false;for(const P of C.pontos)if(Math.hypot(px-P.x*CW,py-P.y*CH)<78)return false;return true;};
  const predios=[];for(let gy=40;gy<CH;gy+=24)for(let gx=40;gx<CW;gx+=24){const px=gx+(R()-.5)*12,py=gy+(R()-.5)*12;if(!livre(px,py))continue;
    let a=0,m=1e9;for(const r of ruas){const d=distLinha(px,py,r);if(d<m){m=d;a=anguloLinha(px,py,r);}}predios.push({px,py,a,w:14+R()*14,h:12+R()*12,torre:fr&&R()<.06,ruina:!fr&&R()<.18});}
  for(const b of predios){x.save();x.translate(b.px,b.py);x.rotate(b.a);
    if(b.torre){x.shadowColor='rgba(0,0,0,.7)';x.shadowBlur=10;x.shadowOffsetY=6;x.fillStyle='#2a1a3e';x.beginPath();x.arc(0,0,b.w*.7,0,7);x.fill();semSombra(x);
      x.fillStyle='#5b3a86';for(let k=0;k<8;k++){x.beginPath();x.moveTo(0,0);x.lineTo(Math.cos(k/8*7)*b.w*.7,Math.sin(k/8*7)*b.w*.7);x.lineTo(Math.cos((k+.5)/8*7)*b.w*.7,Math.sin((k+.5)/8*7)*b.w*.7);x.fill();}
      x.fillStyle='rgba(220,200,255,.85)';x.beginPath();x.arc(0,0,2.4,0,7);x.fill();}
    else{x.shadowColor='rgba(0,0,0,.65)';x.shadowBlur=6;x.shadowOffsetY=4;x.fillStyle=fr?tom('#2c2236',(R()-.5)*16):tom('#2a2f36',(R()-.5)*14);
      if(b.ruina){x.beginPath();x.moveTo(-b.w/2,-b.h/2);x.lineTo(b.w/2,-b.h/2);x.lineTo(b.w/2-4,b.h/4);x.lineTo(0,b.h/2);x.lineTo(-b.w/2,b.h/2);x.fill();}else x.fillRect(-b.w/2,-b.h/2,b.w,b.h);semSombra(x);
      x.strokeStyle=fr?'rgba(150,120,200,.35)':'rgba(255,255,255,.6)';x.lineWidth=fr?1:2;x.beginPath();x.moveTo(-b.w/2+2,0);x.lineTo(b.w/2-2,0);x.stroke();
      if(!fr){x.strokeStyle='rgba(240,245,250,.85)';x.lineWidth=2;x.strokeRect(-b.w/2,-b.h/2,b.w,b.h);}
      if(fr&&R()<.25){x.fillStyle='rgba(225,210,255,.9)';x.fillRect(-1,-b.h/2+2,2,2);}}
    x.restore();}
  // fenda de Kharvel
  if(fenda){x.lineCap='round';x.lineJoin='miter';x.strokeStyle='rgba(225,240,255,.8)';x.lineWidth=52;traco(x,fenda);x.strokeStyle='#020406';x.lineWidth=44;traco(x,fenda);x.strokeStyle='#0b1a26';x.lineWidth=16;traco(x,fenda);}
  // muralha
  x.lineJoin='round';x.strokeStyle='#050307';x.lineWidth=26;x.beginPath();ang.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.stroke();
  x.strokeStyle=fr?'#3b2c4d':'#3a4550';x.lineWidth=18;x.stroke();x.strokeStyle=fr?'rgba(200,170,255,.35)':'rgba(240,248,255,.7)';x.lineWidth=2;x.stroke();
  for(let i=0;i<N;i+=6){const [a,b]=ang[i];x.fillStyle='#050307';x.beginPath();x.arc(a,b,17,0,7);x.fill();x.fillStyle=fr?'#4a3862':'#46525e';x.beginPath();x.arc(a,b,13,0,7);x.fill();
    if(fr){x.fillStyle='rgba(190,150,255,.6)';x.beginPath();x.arc(a,b,3,0,7);x.fill();}}
  if(fenda){x.lineCap='butt';x.strokeStyle='#020406';x.lineWidth=40;traco(x,fenda.slice(0,8));traco(x,fenda.slice(-9));}
  for(const a of C.portoes){const px=C.cx+Math.cos(a)*C.rx,py=C.cy+Math.sin(a)*C.ry;x.fillStyle=fr?'#3a3045':'#8c949c';x.beginPath();x.arc(px,py,16,0,7);x.fill();}
  // marcos dos pontos
  for(const P of C.pontos)marco(x,R,P,P.x*CW,P.y*CH,fr);
  // tochas nas ruas
  x.save();x.globalCompositeOperation='lighter';for(let k=0;k<70;k++){const r=ruas[R()*ruas.length|0],[px,py]=r[R()*r.length|0];const gr=x.createRadialGradient(px,py,0,px,py,26);gr.addColorStop(0,fr?'rgba(190,120,255,.35)':'rgba(255,150,60,.35)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.beginPath();x.arc(px,py,26,0,7);x.fill();}x.restore();
  // névoa e vinheta
  x.save();x.globalAlpha=fr?.55:.45;aplicarManchas(x,rng(C.semente+1),CW,CH,120,fr?'#6a4a90':'#e8f0f6',.32);x.restore();
  const vg=x.createRadialGradient(CW/2,CH/2,CH*.35,CW/2,CH/2,CW*.7);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.75)');x.fillStyle=vg;x.fillRect(0,0,CW,CH);
  return c;}
function marco(x,R,P,X,Y,fr){x.save();x.translate(X,Y);const pedra=fr?'#3a3045':'#8c949c';
  const praca=r=>{x.fillStyle=pedra;x.beginPath();x.arc(0,0,r,0,7);x.fill();x.strokeStyle='rgba(0,0,0,.4)';x.lineWidth=2;x.stroke();};
  const predio=(w,h,cor,borda)=>{x.shadowColor='rgba(0,0,0,.7)';x.shadowBlur=12;x.shadowOffsetY=6;x.fillStyle=cor;x.fillRect(-w/2,-h/2,w,h);semSombra(x);x.strokeStyle=borda;x.lineWidth=2;x.strokeRect(-w/2,-h/2,w,h);};
  switch(P.marco){
    case 'portao':x.fillStyle='#050307';x.fillRect(-46,-14,92,28);x.fillStyle='#4a3862';x.fillRect(-42,-10,30,20);x.fillRect(12,-10,30,20);x.fillStyle='#120a18';x.fillRect(-10,-12,20,24);
      for(let k=0;k<12;k++){x.fillStyle=['#e7dcc8','#c8b2e8','#d9b0a8'][k%3];x.beginPath();x.ellipse(-40+k*7,-20,3,4,0,0,7);x.fill();}break;
    case 'mercado':praca(56);for(let k=0;k<9;k++){x.save();x.rotate(k/9*7+R()*.4);x.translate(32,0);x.rotate(R()-.5);x.fillStyle=k%2?'#5b3a86':'#2b1a3d';x.fillRect(-9,-6,18,12);x.restore();}break;
    case 'taverna':predio(64,44,fr?'#3a2448':'#2c3138',fr?'#a98ad8':'#e6eef5');x.fillStyle=fr?'#5a1020':'#6d0f12';x.fillRect(-18,-8,36,16);
      x.fillStyle='#ffb35a';x.beginPath();x.arc(-26,-18,3,0,7);x.arc(26,-18,3,0,7);x.fill();break;
    case 'cartorio':predio(54,70,'#251a30','#a98ad8');for(let k=0;k<6;k++){x.fillStyle='#d8ccb0';x.fillRect(-20+k*7,-26,4,52);}break;
    case 'labirinto':x.fillStyle='#120c18';x.fillRect(-60,-60,120,120);x.strokeStyle='#5b4a74';x.lineWidth=5;for(let k=0;k<5;k++){const s=56-k*11;x.strokeRect(-s,-s,s*2,s*2);}
      x.strokeStyle='#120c18';x.lineWidth=10;for(let k=0;k<5;k++){const s=56-k*11,a=R()*4|0;x.beginPath();x.moveTo([-s,s,-6,6][a],[-6,6,-s,s][a]);x.lineTo([-s,s,6,-6][a],[6,-6,-s,s][a]);x.stroke();}
      x.fillStyle='#b38cff';x.beginPath();x.arc(0,0,5,0,7);x.fill();break;
    case 'ponte':x.rotate(-.42);x.fillStyle='#120c18';x.fillRect(-14,-62,28,124);x.fillStyle='#4a3a2e';x.fillRect(-10,-62,20,124);x.strokeStyle='#120c18';x.lineWidth=1;for(let k=-60;k<60;k+=6){x.beginPath();x.moveTo(-10,k);x.lineTo(10,k);x.stroke();}break;
    case 'muralha':x.fillStyle='rgba(220,235,250,.9)';x.beginPath();x.arc(0,0,10,0,7);x.fill();break;
    case 'salao':predio(96,70,'#1d2228','#e6eef5');x.fillStyle='#6d0f12';x.fillRect(-10,-30,20,60);x.fillStyle='#111';x.fillRect(-14,-32,12,10);x.fillRect(2,-32,12,10);
      x.fillStyle='rgba(110,8,6,.8)';x.beginPath();x.ellipse(0,8,14,8,0,0,7);x.fill();break;
    case 'forca':praca(54);x.strokeStyle='#2a1c12';x.lineWidth=7;x.beginPath();x.arc(0,0,30,0,7);x.stroke();
      for(let k=0;k<10;k++){const a=k/10*7;x.strokeStyle='#c9b48a';x.lineWidth=1.5;x.beginPath();x.arc(Math.cos(a)*30,Math.sin(a)*30,4,0,7);x.stroke();}break;
    case 'fosso':{const g=x.createRadialGradient(0,0,6,0,0,58);g.addColorStop(0,'#000');g.addColorStop(.7,'#06101a');g.addColorStop(1,'rgba(6,16,26,0)');x.fillStyle=g;x.beginPath();x.arc(0,0,58,0,7);x.fill();
      x.strokeStyle='rgba(225,240,255,.7)';x.lineWidth=2;x.beginPath();x.arc(0,0,40,0,7);x.stroke();break;}
    case 'lago':for(let k=0;k<6;k++){x.fillStyle='#5d6670';x.beginPath();x.arc((R()-.5)*120,(R()-.5)*60,6,0,7);x.fill();}break;
  }
  x.restore();}

// ================= estado sincronizado =================
const S={mapa:null,tokens:{},nevoa:{},marcas:{},mSalas:{},mMarcas:{},pend:{}};
let VISTA={nivel:'mundo',id:null};let SEGUIR=true;try{const v=JSON.parse(localStorage.getItem('mesa-mapa')||'null');if(v&&v.nivel)VISTA=v;SEGUIR=localStorage.getItem('mesa-mapa-seguir')!=='0';}catch(e){}
let FER='mover',PINCEL=1,SEL=null,BASE={},iniciado=false;
const subsMestre=new Set();
function iniciar(){if(iniciado)return;iniciado=true;const db=M().db;
  db.doc('publico/mapa').onSnapshot(s=>{const old=S.mapa?.ativo;S.mapa=s.exists?s.data():null;const a=S.mapa?.ativo;
    if(a&&JSON.stringify(a)!==JSON.stringify(old)&&!M().ME.owner){if(SEGUIR){irPara(a,true);if(old)M().toast('O Mestre mostrou: '+nomeVista(a)+'.');}}desenhar();painel();},e=>console.warn('mapa',e));
  db.collection('tokens').onSnapshot(s=>{S.tokens={};s.docs.forEach(d=>S.tokens[d.id]=d.data());desenhar();painel();},e=>console.warn('tokens',e));
  db.collection('nevoa').onSnapshot(s=>{s.docs.forEach(d=>{if(!S.pend['nv_'+d.id])S.nevoa[d.id]=d.data().v||'';});desenhar();},e=>console.warn('nevoa',e));
  db.collection('marcas').onSnapshot(s=>{S.marcas={};s.docs.forEach(d=>S.marcas[d.id]=d.data().lista||[]);desenhar();painel();},e=>console.warn('marcas',e));
}
function assinarMestre(id){if(!M().ME.owner||subsMestre.has(id))return;subsMestre.add(id);const db=M().db;
  db.doc('mestre/salas_'+id).onSnapshot(s=>{S.mSalas[id]=s.exists?s.data():{};painel();},()=>{});
  db.doc('mestre/marcas_'+id).onSnapshot(s=>{S.mMarcas[id]=s.exists?(s.data().lista||[]):[];desenhar();painel();},()=>{});}

function nomeVista(v){return v.nivel==='mundo'?'Mapa das Camadas':v.nivel==='cidade'?CIDADES[v.id]?.titulo:LOCAIS[v.id]?.nome;}
function irPara(v,auto){VISTA={nivel:v.nivel,id:v.id||null};SEL=null;if(!auto&&!M().ME.owner){const a=S.mapa?.ativo;SEGUIR=!!a&&a.nivel===VISTA.nivel&&a.id===VISTA.id;}
  try{localStorage.setItem('mesa-mapa',JSON.stringify(VISTA));localStorage.setItem('mesa-mapa-seguir',SEGUIR?'1':'0');}catch(e){}
  if(VISTA.id)assinarMestre(VISTA.id);carregarBase();painel(true);}

// ================= visor com zoom, arrasto e pinça =================
const V={cam:{x:0,y:0,z:1},ptr:new Map(),modo:null,ajustado:null,regua:null,selo:null,arr:null};
let mundoImg=null;
function carregarBase(){const v=VISTA;let k=v.nivel+':'+(v.id||'');
  if(v.nivel==='mundo'){if(!mundoImg){mundoImg=new Image();mundoImg.onload=()=>{BASE[k]=mundoImg;ajustar(true);desenhar();};mundoImg.src='mapa-camadas.webp';}else BASE[k]=mundoImg;}
  else if(!BASE[k]){const pai=$('mp-palco');pai&&pai.classList.add('gerando');setTimeout(()=>{BASE[k]=v.nivel==='cidade'?desenharCidade(v.id):desenharLocal(v.id);pai&&pai.classList.remove('gerando');ajustar(true);desenhar();},20);}
  ajustar(true);desenhar();}
function baseAtual(){return BASE[VISTA.nivel+':'+(VISTA.id||'')];}
function tamBase(){const b=baseAtual();if(VISTA.nivel==='mundo')return [1536,1024];if(VISTA.nivel==='cidade')return [CW,CH];const p=planta(VISTA.id);return [p.W*CEL,p.H*CEL];}
function ajustar(forcar){const cvs=$('mp-tela');if(!cvs)return;const r=cvs.getBoundingClientRect(),k=VISTA.nivel+':'+(VISTA.id||'');if(!forcar&&V.ajustado===k)return;V.ajustado=k;
  const [bw,bh]=tamBase(),z=Math.min(r.width/bw,r.height/bh);V.cam={z,x:(r.width-bw*z)/2,y:(r.height-bh*z)/2};}
function mundo(px,py){return [(px-V.cam.x)/V.cam.z,(py-V.cam.y)/V.cam.z];}
function zoomEm(px,py,f){const [bw,bh]=tamBase(),r=$('mp-tela').getBoundingClientRect(),zmin=Math.min(r.width/bw,r.height/bh)*.6,zmax=VISTA.nivel==='local'?3:4;
  const nz=Math.max(zmin,Math.min(zmax,V.cam.z*f));const [wx,wy]=mundo(px,py);V.cam.z=nz;V.cam.x=px-wx*nz;V.cam.y=py-wy*nz;desenhar();}
let rq=0;function desenhar(){if(rq)return;rq=requestAnimationFrame(()=>{rq=0;pintar();});}

// ---------- o que aparece por cima do mapa ----------
function nevoaDe(id){const p=planta(id),s=S.nevoa[id]||'';return s.length===p.W*p.H?s:'0'.repeat(p.W*p.H);}
function revelado(id,cx,cy){const p=planta(id);return nevoaDe(id)[cy*p.W+cx]==='1';}
const fotoCache={};function foto(src){if(!src)return null;if(!fotoCache[src]){const i=new Image();i.onload=desenhar;i.src=src;fotoCache[src]=i;}return fotoCache[src].complete?fotoCache[src]:null;}
function tokensDoMapa(id){const ME=M().ME,out=[];
  for(const [k,t] of Object.entries(S.tokens)){if(t.m!==id)continue;const e=M().entryBy(t.slug);if(!e)continue;const Sv=M().view(e),mx=M().vidaMax(Sv),v=Sv.vidaAtual??mx;
    const p=S.pend['tk_'+k];out.push({k,tipo:'pc',x:p?p[0]:t.x,y:p?p[1]:t.y,nome:Sv.nome,foto:Sv.foto,morto:v<=0,meu:t.uid&&t.uid===ME.id,pode:ME.owner||(t.uid&&t.uid===ME.id),slug:t.slug,uid:t.uid});}
  const lista=ME.owner?(M().combM().lista||[]):(M().st.combPub?.lista||[]);
  for(const n of lista){if(n.tipo!=='npc'||!n.pos||n.pos.m!==id)continue;if(!ME.owner&&!revelado(id,n.pos.x,n.pos.y))continue;
    const p=S.pend['np_'+n.id];out.push({k:'np_'+n.id,id:n.id,tipo:'npc',x:p?p[0]:n.pos.x,y:p?p[1]:n.pos.y,nome:n.nome,oculto:!!n.oculto,morto:ME.owner?n.vida<=0:n.estado==='Caído',pode:ME.owner});}
  return out;}
function marcasDoMapa(id){const pub=S.marcas[id]||[];if(!M().ME.owner)return pub.map(m=>Object.assign({pub:1},m));const ids=new Set(pub.map(m=>m.id));return (S.mMarcas[id]||[]).map(m=>Object.assign({pub:ids.has(m.id)},m));}

function pintar(){const cvs=$('mp-tela');if(!cvs||$('mapas').hidden)return;const dpr=window.devicePixelRatio||1,r=cvs.getBoundingClientRect();
  if(cvs.width!==Math.round(r.width*dpr)||cvs.height!==Math.round(r.height*dpr)){cvs.width=Math.round(r.width*dpr);cvs.height=Math.round(r.height*dpr);}
  const x=cvs.getContext('2d');x.setTransform(1,0,0,1,0,0);x.fillStyle='#070303';x.fillRect(0,0,cvs.width,cvs.height);
  const b=baseAtual();if(!b)return;const z=V.cam.z;x.setTransform(dpr*z,0,0,dpr*z,dpr*V.cam.x,dpr*V.cam.y);x.imageSmoothingQuality='high';x.drawImage(b,0,0);
  const ME=M().ME,u=1/z;
  if(VISTA.nivel==='mundo'){
    const g=S.mapa?.grupo;if(g){const px=g.x*1536,py=g.y*1024;pino(x,px,py,u);}
    if(V.selo&&performance.now()<V.selo.ate){selo(x,V.selo.x,V.selo.y,u,V.selo.txt);requestAnimationFrame(desenhar);}else V.selo=null;
    if(V.realce){const R_=V.realce;x.strokeStyle='rgba(255,90,60,.8)';x.lineWidth=3*u;x.setLineDash([10*u,8*u]);x.beginPath();x.ellipse(R_.x*1536,R_.y*1024,R_.rx*1536,R_.ry*1024,0,0,7);x.stroke();x.setLineDash([]);}
  }
  if(VISTA.nivel==='cidade'){const C=CIDADES[VISTA.id];for(const P of C.pontos)selo_num(x,P.x*CW,P.y*CH,P.n,u*1.3,!!P.local,SEL&&SEL.n===P.n);}
  if(VISTA.nivel==='local'){const id=VISTA.id,L=LOCAIS[id],p=planta(id),nv=nevoaDe(id);
    for(const s of L.salas){const cx=Math.floor(s.x),cy=Math.floor(s.y);if(ME.owner||revelado(id,cx,cy))selo_num(x,(s.x+.5)*CEL,(s.y+.5)*CEL,s.n,Math.max(.7,u),false,SEL&&SEL.sala===s.n);}
    for(const m of marcasDoMapa(id))icone(x,m,SEL&&SEL.marca===m.id);
    const tks=tokensDoMapa(id);tks.sort((a,b)=>(b.morto?1:0)-(a.morto?1:0));
    for(const t of tks)if(t.tipo==='npc')token(x,t,V.arr&&V.arr.k===t.k);
    // névoa: um pixel por quadrado, ampliado com suavização (bordas macias)
    const n=cv(p.W,p.H),nx=n.getContext('2d'),d=nx.createImageData(p.W,p.H);for(let i=0;i<p.W*p.H;i++){d.data[i*4]=4;d.data[i*4+1]=2;d.data[i*4+2]=3;d.data[i*4+3]=nv[i]==='1'?0:255;}nx.putImageData(d,0,0);
    x.save();x.globalAlpha=ME.owner?.5:1;x.imageSmoothingEnabled=true;x.drawImage(n,0,0,p.W,p.H,0,0,p.W*CEL,p.H*CEL);x.restore();
    for(const t of tks)if(t.tipo==='pc')token(x,t,V.arr&&V.arr.k===t.k);
    if(!ME.owner&&!nv.includes('1')){x.save();x.setTransform(dpr,0,0,dpr,0,0);x.font='italic 18px "EB Garamond",serif';x.fillStyle='#c9a988';x.textAlign='center';x.textBaseline='middle';
      x.fillText('A escuridão esconde este lugar.',r.width/2,r.height/2-12);x.fillText('O Mestre revela quando vocês chegarem.',r.width/2,r.height/2+14);x.restore();}
    if(ME.owner&&FER.startsWith('nevoa')&&V.cursor){x.strokeStyle=FER==='nevoa+'?'rgba(255,220,150,.9)':'rgba(150,170,255,.9)';x.lineWidth=2*u;const h=Math.floor(PINCEL/2);x.strokeRect((V.cursor[0]-h)*CEL,(V.cursor[1]-h)*CEL,PINCEL*CEL,PINCEL*CEL);}
  }
  if(V.regua){const [a,b2]=V.regua,ax=a[0],ay=a[1],bx=b2[0],by=b2[1];x.strokeStyle='#ffd27a';x.lineWidth=3*u;x.setLineDash([8*u,6*u]);x.beginPath();x.moveTo(ax,ay);x.lineTo(bx,by);x.stroke();x.setLineDash([]);
    const cel=VISTA.nivel==='local'?CEL:null;let txt;if(cel){const q=Math.hypot(bx-ax,by-ay)/cel;txt=(Math.round(q*METROS*2)/2).toLocaleString('pt-BR')+' m';}else txt=VISTA.nivel==='cidade'?Math.round(Math.hypot(bx-ax,by-ay)*1.5)+' m':Math.round(Math.hypot(bx-ax,by-ay)*0.6)+' km';
    rotulo(x,bx,by-18*u,txt,u);}
}
function rotulo(x,X,Y,txt,u){x.font=`700 ${15*u}px Cinzel,serif`;const w=x.measureText(txt).width+14*u;x.fillStyle='rgba(20,4,4,.9)';x.fillRect(X-w/2,Y-12*u,w,22*u);x.strokeStyle='#8f1a12';x.lineWidth=1.5*u;x.strokeRect(X-w/2,Y-12*u,w,22*u);
  x.fillStyle='#fbeedd';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,X,Y);}
function pino(x,X,Y,u){const s=u*1.15;x.save();x.translate(X,Y);x.scale(s,s);x.shadowColor='rgba(0,0,0,.8)';x.shadowBlur=10;x.shadowOffsetY=4;
  x.fillStyle='#8f1a12';x.beginPath();x.moveTo(0,0);x.bezierCurveTo(-14,-18,-16,-34,0,-40);x.bezierCurveTo(16,-34,14,-18,0,0);x.fill();semSombra(x);x.strokeStyle='#fbeedd';x.lineWidth=2;x.stroke();
  x.fillStyle='#e9dcc2';x.beginPath();x.arc(0,-26,7,0,7);x.fill();x.fillStyle='#1a0505';x.fillRect(-4,-28,3,3);x.fillRect(1,-28,3,3);x.fillRect(-2,-22,4,2);
  x.font='700 13px Cinzel,serif';x.textAlign='center';const t='O grupo está aqui',w=x.measureText(t).width+12;x.fillStyle='rgba(20,4,4,.88)';x.fillRect(-w/2,6,w,20);x.fillStyle='#fbeedd';x.textBaseline='middle';x.fillText(t,0,16);x.restore();}
function selo(x,X,Y,u,txt){x.save();x.translate(X,Y);x.rotate(-.18);x.scale(u,u);x.font='900 18px Cinzel,serif';const w=x.measureText(txt).width+26;
  x.fillStyle='rgba(30,6,6,.85)';x.fillRect(-w/2,-20,w,40);x.strokeStyle='#c0281c';x.lineWidth=3;x.strokeRect(-w/2+3,-17,w-6,34);x.fillStyle='#f0d5c0';x.textAlign='center';x.textBaseline='middle';x.fillText(txt.toUpperCase(),0,1);x.restore();}
function selo_num(x,X,Y,n,u,link,sel){const r=15*u;x.save();x.shadowColor='rgba(0,0,0,.8)';x.shadowBlur=8*u;x.shadowOffsetY=3*u;x.fillStyle=sel?'#e8402b':'#8f1a12';x.beginPath();x.arc(X,Y,r,0,7);x.fill();semSombra(x);
  x.strokeStyle=link?'#f3d27a':'#fbeedd';x.lineWidth=2*u;x.stroke();x.fillStyle='#fbeedd';x.font=`900 ${16*u}px Cinzel,serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(n,X,Y+1*u);x.restore();}
function icone(x,m,sel){const X=(m.x+.5)*CEL,Y=(m.y+.5)*CEL;x.save();x.globalAlpha=m.pub?1:.8;x.fillStyle=m.tipo==='armadilha'?'rgba(120,10,6,.85)':'rgba(40,20,70,.85)';x.beginPath();x.arc(X,Y,15,0,7);x.fill();
  x.strokeStyle=sel?'#ffd27a':m.pub?'#fbeedd':'rgba(251,238,221,.6)';x.setLineDash(m.pub?[]:[4,3]);x.lineWidth=2;x.stroke();x.setLineDash([]);x.strokeStyle='#fbeedd';x.fillStyle='#fbeedd';x.lineWidth=2;
  if(m.tipo==='armadilha'){for(let k=0;k<8;k++){const a=k/8*7;x.beginPath();x.moveTo(X+Math.cos(a)*5,Y+Math.sin(a)*5);x.lineTo(X+Math.cos(a)*11,Y+Math.sin(a)*11);x.stroke();}x.beginPath();x.arc(X,Y,4,0,7);x.fill();}
  else{x.beginPath();x.ellipse(X,Y,10,6,0,0,7);x.stroke();x.beginPath();x.arc(X,Y,3,0,7);x.fill();}x.restore();}
function token(x,t,arr){const X=(t.x+.5)*CEL,Y=(t.y+.5)*CEL,r=CEL*.42;x.save();
  if(t.morto){respingo(x,rng(t.k.length*7),X,Y+3,r*1.1,'rgba(100,6,4,.75)');}
  x.globalAlpha=t.oculto?.55:1;x.shadowColor='rgba(0,0,0,.8)';x.shadowBlur=arr?16:8;x.shadowOffsetY=arr?8:3;
  x.fillStyle=t.tipo==='pc'?'#2a1210':'#3a0806';x.beginPath();x.arc(X,Y,r,0,7);x.fill();semSombra(x);
  const f=t.tipo==='pc'&&foto(t.foto);if(f){x.save();x.beginPath();x.arc(X,Y,r-3,0,7);x.clip();const s=Math.max((r*2)/f.width,(r*2)/f.height);x.drawImage(f,X-f.width*s/2,Y-f.height*s/2,f.width*s,f.height*s);x.restore();}
  else{x.fillStyle=t.tipo==='pc'?'#efdfc4':'#ffb4a0';x.font=`900 ${r*.95}px Cinzel,serif`;x.textAlign='center';x.textBaseline='middle';x.fillText((t.nome||'?')[0],X,Y+1);}
  if(t.morto){x.fillStyle='rgba(40,36,34,.72)';x.beginPath();x.arc(X,Y,r,0,7);x.fill();x.strokeStyle='#c0180d';x.lineWidth=4;x.beginPath();x.moveTo(X-r*.55,Y-r*.55);x.lineTo(X+r*.55,Y+r*.55);x.moveTo(X+r*.55,Y-r*.55);x.lineTo(X-r*.55,Y+r*.55);x.stroke();}
  x.strokeStyle=t.meu?'#f3d27a':t.tipo==='pc'?'#e4493a':'#1a0303';x.lineWidth=t.meu?4:3;if(t.oculto)x.setLineDash([5,4]);x.beginPath();x.arc(X,Y,r,0,7);x.stroke();x.setLineDash([]);
  if(t.tipo==='npc'){x.strokeStyle='#c0281c';x.lineWidth=1.5;x.beginPath();x.arc(X,Y,r-4,0,7);x.stroke();}
  if(V.cam.z>.55){x.font='600 11px "EB Garamond",serif';const nm=String(t.nome||'').split(' ')[0],w=x.measureText(nm).width+8;x.fillStyle='rgba(15,3,3,.8)';x.fillRect(X-w/2,Y+r+2,w,14);x.fillStyle='#efdfc4';x.textAlign='center';x.textBaseline='middle';x.fillText(nm,X,Y+r+9);}
  x.restore();}

// ---------- toques e arrastos ----------
function acharToken(wx,wy){if(VISTA.nivel!=='local')return null;const t=tokensDoMapa(VISTA.id).filter(t=>t.pode);for(let i=t.length-1;i>=0;i--){const X=(t[i].x+.5)*CEL,Y=(t[i].y+.5)*CEL;if(Math.hypot(wx-X,wy-Y)<CEL*.5)return t[i];}return null;}
function ligarEventos(cvs){
  cvs.addEventListener('wheel',ev=>{ev.preventDefault();const r=cvs.getBoundingClientRect();zoomEm(ev.clientX-r.left,ev.clientY-r.top,Math.exp(-ev.deltaY*.0015));},{passive:false});
  cvs.addEventListener('pointerdown',ev=>{cvs.setPointerCapture(ev.pointerId);const r=cvs.getBoundingClientRect(),px=ev.clientX-r.left,py=ev.clientY-r.top;V.ptr.set(ev.pointerId,[px,py]);
    if(V.ptr.size===2){clearTimeout(V.lp);V.arr=null;V.regua=null;const [a,b]=[...V.ptr.values()];V.modo='pinca';V.pinca={d:Math.hypot(a[0]-b[0],a[1]-b[1]),c:[(a[0]+b[0])/2,(a[1]+b[1])/2],cam:Object.assign({},V.cam)};return;}
    const [wx,wy]=mundo(px,py);V.ini={px,py,t:performance.now(),cam:Object.assign({},V.cam)};const ME=M().ME;
    if(VISTA.nivel==='mundo'&&ME.owner&&S.mapa?.grupo){const g=S.mapa.grupo;if(Math.hypot(wx-g.x*1536,wy-(g.y*1024-26))<28/V.cam.z){V.modo='pino';return;}}
    const tk=acharToken(wx,wy);if(tk&&FER==='mover'){V.modo='token';V.arr={k:tk.k,t:tk,ox:wx-(tk.x+.5)*CEL,oy:wy-(tk.y+.5)*CEL,pos:[tk.x,tk.y]};desenhar();return;}
    if(VISTA.nivel==='local'&&ME.owner&&FER.startsWith('nevoa')){V.modo='pincel';pincelar(wx,wy);return;}
    if(FER==='regua'){V.modo='regua';V.regua=[[wx,wy],[wx,wy]];return;}
    V.modo='pan';clearTimeout(V.lp);V.lp=setTimeout(()=>{if(V.modo==='pan'){V.modo='regua';V.cam=Object.assign({},V.ini.cam);const [a,b]=mundo(V.ini.px,V.ini.py);V.regua=[[a,b],[a,b]];navigator.vibrate&&navigator.vibrate(15);desenhar();}},420);});
  cvs.addEventListener('pointermove',ev=>{const r=cvs.getBoundingClientRect(),px=ev.clientX-r.left,py=ev.clientY-r.top;
    if(VISTA.nivel==='local'&&FER.startsWith('nevoa')){const [wx,wy]=mundo(px,py);V.cursor=[Math.floor(wx/CEL),Math.floor(wy/CEL)];if(!V.ptr.size)desenhar();}
    if(!V.ptr.has(ev.pointerId))return;V.ptr.set(ev.pointerId,[px,py]);
    if(V.modo==='pinca'&&V.ptr.size===2){const [a,b]=[...V.ptr.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]),c=[(a[0]+b[0])/2,(a[1]+b[1])/2],P=V.pinca;
      V.cam=Object.assign({},P.cam);V.cam.x+=c[0]-P.c[0];V.cam.y+=c[1]-P.c[1];zoomEm(c[0],c[1],d/P.d);return;}
    const I=V.ini;if(!I)return;const mov=Math.hypot(px-I.px,py-I.py);
    if(V.modo==='pan'){if(mov>6)clearTimeout(V.lp);V.cam.x=I.cam.x+(px-I.px);V.cam.y=I.cam.y+(py-I.py);desenhar();}
    else if(V.modo==='token'){const [wx,wy]=mundo(px,py),A=V.arr,p=planta(VISTA.id);A.pos=[Math.max(0,Math.min(p.W-1,Math.floor((wx-A.ox)/CEL))),Math.max(0,Math.min(p.H-1,Math.floor((wy-A.oy)/CEL)))];
      S.pend[A.t.tipo==='pc'?'tk_'+A.k:A.k]=A.pos;if(I.ref==null)I.ref=[A.t.x,A.t.y];V.regua=[[(I.ref[0]+.5)*CEL,(I.ref[1]+.5)*CEL],[(A.pos[0]+.5)*CEL,(A.pos[1]+.5)*CEL]];desenhar();}
    else if(V.modo==='pincel'){const [wx,wy]=mundo(px,py);pincelar(wx,wy);}
    else if(V.modo==='regua'){V.regua[1]=mundo(px,py);desenhar();}
    else if(V.modo==='pino'){const [wx,wy]=mundo(px,py);S.mapa=Object.assign({},S.mapa,{grupo:{x:Math.max(0,Math.min(1,wx/1536)),y:Math.max(0,Math.min(1,(wy+26)/1024))}});desenhar();}});
  const fim=ev=>{if(!V.ptr.has(ev.pointerId))return;V.ptr.delete(ev.pointerId);clearTimeout(V.lp);const I=V.ini,r=cvs.getBoundingClientRect(),px=ev.clientX-r.left,py=ev.clientY-r.top;
    if(V.modo==='pinca'){if(V.ptr.size===0)V.modo=null;else{V.modo='nada';}return;}
    if(V.modo==='pan'&&I&&Math.hypot(px-I.px,py-I.py)<7&&performance.now()-I.t<500)toque(...mundo(px,py));
    if(V.modo==='token')soltarToken();
    if(V.modo==='pincel')salvarNevoa();
    if(V.modo==='pino'){M().db.doc('publico/mapa').set(Object.assign({},S.mapa||{},{grupo:S.mapa.grupo}),{}).catch(M().fail);}
    if(V.modo==='regua'){const rg=V.regua;setTimeout(()=>{if(V.regua===rg){V.regua=null;desenhar();}},1600);}
    V.modo=null;V.ini=null;desenhar();};
  cvs.addEventListener('pointerup',fim);cvs.addEventListener('pointercancel',fim);
  cvs.addEventListener('pointerleave',()=>{V.cursor=null;desenhar();});
}
function soltarToken(){const A=V.arr;V.arr=null;V.regua=null;if(!A)return;const [nx,ny]=A.pos,t=A.t,db=M().db,id=VISTA.id;
  if(nx===t.x&&ny===t.y){delete S.pend[t.tipo==='pc'?'tk_'+t.k:t.k];return;}
  if(t.tipo==='pc'){const key='tk_'+t.k;db.doc('tokens/'+t.k).update({x:nx,y:ny}).then(()=>delete S.pend[key]).catch(e=>{delete S.pend[key];M().fail(e);desenhar();});}
  else{const c=JSON.parse(JSON.stringify(M().combM()));const n=c.lista.find(q=>q.id===t.id);if(n){n.pos={m:id,x:nx,y:ny};delete S.pend[t.k];M().saveComb(c);}}}

// névoa: pincel do Mestre
let nvT;function pincelar(wx,wy){const id=VISTA.id,p=planta(id),cx=Math.floor(wx/CEL),cy=Math.floor(wy/CEL),h=Math.floor(PINCEL/2),val=FER==='nevoa+'?'1':'0';
  const a=nevoaDe(id).split('');let mud=false;for(let y=cy-h;y<=cy-h+PINCEL-1;y++)for(let x=cx-h;x<=cx-h+PINCEL-1;x++){if(x<0||y<0||x>=p.W||y>=p.H)continue;if(a[y*p.W+x]!==val){a[y*p.W+x]=val;mud=true;}}
  if(mud){S.nevoa[id]=a.join('');S.pend['nv_'+id]=1;desenhar();clearTimeout(nvT);nvT=setTimeout(salvarNevoa,500);}}
function salvarNevoa(){clearTimeout(nvT);const id=VISTA.id;if(!id||!S.pend['nv_'+id])return;M().db.doc('nevoa/'+id).set({v:S.nevoa[id]}).then(()=>delete S.pend['nv_'+id]).catch(e=>{delete S.pend['nv_'+id];M().fail(e);});}
function nevoaAreas(id,areas,val){const p=planta(id),a=nevoaDe(id).split('');for(const [x0,y0,w,h] of areas)for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)if(x>=0&&y>=0&&x<p.W&&y<p.H)a[y*p.W+x]=val;
  S.nevoa[id]=a.join('');S.pend['nv_'+id]=1;desenhar();salvarNevoa();}

// toque simples: depende do nível
function toque(wx,wy){const ME=M().ME;
  if(VISTA.nivel==='mundo'){const u=wx/1536,v=wy/1024;let best=null,bd=9;for(const R_ of REGIOES){const d=((u-R_.x)/R_.rx)**2+((v-R_.y)/R_.ry)**2;if(d<1&&d<bd){bd=d;best=R_;}}
    if(!best)return;if(best.cidade){irPara({nivel:'cidade',id:best.cidade});return;}
    V.selo={x:wx,y:wy,txt:'Ainda não explorado',ate:performance.now()+1600};V.realce=best;setTimeout(()=>{V.realce=null;desenhar();},1600);desenhar();return;}
  if(VISTA.nivel==='cidade'){const C=CIDADES[VISTA.id];for(const P of C.pontos)if(Math.hypot(wx-P.x*CW,wy-P.y*CH)<30/V.cam.z+10){if(P.local&&SEL&&SEL.n===P.n){irPara({nivel:'local',id:P.local});return;}SEL={n:P.n};painel(true);desenhar();
      if(P.local)M().toast('Toque de novo no número para entrar.');return;}SEL=null;painel(true);desenhar();return;}
  if(VISTA.nivel==='local'){const id=VISTA.id,cx=Math.floor(wx/CEL),cy=Math.floor(wy/CEL);
    if(ME.owner&&(FER==='armadilha'||FER==='segredo')){const l=[...(S.mMarcas[id]||[])],m={id:Math.random().toString(36).slice(2,9),x:cx,y:cy,tipo:FER,nota:''};l.push(m);S.mMarcas[id]=l;SEL={marca:m.id};
      M().db.doc('mestre/marcas_'+id).set({lista:l}).catch(M().fail);FER='mover';painel(true);desenhar();return;}
    const mk=marcasDoMapa(id).find(m=>m.x===cx&&m.y===cy);if(mk){SEL={marca:mk.id};painel(true);desenhar();if(!ME.owner&&mk.nota)M().toast(mk.nota);return;}
    const sl=LOCAIS[id].salas.find(s=>Math.floor(s.x)===cx&&Math.floor(s.y)===cy&&(ME.owner||revelado(id,cx,cy)));if(sl){SEL={sala:sl.n};painel(true);desenhar();return;}
    if(SEL){SEL=null;painel(true);desenhar();}}}

// ================= painel e barra =================
const BESTIARIO=()=>[...M().DATA.inimigos,M().DATA.mercador];
let ultimoPainel='',ultimaBarra='';
function painel(forcar){const ap=$('mp-lado'),bar=$('mp-barra');if(!ap||$('mapas').hidden)return;const ME=M().ME,v=VISTA;
  // barra: trilha e ações de mesa
  const trilha=[`<button class="mp-tr" data-mp-ir="mundo">Camadas</button>`];
  if(v.nivel!=='mundo'){const cid=v.nivel==='cidade'?v.id:LOCAIS[v.id].cidade;trilha.push(`<span aria-hidden="true">›</span><button class="mp-tr" data-mp-ir="cidade:${cid}">${esc(CIDADES[cid].nome)}</button>`);}
  if(v.nivel==='local')trilha.push(`<span aria-hidden="true">›</span><b class="mp-tr-at">${esc(LOCAIS[v.id].nome)}</b>`);
  const a=S.mapa?.ativo,mostrando=a&&a.nivel===v.nivel&&(a.id||null)===(v.id||null);
  const acoes=ME.owner?`<button class="primary" data-mp="mostrar" ${mostrando?'disabled':''}>${mostrando?'Todos estão vendo':'Mostrar a todos'}</button>`
    :(a&&!mostrando?`<button class="primary" data-mp="voltar">Voltar ao mapa do Mestre</button>`:a?`<span class="hint">Vendo o mapa do Mestre</span>`:'');
  const zoom=`<span class="mp-zoom"><button data-mp="z-" aria-label="Diminuir zoom">−</button><button data-mp="z0" aria-label="Ver mapa inteiro">Inteiro</button><button data-mp="z+" aria-label="Aumentar zoom">+</button></span>`;
  const htmlBar=`<nav class="mp-trilha" aria-label="Onde você está">${trilha.join('')}</nav><div class="mp-acoes">${zoom}${acoes}</div>`;
  if(forcar||htmlBar!==ultimaBarra){bar.innerHTML=htmlBar;ultimaBarra=htmlBar;}
  const foco=document.activeElement;if(!forcar&&foco&&ap.contains(foco)&&/TEXTAREA|INPUT|SELECT/.test(foco.tagName))return;
  let h='';
  if(v.nivel==='mundo'){h=`<h2>Mapa das Camadas do Pecado</h2><p class="hint">Toque numa região para entrar. Arraste para mover e use a pinça ou a roda do mouse para o zoom. Segure e arraste para medir.</p>
    <ul class="mp-lista">${REGIOES.map(R_=>`<li><button class="mp-item" data-mp-ir="${R_.cidade?'cidade:'+R_.cidade:''}" ${R_.cidade?'':'disabled'}><b>${esc(R_.nome)}</b><small>${R_.cidade?esc(CIDADES[R_.cidade].nome):'Ainda não explorado'}</small></button></li>`).join('')}</ul>
    ${ME.owner?`<p class="hint">Mestre: arraste o marcador vermelho para onde o grupo está.${S.mapa?.grupo?'':` <button class="sm" data-mp="pino">Pôr o marcador</button>`}</p>`:''}`;}
  else if(v.nivel==='cidade'){const C=CIDADES[v.id],ms=S.mSalas[v.id]||{};const P=SEL&&C.pontos.find(p=>p.n===SEL.n);
    h=`<h2>${esc(C.titulo)}</h2><p class="mp-lema">“${esc(C.lema)}”</p><p>${esc(C.desc)}</p>
    ${P?`<section class="mp-sel"><h3>${P.n}. ${esc(P.nome)}</h3>${ME.owner?descMestre(v.id,P.n,ms):''}${P.local?`<button class="primary" data-mp-ir="local:${P.local}">Entrar</button>`:'<p class="hint">Sem mapa local.</p>'}</section>`:''}
    <ol class="mp-lista">${C.pontos.map(p=>`<li><button class="mp-item ${SEL&&SEL.n===p.n?'on':''}" data-mp-ponto="${p.n}"><span class="mp-n">${p.n}</span><b>${esc(p.nome)}</b>${p.local?'<small>mapa local</small>':''}</button></li>`).join('')}</ol>`;}
  else{const id=v.id,L=LOCAIS[id],ms=S.mSalas[id]||{},p=planta(id);
    const sl=SEL&&SEL.sala&&L.salas.find(s=>s.n===SEL.sala),mk=SEL&&SEL.marca&&marcasDoMapa(id).find(m=>m.id===SEL.marca);
    const fer=ME.owner?`<div class="mp-fer" role="group" aria-label="Ferramentas">${[['mover','Mover'],['regua','Régua'],['nevoa+','Revelar'],['nevoa-','Cobrir'],['armadilha','Armadilha'],['segredo','Segredo']].map(([k,n])=>`<button data-mp-fer="${k}" aria-pressed="${FER===k}">${n}</button>`).join('')}</div>
      ${FER.startsWith('nevoa')?`<div class="row"><span class="hint">Pincel</span>${[1,3,5].map(n=>`<button class="sm" data-mp-pincel="${n}" aria-pressed="${PINCEL===n}">${n}×${n}</button>`).join('')}<button class="sm" data-mp="tudo1">Revelar tudo</button><button class="sm" data-mp="tudo0">Cobrir tudo</button></div>`:''}
      ${FER==='armadilha'||FER==='segredo'?'<p class="hint">Toque num quadrado para marcar. Só você vê, até revelar.</p>':''}`
      :`<div class="mp-fer" role="group" aria-label="Ferramentas">${[['mover','Mover'],['regua','Régua']].map(([k,n])=>`<button data-mp-fer="${k}" aria-pressed="${FER===k}">${n}</button>`).join('')}</div>`;
    let tk='';const meus=Object.values(S.tokens).filter(t=>t.m===id);
    if(ME.owner){const naoPostos=(M().combM().lista||[]).filter(n=>n.tipo==='npc'&&(!n.pos||n.pos.m!==id));
      tk=`<h3>Fichas no mapa</h3><div class="row"><button data-mp="pcs">Pôr os condenados</button></div>
      <div class="row mp-ini"><select id="mp-bicho" aria-label="Inimigo">${BESTIARIO().map(m=>`<option value="${m.id}">${esc(m.nome)}</option>`).join('')}</select><label class="hint row"><input type="checkbox" id="mp-esc" checked> escondido</label><button data-mp="ini">Pôr inimigo</button></div>
      ${naoPostos.length?`<p class="hint">No Combate e fora deste mapa:</p><ul class="mp-lista">${naoPostos.map(n=>`<li class="row"><span>${esc(n.nome)}${n.oculto?' <small class="hint">(escondido)</small>':''}</span><button class="sm" data-mp-por="${n.id}">Pôr aqui</button></li>`).join('')}</ul>`:''}`;}
    else{const e=M().entries().find(e=>e.uid&&e.uid===ME.id);if(e&&!meus.some(t=>t.slug===e.slug))tk=`<div class="row"><button class="primary" data-mp="meu">Pôr meu condenado no mapa</button></div>`;}
    const selHtml=mk?`<section class="mp-sel"><h3>${mk.tipo==='armadilha'?'Armadilha':'Segredo'}</h3>${ME.owner?`<textarea id="mp-nota" data-mp-nota="${mk.id}" rows="2" placeholder="O que é?">${esc(mk.nota||'')}</textarea>
        <div class="row"><button class="${mk.pub?'':'primary'}" data-mp-rev="${mk.id}">${mk.pub?'Esconder de novo':'Revelar aos jogadores'}</button><button data-mp-del="${mk.id}">Apagar</button></div>`:`<p>${esc(mk.nota||'Algo está marcado aqui.')}</p>`}</section>`
      :sl?`<section class="mp-sel"><h3>${sl.n}. ${esc(sl.nome)}</h3>${ME.owner?descMestre(id,sl.n,ms)+`<div class="row"><button class="primary" data-mp-sala="${sl.n}" data-v="1">Revelar sala</button><button data-mp-sala="${sl.n}" data-v="0">Cobrir sala</button></div>`:''}</section>`:'';
    h=`<h2>${esc(L.nome)}</h2><p class="hint">${p.W}×${p.H} quadrados · 1 quadrado = 1,5 m · segure e arraste para medir</p>${fer}${selHtml}${tk}
      <h3>Legenda</h3><ol class="mp-lista">${L.salas.filter(s=>ME.owner||revelado(id,Math.floor(s.x),Math.floor(s.y))).map(s=>`<li><button class="mp-item ${SEL&&SEL.sala===s.n?'on':''}" data-mp-sala-sel="${s.n}"><span class="mp-n">${s.n}</span><b>${esc(s.nome)}</b></button></li>`).join('')||'<li class="empty">Nada descoberto ainda.</li>'}</ol>`;}
  if(forcar||h!==ultimoPainel){ap.innerHTML=h;ultimoPainel=h;}}
function descMestre(id,n,ms){return `<label class="mlabel" for="mp-desc">Só o Mestre vê</label><textarea id="mp-desc" data-mp-desc="${id}|${n}" rows="4" placeholder="Descrição para você ler na mesa">${esc(ms['s'+n]||'')}</textarea>`;}

// ações dos botões
document.addEventListener('click',ev=>{const b=ev.target.closest('#mapas button');if(!b)return;const d=b.dataset,ME=M().ME,db=M().db,id=VISTA.id;
  if(d.mpIr!==undefined){if(!d.mpIr)return;const [n,i]=d.mpIr.split(':');irPara({nivel:n,id:i||null});return;}
  if(d.mpPonto){const C=CIDADES[VISTA.id],P=C.pontos.find(p=>p.n===+d.mpPonto);SEL={n:P.n};const [bw,bh]=tamBase(),r=$('mp-tela').getBoundingClientRect();V.cam.x=r.width/2-P.x*bw*V.cam.z;V.cam.y=r.height/2-P.y*bh*V.cam.z;painel(true);desenhar();return;}
  if(d.mpSalaSel){const s=LOCAIS[id].salas.find(s=>s.n===+d.mpSalaSel);SEL={sala:s.n};const r=$('mp-tela').getBoundingClientRect();V.cam.x=r.width/2-(s.x+.5)*CEL*V.cam.z;V.cam.y=r.height/2-(s.y+.5)*CEL*V.cam.z;painel(true);desenhar();return;}
  if(d.mpFer){FER=d.mpFer;V.regua=null;painel(true);desenhar();return;}
  if(d.mpPincel){PINCEL=+d.mpPincel;painel(true);return;}
  if(d.mpSala){const s=LOCAIS[id].salas.find(s=>s.n===+d.mpSala);nevoaAreas(id,s.areas,d.v);return;}
  if(d.mpRev){const l=marcasDoMapa(id),m=l.find(q=>q.id===d.mpRev);const pub=(S.marcas[id]||[]).filter(q=>q.id!==m.id);if(!m.pub)pub.push({id:m.id,x:m.x,y:m.y,tipo:m.tipo,nota:m.nota||''});
    db.doc('marcas/'+id).set({lista:pub}).then(()=>M().toast(m.pub?'Marcação escondida.':'Marcação revelada aos jogadores.')).catch(M().fail);return;}
  if(d.mpDel){const l=(S.mMarcas[id]||[]).filter(q=>q.id!==d.mpDel);S.mMarcas[id]=l;SEL=null;db.doc('mestre/marcas_'+id).set({lista:l}).catch(M().fail);
    if((S.marcas[id]||[]).some(q=>q.id===d.mpDel))db.doc('marcas/'+id).set({lista:(S.marcas[id]||[]).filter(q=>q.id!==d.mpDel)}).catch(M().fail);painel(true);desenhar();return;}
  if(d.mpPor){const c=JSON.parse(JSON.stringify(M().combM())),n=c.lista.find(q=>q.id===d.mpPor),[cx,cy]=centroLivre();if(n){n.pos={m:id,x:cx,y:cy};M().saveComb(c);}return;}
  const a=d.mp;
  if(a==='z+'||a==='z-'){const r=$('mp-tela').getBoundingClientRect();zoomEm(r.width/2,r.height/2,a==='z+'?1.35:1/1.35);return;}
  if(a==='z0'){V.ajustado=null;ajustar(true);desenhar();return;}
  if(a==='mostrar'){db.doc('publico/mapa').set(Object.assign({},S.mapa||{},{ativo:{nivel:VISTA.nivel,id:VISTA.id||null}})).then(()=>M().toast('Todos estão vendo: '+nomeVista(VISTA)+'.')).catch(M().fail);return;}
  if(a==='voltar'){SEGUIR=true;irPara(S.mapa.ativo,true);try{localStorage.setItem('mesa-mapa-seguir','1');}catch(e){}return;}
  if(a==='pino'){db.doc('publico/mapa').set(Object.assign({},S.mapa||{},{grupo:{x:.5,y:.5}})).catch(M().fail);return;}
  if(a==='tudo1'||a==='tudo0'){const p=planta(id);nevoaAreas(id,[[0,0,p.W,p.H]],a==='tudo1'?'1':'0');return;}
  if(a==='pcs'){const es=M().entries();es.forEach((e,i)=>{const k=id+'__'+e.slug,ex=S.tokens[k],[cx,cy]=ex?[ex.x,ex.y]:centroLivre(i);db.doc('tokens/'+k).set({m:id,slug:e.slug,uid:e.uid||null,x:cx,y:cy}).catch(M().fail);});return;}
  if(a==='meu'){const e=M().entries().find(e=>e.uid&&e.uid===ME.id);if(!e)return;const [cx,cy]=centroLivre();db.doc('tokens/'+id+'__'+e.slug).set({m:id,slug:e.slug,uid:ME.id,x:cx,y:cy}).catch(M().fail);return;}
  if(a==='ini'){const m=BESTIARIO().find(q=>q.id===$('mp-bicho').value),c=JSON.parse(JSON.stringify(M().combM())),same=c.lista.filter(q=>q.ref===m.id).length,[cx,cy]=centroLivre();
    c.lista.push({id:M().uidGen(),tipo:'npc',ref:m.id,nome:m.nome+(same?' '+(same+1):''),vida:m.vida,vidaMax:m.vida,arm:m.arm||0,oculto:$('mp-esc').checked,pos:{m:id,x:cx,y:cy}});c.ativo=true;M().saveComb(c);M().toast(m.nome+' no mapa e no Combate.');return;}
});
let dsT={};document.addEventListener('input',ev=>{const t=ev.target;if(!t.closest||!t.closest('#mapas'))return;const db=M().db;
  if(t.dataset.mpDesc){const [id,n]=t.dataset.mpDesc.split('|');S.mSalas[id]=Object.assign({},S.mSalas[id],{['s'+n]:t.value});clearTimeout(dsT[id+n]);dsT[id+n]=setTimeout(()=>db.doc('mestre/salas_'+id).set({['s'+n]:t.value},{merge:true}).catch(M().fail),600);}
  if(t.dataset.mpNota){const id=VISTA.id,l=(S.mMarcas[id]||[]).map(m=>m.id===t.dataset.mpNota?Object.assign({},m,{nota:t.value}):m);S.mMarcas[id]=l;clearTimeout(dsT.nota);dsT.nota=setTimeout(()=>db.doc('mestre/marcas_'+id).set({lista:l}).catch(M().fail),600);}});
function centroLivre(i=0){const id=VISTA.id,p=planta(id),r=$('mp-tela').getBoundingClientRect(),[wx,wy]=mundo(r.width/2,r.height/2);let cx=Math.floor(wx/CEL),cy=Math.floor(wy/CEL);
  const ocup=new Set(tokensDoMapa(id).map(t=>t.x+','+t.y));const ok=(x,y)=>x>=0&&y>=0&&x<p.W&&y<p.H&&!ehParede(p.g[y][x])&&p.g[y][x]!=='o'&&!ocup.has(x+','+y);
  for(let raio=0;raio<12;raio++)for(let dy=-raio;dy<=raio;dy++)for(let dx=-raio;dx<=raio;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==raio)continue;if(ok(cx+dx,cy+dy)){if(i-->0){ocup.add((cx+dx)+','+(cy+dy));continue;}return [cx+dx,cy+dy];}}return [Math.max(0,cx),Math.max(0,cy)];}

// ================= montagem da aba =================
let montado=false;
function montar(){const s=$('mapas');if(montado)return;montado=true;
  s.innerHTML=`<div class="mp-barra" id="mp-barra"></div><div class="mp-corpo"><div class="mp-palco" id="mp-palco"><canvas id="mp-tela" aria-label="Mapa"></canvas><p class="mp-gerando">Desenhando o mapa…</p></div><aside class="mp-lado panel" id="mp-lado"></aside></div>`;
  ligarEventos($('mp-tela'));new ResizeObserver(()=>{desenhar();}).observe($('mp-palco'));}
function mostrar(){montar();if(!M().ME.owner&&SEGUIR&&S.mapa?.ativo){const a=S.mapa.ativo;if(a.nivel!==VISTA.nivel||(a.id||null)!==(VISTA.id||null)){irPara(a,true);return;}}
  if(VISTA.id)assinarMestre(VISTA.id);if(!baseAtual())carregarBase();painel();desenhar();}
return {iniciar,mostrar,atualizar:()=>{if(!$('mapas')||$('mapas').hidden)return;painel();desenhar();},_dev:{LOCAIS,CIDADES,planta,desenharLocal,desenharCidade,V,S,toque}};
})();
