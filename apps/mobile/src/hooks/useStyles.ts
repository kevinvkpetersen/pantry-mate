import { useMemo } from 'react';
import type { TextStyle } from 'react-native';
import { StyleSheet } from 'react-native';

const colors = {
    white: '#FFFFFF',
    theme: { mid: '#0F5714', dark: '#062308' },
};

const spacing = {
    normal: 12,
    tight: 8,
};

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
            surface: {
                backgroundColor: colors.white,
                padding: spacing.tight,
                paddingHorizontal: spacing.normal,
                borderRadius: spacing.normal,
            },
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
    };
};

const useStyles = () => {
    return useMemo(() => createStyles(), []);
};

export default useStyles;
