import { AppLanguage } from '@/i18n';

export type LocalizedText = {
  ru: string;
  kk: string;
  en: string;
};

export const localized = (ru: string, kk: string, en: string): LocalizedText => ({ ru, kk, en });

export function getLocalizedText(value: LocalizedText, language: AppLanguage) {
  return value[language] || value.ru;
}

export type DisciplineContent = {
  id: string;
  key: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  icon: string;
  topics: LocalizedText[];
};

export const disciplines: DisciplineContent[] = [
  {
    id: 'molecular-biology',
    key: 'molecular',
    title: localized('Молекулярная биология', 'Молекулалық биология', 'Molecular biology'),
    subtitle: localized('ДНК, РНК и экспрессия генов', 'ДНҚ, РНҚ және ген экспрессиясы', 'DNA, RNA & gene expression'),
    description: localized(
      'Молекулярный язык жизни: строение ДНК и РНК, репликация, транскрипция, трансляция и регуляция работы генов.',
      'Тіршіліктің молекулалық тілі: ДНҚ мен РНҚ құрылымы, репликация, транскрипция, трансляция және гендер жұмысын реттеу.',
      'The molecular language of life: DNA and RNA structure, replication, transcription, translation and gene regulation.',
    ),
    icon: 'activity',
    topics: [
      localized('Репликация ДНК', 'ДНҚ репликациясы', 'DNA replication'),
      localized('Транскрипция и процессинг РНК', 'Транскрипция және РНҚ процессингі', 'RNA transcription & processing'),
      localized('Трансляция и генетический код', 'Трансляция және генетикалық код', 'Translation & the genetic code'),
      localized('Регуляция экспрессии генов', 'Ген экспрессиясын реттеу', 'Regulation of gene expression'),
      localized('Мутации и репарация ДНК', 'Мутациялар және ДНҚ репарациясы', 'Mutations & DNA repair'),
    ],
  },
  {
    id: 'medical-genetics',
    key: 'genetics',
    title: localized('Медицинская генетика', 'Медициналық генетика', 'Medical genetics'),
    subtitle: localized('Наследование и диагностика', 'Тұқым қуалау және диагностика', 'Inheritance & diagnosis'),
    description: localized(
      'Типы наследования, хромосомные и моногенные болезни, анализ родословных и современные методы генетической диагностики.',
      'Тұқым қуалау типтері, хромосомалық және моногендік аурулар, шежіре талдауы және генетикалық диагностиканың заманауи әдістері.',
      'Inheritance patterns, chromosomal and single-gene disorders, pedigree analysis and modern genetic diagnostics.',
    ),
    icon: 'git-branch',
    topics: [
      localized('Типы наследования', 'Тұқым қуалау типтері', 'Patterns of inheritance'),
      localized('Хромосомные болезни', 'Хромосомалық аурулар', 'Chromosomal disorders'),
      localized('Моногенные заболевания', 'Моногендік аурулар', 'Single-gene disorders'),
      localized('Генеалогический анализ', 'Генеалогиялық талдау', 'Pedigree analysis'),
      localized('Методы генетической диагностики', 'Генетикалық диагностика әдістері', 'Genetic testing methods'),
    ],
  },
  {
    id: 'biomedicine',
    key: 'biomedicine',
    title: localized('Биомедицина', 'Биомедицина', 'Biomedicine'),
    subtitle: localized('Клетки, терапия и omics', 'Жасушалар, терапия және omics', 'Cells, therapy & omics'),
    description: localized(
      'Клеточные и молекулярные технологии в медицине: стволовые клетки, генная терапия, редактирование генома и биомаркеры.',
      'Медицинадағы жасушалық және молекулалық технологиялар: бағаналы жасушалар, гендік терапия, геномды редакциялау және биомаркерлер.',
      'Cellular and molecular technologies in medicine: stem cells, gene therapy, genome editing and biomarkers.',
    ),
    icon: 'layers',
    topics: [
      localized('Стволовые клетки', 'Бағаналы жасушалар', 'Stem cells'),
      localized('Клеточная и генная терапия', 'Жасушалық және гендік терапия', 'Cell & gene therapy'),
      localized('Редактирование генома CRISPR', 'CRISPR геномды редакциялау', 'CRISPR genome editing'),
      localized('Омиксные технологии', 'Омикс технологиялары', 'Omics technologies'),
      localized('Биомаркеры и диагностика', 'Биомаркерлер және диагностика', 'Biomarkers & diagnostics'),
    ],
  },
  {
    id: 'medical-biology-parasitology',
    key: 'parasitology',
    title: localized('Медицинская биология и паразитология', 'Медициналық биология және паразитология', 'Medical biology & parasitology'),
    subtitle: localized('Развитие, паразиты и хозяин', 'Даму, паразиттер және ие', 'Development, parasites & host'),
    description: localized(
      'Эмбриология и онтогенез человека, жизненные циклы паразитов, инвазия и взаимодействие паразита с хозяином, профилактика паразитарных болезней.',
      'Адам эмбриологиясы мен онтогенезі, паразиттердің өмірлік циклдері, инвазия және паразит пен иенің өзара әрекеті, паразиттік аурулардың алдын алу.',
      'Human embryology and ontogeny, parasite life cycles, invasion and host–parasite interaction, and prevention of parasitic disease.',
    ),
    icon: 'target',
    topics: [
      localized('Эмбриология: от гаметы до органа', 'Эмбриология: гаметадан мүшеге дейін', 'Embryology: from gamete to organ'),
      localized('Онтогенез: рост, старение, регенерация', 'Онтогенез: өсу, қартаю, регенерация', 'Ontogeny: growth, aging, regeneration'),
      localized('Паразитология: циклы и хозяева', 'Паразитология: циклдер және иелер', 'Parasitology: life cycles & hosts'),
      localized('Инвазия человека: паразит и хозяин', 'Адам инвазиясы: паразит және ие', 'Human invasion: parasite & host'),
      localized('Профилактика паразитарных болезней', 'Паразиттік аурулардың алдын алу', 'Preventing parasitic disease'),
    ],
  },
];

