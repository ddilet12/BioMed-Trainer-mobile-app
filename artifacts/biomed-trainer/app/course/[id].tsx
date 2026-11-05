import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { disciplines, courseTopics, getLocalizedText } from '@/data/content';
import { useStudy } from '@/context/StudyContext';
import { useTranslation } from 'react-i18next';

const topicMeta = [
  { duration: 12, typeKey: 'course.interactiveLesson', free: true },
  { duration: 10, typeKey: 'course.theoryVisual', free: false },
  { duration: 14, typeKey: 'course.practiceSet', free: false },
  { duration: 16, typeKey: 'course.clinicalCase', free: false },
  { duration: 13, typeKey: 'course.interactiveLesson', free: false },
];

export default function CourseScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { language, progressPercent } = useStudy();
  const { t } = useTranslation();
  const course = disciplines.find((item) => item.id === id) ?? disciplines[0];
  const courseNumber = disciplines.findIndex((item) => item.id === course.id) + 1;
  const topInset = insets.top + (Platform.OS === 'web' ? 67 : 0);
  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: insets.bottom + 30 }} showsVerticalScrollIndicator={false}>
      <View style={[styles.hero, { backgroundColor: colors.foreground, paddingTop: topInset + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.back}><Feather name="arrow-left" size={19} color="#FFFFFF" /></Pressable>
        <View style={[styles.heroIcon, { backgroundColor: colors.primary }]}><Feather name={course.icon as keyof typeof Feather.glyphMap} size={23} color="#FFFFFF" /></View>
        <Text style={styles.eyebrow}>{t('course.discipline', { number: String(courseNumber).padStart(2, '0') })}</Text>
        <Text style={styles.title}>{getLocalizedText(course.title, language)}</Text>
        <Text style={styles.description}>{getLocalizedText(course.description, language)}</Text>
        <View style={styles.courseMeta}><Text style={styles.metaText}>{t('course.complete', { percent: progressPercent })}</Text><View style={styles.heroTrack}><View style={[styles.heroFill, { width: `${progressPercent}%` }]} /></View><Text style={styles.metaText}>{t('course.totalTime')}</Text></View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyHeading}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('course.courseTopics')}</Text><Text style={[styles.topicCount, { color: colors.mutedForeground }]}>{t('course.topicCount', { count: courseTopics.length })}</Text></View>
        <View style={styles.topicList}>
          {courseTopics.map((topic, index) => {
            const meta = topicMeta[index];
            return (
            <Pressable
              key={topic.ru}
              disabled={!meta.free}
              onPress={() => router.push('/lesson/molecular-biology-dna')}
              style={({ pressed }) => [styles.topicRow, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.82 : 1 }]}
            >
              <View style={[styles.topicNumber, { backgroundColor: index === 0 ? colors.primary : colors.muted }]}>{meta.free ? <Text style={[styles.numberText, { color: index === 0 ? '#FFFFFF' : colors.mutedForeground }]}>{index + 1}</Text> : <Feather name="clock" size={13} color={colors.mutedForeground} />}</View>
              <View style={{ flex: 1 }}><Text style={[styles.topicTitle, { color: colors.foreground }]}>{getLocalizedText(topic, language)}</Text><Text style={[styles.topicDetail, { color: colors.mutedForeground }]}>{t(meta.typeKey)} · {t('course.minutes', { count: meta.duration })}</Text></View>
              {meta.free ? <Feather name="chevron-right" size={18} color={colors.primary} /> : <Text style={[styles.lockedLabel, { color: colors.mutedForeground }]}>{t('course.comingSoon')}</Text>}
            </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hero: { paddingHorizontal: 21, paddingBottom: 24 },
  back: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#42624F', alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  heroIcon: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 17 },
  eyebrow: { color: '#A8D2B4', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  title: { color: '#FFFFFF', fontSize: 31, fontWeight: '700', letterSpacing: -1 },
  description: { color: '#C1D8C7', fontSize: 13, lineHeight: 19, marginTop: 10, maxWidth: 320 },
  courseMeta: { marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 9 },
  metaText: { color: '#C1D8C7', fontSize: 10, fontWeight: '700' },
  heroTrack: { height: 5, borderRadius: 3, backgroundColor: '#3C6D52', flex: 1, overflow: 'hidden' },
  heroFill: { height: 5, backgroundColor: '#9BD7A9', borderRadius: 3 },
  body: { paddingHorizontal: 20, paddingTop: 24 },
  bodyHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  sectionTitle: { fontSize: 19, fontWeight: '700', letterSpacing: -0.4 },
  topicCount: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  topicList: { gap: 9 },
  topicRow: { borderRadius: 17, borderWidth: 1, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 11 },
  topicNumber: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  numberText: { fontSize: 12, fontWeight: '800' },
  topicTitle: { fontSize: 13, fontWeight: '700' },
  topicDetail: { fontSize: 10, marginTop: 4 },
  lockedLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 0.7 },
});