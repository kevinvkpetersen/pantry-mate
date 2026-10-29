import { screen } from '@testing-library/react-native';

export const expectNoNullishText = () => {
    expect(screen.queryByText('null', { exact: false })).toBeNull();
    expect(screen.queryByText('undefined', { exact: false })).toBeNull();
};
