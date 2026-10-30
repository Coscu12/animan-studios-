"""Build story/shots.json: each shot starts 0.15 s before its anchor phrase (searched in order in timeline/words.json)."""
import json, re, unicodedata
W = json.load(open('timeline/words.json'))['words']
norm = lambda s: re.sub(r'[^\w]+', '', s.lower())
NW = [norm(w['word']) for w in W]
old = {s['id']: s for s in json.load(open('../cerebro-sobreestimulado/story/shots.json'))['shots']}
D = 664.5
def P(tpl, **kw): kw['tpl'] = tpl; return kw
def B(n): return ('b%02d' % n, None)
CH = lambda lines, bg: P('chapter', lines=lines, bg=bg)
PLAN = [
 # ---------------- HOOK ----------------
 ('h01', 'Tomas el teléfono', P('grab', mode='grab', reachAt=0.1), {'in': {'type': 'fade', 'dur': 0.5}, 'sfx': [{'at': 0.9, 'name': 'tick', 'gain': -14}]}),
 ('h02', 'No sabes por', P('face', ex=[[0, 'confused'], ['nadie', 'thinking']], look=[0.4, 0.5]), {'bars': 'scope'}),
 ('h03', 'Simplemente', P('grab', mode='grab', reachAt=0.6), {}),
 ('h04', 'Desbloqueas', P('screen', mode='unlock', at='desbloqueas'), {'sfx': [{'at': 0.3, 'name': 'blip', 'gain': -14}]}),
 ('h05', 'Un video', P('screen', mode='cards', cards=[['video', 0], ['otro', 1], ['más', 2]]), {'sfx': [{'at': 0.1, 'name': 'swish', 'gain': -14}, {'at': 0.9, 'name': 'swish', 'gain': -14}, {'at': 1.6, 'name': 'swish', 'gain': -14}]}),
 ('h06', 'Y cuando por fin', P('room', ex=[[0, 'neutral'], ['vista', 'shocked']], look=[1, -0.2], badge='+40 MIN', badgeAt='cuarenta'), {'sfx': [{'at': 2.6, 'name': 'clock', 'gain': -12}], 'amb': {'name': 'roomtone', 'gain': -26}}),
 ('h07', 'Te sientas', P('desk', mood='golden', ex=[[0, 'determined']]), {'in': {'type': 'dip', 'dur': 0.4}, 'amb': {'name': 'roomtone', 'gain': -26}}),
 ('h08', 'Y tu mente', P('desk', mood='golden', expr='sleepy', pose='think', think=0.3), {}),
 ('h09', 'Abres una', P('laptop', mood='golden', tabs=[[0, 'DOCUMENTO', 0], ['pestaña', 'VIDEO', 1], ['otra', 'TIENDA', 2], ['revisas', 'CORREO', 3], ['revisar', 'CORREO', 3]]), {'sfx': [{'at': 0.6, 'name': 'pop', 'gain': -14}, {'at': 1.6, 'name': 'pop', 'gain': -14}]}),
 ('h10', 'Y al final', P('desk', mood='dusk', pose='facepalm', expr='sad', clock='19:47'), {'amb': {'name': 'roomtone', 'gain': -26}}),
 ('h11', 'Algo está mal', P('face', bg='room', phone=False, expr='sad', text='"ALGO ESTÁ MAL CONMIGO"', textColor='cream', textAt='algo'), {'bars': 'scope'}),
 ('h12', 'Quiero que', P('face', bg='room', phone=False, ex=[[0, 'sad'], ['atención', 'surprised']], look=[0, 0]), {'bars': 'scope'}),
 ('h13', 'No hay nada', P('brainState', mode='intact', label='NO ESTÁ ROTO', labelAt='roto', labelColor='gold'), {'in': {'type': 'zoom', 'dur': 0.4}, 'bars': 'none', 'sfx': [{'at': 0.4, 'name': 'shimmer', 'gain': -12}]}),
 ('h14', 'Está sobreestimulado', P('brainState', mode='overload', label='SOBREESTIMULADO', labelColor='accent', labelAt=0.1), {'bars': 'none', 'sfx': [{'at': 0.0, 'name': 'glitch', 'gain': -8}]}),
 ('h15', 'Y en los próximos', CH(['TU CEREBRO NO ESTÁ ROTO', 'ESTÁ SOBREESTIMULADO'], 'room'), {'bars': 'scope', 'in': {'type': 'flash', 'dur': 0.3}, 'sfx': [{'at': 0.2, 'name': 'impact', 'gain': -8}]}),
 # ---------------- PART 1 ----------------
 ('c1', 'El cerebro que', CH(['PARTE 1', 'EL CEREBRO QUE HEREDASTE'], 'sabana'), {'bars': 'scope', 'in': {'type': 'dip', 'dur': 0.6}, 'amb': {'name': 'wind', 'gain': -26}}),
 B(2) + ('Empecemos',), B(3) + ('Tu cerebro fue',), B(4) + ('Durante cientos',), B(5) + ('La comida',), B(6) + ('La información',), B(7) + ('Las novedades',), B(8) + ('Encontrar',),
 B(9) + ('Escuchar',), B(10) + ('Y para que',), B(11) + ('tu cerebro desarrolló',), B(12) + ('Ese sistema',), B(13) + ('Se llama',), B(14) + ('Durante mucho',), B(15) + ('Pero la ciencia',),
 B(16) + ('El neurocientífico',), B(17) + ('distinguió',), B(18) + ('Y descubrió',), B(19) + ('Al deseo',), B(20) + ('A la anticipación',), B(21) + ('La dopamina no',), B(22) + ('Es la promesa',),
 B(23) + ('Es la voz',), B(24) + ('Algo bueno',), B(25) + ('Wolfram',), B(26) + ('observó',), B(27) + ('reaccionan',), B(28) + ('Cuando una recompensa',), B(29) + ('Cuando ya sabes',), B(30) + ('En otras',),
 B(31) + ('tu cerebro es adicto',), B(32) + ('Y eso en la',), B(33) + ('Hoy',),
 # ---------------- PART 2: la máquina de la sorpresa ----------------
 ('c2', 'La máquina de', CH(['PARTE 2', 'LA MÁQUINA DE LA SORPRESA'], 'room'), {'bars': 'scope', 'in': {'type': 'dip', 'dur': 0.6}, 'sfx': [{'at': 0.3, 'name': 'shimmer', 'gain': -12}]}),
 ('m01', 'Ahora piensa', P('room', expr='thinking', look=[0.6, 0.7]), {'amb': {'name': 'roomtone', 'gain': -26}}),
 ('m02', 'Cada vez que lo desbloqueas', P('screen', mode='unlock', at='desbloqueas', q=True), {'sfx': [{'at': 0.5, 'name': 'blip', 'gain': -14}]}),
 ('m03', 'Quizás un mensaje', P('screen', mode='notif', at=0.2), {'sfx': [{'at': 0.2, 'name': 'phonebuzz', 'gain': -12}]}),
 ('m04', 'Quizás nada', P('screen', mode='empty'), {}),
 ('m05', 'Quizás un video', P('face', ex=[[0, 'joy']], look=[0.3, 0.6]), {'bars': 'scope'}),
 ('m06', 'Quizás una notificación', P('face', ex=[[0, 'neutral'], ['inquieta', 'worried']], look=[0.3, 0.6]), {'bars': 'scope', 'sfx': [{'at': 0.6, 'name': 'phonebuzz', 'gain': -14}]}),
 ('m07', 'Esa incertidumbre', P('bigText', lines=[['incertidumbre', 'INCERTIDUMBRE', 'gold'], ['accidente', 'NO ES UN ACCIDENTE', 'accent', 60]]), {'bars': 'none', 'sfx': [{'at': 0.4, 'name': 'stinger', 'gain': -10}]}),
 ('m08', 'En el siglo', P('lab', who='SKINNER', name='B. F. SKINNER', role='PSICÓLOGO · SIGLO XX', nameAt='skinner'), {'in': {'type': 'dip', 'dur': 0.4}, 'amb': {'name': 'roomtone', 'gain': -26}}),
 ('m09', 'Y encontró', P('skinner', aveces='veces'), {'bars': 'none', 'sfx': [{'at': 0.7, 'name': 'pop', 'gain': -14}, {'at': 2.3, 'name': 'pop', 'gain': -14}, {'at': 5.2, 'name': 'pop', 'gain': -14}]}),
 ('m10', 'el comportamiento', P('persist'), {'bars': 'none'}),
 ('m11', 'Es el mismo principio', P('slot'), {'bars': 'none', 'sfx': [{'at': 0.2, 'name': 'counter', 'gain': -16}]}),
 ('m12', 'Se llama refuerzo', P('bigText', lines=[['refuerzo', 'REFUERZO', 'gold'], ['intermitente', 'INTERMITENTE', 'gold']]), {'bars': 'scope', 'in': {'type': 'flash', 'dur': 0.3}, 'sfx': [{'at': 0.2, 'name': 'impact', 'gain': -8}]}),
 ('m13', 'Y ahora vive', P('screen', mode='slot', at=0.1, label='EN TU BOLSILLO', labelAt='bolsillo'), {'sfx': [{'at': 0.1, 'name': 'counter', 'gain': -16}]}),
 ('m14', 'Deslizar hacia', P('screen', mode='pull'), {'sfx': [{'at': 0.4, 'name': 'swish', 'gain': -14}]}),
 ('m15', 'El siguiente video', P('screen', mode='autoplay'), {'sfx': [{'at': 0.2, 'name': 'tick', 'gain': -16}]}),
 ('m16', 'El contador', P('screen', mode='likes'), {'sfx': [{'at': 0.3, 'name': 'counter', 'gain': -16}]}),
 ('m17', 'Cada gesto', P('bigText', lines=[['gesto', 'CADA GESTO', 'cream'], ['palanca', '= UNA PALANCA', 'gold']]), {'bars': 'none'}),
 ('m18', 'No es que tú', P('face', phone=False, ex=[[0, 'sad'], ['débil', 'neutral']]), {'bars': 'scope'}),
 ('m19', 'Es que compites', P('vs'), {'bars': 'none', 'sfx': [{'at': 4.5, 'name': 'counter', 'gain': -16}]}),
 ('m20', 'Tú tienes fuerza', P('versus'), {'bars': 'none'}),
 ('m21', 'Esa no es una', P('bigText', lines=[['pelea', 'NO ES UNA', 'cream'], ['justa', 'PELEA JUSTA', 'accent']]), {'bars': 'scope'}),
 ('m22', 'Y entenderlo', P('face', phone=False, ex=[[0, 'neutral'], ['paso', 'smile']], sparkle='culparte'), {'bars': 'scope', 'sfx': [{'at': 1.4, 'name': 'shimmer', 'gain': -14}]}),
 # ---------------- PART 3: atención ----------------
 ('c3', 'Lo que esto le', CH(['PARTE 3', 'LO QUE ESTO LE HACE A TU ATENCIÓN'], 'room'), {'bars': 'scope', 'in': {'type': 'dip', 'dur': 0.6}}),
 ('a01', 'Pero hay algo', P('room', expr='sleepy', z0=1.0, z1=1.1), {'amb': {'name': 'roomtone', 'gain': -26}}),
 ('a02', 'La psiquiatra', P('lab', who='LEMBKE', name='ANNA LEMBKE', role='PSIQUIATRA · STANFORD', nameAt='anna'), {'in': {'type': 'dip', 'dur': 0.4}}),
 ('a03', 'describe el sistema', P('balance', mode='level'), {'bars': 'none'}),
 ('a04', 'Cuando recibes', P('balance', mode='tilt', at='placentero'), {'bars': 'none', 'sfx': [{'at': 1.2, 'name': 'ding', 'gain': -12}]}),
 ('a05', 'Y tu cerebro que busca', P('balance', mode='push', at='empuja'), {'bars': 'none', 'sfx': [{'at': 2.5, 'name': 'whoosh', 'gain': -14}]}),
 ('a06', 'Si eso ocurre', P('balance', mode='reset'), {'bars': 'none'}),
 ('a07', 'Pero si ocurre', P('balance', mode='flood'), {'bars': 'none', 'sfx': [{'at': 0.3, 'name': 'counter', 'gain': -16}]}),
 ('a08', 'tu cerebro empieza a compensar', P('balance', mode='stuck', at='compensar'), {'bars': 'none'}),
 ('a09', 'El resultado', P('face', ex=[[0, 'neutral'], ['aburrido', 'sleepy']], phone=False), {'bars': 'scope'}),
 ('a10', 'Leer un libro', P('room', prop='paper', expr='sleepy', look=[0.6, 0.8], mood='golden'), {}),
 ('a11', 'Una conversación', P('table', mode='talk', ex=[[0, 'sleepy']]), {'amb': {'name': 'murmur', 'gain': -28}}),
 ('a12', 'Trabajar en una sola', P('desk', mood='golden', pose='facepalm', expr='worried'), {}),
 ('a13', 'No porque esas', P('balance', mode='reference'), {'bars': 'none'}),
 ('a14', 'La investigadora Gloria', P('lab', who='MARK', name='GLORIA MARK', role='UNIVERSIDAD DE CALIFORNIA, IRVINE', nameAt='gloria', monitor=True), {'in': {'type': 'dip', 'dur': 0.4}}),
 ('a15', 'lleva unos veinte', P('switcher'), {'bars': 'none', 'sfx': [{'at': 0.2, 'name': 'clock', 'gain': -16}]}),
 ('a16', 'A principios', P('attn', mode=1, at1='promedio'), {'bars': 'none', 'sfx': [{'at': 1.6, 'name': 'counter', 'gain': -16}]}),
 ('a17', 'En sus mediciones', P('attn', mode=2, at2='cuarenta'), {'bars': 'none', 'sfx': [{'at': 2.1, 'name': 'impact', 'gain': -10}]}),
 ('a18', 'Cuarenta y siete segundos Y', P('bigText', lines=[[0.1, '47 SEGUNDOS', 'accent', 140]]), {'bars': 'scope', 'in': {'type': 'flash', 'dur': 0.3}}),
 ('a19', 'Y lo más revelador', P('desk', mood='golden', poses=[[0, 'typing'], ['vienen', 'grabPhone']], expr='neutral', phone=True), {}),
 ('a20', 'Vienen de nosotros', P('face', ex=[[0, 'smirk'], ['solos', 'confused']], phone=True), {'bars': 'scope'}),
 ('a21', 'Y cada salto', P('residue', mode='jump', at='costo'), {'bars': 'none', 'sfx': [{'at': 1.6, 'name': 'hit', 'gain': -14}]}),
 ('a22', 'La investigadora Sophie', P('lab', who='LEROY', name='SOPHIE LEROY', role='INVESTIGADORA', nameAt='sophie'), {'in': {'type': 'dip', 'dur': 0.4}}),
 ('a23', 'residuo de atención Cuando', P('bigText', lines=[['residuo', 'RESIDUO', 'gold'], ['atención', 'DE ATENCIÓN', 'gold']]), {'bars': 'scope'}),
 ('a24', 'Cuando pasas', P('residue', mode='stick', labelAt='atrapada'), {'bars': 'none'}),
 ('a25', 'Revisas un mensaje', P('desk', mood='golden', poses=[[0, 'grabPhone'], ['vuelves', 'typing']], phone=True, expr='neutral'), {'sfx': [{'at': 0.3, 'name': 'phonebuzz', 'gain': -14}]}),
 ('a26', 'pero no vuelves', P('desk', mood='golden', expr='confused', ghost=0.2, phone=True), {}),
 ('a27', 'Ahora multiplica', P('residue', mode='many'), {'bars': 'none', 'sfx': [{'at': 0.3, 'name': 'counter', 'gain': -14}]}),
 ('a28', 'Por eso terminas', P('desk', mood='night', pose='sad', expr='sleepy', clock='23:10', lit=0.5), {'amb': {'name': 'roomtone', 'gain': -26}}),
 ('a29', 'No es que hayas', P('desk', mood='golden', expr='determined'), {}),
 ('a30', 'Es que te fragmentaste', P('fragment'), {'bars': 'none', 'sfx': [{'at': 0.3, 'name': 'glitch', 'gain': -10}]}),
 ('a31', 'Tu atención aprendió', P('residue', mode='jump', at=99), {'bars': 'none'}),
 ('a32', 'Y lo que se aprende', P('brainState', mode='plastic', label='SE PUEDE DESAPRENDER', labelAt='desaprender', labelColor='gold'), {'bars': 'none', 'sfx': [{'at': 1.4, 'name': 'shimmer', 'gain': -12}]}),
 # ---------------- PART 4: la buena noticia ----------------
 ('c4', 'La buena noticia', CH(['PARTE 4', 'LA BUENA NOTICIA'], 'dawn'), {'bars': 'scope', 'in': {'type': 'dip', 'dur': 0.6}, 'sfx': [{'at': 0.3, 'name': 'shimmer', 'gain': -10}]}),
 ('n01', 'Aquí está la parte', P('face', bg='dawn', ex=[[0, 'thinking'], ['dice', 'surprised']], phone=False), {'bars': 'scope'}),
 ('n02', 'Tu cerebro es plástico', P('brainState', mode='plastic', label='PLÁSTICO', labelAt='plástico', labelColor='gold'), {'bars': 'none'}),
 ('n03', 'Si durante años', P('brainState', mode='fast', label='RÁPIDOS · CONSTANTES · IMPREDECIBLES', labelAt='rápidos', labelColor='accent'), {'bars': 'none'}),
 ('n04', 'Y si empiezas', P('brainState', mode='slow', label='TAMBIÉN SE AJUSTARÁ', labelAt='también', labelColor='gold'), {'bars': 'none'}),
 ('n05', 'No en un día', P('calendar', days=28), {'bars': 'none'}),
 ('n06', 'No necesitas huir', P('nope', mode='mountain', xAt='montaña'), {'bars': 'none', 'sfx': [{'at': 1.4, 'name': 'hit', 'gain': -14}]}),
 ('n07', 'No necesitas tirar', P('nope', mode='river', xAt='río'), {'bars': 'none', 'sfx': [{'at': 1.6, 'name': 'hit', 'gain': -14}]}),
 ('n08', 'Necesitas bajar', P('volume', text='BAJAR EL VOLUMEN', at='bajar'), {'bars': 'none'}),
 ('n09', 'Déjame darte', P('bigText', lines=[['cinco', '5 FORMAS', 'gold', 120]], bg='dawn'), {'bars': 'scope'}),
 # ---------------- PART 5: cinco formas ----------------
 ('c5', 'Cinco formas de recuperar', CH(['PARTE 5', 'CINCO FORMAS DE RECUPERAR TU MENTE'], 'dawn'), {'bars': 'scope', 'in': {'type': 'dip', 'dur': 0.5}}),
 ('t1', 'Uno', P('tip', n=1, title=['AUMENTA', 'LA FRICCIÓN'], titleAt='aumenta'), {'bars': 'none', 'in': {'type': 'flash', 'dur': 0.3}, 'sfx': [{'at': 0.1, 'name': 'impact', 'gain': -10}]}),
 ('t1a', 'Las distracciones que ganan', P('friction', at='difíciles'), {'bars': 'none'}),
 ('t1b', 'Saca las aplicaciones', P('screen', mode='apps', remove=[1, 4, 6, 9, 14], at='adictivas', mood='golden'), {'sfx': [{'at': 1.4, 'name': 'pop', 'gain': -14}]}),
 ('t1c', 'Cierra sesión', P('screen', mode='logout', at=0.2, mood='golden'), {'sfx': [{'at': 1.2, 'name': 'blip', 'gain': -14}]}),
 ('t1d', 'Deja el teléfono en otra', P('desk', mood='golden', door=True, expr='determined'), {}),
 ('t1e', 'No dependas', P('plan'), {'bars': 'none'}),
 ('t2', 'Dos', P('tip', n=2, title=['REDUCE EL RUIDO', 'DE ENTRADA'], titleAt='reduce'), {'bars': 'none', 'in': {'type': 'flash', 'dur': 0.3}, 'sfx': [{'at': 0.1, 'name': 'impact', 'gain': -10}]}),
 ('t2a', 'Desactiva todas', P('screen', mode='toggles', at=0.5, mood='golden'), {'sfx': [{'at': 0.5, 'name': 'tick', 'gain': -14}, {'at': 1.2, 'name': 'tick', 'gain': -14}, {'at': 1.9, 'name': 'tick', 'gain': -14}]}),
 ('t2b', 'Cada sonido', P('screen', mode='badges', keys=[['sonido', 4], ['vibración', 2], ['globo', 0], ['promesa', 1], ['arranca', 3]], label='', mood='golden'), {'sfx': [{'at': 0.1, 'name': 'phonebuzz', 'gain': -14}]}),
 ('t2c', 'Tú decides', P('face', bg='dawn', phone=False, ex=[[0, 'determined']], text='TÚ DECIDES', textAt='decides'), {'bars': 'scope'}),
 ('t3', 'Tres', P('tip', n=3, title=['PRACTICA', 'EL ABURRIMIENTO'], titleAt='practica'), {'bars': 'none', 'in': {'type': 'flash', 'dur': 0.3}, 'sfx': [{'at': 0.1, 'name': 'impact', 'gain': -10}]}),
 ('t3a', 'Suena extraño', P('face', bg='dawn', phone=False, ex=[[0, 'confused'], ['poderoso', 'smirk']]), {'bars': 'scope'}),
 ('t3b', 'Haz una fila', P('queue', ex=[[0, 'neutral']]), {'amb': {'name': 'murmur', 'gain': -28}}),
 ('t3c', 'Camina diez', P('walk', badge='10 MIN'), {'amb': {'name': 'wind', 'gain': -26}}),
 ('t3d', 'Come sin', P('table', mode='eat', mood='interiorWarm'), {}),
 ('t3e', 'Al principio será', P('face', bg='dawn', phone=False, ex=[[0, 'nervous']], sweat=True), {'bars': 'scope'}),
 ('t3f', 'Sentirás el impulso', P('grab', mode='twitch', mood='golden'), {'sfx': [{'at': 0.3, 'name': 'heartbeat', 'gain': -12}]}),
 ('t3g', 'Obsérvala', P('face', bg='dawn', phone=False, ex=[[0, 'neutral'], ['obedezcas', 'determined']], text='NO LA OBEDEZCAS', textAt='obedezcas'), {'bars': 'scope'}),
 ('t3h', 'Cada vez que resistes', P('brainState', mode='calm', label='LA CALMA NO ES UNA AMENAZA', labelAt='calma', labelColor='gold'), {'bars': 'none', 'sfx': [{'at': 0.3, 'name': 'shimmer', 'gain': -12}]}),
 ('t4', 'Cuatro', P('tip', n=4, title=['ENTRENA LA ATENCIÓN', 'COMO UN MÚSCULO'], titleAt='entrena'), {'bars': 'none', 'in': {'type': 'flash', 'dur': 0.3}, 'sfx': [{'at': 0.1, 'name': 'impact', 'gain': -10}]}),
 ('t4a', 'Elige una sola', P('desk', mood='golden', expr='determined'), {}),
 ('t4b', 'Pon un temporizador', P('timer'), {'bars': 'none', 'sfx': [{'at': 0.4, 'name': 'clock', 'gain': -14}]}),
 ('t4c', 'Cuando tu mente se escape', P('timer', mode='wander', at='escape', backAt='regrésala'), {'bars': 'none'}),
 ('t4d', 'Ese regreso', P('gym'), {'bars': 'none', 'sfx': [{'at': 0.8, 'name': 'hit', 'gain': -16}, {'at': 2.5, 'name': 'hit', 'gain': -16}]}),
 ('t4e', 'Con el tiempo alarga', P('blocks'), {'bars': 'none', 'sfx': [{'at': 2.2, 'name': 'pop', 'gain': -14}, {'at': 3.6, 'name': 'pop', 'gain': -14}, {'at': 5.3, 'name': 'pop', 'gain': -14}]}),
 ('t5', 'Cinco Cambia', P('tip', n=5, title=['DOPAMINA RÁPIDA', '→ DOPAMINA LENTA'], titleAt='cambia'), {'bars': 'none', 'in': {'type': 'flash', 'dur': 0.3}, 'sfx': [{'at': 0.1, 'name': 'impact', 'gain': -10}]}),
 ('t5a', 'No se trata de eliminar', P('face', bg='dawn', phone=False, ex=[[0, 'thinking'], ['elegir', 'smile']]), {'bars': 'scope'}),
 ('t5b', 'Hay placeres', P('curves', fast=True, mode='fast', title='PLACER RÁPIDO'), {'bars': 'none'}),
 ('t5c', 'Y hay otros', P('curves', fast=True, slow=True, mode='slow', title='PLACER LENTO'), {'bars': 'none'}),
 ('t5d', 'Hacer ejercicio', P('montage'), {'bars': 'none', 'sfx': [{'at': 0.2, 'name': 'pop', 'gain': -14}, {'at': 1.4, 'name': 'pop', 'gain': -14}, {'at': 2.9, 'name': 'pop', 'gain': -14}, {'at': 4.3, 'name': 'pop', 'gain': -14}]}),
 ('t5e', 'Esos placeres', P('dawn', pose='cheer', ex=[[0, 'smile'], ['construyen', 'joy']]), {'sfx': [{'at': 1.5, 'name': 'shimmer', 'gain': -12}]}),
 # ---------------- PART 6: lo que vas a sentir ----------------
 ('c6', 'Lo que vas a sentir', CH(['PARTE 6', 'LO QUE VAS A SENTIR'], 'dawn'), {'bars': 'scope', 'in': {'type': 'dip', 'dur': 0.5}}),
 ('l01', 'Imagina a alguien', P('desk', who='LUCIA', mood='golden', expr='smile', badge='LUCÍA · 32 AÑOS', badgeAt='lucía'), {'amb': {'name': 'roomtone', 'gain': -26}}),
 ('l02', 'Cada mañana', P('desk', who='LUCIA', mood='golden', expr='determined', clock='8:30'), {}),
 ('l03', 'Pero primero revisa', P('laptop', mood='golden', tabs=[[0, 'PROYECTO', 0], ['correo', 'CORREO', 3], ['mensaje', 'MENSAJES', 1], ['redes', 'REDES', 2]]), {'sfx': [{'at': 0.7, 'name': 'pop', 'gain': -14}, {'at': 2.3, 'name': 'pop', 'gain': -14}, {'at': 4.0, 'name': 'pop', 'gain': -14}]}),
 ('l04', 'Al mediodía', P('desk', who='LUCIA', mood='golden', pose='facepalm', expr='sad', clock='12:00'), {'sfx': [{'at': 0.3, 'name': 'clock', 'gain': -14}]}),
 ('l05', 'Una semana decide', P('kitchen', putAt='cocina'), {'amb': {'name': 'roomtone', 'gain': -26}}),
 ('l06', 'El primer día', P('desk', who='LUCIA', mood='golden', expr='nervous', look=[-1, 0], badge='DÍA 1', door=True), {}),
 ('l07', 'Se levanta dos', P('kitchen', putAt=99, badge='DÍA 1'), {}),
 ('l08', 'El tercer día', P('desk', who='LUCIA', mood='golden', expr='neutral', badge='DÍA 3', meter=[0.8, 0.25], meterLabel='ANSIEDAD'), {}),
 ('l09', 'Al final de la semana', P('desk', who='LUCIA', mood='golden', poses=[[0, 'typing'], ['días', 'cheer']], ex=[[0, 'determined'], ['días', 'joy']], badge='DÍA 7', progress=1.0, progressLabel='PROYECTO'), {'sfx': [{'at': 3.4, 'name': 'ding', 'gain': -10}]}),
 ('l10', 'No cambió su talento', P('checklist'), {'bars': 'none', 'sfx': [{'at': 0.3, 'name': 'hit', 'gain': -16}, {'at': 1.8, 'name': 'hit', 'gain': -16}, {'at': 3.6, 'name': 'ding', 'gain': -10}]}),
 ('l11', 'Y su cerebro respondió', P('brainState', mode='calm'), {'bars': 'none', 'sfx': [{'at': 0.3, 'name': 'powerup', 'gain': -12}]}),
 ('s01', 'Ahora quiero ser', P('face', bg='dawn', phone=False, ex=[[0, 'neutral']]), {'bars': 'scope', 'in': {'type': 'dip', 'dur': 0.4}}),
 ('s02', 'Los primeros días', P('room', mood='golden', prop=None, ex=[[0, 'neutral'], ['inquieto', 'nervous'], ['aburrido', 'sleepy'], ['irritable', 'angry']], look=[1, 0]), {}),
 ('s03', 'Eso no significa', P('balance', mode='return', at='balanza'), {'bars': 'none'}),
 ('s04', 'Y luego poco', P('dawn', expr='smile', z0=1.0, z1=1.1), {'amb': {'name': 'wind', 'gain': -30}}),
 ('s05', 'Un día notas', P('room', mood='golden', prop='paper', expr='smile', look=[0.6, 0.8], badge='10 PÁGINAS', badgeAt='diez'), {'sfx': [{'at': 1.5, 'name': 'ding', 'gain': -14}]}),
 ('s06', 'Otro día terminas', P('desk', mood='golden', expr='smile', progress=1.0, progressLabel='TAREA · EN LA MITAD DEL TIEMPO'), {}),
 ('s07', 'Una tarde caminas', P('walk', mood='golden', notes=True), {'amb': {'name': 'wind', 'gain': -26}}),
 ('s08', 'Las cosas simples', P('table', mode='eat', friend=True, mood='golden'), {}),
 ('s09', 'Y entiendes que', P('dawn', fog=True, pose='stand', expr='awe'), {'sfx': [{'at': 0.5, 'name': 'shimmer', 'gain': -12}]}),
 # ---------------- CLOSING ----------------
 ('z01', 'Así que la próxima', P('grab', mode='stop', reachAt=0.4, stopAt='detente', mood='golden'), {'in': {'type': 'dip', 'dur': 0.4}}),
 ('z02', 'detente un segundo', P('face', bg='dawn', phone=False, ex=[[0, 'surprised'], ['respira', 'sleepy']], rings=True, ringColor=None), {'bars': 'scope', 'sfx': [{'at': 1.5, 'name': 'slowmo', 'gain': -10}]}),
 ('z03', 'Y recuerda esto', P('bigText', lines=[['tú', 'TÚ NO ERES', 'cream'], ['distracción', 'TU DISTRACCIÓN', 'gold']], bg='dawn'), {'bars': 'scope'}),
 ('z04', 'Tú no eres tu falta', P('bigText', lines=[['tú', 'TÚ NO ERES', 'cream'], ['falta', 'TU FALTA DE CONCENTRACIÓN', 'gold', 70]], bg='dawn'), {'bars': 'scope'}),
 ('z05', 'Tu mente no está rota', P('brainState', mode='intact', label='NUNCA LO ESTUVO', labelAt='nunca', labelColor='gold'), {'bars': 'none', 'sfx': [{'at': 0.3, 'name': 'shimmer', 'gain': -12}]}),
 ('z06', 'Solo ha estado gritando', P('noise'), {'sfx': [{'at': 0.5, 'name': 'riser', 'gain': -14}], 'amb': {'name': 'hum', 'gain': -24}}),
 ('z07', 'Mañana cuando despiertes', P('dawn', bed=True, fx=60, pose='stand', expr='smile', badge='30 MIN SIN TELÉFONO', badgeAt='treinta'), {'in': {'type': 'dip', 'dur': 0.6}, 'amb': {'name': 'wind', 'gain': -30}}),
 ('z08', 'Deja que tu mente', P('dawn', pose='cup', expr='smile', strike=[['titulares', 'TITULARES'], ['mensajes', 'MENSAJES'], ['opinión', 'LA OPINIÓN DE NADIE']]), {}),
 ('z09', 'Baja el volumen', P('volume', text='BAJA EL VOLUMEN', at=0.1), {'bars': 'none'}),
 ('z10', 'Recupera el silencio', P('dawn', pose='stand', expr='sleepy', z0=1.05, z1=0.98), {}),
 ('z11', 'Y en ese silencio', P('face', bg='dawn', phone=False, ex=[[0, 'neutral'], ['encontrar', 'awe']], sparkle='sentir'), {'bars': 'scope'}),
 ('z12', 'Tu propia atención', P('bigText', lines=[['atención', 'TU PROPIA ATENCIÓN', 'cream'], ['dirección', 'TU PROPIA DIRECCIÓN', 'cream'], ['vida', 'TU PROPIA VIDA', 'gold']], bg='dawn'), {'bars': 'scope', 'sfx': [{'at': 3.0, 'name': 'shimmer', 'gain': -10}]}),
 ('z13', 'Empieza hoy', P('endCard', lines=[['hoy', 'EMPIEZA HOY', 'gold'], ['minuto', 'CON UN SOLO MINUTO', 'cream'], ['tuyo', 'CADA MINUTO QUE RECUPERAS ES TUYO', 'cream']]), {'bars': 'scope', 'in': {'type': 'fade', 'dur': 0.6}}),
]
def find(anchor, i0):
    a = [norm(x) for x in anchor.split()]
    for i in range(i0, len(NW)):
        if NW[i:i + len(a)] == a: return i
    raise SystemExit(f'anchor not found after {i0}: {anchor}')
