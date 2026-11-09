// Typography styles for the app
// Uses system fonts with Nunito as preferred (loaded via expo-font)

export const FontFamily = {
  light: 'Nunito_300Light',
  regular: 'Nunito_400Regular',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
} as const;

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  hero: 34,
} as const;

export const Typography = {
  heroTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.hero,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
  },
  subtitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.lg,
  },
  bodySmall: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
  },
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
  },
  number: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
  },
  numberLarge: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.xxxl,
  },
} as const;
