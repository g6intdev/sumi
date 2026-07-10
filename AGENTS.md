# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Design system

- Do not hardcode colors, spacing, border radii, or font sizes in application components.
- Define shared semantic design tokens in `src/theme/theme.ts` and use them for custom components, screen layout, and app-specific styling.
- Name color tokens by purpose, such as `background`, `surface`, `textPrimary`, `textSecondary`, `border`, `accent`, and `danger`; do not name them after literal colors.
- Use React Native appearance APIs for light and dark themes where appropriate.
- Prefer Expo UI components when they provide the needed control. Preserve their platform-native appearance and behavior, and only override their internal styling for accessibility or an explicit product requirement.
- Runtime-computed values, animations, measurements, and platform-specific styles may remain in `style` props and do not require tokens.
