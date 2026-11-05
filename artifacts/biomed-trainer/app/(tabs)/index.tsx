import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppLogo } from '@/components/AppLogo';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/context/StudyContext';
import { AVAILABLE_DISCIPLINES } from '@/constants/app';
import { disciplines, getLocalizedText } from '@/data/content';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { streak, language, completedCount, totalLessons, progressPercent } = useStudy();
  const { t } = useTranslation();
  const topInset = insets.top + (Platform.OS === 'web' ? 67 : 0);
  const cardWidth = Math.min((width - 52) / 2, 210);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: topInset, paddingBottom: insets.bottom + 112 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerIdentity}>
          <AppLogo />
          <View>
            <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>{t('home.eyebrow')}</Text>
            <Text style={[styles.greeting, { color: colors.foreground }]}>{t('home.greeting')}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.streakRow, { backgroundColor: colors.secondary }]}>
        <View style={[styles.streakIcon, { backgroundColor: colors.accent }]}>
          <Feather name="zap" size={17} color={colors.accentForeground} />
        </View>
        <View style={styles.streakCopy}>
          <Text style={[styles.streakTitle, { color: colors.foreground }]}>{t('home.streakTitle', { count: streak })}</Text>
          <Text style={[styles.streakSub, { color: colors.mutedForeground }]}>{t('home.streakSubtitle')}</Text>
        </View>
        <Text style={[styles.streakAction, { color: colors.primary }]}>{t('home.today')}</Text>
      </View>

      <View style={[styles.progressCard, { backgroundColor: colors.primary }]}>
        <View style={styles.progressCopy}>
          <Text style={styles.progressLabel}>{t('home.studyPlanLabel')}</Text>
          <Text style={styles.progressHeadline}>{t('home.studyPlanHeadline1')}{'\n'}{t('home.studyPlanHeadline2')}</Text>
          <Text style={styles.progressDetail}>{t('home.studyPlanDetail', { count: completedCount, total: totalLessons })}</Text>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progressPercent}%` }]} /></View>
        </View>
        <View style={styles.progressCircle}>
          <Text style={styles.progressNumber}>{progressPercent}</Text>
          <Text style={styles.progressPercent}>%</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('home.continueTitle')}</Text>
        <Pressable onPress={() => router.push('/course/molecular-biology')}><Text style={[styles.seeAll, { color: colors.primary }]}>{t('home.viewCourse')}</Text></Pressable>
      </View>
      <Pressable
        onPress={() => router.push('/lesson/molecular-biology-dna')}
        style={({ pressed }) => [styles.continueCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.88 : 1 }]}
      >
        <View style={[styles.lessonVisual, { backgroundColor: '#E5F4EA' }]}>
          <View style={styles.dnaRailLeft} />
          <View style={styles.dnaRailRight} />
          {[0, 1, 2, 3].map((item) => <View key={item} style={[styles.dnaRung, { top: 18 + item * 13, backgroundColor: colors.primary }]} />)}
        </View>
        <View style={styles.lessonCopy}>
          <Text style={[styles.lessonKicker, { color: colors.primary }]}>{t('home.lessonKicker')}</Text>
          <Text style={[styles.lessonTitle, { color: colors.foreground }]}>{t('home.lessonTitle')}</Text>
          <Text style={[styles.lessonSub, { color: colors.mutedForeground }]}>{t('home.lessonSubtitle')}</Text>
          <View style={styles.lessonMeta}><View style={[styles.miniProgressTrack, { backgroundColor: colors.secondary }]}><View style={[styles.miniProgressFill, { backgroundColor: colors.primary, width: `${progressPercent}%` }]} /></View><Text style={[styles.lessonPercent, { color: colors.mutedForeground }]}>{progressPercent}%</Text></View>
        </View>
        <View style={[styles.playButton, { backgroundColor: colors.foreground }]}><Feather name="play" size={14} color={colors.card} /></View>
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('home.exploreTitle')}</Text>
        <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>{t('home.total')}</Text>
      </View>
      <View style={styles.grid}>
        {disciplines.map((discipline) => {
          const available = AVAILABLE_DISCIPLINES.includes(discipline.id);
          const progress = available ? progressPercent : 0;
          return (
          <Pressable
            key={discipline.id}
            disabled={!available}
            accessibilityState={{ disabled: !available }}
            onPress={() => router.push({ pathname: '/course/[id]', params: { id: discipline.id } })}
            style={({ pressed }) => [styles.disciplineCard, { width: cardWidth, backgroundColor: colors.card, borderColor: colors.border, opacity: !available ? 0.6 : pressed ? 0.84 : 1 }]}
          >
            <View style={[styles.disciplineIcon, { backgroundColor: available ? colors.secondary : colors.muted }]}>
              <Feather name={discipline.icon as keyof typeof Feather.glyphMap} size={18} color={available ? colors.primary : colors.mutedForeground} />
            </View>
            <Text style={[styles.disciplineTitle, { color: colors.foreground }]} numberOfLines={2}>{getLocalizedText(discipline.title, language)}</Text>
            <Text style={[styles.disciplineSubtitle, { color: colors.mutedForeground }]} numberOfLines={2}>{getLocalizedText(discipline.subtitle, language)}</Text>
            <View style={styles.disciplineFooter}>
              {available ? (
                <>
                  <View style={[styles.miniProgressTrack, { backgroundColor: colors.secondary }]}><View style={[styles.miniProgressFill, { backgroundColor: colors.primary, width: `${progress}%` }]} /></View>
                  <Text style={[styles.disciplinePercent, { color: colors.mutedForeground }]}>{progress}%</Text>
                </>
              ) : (
                <Text style={[styles.comingSoon, { color: colors.mutedForeground }]}>{t('home.comingSoon')}</Text>
              )}
            </View>
          </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  headerIdentity: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.3, marginBottom: 4 },
  greeting: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  streakRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, marginBottom: 14 },
  streakIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  streakCopy: { flex: 1, marginLeft: 10 },
  streakTitle: { fontSize: 13, fontWeight: '700' },
  streakSub: { fontSize: 11, marginTop: 2 },
  streakAction: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  progressCard: { borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 26, minHeight: 173 },
  progressCopy: { flex: 1, paddingRight: 10 },
  progressLabel: { color: '#C8EBD2', fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginBottom: 8 },
  progressHeadline: { color: '#FFFFFF', fontSize: 23, lineHeight: 27, fontWeight: '700', letterSpacing: -0.6 },
  progressDetail: { color: '#D8F1DF', fontSize: 11, lineHeight: 16, marginTop: 9 },
  progressTrack: { height: 5, backgroundColor: '#5BA781', borderRadius: 3, marginTop: 13, width: '93%' },
  progressFill: { height: 5, backgroundColor: '#E6F7E8', borderRadius: 3 },
  progressCircle: { width: 77, height: 77, borderRadius: 39, borderWidth: 7, borderColor: '#A7DDB6', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-12deg' }] },
  progressNumber: { color: '#FFFFFF', fontSize: 25, fontWeight: '700', lineHeight: 27, transform: [{ rotate: '12deg' }] },
  progressPercent: { color: '#D8F1DF', fontSize: 10, fontWeight: '700', transform: [{ rotate: '12deg' }] },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.4 },
  seeAll: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  countLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  continueCard: { borderRadius: 21, borderWidth: 1, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  lessonVisual: { width: 77, height: 88, borderRadius: 15, position: 'relative', overflow: 'hidden' },
  dnaRailLeft: { position: 'absolute', left: 25, top: 13, width: 4, height: 63, borderRadius: 3, backgroundColor: '#2F8F68', transform: [{ rotate: '18deg' }] },
  dnaRailRight: { position: 'absolute', left: 48, top: 13, width: 4, height: 63, borderRadius: 3, backgroundColor: '#81C79B', transform: [{ rotate: '-18deg' }] },
  dnaRung: { position: 'absolute', left: 27, width: 23, height: 3, borderRadius: 2, transform: [{ rotate: '5deg' }] },
  lessonCopy: { flex: 1, paddingHorizontal: 12 },
  lessonKicker: { fontSize: 9, letterSpacing: 0.7, fontWeight: '800', marginBottom: 5 },
  lessonTitle: { fontSize: 16, fontWeight: '700' },
  lessonSub: { fontSize: 11, marginTop: 3 },
  lessonMeta: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 13 },
  miniProgressTrack: { height: 4, width: 60, borderRadius: 2, overflow: 'hidden' },
  miniProgressFill: { height: 4, borderRadius: 2 },
  lessonPercent: { fontSize: 10, fontWeight: '600' },
  playButton: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  disciplineCard: { minHeight: 163, borderRadius: 19, borderWidth: 1, padding: 14 },
  disciplineIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  disciplineTitle: { fontSize: 14, fontWeight: '700', lineHeight: 18 },
  disciplineSubtitle: { fontSize: 10.5, lineHeight: 15, marginTop: 4, minHeight: 30 },
  disciplineFooter: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 'auto' },
  disciplinePercent: { fontSize: 10, fontWeight: '600' },
  comingSoon: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
});
