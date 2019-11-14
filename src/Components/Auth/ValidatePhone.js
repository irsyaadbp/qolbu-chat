import React from 'react';
import {
  Text,
  View,
  TextInput,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import {Button, Input, Item} from 'native-base';
import OTPInputView from '@twotalltotems/react-native-otp-input';
const {height, width} = Dimensions.get('window');
import {UserContext} from '../../UserProvider';

import auth from '@react-native-firebase/auth';

const ValidatePhone = props => {
  const {setUser} = React.useContext(UserContext);
  const [visible, setVisible] = React.useState({
    otp: true,
    verify: false,
  });

  const [state, setState] = React.useState({
    numberPhone: '',
    verifyCode: '',
    phoneAuthSnapshot: '',
    loading: false,
  });

  const onChangeNumber = async number => {
    await setState({...state, numberPhone: `+62${number}`});
  };

  const onSendOtp = async number => {
    await handleSubmit();
  };

  const handleSubmit = () => {
    // const number = '+62' + state.numberPhone;
    if (state.numberPhone === '') {
      Alert.alert('Failed', "Phone number can't be empty");
    } else {
      auth()
        .verifyPhoneNumber(state.numberPhone)
        .on(
          'state_changed',
          phoneAuthSnapshot => {
            console.log();
            console.log('aing macan', phoneAuthSnapshot);
            if (!phoneAuthSnapshot.error)
              setVisible({otp: false, verify: true});

            setState({
              ...state,
              phoneAuthSnapshot,
            });
            // How you handle these state events is entirely up to your ui flow and whether
            // you need to support both ios and android. In short: not all of them need to
            // be handled - it's entirely up to you, your ui and supported platforms.

            // E.g you could handle android specific events only here, and let the rest fall back
            // to the optionalErrorCb or optionalCompleteCb functions
            switch (phoneAuthSnapshot.state) {
              // ------------------------
              //  IOS AND ANDROID EVENTS
              // ------------------------
              case auth.PhoneAuthState.CODE_SENT: // or 'sent'
                console.log('code sent');

                console.log(phoneAuthSnapshot, 'send');
                // on ios this is the final phone auth state event you'd receive
                // so you'd then ask for user input of the code and build a credential from it
                break;
              case auth.PhoneAuthState.ERROR: // or 'error'
                console.log('verification error');
                console.log(phoneAuthSnapshot.error);
                if (phoneAuthSnapshot.error.code === 'auth/unknown') {
                  Alert.alert(
                    'Failed',
                    'This number is too many requests. Try again later or try with another number',
                  );
                } else if (
                  phoneAuthSnapshot.error.code === 'auth/invalid-phone-number'
                ) {
                  Alert.alert('Failed', 'Invalid format phone number');
                }
                break;

              // ---------------------
              // ANDROID ONLY EVENTS
              // ---------------------
              case auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                console.log('auto verify on android timed out');
                // proceed with your manual code input flow, same as you would do in
                // CODE_SENT if you were on IOS
                break;
              case auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
                // auto verified means the code has also been automatically confirmed as correct/received
                // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
                console.log('auto verified on android');
                console.log(phoneAuthSnapshot);
                setState({
                  ...state,
                  phoneAuthSnapshot,
                  verifyCode: phoneAuthSnapshot.code || '',
                });

                // setTimeout(() => {
                submitOtp();
                // }, 2000);

                // Example usage if handling here and not in optionalCompleteCb:
                // const {verificationId, code} = phoneAuthSnapshot;
                // const credential = auth.PhoneAuthProvider.credential(
                //   verificationId,
                //   code,
                // );

                // // Do something with your new credential, e.g.:
                // auth()
                //   .signInWithCredential(credential)
                //   .then(user => {
                //     console.log('PHONE AUTH USER ->>>>>', user);
                //     // this.setState({user: user.toJSON()});
                //   });
                // firebase.auth().linkWithCredential(credential);
                // etc ...
                break;
            }
          },
          error => {
            // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
            // the ERROR case in the above observer then there's no need to handle it here
            console.log(error);
            // verificationId is attached to error if required
            console.log(error.verificationId);
          },
          phoneAuthSnapshot => {
            // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
            // depending on the platform. If you've already handled those cases in the observer then
            // there's absolutely no need to handle it here.

            // Platform specific logic:
            // - if this is on IOS then phoneAuthSnapshot.code will always be null
            // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
            //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
            // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
            //   continue with user input logic.
            console.log(phoneAuthSnapshot, 'uwu');
          },
        );
      // optionally also supports .then & .catch instead of optionalErrorCb &
      // optionalCompleteCb (with the same resulting args)
    }
  };

  const submitOtp = () => {
    console.log('masuk submitOtp');
    const {verificationId} = state.phoneAuthSnapshot;
    const code = state.verifyCode;
    console.log(verificationId, code, 'submitotp');
    const credential = auth.PhoneAuthProvider.credential(verificationId, code);

    // Do something with your new credential, e.g.:
    auth()
      .signInWithCredential(credential)
      .then(async currentUser => {
        console.log('PHONE AUTH USER ->>>>>', currentUser);
        await setUser({
          uid: currentUser.user._user.uid,
          username: currentUser.user._user.displayName,
          email: currentUser.user._user.displayName,
          phone: currentUser.user._user.phoneNumber,
          photo: currentUser.user._user.photoUrl,
        });

        // if (currentUser.additionalUserInfo.isNewUser) {

        props.navigation.navigate('AddProfileScreen');
        // } else {
        //   props.navigation.navigate('Dashboard');
        // }
      })
      .catch(err => {
        Alert.alert('Failed', err.message);
      });
  };

  return (
    <View>
      {props.visible ? (
        <View style={{alignItems: 'center'}}>
          <ImageBackground
            source={require('../../../assets/message-sent.png')}
            style={{
              width: '100%',
              height: height / 3,
              marginHorizontal: 24,
            }}
            resizeMode="center"
          />
          <Text
            style={{
              fontSize: 24,
              marginBottom: 24,
              marginHorizontal: 24,
              fontWeight: 'bold',
            }}>
            OTP Verification
          </Text>
          <InputNumber
            onSendOtp={onSendOtp}
            visible={visible.otp}
            onChangeNumber={onChangeNumber}
            numberPhone={state.numberPhone.replace('+62', '')}
          />
          {console.log(state, 'state')}
          <OtpLayout
            visible={visible.verify}
            numberPhone={state.numberPhone}
            onClickChangeNumber={() => {
              setVisible({otp: true, verify: false}),
                setState({...state, verifyCode: ''});
            }}
            verifyCode={state.verifyCode}
            onChange={value => setState({...state, verifyCode: value})}
            onSubmit={submitOtp}
            state={state}
          />
        </View>
      ) : null}
    </View>
  );
};

const InputNumber = props => {
  return (
    <View>
      {props.visible ? (
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              marginHorizontal: 24,
              fontSize: 16,
              marginBottom: 24,
              textAlign: 'center',
              color: '#9C9C9C',
            }}>
            We will send you{' '}
            <Text style={{fontWeight: 'bold', color: '#252525'}}>
              One Time Password
            </Text>{' '}
            on your phone number
          </Text>
          <Text
            style={{
              marginHorizontal: 24,
              fontSize: 16,
              color: '#9C9C9C',
              textAlign: 'center',
            }}>
            Enter phone number
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 24,
            }}>
            <Text
              style={{
                fontSize: 20,
                paddingRight: 16,
                borderRightWidth: 1,
                borderRightColor: '#f0f0f0',
              }}>
              +62
            </Text>
            <TextInput
              onChangeText={props.onChangeNumber}
              value={props.numberPhone}
              placeholder="Phone number"
              underlineColorAndroid="transparent"
              autoCorrect={false}
              spellCheck={false}
              style={{
                padding: 16,
                fontSize: 20,

                // backgroundColor: 'pink',
                // borderRadius: 24,
              }}
              textContentType="telephoneNumber"
              maxLength={15}
              keyboardType="numeric"
            />
          </View>
          <Button
            block
            style={{
              backgroundColor: '#FB5286',
              marginTop: 20,
              marginHorizontal: 24,
            }}
            onPress={props.onSendOtp}>
            <Text style={{color: 'white'}}>Send me</Text>
          </Button>
        </View>
      ) : null}
    </View>
  );
};

