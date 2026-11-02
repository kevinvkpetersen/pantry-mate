import { useMemo } from 'react';
import type { TextStyle } from 'react-native';
import { StyleSheet } from 'react-native';

const colors = {
    white: '#FFFFFF',
    theme: { mid: '#0F5714', dark: '#062308' },
} as const;

const spacing = {
    normal: 12,
    tight: 8,
    xTight: 4,
} as const;

const radius = {
    normal: 12,
    full: 9999,
} as const;

const font = {
    size: {
        medium: 16,
        small: 14,
    },
    weight: {
        semibold: '600',
    },
} as const satisfies {
    size: Record<string, number>;
    weight: Record<string, TextStyle['fontWeight']>;
};

const createStyles = () => {
    return {
        text: StyleSheet.create({
            primary: {
                fontSize: font.size.medium,
                fontWeight: font.weight.semibold,
                color: colors.theme.dark,
            },
            detail: {
                fontSize: font.size.small,
                color: colors.theme.mid,
            },
        }),
        card: StyleSheet.create({
            base: {
                padding: spacing.tight,
                paddingHorizontal: spacing.normal,
                borderRadius: radius.normal,
                backgroundColor: colors.white,
            },
        }),
        badge: StyleSheet.create({
            base: {
                padding: spacing.tight,
                paddingVertical: spacing.xTight,
                borderRadius: radius.full,
            },
            text: {
                fontSize: font.size.small,
                fontWeight: font.weight.semibold,
            },
        }),
    };
};

const useStyles = () => {
    return useMemo(() => createStyles(), []);
};

export default useStyles;
