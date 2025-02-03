import { toast } from '@backpackapp-io/react-native-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';
import { green } from './constants/Colors';
import usePreferencesStore from './stores/preferenceStore';
import useUserProfileStore from './stores/useUserProfileStore';
//AsyncStorage.clear();

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .useReactNative({ asyncStorage: true })
  .connect();

Reactotron.onCustomCommand({
  title: 'Success toast',
  command: 'Test success',
  handler: () =>
    toast.success('Nice cock bro', {
      icon: '✅',
      duration: 5000,
      styles: {
        indicator: { backgroundColor: green[700] },
      },
    }),
  description: 'Send a success toast',
});

Reactotron.onCustomCommand({
  title: 'Error toast',
  command: 'Test error',
  handler: () =>
    toast.error('Ugly cock bro', {
      icon: '❌',
    }),
  description: 'Send a error toast',
});

Reactotron.onCustomCommand({
  title: 'User profile store state',
  command: 'Log state',
  handler: () => {
    console.log(useUserProfileStore.getState());
  },
  description: 'Inspect the user profile store state',
});

Reactotron.onCustomCommand({
  title: 'Preference store state',
  command: 'Log state',
  handler: () => {
    console.log(usePreferencesStore.getState());
  },
  description: 'Inspect the preference store state',
});
