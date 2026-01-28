import Reactotron, { asyncStorage } from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import { AsyncStorage } from '@react-native-async-storage/async-storage';

const reactotron = Reactotron
    .configure() // controls connection & communication settings
    .useReactNative() // add all built-in react native plugins
    .use(reactotronRedux())
    .use(asyncStorage())
    .connect(); // let's connect!

export default reactotron;