const OtpLayout = props => {
  return (
    <View>
      {console.log(props.state, 'state otp layour')}
      {props.visible ? (
        <View>
          <Text style={{textAlign: 'center', color: '#9C9C9C', margin: 24}}>
            Please enter the OTP code that has been sent to{' '}
            <Text style={{fontWeight: 'bold', color: '#252525'}}>
              {props.numberPhone}
            </Text>
          </Text>

          <OTPInputView
            style={{
              width: '90%',
              height: 100,
              // borderWidth: 1,
              //   justifyContent: 'center',
              marginLeft: 24,
            }}
            pinCount={6}
            code={props.verifyCode} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
            onCodeChanged={props.onChange}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={code => {
              console.log(`Code is ${code}, you are good to go!`);
            }}
          />
          <TouchableOpacity onPress={props.onClickChangeNumber}>
            <Text style={{textAlign: 'center', color: '#FB5286', margin: 24}}>
              Change phone number
            </Text>
          </TouchableOpacity>
          <Button
            block
            style={{
              backgroundColor: '#FB5286',
              marginTop: 20,
              marginHorizontal: 24,
            }}
            onPress={props.onSubmit}>
            <Text style={{color: 'white'}}>Submit</Text>
          </Button>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  borderStyleHighLighted: {
    borderColor: '#FB5286',
  },

  underlineStyleBase: {
    width: 50,
    height: 65,
    backgroundColor: '#f5f5f5',
    borderWidth: 0,
    fontSize: 20,
  },

  underlineStyleHighLighted: {
    borderColor: '#FB5286',
    backgroundColor: '#fff',
    borderWidth: 1,
  },
});

export default ValidatePhone;
