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
};

export const disciplines: DisciplineContent[] = [
  { id: 'molecular-biology', key: 'molecular', title: localized('Молекулярная биология', 'Молекулалық биология', 'Molecular biology'), subtitle: localized('ДНК, РНК и экспрессия генов', 'ДНҚ, РНҚ және ген экспрессиясы', 'DNA, RNA & gene expression'), description: localized('Поймите молекулярный язык жизни — от структуры ДНК до экспрессии генов.', 'ДНҚ құрылымынан ген экспрессиясына дейінгі тіршіліктің молекулалық тілін түсініңіз.', 'Understand the molecular language of life, from DNA structure to gene expression.'), icon: 'activity' },
  { id: 'medical-genetics', key: 'genetics', title: localized('Медицинская генетика', 'Медициналық генетика', 'Medical genetics'), subtitle: localized('Наследование и диагностика', 'Тұқым қуалау және диагностика', 'Inheritance & diagnosis'), description: localized('Читайте закономерности наследования и связывайте механизмы с диагнозом.', 'Тұқым қуалау заңдылықтарын оқып, механизмдерді диагнозбен байланыстырыңыз.', 'Read inheritance patterns and connect genetic mechanisms to diagnosis.'), icon: 'git-branch' },
  { id: 'biomedicine', key: 'biomedicine', title: localized('Биомедицина', 'Биомедицина', 'Biomedicine'), subtitle: localized('Клетки, терапия и omics', 'Жасушалар, терапия және omics', 'Cells, therapy & omics'), description: localized('Изучайте клеточные технологии, которые меняют медицину будущего.', 'Болашақ медицинасын қалыптастыратын жасушалық технологияларды зерттеңіз.', 'Explore the cellular technologies shaping the future of medicine.'), icon: 'layers' },
  { id: 'parasitology', key: 'parasitology', title: localized('Паразитология', 'Паразитология', 'Parasitology'), subtitle: localized('Циклы, хозяева и профилактика', 'Циклдер, иелер және алдын алу', 'Cycles, hosts & prevention'), description: localized('Изучайте жизненные циклы, хозяев и профилактику паразитарных болезней.', 'Паразиттік аурулардың өмірлік циклдерін, иелерін және алдын алуды зерттеңіз.', 'Study life cycles, hosts, and prevention of parasitic disease.'), icon: 'target' },
  { id: 'embryology', key: 'embryology', title: localized('Эмбриология', 'Эмбриология', 'Embryology'), subtitle: localized('От гаметы до органа', 'Гаметадан мүшеге дейін', 'From gamete to organ'), description: localized('Проследите путь развития от оплодотворения до формирования органов.', 'Ұрықтанудан мүшелердің қалыптасуына дейінгі дамуды бақылаңыз.', 'Follow development from fertilization to organ formation.'), icon: 'heart' },
  { id: 'ontogeny', key: 'ontogeny', title: localized('Онтогенез', 'Онтогенез', 'Ontogeny'), subtitle: localized('Рост, старение и регенерация', 'Өсу, қартаю және қалпына келу', 'Growth, aging & repair'), description: localized('Поймите рост, дифференцировку, регенерацию и клеточное старение.', 'Өсу, дифференциация, қалпына келу және жасушалық қартаюды түсініңіз.', 'Understand growth, differentiation, regeneration, and cellular aging.'), icon: 'trending-up' },
  { id: 'human-invasion', key: 'invasion', title: localized('Инвазия человека', 'Адам инвазиясы', 'Human invasion'), subtitle: localized('Паразит и хозяин', 'Паразит пен ие', 'Parasite–host interaction'), description: localized('Разберите передачу, миграцию и иммунный ответ в системе паразит–хозяин.', 'Паразит–ие жүйесіндегі берілу, миграция және иммундық жауапты талдаңыз.', 'Explore transmission, migration, and immune response in host–parasite systems.'), icon: 'shield' },
];

export const courseTopics: LocalizedText[] = [
  localized('Репликация ДНК', 'ДНҚ репликациясы', 'DNA replication'),
  localized('Транскрипция и процессинг РНК', 'Транскрипция және РНҚ процессингі', 'RNA transcription & processing'),
  localized('Трансляция и генетический код', 'Трансляция және генетикалық код', 'Translation & the genetic code'),
  localized('Регуляция экспрессии генов', 'Ген экспрессиясын реттеу', 'Regulation of gene expression'),
  localized('Мутации и репарация ДНК', 'Мутациялар және ДНҚ репарациясы', 'Mutations & DNA repair'),
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