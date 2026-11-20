import { Feather } from '@expo/vector-icons';
import * as InAppUpdates from 'expo-in-app-updates';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/hooks/useColors';

type BannerState = 'hidden' | 'available' | 'downloading';

/**
 * Shows a banner when Google Play has a newer version of the app (Android only).
 * Uses Play's flexible in-app update: the download runs in the background and
 * the app restarts into the new version when it is ready.
 */
export function UpdateBanner() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [state, setState] = useState<BannerState>('hidden');

  useEffect(() => {
    if (__DEV__ || Platform.OS !== 'android') return;
    let active = true;
    InAppUpdates.checkForUpdate()
      .then((info) => {
        if (!active) return;
        if (info.updateInProgress) setState('downloading');
        else if (info.updateAvailable) setState('available');
      })
      .catch(() => undefined); // Not installed from Google Play, offline, etc.

    const removeCancelled = InAppUpdates.addUpdateListener('updateCancelled', () => setState('available'));
    const removeDownloaded = InAppUpdates.addUpdateListener('updateDownloaded', () => setState('downloading'));
    return () => {
      active = false;
      removeCancelled();
      removeDownloaded();
    };
  }, []);

  if (state === 'hidden') return null;

  const startUpdate = async () => {
    setState('downloading');
    try {
      const started = await InAppUpdates.startUpdate(false);
      if (!started) setState('available');
    } catch {
      setState('available');
    }
  };

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { top: insets.top + 8 }]}>
      <View style={[styles.banner, { backgroundColor: colors.foreground }]} accessibilityRole="alert">
        <View style={[styles.icon, { backgroundColor: colors.primary }]}>
          {state === 'downloading' ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Feather name="download" size={16} color="#FFFFFF" />}
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>{state === 'downloading' ? t('update.downloadingTitle') : t('update.title')}</Text>
          <Text style={styles.body}>{state === 'downloading' ? t('update.downloadingBody') : t('update.body')}</Text>
        </View>
        {state === 'available' && (
          <View style={styles.actions}>
            <Pressable onPress={startUpdate} style={[styles.action, { backgroundColor: colors.primary }]} accessibilityRole="button">
              <Text style={styles.actionText}>{t('update.action')}</Text>
            </Pressable>
            <Pressable onPress={() => setState('hidden')} hitSlop={8} accessibilityRole="button" accessibilityLabel={t('update.later')}>
              <Text style={styles.later}>{t('update.later')}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 12, right: 12, zIndex: 100 },
  banner: { borderRadius: 18, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11, elevation: 6, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  icon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1 },
  title: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  body: { color: '#C1D8C7', fontSize: 11, lineHeight: 15, marginTop: 2 },
  actions: { alignItems: 'center', gap: 6 },
  action: { borderRadius: 11, paddingHorizontal: 12, paddingVertical: 8 },
  actionText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  later: { color: '#A8D2B4', fontSize: 11, fontWeight: '700' },
});