export type LessonTheoryBlock = {
  title: LocalizedText;
  body: LocalizedText;
};

/** Theory step of the demo lesson (DNA replication). */
export const lessonTheory: LessonTheoryBlock[] = [
  {
    title: localized('Зачем клетке копировать ДНК', 'Жасушаға ДНҚ-ны көшіру не үшін керек', 'Why a cell copies its DNA'),
    body: localized(
      'Перед делением клетка удваивает всю ДНК, чтобы каждая дочерняя клетка получила полный набор генов. Репликация полуконсервативна: каждая новая двойная спираль состоит из одной старой (матричной) и одной новой цепи.',
      'Бөлінер алдында жасуша барлық ДНҚ-ны екі еселейді, сонда әр еншілес жасуша гендердің толық жиынтығын алады. Репликация жартылай консервативті: әр жаңа қос спираль бір ескі (матрицалық) және бір жаңа тізбектен тұрады.',
      'Before dividing, a cell doubles all of its DNA so that each daughter cell receives a full set of genes. Replication is semi-conservative: each new double helix contains one old (template) strand and one new strand.',
    ),
  },
  {
    title: localized('Репликационная вилка', 'Репликация айыры', 'The replication fork'),
    body: localized(
      'Хеликаза раскручивает двойную спираль и разделяет цепи. Праймаза ставит короткий РНК-праймер, а ДНК-полимераза присоединяет к нему комплементарные нуклеотиды (A–T, G–C).',
      'Хеликаза қос спиральды тарқатып, тізбектерді ажыратады. Праймаза қысқа РНҚ-праймер қояды, ал ДНҚ-полимераза оған комплементарлы нуклеотидтерді (A–T, G–C) қосады.',
      'Helicase unwinds the double helix and separates the strands. Primase lays down a short RNA primer, and DNA polymerase adds complementary nucleotides to it (A–T, G–C).',
    ),
  },
  {
    title: localized('Ведущая и отстающая цепи', 'Жетекші және кейін қалушы тізбектер', 'Leading and lagging strands'),
    body: localized(
      'ДНК-полимераза строит цепь только в направлении 5′ → 3′. Поэтому ведущая цепь синтезируется непрерывно, а отстающая — короткими фрагментами Оказаки, которые затем сшивает ДНК-лигаза.',
      'ДНҚ-полимераза тізбекті тек 5′ → 3′ бағытында құрады. Сондықтан жетекші тізбек үздіксіз, ал кейін қалушы тізбек қысқа Оказаки фрагменттерімен синтезделеді, оларды кейін ДНҚ-лигаза біріктіреді.',
      'DNA polymerase can only build a strand in the 5′ → 3′ direction. So the leading strand is made continuously, while the lagging strand is made in short Okazaki fragments that DNA ligase later joins.',
    ),
  },
];

