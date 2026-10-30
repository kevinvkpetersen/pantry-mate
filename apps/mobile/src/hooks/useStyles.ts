import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

const colors = {
    white: '#FFFFFF',
    theme: { mid: '#0F5714', dark: '#062308' },
};

const spacing = {
    normal: 12,
    tight: 8,
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
                fontSize: 16,
                fontWeight: '600',
                color: colors.theme.dark,
            },
            detail: {
                fontSize: 14,
                color: colors.theme.mid,
            },
        }),
    };
};

const useStyles = () => {
    return useMemo(() => createStyles(), []);
};

export default useStyles;
