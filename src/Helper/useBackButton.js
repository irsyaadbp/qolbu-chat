import {useEffect} from 'react';
import {BackHandler} from 'react-native';

const useBackButton = handler => {
  // Frustration isolated! Yay! 🎉
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handler);
    };
  }, [handler]);
};

export default useBackButton;
