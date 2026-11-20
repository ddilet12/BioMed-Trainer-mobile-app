import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G, Line, Polygon } from 'react-native-svg';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/context/StudyContext';
import { getLocalizedText, lessonQuestions, lessonSchemeLegend, lessonTheory } from '@/data/content';
import { useTranslation } from 'react-i18next';

type Phase = 'theory' | 'scheme' | 'quiz' | 'result';
const PHASES: Phase[] = ['theory', 'scheme', 'quiz', 'result'];

type Point = [number, number];
const lerp = (a: Point, b: Point, t: number): Point => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const offset = (p: Point, n: Point, d: number): Point => [p[0] + n[0] * d, p[1] + n[1] * d];

/** Arrowhead triangle at `tip`, pointing along from → tip. */
function arrowHead(from: Point, tip: Point, size = 7) {
  const dx = tip[0] - from[0];
  const dy = tip[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = tip[0] - ux * size;
  const by = tip[1] - uy * size;
  return `${tip[0]},${tip[1]} ${bx - uy * size * 0.55},${by + ux * size * 0.55} ${bx + uy * size * 0.55},${by - ux * size * 0.55}`;
}

function ReplicationForkDiagram({ rungColor }: { rungColor: string }) {
  const [template, helicase, leading, lagging] = lessonSchemeLegend.map((item) => item.color);
  const forkTop: Point = [150, 92];
  const forkBottom: Point = [150, 108];
  const upperEnd: Point = [304, 38];
  const lowerEnd: Point = [304, 162];
  // Unit normals pointing into the fork (between the two template arms).
  const upperNormal: Point = [0.327, 0.945];
  const lowerNormal: Point = [0.327, -0.945];

  const leadStart = offset(lerp(forkTop, upperEnd, 0.96), upperNormal, 10);
  const leadEnd = offset(lerp(forkTop, upperEnd, 0.14), upperNormal, 10);
  const laggingSegments: [number, number][] = [[0.16, 0.38], [0.45, 0.67], [0.74, 0.96]];

  return (
    <Svg width="100%" height={200} viewBox="0 0 320 200" accessibilityRole="image">
      {/* Parental double helix before the fork */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Line key={i} x1={24 + i * 16} y1={92} x2={24 + i * 16} y2={108} stroke={rungColor} strokeWidth={3} strokeLinecap="round" />
      ))}
      <Line x1={14} y1={92} x2={forkTop[0]} y2={forkTop[1]} stroke={template} strokeWidth={5} strokeLinecap="round" />
      <Line x1={14} y1={108} x2={forkBottom[0]} y2={forkBottom[1]} stroke={template} strokeWidth={5} strokeLinecap="round" />

      {/* Separated template strands */}
      <Line x1={forkTop[0]} y1={forkTop[1]} x2={upperEnd[0]} y2={upperEnd[1]} stroke={template} strokeWidth={5} strokeLinecap="round" />
      <Line x1={forkBottom[0]} y1={forkBottom[1]} x2={lowerEnd[0]} y2={lowerEnd[1]} stroke={template} strokeWidth={5} strokeLinecap="round" />

      {/* Leading strand: continuous, grows toward the fork */}
      <Line x1={leadStart[0]} y1={leadStart[1]} x2={leadEnd[0]} y2={leadEnd[1]} stroke={leading} strokeWidth={4} strokeLinecap="round" />
      <Polygon points={arrowHead(leadStart, leadEnd)} fill={leading} />

      {/* Lagging strand: Okazaki fragments, each grows away from the fork */}
      {laggingSegments.map(([a, b]) => {
        const start = offset(lerp(forkBottom, lowerEnd, b), lowerNormal, 10);
        const end = offset(lerp(forkBottom, lowerEnd, a), lowerNormal, 10);
        return (
          <G key={a}>
            <Line x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} stroke={lagging} strokeWidth={4} strokeLinecap="round" />
            <Polygon points={arrowHead(start, end, 6)} fill={lagging} />
          </G>
        );
      })}

      {/* Helicase at the fork */}
      <Circle cx={146} cy={100} r={13} fill={helicase} />
      <Circle cx={146} cy={100} r={5} fill="#FFFFFF" opacity={0.85} />
    </Svg>
  );
}

