import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/context/StudyContext';
import { disciplines, getLocalizedText } from '@/data/content';
import { glossary } from '@/data/glossary';

const ALL = 'all';

export default function GlossaryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language } = useStudy();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>(ALL);
  const [expanded, setExpanded] = useState<string | null>(null);
  const topInset = insets.top + (Platform.OS === 'web' ? 67 : 0);

  const terms = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return glossary
      .filter((item) => filter === ALL || item.discipline === filter)
      .filter((item) => {
        if (!q) return true;
        return (
          getLocalizedText(item.term, language).toLocaleLowerCase().includes(q) ||
          getLocalizedText(item.definition, language).toLocaleLowerCase().includes(q)
        );
      })
      .sort((a, b) => getLocalizedText(a.term, language).localeCompare(getLocalizedText(b.term, language), language));
  }, [query, filter, language]);

  const disciplineTitle = (id: string) => {
    const discipline = disciplines.find((item) => item.id === id);
    return discipline ? getLocalizedText(discipline.title, language) : '';
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topInset, paddingBottom: insets.bottom + 112 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.kicker, { color: colors.primary }]}>{t('glossary.kicker')}</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>{t('glossary.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{t('glossary.subtitle', { count: glossary.length })}</Text>
      </View>

      <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('glossary.searchPlaceholder')}
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { color: colors.foreground }]}
          autoCorrect={false}
          clearButtonMode="while-editing"
          accessibilityLabel={t('glossary.searchPlaceholder')}
        />
        {query.length > 0 && Platform.OS !== 'ios' && (
          <Pressable onPress={() => setQuery('')} hitSlop={10} accessibilityLabel={t('glossary.clear')}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {[{ id: ALL, label: t('glossary.all') }, ...disciplines.map((item) => ({ id: item.id, label: getLocalizedText(item.title, language) }))].map((chip) => {
          const active = filter === chip.id;
          return (
            <Pressable
              key={chip.id}
              onPress={() => setFilter(chip.id)}
              accessibilityState={{ selected: active }}
              style={[styles.chip, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border }]}
            >
              <Text style={[styles.chipText, { color: active ? colors.primaryForeground : colors.foreground }]}>{chip.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.list}>
        {terms.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.secondary }]}>
            <Feather name="book-open" size={18} color={colors.primary} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t('glossary.empty')}</Text>
          </View>
        ) : (
          terms.map((item) => {
            const open = expanded === item.id || query.trim().length > 0;
            return (
              <Pressable
                key={item.id}
                onPress={() => setExpanded(expanded === item.id ? null : item.id)}
                style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.88 : 1 }]}
              >
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.tag, { color: colors.primary }]} numberOfLines={1}>{disciplineTitle(item.discipline).toUpperCase()}</Text>
                    <Text style={[styles.term, { color: colors.foreground }]}>{getLocalizedText(item.term, language)}</Text>
                  </View>
                  <Feather name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.mutedForeground} />
                </View>
                <Text style={[styles.definition, { color: colors.mutedForeground }]} numberOfLines={open ? undefined : 2}>
                  {getLocalizedText(item.definition, language)}
                </Text>
              </Pressable>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, marginBottom: 18 },
  kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  title: { fontSize: 30, fontWeight: '700', letterSpacing: -0.9, marginTop: 8 },
  subtitle: { fontSize: 13, lineHeight: 19, marginTop: 6 },
  search: { marginHorizontal: 20, borderWidth: 1, borderRadius: 15, paddingHorizontal: 13, height: 46, flexDirection: 'row', alignItems: 'center', gap: 9 },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
  chips: { paddingHorizontal: 20, gap: 8, paddingVertical: 14 },
  chip: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 13, paddingVertical: 8 },
  chipText: { fontSize: 12, fontWeight: '700' },
  list: { paddingHorizontal: 20, gap: 9 },
  card: { borderWidth: 1, borderRadius: 17, padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tag: { fontSize: 9, fontWeight: '800', letterSpacing: 0.9, marginBottom: 4 },
  term: { fontSize: 15, fontWeight: '700' },
  definition: { fontSize: 12.5, lineHeight: 18, marginTop: 7 },
  empty: { borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  emptyText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
