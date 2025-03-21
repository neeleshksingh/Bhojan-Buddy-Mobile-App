import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { TextInput, Button, Title, Text, Caption } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { NavigationProp } from '../types/navigation';
import * as Facebook from 'expo-facebook';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  navigation: NavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState<string>('');
  const dispatch = useDispatch();

  const handlePhoneLogin = () => {
    if (phone.length === 10) {
      dispatch(login(phone));
      navigation.navigate('Landing');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await Facebook.initializeAsync({ appId: 'YOUR_FB_APP_ID' });
      const { type } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });
      if (type === 'success') {
        dispatch(login('facebook_user'));
        navigation.navigate('Landing');
      }
    } catch (error) {
      console.error('Facebook Login Error:', error);
    }
  };

  const handleGoogleLogin = () => {
    // Dummy Google login: simulate a successful login
    console.log('Dummy Google login triggered');
    dispatch(login('dummy_google_user'));
    navigation.navigate('Landing');
  };

  // Dismiss keyboard when tapping outside
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/food-cover.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'rgba(255,153,51,0.8)']}
            style={styles.overlay}
          />
          
          <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
            <Animatable.Image
              animation="pulse" 
              iterationCount="infinite" 
              duration={3000}
              source={require('../assets/food-bg.jpg')}
              style={styles.logo}
            />
            <Animatable.View animation="fadeIn" delay={500}>
              <Title style={styles.title}>Bhojan Buddy</Title>
              <Caption style={styles.subtitle}>Delicious food is just a tap away!</Caption>
            </Animatable.View>
          </Animatable.View>
          
          <Animatable.View animation="fadeInUp" duration={1000} delay={300} style={styles.formContainer}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.loginPrompt}>Login to continue your food journey</Text>
            </View>
            
            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="numeric"
              maxLength={10}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { primary: '#FF9933', background: '#fff' } }}
              left={<TextInput.Icon icon="phone" color="#FF9933" />}
            />
            
            <Animatable.View animation="pulse" iterationCount={1} delay={800}>
              <Button
                mode="contained"
                onPress={handlePhoneLogin}
                style={styles.phoneButton}
                labelStyle={styles.buttonLabel}
                disabled={phone.length !== 10}
              >
                Login with Phone
              </Button>
            </Animatable.View>
            
            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>
            
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity 
                style={[styles.socialButton, styles.facebookButton]} 
                onPress={handleFacebookLogin}
              >
                <Ionicons name="logo-facebook" size={24} color="#fff" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialButton, styles.googleButton]} 
                onPress={handleGoogleLogin}
              >
                <Ionicons name="logo-google" size={24} color="#fff" />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.createAccountButton}>
              <Text style={styles.createAccountText}>
                New to Bhojan Buddy? <Text style={styles.link}>Create Account</Text>
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.footerText}>
              By logging in, you agree to our <Text style={styles.link}>Terms & Conditions</Text> and <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </Animatable.View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'space-between',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: { 
    alignItems: 'center', 
    paddingTop: 60,
    paddingBottom: 20,
  },
  logo: { 
    width: 100, 
    height: 100, 
    borderRadius: 50,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#fff',
  },
  title: { 
    fontSize: 31, 
    fontWeight: 'bold', 
    color: '#fff', 
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 3 }, 
    textShadowRadius: 5 
  },
  subtitle: { 
    fontSize: 18, 
    color: '#fff', 
    marginTop: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  formContainer: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 30, 
    paddingTop: 25,
    paddingBottom: 40, 
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  welcomeTextContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  loginPrompt: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  input: { 
    marginBottom: 20, 
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  phoneButton: { 
    backgroundColor: '#FF9933',
    paddingVertical: 8, 
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#FF9933',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonLabel: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#fff',
    paddingVertical: 2,
  },
  divider: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 25 
  },
  line: { 
    flex: 1, 
    height: 1, 
    backgroundColor: '#ddd' 
  },
  orText: { 
    marginHorizontal: 15, 
    color: '#888', 
    fontSize: 16,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: { 
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 12, 
    borderRadius: 10, 
    marginVertical: 10, 
    justifyContent: 'center',
    flex: 0.48,
    elevation: 3,
  },
  facebookButton: {
    backgroundColor: '#3b5998',
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  socialText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600', 
    marginLeft: 10 
  },
  createAccountButton: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  createAccountText: {
    fontSize: 15,
    color: '#666',
  },
  footerText: { 
    textAlign: 'center', 
    color: '#888', 
    marginTop: 20, 
    fontSize: 12,
    lineHeight: 18,
  },
  link: { 
    color: '#FF9933', 
    fontWeight: 'bold' 
  }
});

export default LoginScreen;