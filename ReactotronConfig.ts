import { toast } from '@backpackapp-io/react-native-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';
import { green } from './constants/Colors';
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
