import React, { forwardRef } from 'react';
import { ScrollViewProps } from 'react-native';
import DefaultStyles from '@/constants/DefaultStyles';
import usePreferencesStore from '@/stores/preferenceStore';
import Animated from 'react-native-reanimated';

interface PageScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
}

const INDICATOR_COLOR = {
  system: 'default' as const,
  light: 'black' as const,
  dark: 'white' as const,
};

const PageScrollView = forwardRef<Animated.ScrollView, PageScrollViewProps>(
  ({ children, contentContainerStyle, ...props }, ref) => {
    const { userPreferences } = usePreferencesStore();

    return (
      <Animated.ScrollView
        ref={ref}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          DefaultStyles.pageContainer,
          contentContainerStyle,
        ]}
        indicatorStyle={INDICATOR_COLOR[userPreferences.theme]}
        {...props}
      >
        {children}
      </Animated.ScrollView>
    );
  }
);

export default PageScrollView;