/** Labels for the replication-fork diagram (scheme step). */
export const lessonSchemeLegend: { color: string; label: LocalizedText; detail: LocalizedText }[] = [
  { color: '#2F8F68', label: localized('Матричные цепи', 'Матрицалық тізбектер', 'Template strands'), detail: localized('Старая ДНК, по которой идёт копирование', 'Көшіру жүретін ескі ДНҚ', 'Old DNA used as the template') },
  { color: '#E0A43B', label: localized('Хеликаза', 'Хеликаза', 'Helicase'), detail: localized('Раскручивает спираль в вилке', 'Айырда спиральды тарқатады', 'Unwinds the helix at the fork') },
  { color: '#4C7DD9', label: localized('Ведущая цепь', 'Жетекші тізбек', 'Leading strand'), detail: localized('Синтезируется непрерывно', 'Үздіксіз синтезделеді', 'Made continuously') },
  { color: '#D9644C', label: localized('Фрагменты Оказаки', 'Оказаки фрагменттері', 'Okazaki fragments'), detail: localized('Отстающая цепь, синтез частями', 'Кейін қалушы тізбек, бөліктермен синтез', 'Lagging strand, made in pieces') },
];

export type LessonQuestion = {
  prompt: LocalizedText;
  options: LocalizedText[];
  answer: number;
  explanation: LocalizedText;
};

export const lessonQuestions: LessonQuestion[] = [
  { prompt: localized('Какой фермент разделяет две цепи ДНК в репликационной вилке?', 'Репликация айырмасында ДНҚ-ның екі тізбегін қандай фермент ажыратады?', 'Which enzyme separates the two DNA strands at the replication fork?'), options: [localized('ДНК-лигаза', 'ДНҚ-лигаза', 'DNA ligase'), localized('Хеликаза', 'Хеликаза', 'Helicase'), localized('РНК-полимераза', 'РНҚ-полимераза', 'RNA polymerase'), localized('Теломераза', 'Теломераза', 'Telomerase')], answer: 1, explanation: localized('Хеликаза разрывает водородные связи между азотистыми основаниями и раскручивает двойную спираль.', 'Хеликаза негіздер арасындағы сутектік байланыстарды үзіп, қос спиральды ашады.', 'Helicase breaks the hydrogen bonds between base pairs, opening the double helix.') },
  { prompt: localized('Что присоединяется к новой цепи в направлении 5′ → 3′?', 'Жаңа тізбекке 5′ → 3′ бағытында не қосылады?', 'What is added to the new strand in the 5′ → 3′ direction?'), options: [localized('Нуклеотиды', 'Нуклеотидтер', 'Nucleotides'), localized('Аминокислоты', 'Аминқышқылдары', 'Amino acids'), localized('Рибосомы', 'Рибосомалар', 'Ribosomes'), localized('Интроны', 'Интрондар', 'Introns')], answer: 0, explanation: localized('ДНК-полимераза присоединяет комплементарные нуклеотиды и так строит новую цепь.', 'ДНҚ-полимераза жаңа тізбекті құру үшін комплементарлы нуклеотидтерді қосады.', 'DNA polymerase adds complementary nucleotides to build the new strand.') },
  { prompt: localized('Почему образуются фрагменты Оказаки?', 'Оказаки фрагменттері не үшін түзіледі?', 'Why are Okazaki fragments formed?'), options: [localized('ДНК кольцевая', 'ДНҚ сақиналы болғандықтан', 'DNA is circular'), localized('Матрица повреждена', 'Матрица зақымдалғандықтан', 'The template is damaged'), localized('ДНК-полимераза работает в одном направлении', 'ДНҚ-полимераза бір бағытта жұмыс істейтіндіктен', 'DNA polymerase works in one direction'), localized('РНК нестабильна', 'РНҚ тұрақсыз болғандықтан', 'RNA is unstable')], answer: 2, explanation: localized('Отстающая цепь строится короткими фрагментами, потому что ДНК-полимераза работает только 5′ → 3′.', 'Кейін қалушы тізбек қысқа фрагменттермен түзіледі, себебі ДНҚ-полимераза тек 5′ → 3′ бағытында жұмыс істейді.', 'The lagging strand is built in short fragments because DNA polymerase only works 5′ → 3′.') },
];