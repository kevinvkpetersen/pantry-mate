import { useMemo } from 'react';
import type { ColorValue, TextStyle } from 'react-native';
import { StyleSheet } from 'react-native';

export const BADGE_VARIANTS = ['fresh', 'warning', 'expired'] as const;
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

const colors = {
    white: '#FFFFFF',
    theme: {
        light: '#EEFCEF',
        mid: '#0F5714',
        dark: '#062308',
    },
    variants: {
        fresh: { primary: '#0E5814', subtle: '#DCF9DE' },
        warning: { primary: '#8A5A00', subtle: '#FFF1D6' },
        expired: { primary: '#B3261E', subtle: '#FBE9E7' },
    } satisfies Record<
        BadgeVariant,
        { primary: ColorValue; subtle: ColorValue }
    >,
} as const;

const spacing = {
    relaxed: 16,
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
            list: {
                padding: spacing.relaxed,
                gap: spacing.normal,
            },
        }),
        canvas: StyleSheet.create({
            background: {
                backgroundColor: colors.theme.light,
            },
        }),
        badge: {
            styles: StyleSheet.create({
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
            variants: {
                fresh: StyleSheet.create({
                    view: { backgroundColor: colors.variants.fresh.subtle },
                    text: { color: colors.variants.fresh.primary },
                }),
                warning: StyleSheet.create({
                    view: { backgroundColor: colors.variants.warning.subtle },
                    text: { color: colors.variants.warning.primary },
                }),
                expired: StyleSheet.create({
                    view: { backgroundColor: colors.variants.expired.subtle },
                    text: { color: colors.variants.expired.primary },
                }),
            } satisfies Record<BadgeVariant, { view: object; text: object }>,
        },
    };
};

const useStyles = () => {
    return useMemo(() => createStyles(), []);
};

export default useStyles;
