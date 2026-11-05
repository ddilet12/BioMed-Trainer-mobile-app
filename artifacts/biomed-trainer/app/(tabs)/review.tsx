import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/context/StudyContext';
import { useTranslation } from 'react-i18next';

const items = [
  { id: 'dna-review', lessonId: 'molecular-biology-dna', titleKey: 'home.lessonTitle', detailKey: 'review.dnaDetail', icon: 'activity' },
];

export default function ReviewScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { streak } = useStudy();
  const { t } = useTranslation();
  const topInset = insets.top + (Platform.OS === 'web' ? 67 : 0);
  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingTop: topInset, paddingBottom: insets.bottom + 112 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={[styles.kicker, { color: colors.primary }]}>{t('review.kicker')}</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>{t('review.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{t('review.subtitle')}</Text>
        </View>
        <View style={[styles.streakBadge, { backgroundColor: colors.secondary }]}><Feather name="zap" size={15} color={colors.primary} /><Text style={[styles.streakText, { color: colors.primary }]}>{streak}</Text></View>
      </View>
      <Pressable onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: items[0].lessonId } })} style={({ pressed }) => [styles.summaryCard, { backgroundColor: colors.foreground, opacity: pressed ? 0.88 : 1 }]}>
        <View style={[styles.summaryIcon, { backgroundColor: colors.primary }]}><Feather name="refresh-cw" size={18} color={colors.card} /></View>
        <View style={{ flex: 1 }}><Text style={styles.summaryTitle}>{t('review.summaryTitle')}</Text><Text style={styles.summarySub}>{t('review.summarySubtitle')}</Text></View>
        <Feather name="arrow-up-right" size={18} color="#BEE6C9" />
      </Pressable>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('review.sectionTitle')}</Text>
      <View style={styles.list}>
        {items.map((item, index) => (
          <Pressable key={item.id} onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: item.lessonId } })} style={({ pressed }) => [styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.84 : 1 }]}>
            <View style={[styles.reviewIcon, { backgroundColor: index === 0 ? colors.secondary : '#F3EBDD' }]}><Feather name={item.icon as keyof typeof Feather.glyphMap} size={19} color={index === 0 ? colors.primary : '#B17A43'} /></View>
            <View style={{ flex: 1, paddingRight: 8 }}><Text style={[styles.itemTag, { color: colors.mutedForeground }]}>{t('disciplines.molecular.title').toUpperCase()}</Text><Text style={[styles.itemTitle, { color: colors.foreground }]}>{t(item.titleKey)}</Text><Text style={[styles.itemDetail, { color: colors.mutedForeground }]}>{t(item.detailKey)}</Text></View>
            <View style={[styles.arrow, { borderColor: colors.border }]}><Feather name="chevron-right" size={16} color={colors.primary} /></View>
          </Pressable>
        ))}
      </View>
      <View style={[styles.tip, { backgroundColor: colors.secondary }]}>
        <Feather name="info" size={16} color={colors.primary} />
        <Text style={[styles.tipText, { color: colors.secondaryForeground }]}>{t('review.tip')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  title: { fontSize: 27, fontWeight: '700', letterSpacing: -0.8 },
  subtitle: { fontSize: 13, marginTop: 6 },
  streakBadge: { borderRadius: 15, paddingHorizontal: 11, paddingVertical: 8, flexDirection: 'row', gap: 5, alignItems: 'center' },
  streakText: { fontSize: 13, fontWeight: '800' },
  summaryCard: { marginHorizontal: 20, borderRadius: 20, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 29 },
  summaryIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  summaryTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  summarySub: { color: '#BBD8C4', fontSize: 11, marginTop: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginHorizontal: 20, marginBottom: 13 },
  list: { marginHorizontal: 20, gap: 10 },
  reviewCard: { borderRadius: 19, borderWidth: 1, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 },
  reviewIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  itemTag: { fontSize: 9, fontWeight: '800', letterSpacing: 0.6, marginBottom: 4 },
  itemTitle: { fontSize: 15, fontWeight: '700' },
  itemDetail: { fontSize: 11, marginTop: 4 },
  arrow: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  tip: { marginHorizontal: 20, marginTop: 25, borderRadius: 17, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  tipText: { flex: 1, fontSize: 11, lineHeight: 16 },
});