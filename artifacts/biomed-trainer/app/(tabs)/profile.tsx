import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppLogo } from '@/components/AppLogo';
import { useColors } from '@/hooks/useColors';
import { Language, useStudy } from '@/context/StudyContext';
import { useTranslation } from 'react-i18next';
import { PRIVACY_POLICY_URL, SUPPORT_EMAIL } from '@/constants/app';

const languages: { code: Language; labelKey: string }[] = [
  { code: 'en', labelKey: 'languages.shortEn' },
  { code: 'ru', labelKey: 'languages.shortRu' },
  { code: 'kk', labelKey: 'languages.shortKk' },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, setLanguage, completedCount, progressPercent } = useStudy();
  const { t } = useTranslation();
  const topInset = insets.top + (Platform.OS === 'web' ? 67 : 0);
  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingTop: topInset, paddingBottom: insets.bottom + 112 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><Text style={[styles.kicker, { color: colors.primary }]}>{t('profile.kicker')}</Text><Text style={[styles.title, { color: colors.foreground }]}>{t('profile.title')}</Text></View>
      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <AppLogo size={54} />
        <View style={{ flex: 1, marginLeft: 13 }}><Text style={[styles.name, { color: colors.foreground }]}>{t('profile.studentName')}</Text><Text style={[styles.email, { color: colors.mutedForeground }]}>{t('profile.studentMeta')}</Text></View>
      </View>
      <View style={styles.statsRow}>
        <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.statNumber, { color: colors.foreground }]}>{progressPercent}%</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{t('profile.overallProgress')}</Text></View>
        <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.statNumber, { color: colors.foreground }]}>{completedCount}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{t('profile.topicsCompleted')}</Text></View>
      </View>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t('profile.preferences')}</Text>
      <View style={[styles.preferenceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.preferenceHeading}><View style={[styles.preferenceIcon, { backgroundColor: colors.secondary }]}><Feather name="globe" size={17} color={colors.primary} /></View><View><Text style={[styles.preferenceTitle, { color: colors.foreground }]}>{t('profile.languageTitle')}</Text><Text style={[styles.preferenceSub, { color: colors.mutedForeground }]}>{t('profile.languageSubtitle')}</Text></View></View>
        <View style={styles.languageRow}>
          {languages.map((item) => <Pressable key={item.code} onPress={() => setLanguage(item.code)} style={[styles.languageButton, { backgroundColor: language === item.code ? colors.primary : colors.background, borderColor: language === item.code ? colors.primary : colors.border }]}><Text style={[styles.languageLabel, { color: language === item.code ? colors.primaryForeground : colors.mutedForeground }]}>{t(item.labelKey)}</Text></Pressable>)}
        </View>
      </View>
      <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
          { icon: 'mail', titleKey: 'profile.help', detailKey: 'profile.contactDetail', url: `mailto:${SUPPORT_EMAIL}?subject=BioMed%20Trainer` },
          { icon: 'shield', titleKey: 'profile.privacy', detailKey: 'profile.privacyDetail', url: PRIVACY_POLICY_URL },
        ].map((item, index, list) => <Pressable key={item.titleKey} onPress={() => { Linking.openURL(item.url).catch(() => undefined); }} accessibilityRole="link" style={[styles.menuRow, index < list.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}><View style={[styles.menuIcon, { backgroundColor: colors.muted }]}><Feather name={item.icon as keyof typeof Feather.glyphMap} size={16} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={[styles.menuTitle, { color: colors.foreground }]}>{t(item.titleKey)}</Text><Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{t(item.detailKey)}</Text></View><Feather name="chevron-right" size={17} color={colors.mutedForeground} /></Pressable>)}
      </View>
      <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>{t('profile.disclaimer')}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, marginBottom: 17 },
  kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 7 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.8 },
  profileCard: { marginHorizontal: 20, borderRadius: 20, borderWidth: 1, padding: 15, flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '700' },
  email: { fontSize: 11, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 20, marginTop: 10, marginBottom: 27 },
  stat: { flex: 1, borderRadius: 17, borderWidth: 1, padding: 15 },
  statNumber: { fontSize: 22, fontWeight: '700' },
  statLabel: { fontSize: 10, marginTop: 5 },
  disclaimer: { marginHorizontal: 20, marginTop: 18, fontSize: 11, lineHeight: 16 },
  sectionTitle: { marginHorizontal: 20, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  preferenceCard: { marginHorizontal: 20, borderRadius: 19, borderWidth: 1, padding: 15, marginBottom: 13 },
  preferenceHeading: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  preferenceIcon: { width: 35, height: 35, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  preferenceTitle: { fontSize: 14, fontWeight: '700' },
  preferenceSub: { fontSize: 10, marginTop: 3 },
  languageRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  languageButton: { flex: 1, borderWidth: 1, borderRadius: 11, paddingVertical: 10, alignItems: 'center' },
  languageLabel: { fontSize: 12, fontWeight: '800' },
  menuCard: { marginHorizontal: 20, borderRadius: 19, borderWidth: 1, paddingHorizontal: 14 },
  menuRow: { paddingVertical: 13, flexDirection: 'row', alignItems: 'center', gap: 11 },
  menuIcon: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  menuTitle: { fontSize: 13, fontWeight: '700' },
  menuSub: { fontSize: 10, marginTop: 3 },
});