export default function LessonScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { completeLesson, language } = useStudy();
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);
  const [phase, setPhase] = useState<Phase>('theory');
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const question = lessonQuestions[step];
  const topInset = insets.top + (Platform.OS === 'web' ? 67 : 0);
  const phaseIndex = PHASES.indexOf(phase);

  const goTo = (next: Phase) => {
    setPhase(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };
  const choose = (index: number) => {
    if (checked) return;
    Haptics.selectionAsync().catch(() => undefined);
    setSelected(index);
  };
  const checkAnswer = () => {
    if (selected === null) return;
    const correct = selected === question.answer;
    setChecked(true);
    if (correct) setCorrectCount((count) => count + 1);
    Haptics.notificationAsync(correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    // The lesson counts as completed once every question has been answered.
    if (step === lessonQuestions.length - 1) completeLesson(id ?? 'molecular-biology-dna');
  };
  const next = () => {
    if (step < lessonQuestions.length - 1) {
      setStep(step + 1);
      setSelected(null);
      setChecked(false);
    } else {
      goTo('result');
    }
  };
  const restart = () => {
    setStep(0);
    setSelected(null);
    setChecked(false);
    setCorrectCount(0);
    goTo('theory');
  };

  const primaryButton = (label: string, onPress: () => void, icon: keyof typeof Feather.glyphMap = 'arrow-right', disabled = false) => (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.primaryButton, { backgroundColor: disabled ? colors.border : colors.primary }]}
    >
      <Text style={[styles.primaryButtonText, { color: disabled ? colors.mutedForeground : colors.primaryForeground }]}>{label}</Text>
      <Feather name={icon} size={17} color={disabled ? colors.mutedForeground : colors.primaryForeground} />
    </Pressable>
  );

  return (
    <ScrollView ref={scrollRef} style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: insets.bottom + 30 }} showsVerticalScrollIndicator={false}>
      <View style={[styles.top, { paddingTop: topInset + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.back} accessibilityLabel={t('lesson.backToCourse')}><Feather name="arrow-left" size={19} color={colors.foreground} /></Pressable>
        <Text style={[styles.topTitle, { color: colors.foreground }]}>{t('home.lessonTitle')}</Text>
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>{phaseIndex + 1} / {PHASES.length}</Text>
      </View>

      <View style={styles.stepper}>
        {PHASES.map((item, index) => {
          const done = index < phaseIndex;
          const active = index === phaseIndex;
          return (
            <View key={item} style={styles.stepperItem}>
              <View style={[styles.stepperBar, { backgroundColor: done || active ? colors.primary : colors.border }]} />
              <Text style={[styles.stepperText, { color: active ? colors.primary : colors.mutedForeground }]} numberOfLines={1}>{t(`lesson.phase.${item}`)}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.body}>
        {phase === 'theory' && (
          <>
            <Text style={[styles.kicker, { color: colors.primary }]}>{t('lesson.theoryKicker')}</Text>
            <Text style={[styles.heading, { color: colors.foreground }]}>{t('lesson.heading')}</Text>
            <Text style={[styles.intro, { color: colors.mutedForeground }]}>{t('lesson.intro')}</Text>
            <View style={styles.theoryList}>
              {lessonTheory.map((block, index) => (
                <View key={block.title.en} style={[styles.theoryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.theoryNumber, { backgroundColor: colors.secondary }]}><Text style={[styles.theoryNumberText, { color: colors.primary }]}>{index + 1}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.theoryTitle, { color: colors.foreground }]}>{getLocalizedText(block.title, language)}</Text>
                    <Text style={[styles.theoryBody, { color: colors.mutedForeground }]}>{getLocalizedText(block.body, language)}</Text>
                  </View>
                </View>
              ))}
            </View>
            {primaryButton(t('lesson.toScheme'), () => goTo('scheme'))}
          </>
        )}

        {phase === 'scheme' && (
          <>
            <Text style={[styles.kicker, { color: colors.primary }]}>{t('lesson.schemeKicker')}</Text>
            <Text style={[styles.heading, { color: colors.foreground }]}>{t('lesson.schemeTitle')}</Text>
            <Text style={[styles.intro, { color: colors.mutedForeground }]}>{t('lesson.schemeIntro')}</Text>
            <View style={[styles.visual, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.visualTop}>
                <Text style={[styles.visualLabel, { color: colors.mutedForeground }]}>{t('lesson.visualLabel')}</Text>
                <View style={[styles.liveBadge, { backgroundColor: colors.secondary }]}><View style={[styles.liveDot, { backgroundColor: colors.primary }]} /><Text style={[styles.liveText, { color: colors.primary }]}>{t('lesson.visualBadge')}</Text></View>
              </View>
              <ReplicationForkDiagram rungColor={colors.border} />
              <View style={[styles.legend, { borderTopColor: colors.border }]}>
                {lessonSchemeLegend.map((item) => (
                  <View key={item.label.en} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.legendTitle, { color: colors.foreground }]}>{getLocalizedText(item.label, language)}</Text>
                      <Text style={[styles.legendText, { color: colors.mutedForeground }]}>{getLocalizedText(item.detail, language)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <Text style={[styles.note, { color: colors.mutedForeground }]}>{t('lesson.schemeNote')}</Text>
            {primaryButton(t('lesson.toTask'), () => goTo('quiz'))}
            <Pressable onPress={() => goTo('theory')} style={styles.secondaryButton}><Text style={[styles.secondaryButtonText, { color: colors.primary }]}>{t('lesson.backToTheory')}</Text></Pressable>
          </>
        )}

        {phase === 'quiz' && (
          <>
            <View style={styles.questionHeader}><Text style={[styles.questionLabel, { color: colors.mutedForeground }]}>{t('lesson.checkUnderstanding')}</Text><Text style={[styles.questionNumber, { color: colors.primary }]}>{step + 1} / {lessonQuestions.length}</Text></View>
            <Text style={[styles.question, { color: colors.foreground }]}>{getLocalizedText(question.prompt, language)}</Text>
            <View style={styles.options}>
              {question.options.map((option, index) => {
                const isSelected = selected === index;
                const isCorrect = checked && index === question.answer;
                const isWrong = checked && isSelected && !isCorrect;
                return (
                  <Pressable
                    key={option.en}
                    onPress={() => choose(index)}
                    accessibilityState={{ selected: isSelected }}
                    style={[styles.option, { backgroundColor: isCorrect ? '#E5F3E8' : isWrong ? '#F8E8E5' : isSelected ? colors.secondary : colors.card, borderColor: isCorrect ? colors.primary : isWrong ? colors.destructive : isSelected ? colors.primary : colors.border }]}
                  >
                    <View style={[styles.optionDot, { borderColor: isCorrect ? colors.primary : isWrong ? colors.destructive : isSelected ? colors.primary : colors.border, backgroundColor: isCorrect ? colors.primary : isWrong ? colors.destructive : 'transparent' }]}>{(isCorrect || isWrong) && <Feather name={isCorrect ? 'check' : 'x'} size={11} color="#FFFFFF" />}</View>
                    <Text style={[styles.optionText, { color: colors.foreground }]}>{getLocalizedText(option, language)}</Text>
                  </Pressable>
                );
              })}
            </View>
            {checked && (
              <View style={[styles.feedback, { backgroundColor: selected === question.answer ? '#E5F3E8' : '#F8E8E5' }]}>
                <Feather name={selected === question.answer ? 'check-circle' : 'info'} size={18} color={selected === question.answer ? colors.primary : colors.destructive} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.feedbackTitle, { color: colors.foreground }]}>{selected === question.answer ? t('lesson.correct') : t('lesson.notQuite')}</Text>
                  <Text style={[styles.feedbackText, { color: colors.mutedForeground }]}>{getLocalizedText(question.explanation, language)}</Text>
                </View>
              </View>
            )}
            {!checked
              ? primaryButton(t('lesson.checkAnswer'), checkAnswer, 'arrow-right', selected === null)
              : step < lessonQuestions.length - 1
                ? primaryButton(t('lesson.nextQuestion'), next)
                : primaryButton(t('lesson.showResult'), next, 'flag')}
          </>
        )}

        {phase === 'result' && (
          <>
            <View style={[styles.resultCard, { backgroundColor: colors.primary }]}>
              <Feather name="award" size={28} color="#FFFFFF" />
              <Text style={styles.resultTitle}>{t('lesson.resultTitle')}</Text>
              <Text style={styles.resultScore}>{t('lesson.resultScore', { correct: correctCount, total: lessonQuestions.length })}</Text>
              <Text style={styles.resultText}>{correctCount === lessonQuestions.length ? t('lesson.resultPerfect') : t('lesson.resultKeepGoing')}</Text>
            </View>
            {primaryButton(t('lesson.backToCourse'), () => router.back(), 'check')}
            <Pressable onPress={restart} style={styles.secondaryButton}><Text style={[styles.secondaryButtonText, { color: colors.primary }]}>{t('lesson.repeat')}</Text></Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  top: { paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 14 },
  back: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#D9E8DC', alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, fontSize: 16, fontWeight: '700' },
  stepLabel: { fontSize: 11, fontWeight: '700' },
  stepper: { flexDirection: 'row', gap: 6, paddingHorizontal: 20 },
  stepperItem: { flex: 1, gap: 6 },
  stepperBar: { height: 4, borderRadius: 2 },
  stepperText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.4 },
  body: { paddingHorizontal: 20, paddingTop: 22 },
  kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  heading: { fontSize: 28, fontWeight: '700', letterSpacing: -0.8, marginTop: 8 },
  intro: { fontSize: 13, lineHeight: 19, marginTop: 7 },
  theoryList: { gap: 10, marginTop: 18 },
  theoryCard: { borderWidth: 1, borderRadius: 18, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  theoryNumber: { width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  theoryNumberText: { fontSize: 12, fontWeight: '800' },
  theoryTitle: { fontSize: 14, fontWeight: '700' },
  theoryBody: { fontSize: 12.5, lineHeight: 18.5, marginTop: 5 },
  visual: { borderRadius: 20, borderWidth: 1, marginTop: 18, padding: 14 },
  visualTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  visualLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  liveBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5, flexDirection: 'row', gap: 5, alignItems: 'center' },
  liveDot: { width: 5, height: 5, borderRadius: 3 },
  liveText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  legend: { gap: 10, borderTopWidth: 1, paddingTop: 12, marginTop: 4 },
  legendItem: { flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginTop: 3 },
  legendTitle: { fontSize: 12, fontWeight: '700' },
  legendText: { fontSize: 11, lineHeight: 15, marginTop: 1 },
  note: { fontSize: 12, lineHeight: 18, marginTop: 14 },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  questionLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  questionNumber: { fontSize: 12, fontWeight: '800' },
  question: { fontSize: 19, fontWeight: '700', lineHeight: 25, marginTop: 9 },
  options: { gap: 9, marginTop: 16 },
  option: { borderWidth: 1, borderRadius: 15, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  optionDot: { width: 21, height: 21, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  optionText: { flex: 1, fontSize: 13, fontWeight: '600' },
  feedback: { borderRadius: 15, padding: 13, marginTop: 14, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  feedbackTitle: { fontSize: 13, fontWeight: '800' },
  feedbackText: { fontSize: 11.5, lineHeight: 17, marginTop: 3 },
  primaryButton: { borderRadius: 15, paddingVertical: 15, marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { fontSize: 13, fontWeight: '800' },
  secondaryButton: { paddingVertical: 14, alignItems: 'center' },
  secondaryButtonText: { fontSize: 13, fontWeight: '700' },
  resultCard: { borderRadius: 24, padding: 22, alignItems: 'flex-start', gap: 8 },
  resultTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', letterSpacing: -0.6, marginTop: 6 },
  resultScore: { color: '#D8F1DF', fontSize: 14, fontWeight: '700' },
  resultText: { color: '#E6F7E8', fontSize: 13, lineHeight: 19 },
});
