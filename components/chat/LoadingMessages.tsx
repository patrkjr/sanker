import { StyleSheet } from 'react-native';
import React from 'react';
import { View } from '../Themed';
import LoadingShimmer from '../ui/LoadingShimmer';
import DefaultStyles from '@/constants/DefaultStyles';

export default function LoadingMessages() {
  const Loading = () => {
    return <LoadingShimmer style={{ height: 62 }} />;
  };

  return (
    <View style={pageContainer}>
      <Loading />
      <Loading />
      <Loading />
      <Loading />
    </View>
  );
}

const { pageContainer } = DefaultStyles;

const styles = StyleSheet.create({});
