import { render, renderHook, screen } from '@testing-library/react-native';

import type { BadgeVariant } from '@/hooks/useStyles';
import useStyles from '@/hooks/useStyles';

import Badge from './Badge';

describe('Badge', () => {
    it('renders its text', async () => {
        await render(<Badge text="Fresh" variant="fresh" />);

        expect(screen.getByText('Fresh')).toBeOnTheScreen();
    });

    it.each<BadgeVariant>(['fresh'])(
        'applies the %s variant styles',
        async (variant) => {
            const { result } = await renderHook(() => useStyles());
            const expected = result.current.badge.variants[variant];

            await render(<Badge text="Label" variant={variant} />);

            const text = screen.getByText('Label');
            expect(text).toHaveStyle(expected.text);
            expect(text.parent).toHaveStyle(expected.view);
        }
    );
});