shots, i0 = [], 0
for item in PLAN:
    if len(item) == 3: sid, _, anchor = item; params, extra = None, {}
    else: sid, anchor, params, extra = item
    i = find(anchor, i0); i0 = i + 1
    st = max(0.0, round(W[i]['start'] - 0.15, 2)) if shots else 0.0
    if sid.startswith('b') and params is None:
        o = old['s' + sid[1:]]; d = {k: o[k] for k in ('bars', 'in', 'sfx', 'scene', 'set') if k in o}
        if 'amb' in o: d['amb'] = o['amb']
    else: d = {'bars': None, 'in': {'type': 'cut'}, 'sfx': [], 'scene': params['tpl'], **extra}
    shots.append({'id': sid, 'start': st, 'line': anchor, **d, **({'params': params} if params else {})})
for a, b in zip(shots, shots[1:]): a['end'] = b['start']
shots[-1]['end'] = D
for s in shots:
    assert s['end'] > s['start'] + 0.3, (s['id'], s['start'], s['end'])
music = [{'start': 0, 'end': 55, 'mood': 'tension', 'intensity': 0.4}, {'start': 55, 'end': 131, 'mood': 'mystery', 'intensity': 0.35}, {'start': 131, 'end': 151, 'mood': 'tension', 'intensity': 0.5},
 {'start': 151, 'end': 232, 'mood': 'tension', 'intensity': 0.45}, {'start': 232, 'end': 353, 'mood': 'mystery', 'intensity': 0.4}, {'start': 353, 'end': 388, 'mood': 'hopeful', 'intensity': 0.4},
 {'start': 388, 'end': 515, 'mood': 'hopeful', 'intensity': 0.5}, {'start': 515, 'end': 608, 'mood': 'wonder', 'intensity': 0.45}, {'start': 608, 'end': D, 'mood': 'triumph', 'intensity': 0.4}]
json.dump({'title': 'Tu cerebro no está roto, está sobreestimulado', 'duration': D, 'shots': shots, 'music': music, 'sfx': []}, open('story/shots.json', 'w'), ensure_ascii=False, indent=1)
durs = sorted(s['end'] - s['start'] for s in shots)
print(len(shots), 'shots; median %.2fs, max %.2fs' % (durs[len(durs) // 2], durs[-1]))
for s in shots:
    if s['end'] - s['start'] > 8: print('  long:', s['id'], round(s['end'] - s['start'], 1))
