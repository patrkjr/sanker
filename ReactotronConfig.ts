import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//AsyncStorage.clear();

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .useReactNative({ asyncStorage: true })
  .connect();
