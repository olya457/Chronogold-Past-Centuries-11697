import { useWindowDimensions } from 'react-native';
export function useLayout() {
  const { width, height, fontScale } = useWindowDimensions();
  const compact = width < 375 || height < 700;
  return {
    width,
    height,
    compact,
    stacked: width < 350 || fontScale > 1.3,
    gutter: width < 375 ? 14 : 20,
    titleSize: width < 375 ? 30 : 36,
    cardPadding: width < 375 ? 14 : 18,
    artHeight: Math.min(360, height * (height < 700 ? 0.31 : 0.39)),
    studyHeight: Math.min(360, Math.max(220, height * 0.4)),
  };
}
