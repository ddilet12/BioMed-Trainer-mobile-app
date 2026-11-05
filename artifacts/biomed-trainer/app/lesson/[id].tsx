import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/context/StudyContext';
import { getLocalizedText, lessonQuestions } from '@/data/content';
import { useTranslation } from 'react-i18next';

export default function LessonScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { completeLesson, language } = useStudy();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const question = lessonQuestions[step];
  const topInset = insets.top + (Platform.OS === 'web' ? 67 : 0);

  const choose = (index: number) => {
    if (checked) return;
    Haptics.selectionAsync().catch(() => undefined);
    setSelected(index);
  };
  const checkAnswer = () => {
    if (selected === null) return;
    setChecked(true);
    Haptics.notificationAsync(selected === question.answer ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    // The lesson counts as completed once every question has been answered.
    if (step === lessonQuestions.length - 1) completeLesson(id ?? 'molecular-biology-dna');
  };
  const next = () => {
    if (step < lessonQuestions.length - 1) {
      setStep(step + 1);
      setSelected(null);
      setChecked(false);
    }
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: insets.bottom + 30 }} showsVerticalScrollIndicator={false}>
      <View style={[styles.top, { paddingTop: topInset + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.back}><Feather name="arrow-left" size={19} color={colors.foreground} /></Pressable>
        <Text style={[styles.topTitle, { color: colors.foreground }]}>{t('home.lessonTitle')}</Text>
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>{step + 1} / {lessonQuestions.length}</Text>
      </View>
      <View style={styles.progressTrack}><View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${((step + 1) / lessonQuestions.length) * 100}%` }]} /></View>
      <View style={styles.body}>
        <Text style={[styles.kicker, { color: colors.primary }]}>{t('lesson.interactivePractice')}</Text>
        <Text style={[styles.heading, { color: colors.foreground }]}>{t('lesson.heading')}</Text>
        <Text style={[styles.intro, { color: colors.mutedForeground }]}>{t('lesson.intro')}</Text>
        <View style={[styles.visual, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.visualTop}><Text style={[styles.visualLabel, { color: colors.mutedForeground }]}>{t('lesson.visualLabel')}</Text><View style={[styles.liveBadge, { backgroundColor: colors.secondary }]}><View style={[styles.liveDot, { backgroundColor: colors.primary }]} /><Text style={[styles.liveText, { color: colors.primary }]}>{t('lesson.visualBadge')}</Text></View></View>
          <View style={styles.helix}>
            {[0, 1, 2, 3, 4].map((item) => <View key={item} style={[styles.basePair, { top: 25 + item * 21 }]}><View style={[styles.base, { backgroundColor: item % 2 ? colors.accent : colors.primary }]} /><View style={[styles.connector, { backgroundColor: colors.border }]} /><View style={[styles.base, { backgroundColor: item % 2 ? colors.secondary : '#C5E6CC' }]} /></View>)}
            <View style={[styles.helixRail, { left: 45, backgroundColor: colors.primary }]} /><View style={[styles.helixRail, { right: 45, backgroundColor: colors.accent }]} />
          </View>
          <View style={styles.legend}><View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.primary }]} /><Text style={[styles.legendText, { color: colors.mutedForeground }]}>{t('lesson.leadingStrand')}</Text></View><View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.accent }]} /><Text style={[styles.legendText, { color: colors.mutedForeground }]}>{t('lesson.newStrand')}</Text></View></View>
        </View>
        <View style={styles.questionHeader}><Text style={[styles.questionLabel, { color: colors.mutedForeground }]}>{t('lesson.checkUnderstanding')}</Text><Text style={[styles.questionNumber, { color: colors.primary }]}>0{step + 1}</Text></View>
        <Text style={[styles.question, { color: colors.foreground }]}>{getLocalizedText(question.prompt, language)}</Text>
        <View style={styles.options}>
          {question.options.map((option, index) => {
            const isSelected = selected === index;
            const isCorrect = checked && index === question.answer;
            const isWrong = checked && isSelected && !isCorrect;
            return <Pressable key={option.en} onPress={() => choose(index)} style={[styles.option, { backgroundColor: isCorrect ? '#E5F3E8' : isWrong ? '#F8E8E5' : isSelected ? colors.secondary : colors.card, borderColor: isCorrect ? colors.primary : isWrong ? colors.destructive : isSelected ? colors.primary : colors.border }]}><View style={[styles.optionDot, { borderColor: isCorrect ? colors.primary : isWrong ? colors.destructive : isSelected ? colors.primary : colors.border, backgroundColor: isCorrect ? colors.primary : isWrong ? colors.destructive : 'transparent' }]}>{(isCorrect || isWrong) && <Feather name={isCorrect ? 'check' : 'x'} size={11} color="#FFFFFF" />}</View><Text style={[styles.optionText, { color: colors.foreground }]}>{getLocalizedText(option, language)}</Text></Pressable>;
          })}
        </View>
        {checked && <View style={[styles.feedback, { backgroundColor: selected === question.answer ? '#E5F3E8' : '#F8E8E5' }]}><Feather name={selected === question.answer ? 'check-circle' : 'info'} size={18} color={selected === question.answer ? colors.primary : colors.destructive} /><View style={{ flex: 1 }}><Text style={[styles.feedbackTitle, { color: colors.foreground }]}>{selected === question.answer ? t('lesson.correct') : t('lesson.notQuite')}</Text><Text style={[styles.feedbackText, { color: colors.mutedForeground }]}>{getLocalizedText(question.explanation, language)}</Text></View></View>}
        {!checked ? <Pressable disabled={selected === null} onPress={checkAnswer} style={[styles.primaryButton, { backgroundColor: selected === null ? colors.border : colors.primary }]}><Text style={[styles.primaryButtonText, { color: selected === null ? colors.mutedForeground : colors.primaryForeground }]}>{t('lesson.checkAnswer')}</Text><Feather name="arrow-right" size={17} color={selected === null ? colors.mutedForeground : colors.primaryForeground} /></Pressable> : step < lessonQuestions.length - 1 ? <Pressable onPress={next} style={[styles.primaryButton, { backgroundColor: colors.primary }]}><Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>{t('lesson.nextQuestion')}</Text><Feather name="arrow-right" size={17} color={colors.primaryForeground} /></Pressable> : <Pressable onPress={() => router.back()} style={[styles.primaryButton, { backgroundColor: colors.primary }]}><Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>{t('lesson.backToCourse')}</Text><Feather name="check" size={17} color={colors.primaryForeground} /></Pressable>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  top: { paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 16 },
  back: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#D9E8DC', alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, fontSize: 16, fontWeight: '700' },
  stepLabel: { fontSize: 11, fontWeight: '700' },
  progressTrack: { height: 4, backgroundColor: '#E1EDE2', marginHorizontal: 20, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
  body: { paddingHorizontal: 20, paddingTop: 25 },
  kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  heading: { fontSize: 28, fontWeight: '700', letterSpacing: -0.8, marginTop: 8 },
  intro: { fontSize: 13, lineHeight: 19, marginTop: 7 },
  visual: { borderRadius: 20, borderWidth: 1, marginTop: 20, padding: 14 },
  visualTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  visualLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  liveBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5, flexDirection: 'row', gap: 5, alignItems: 'center' },
  liveDot: { width: 5, height: 5, borderRadius: 3 },
  liveText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  helix: { height: 134, marginTop: 7, position: 'relative', overflow: 'hidden' },
  helixRail: { position: 'absolute', top: 13, width: 6, height: 108, borderRadius: 4 },
  basePair: { position: 'absolute', left: 46, right: 46, height: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 2 },
  base: { width: 13, height: 13, borderRadius: 5 },
  connector: { height: 3, flex: 1, marginHorizontal: 4, borderRadius: 2 },
  legend: { flexDirection: 'row', gap: 17, borderTopWidth: 1, borderTopColor: '#E3EDE4', paddingTop: 11 },
  legendItem: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  legendDot: { width: 7, height: 7, borderRadius: 3.5 },
  legendText: { fontSize: 10 },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25 },
  questionLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  questionNumber: { fontSize: 12, fontWeight: '800' },
  question: { fontSize: 18, fontWeight: '700', lineHeight: 24, marginTop: 9 },
  options: { gap: 9, marginTop: 16 },
  option: { borderWidth: 1, borderRadius: 15, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  optionDot: { width: 21, height: 21, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  optionText: { flex: 1, fontSize: 13, fontWeight: '600' },
  feedback: { borderRadius: 15, padding: 13, marginTop: 14, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  feedbackTitle: { fontSize: 13, fontWeight: '800' },
  feedbackText: { fontSize: 11, lineHeight: 16, marginTop: 3 },
  primaryButton: { borderRadius: 15, paddingVertical: 15, marginTop: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { fontSize: 13, fontWeight: '800' },
});