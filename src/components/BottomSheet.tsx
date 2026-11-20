import { ReactNode, useMemo } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  showCloseButton?: boolean;
};

/**
 * Modal bottom sheet used for the trip editors. Renders a dimmed backdrop and a
 * rounded sheet pinned to the bottom, with a drag handle and safe-area padding.
 */
export function BottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  children,
  showCloseButton = true,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close sheet"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}
        >
          <View style={styles.handle} />
          {title ? (
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    theme.typography.headlineSm,
                    { color: theme.colors.secondary },
                  ]}
                >
                  {title}
                </Text>
                {subtitle ? (
                  <Text
                    style={[
                      theme.typography.bodySm,
                      {
                        color: theme.colors.onSurfaceVariant,
                        marginTop: 2,
                      },
                    ]}
                  >
                    {subtitle}
                  </Text>
                ) : null}
              </View>
              {showCloseButton ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                  onPress={onClose}
                  hitSlop={8}
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text
                    style={[
                      theme.typography.labelMd,
                      { color: theme.colors.primary },
                    ]}
                  >
                    Done
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scroll}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: theme.colors.overlay,
    },
    sheet: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.radii.sheet,
      borderTopRightRadius: theme.radii.sheet,
      paddingHorizontal: theme.spacing.page,
      paddingTop: theme.spacing.sm,
      maxHeight: '92%',
      ...theme.shadows.warm,
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.outlineVariant,
      marginBottom: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    closeButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primaryContainer,
    },
    scroll: {
      paddingBottom: theme.spacing.lg,
      gap: theme.spacing.md,
    },
  });
}