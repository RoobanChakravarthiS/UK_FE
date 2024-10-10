import React from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import { Text, View, TextInput, StyleSheet, Platform } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { useState } from "react";
import Lottie from 'lottie-react-native'; // Import Lottie

const Login = ({ navigation }) => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [isPressed, setIsPressed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data) => {
      setLoading(true);
      console.log(data);
      setErrorMessage(""); // Reset error message
  
      try {
          const response = await fetch(`http://192.168.76.154:8080/login`, {
              method: 'POST', // Ensure it's 'POST' or 'GET' based on your API
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
          });
  
          if (response.status === 401) {
              Toast.show({
                  text1: 'Login Failed',
                  text2: 'Invalid username or password',
                  type: 'error',
                  position: 'top',
                  visibilityTime: 3000,
                  autoHide: true,
              });
              return;
          }
  
          if (response.status !== 200) {
              throw new Error("Login failed. Please try again.");
          }
  
          const responseData = await response.json();
          console.log(responseData);
  
          Toast.show({
              text1: 'Login Successful',
              text2: 'Welcome back!',
              type: 'success',
              position: 'top',
              visibilityTime: 3000,
              autoHide: true,
          });
  
          navigation.navigate('Bar');
      } catch (error) {
          Toast.show({
              text1: 'Login Error',
              text2: error.message || 'An unexpected error occurred',
              type: 'error',
              position: 'top',
              visibilityTime: 3000,
              autoHide: true,
          });
          console.error('Login error:', error);
      } finally {
          setLoading(false);
      }
  };
  

    const toastConfig = {
        success: (internalState) => (
            <View style={styles.toastSuccess}>
                <Text style={styles.toastText}>{internalState.text1}</Text>
                <Text style={styles.toastSubText}>{internalState.text2}</Text>
            </View>
        ),
        error: (internalState) => (
            <View style={styles.toastError}>
                <Text style={styles.toastText}>{internalState.text1}</Text>
                <Text style={styles.toastSubText}>{internalState.text2}</Text>
            </View>
        ),
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Lottie source={require('../assets/login.json')} autoPlay loop style={styles.lottie} />

            <View style={styles.formContainer}>
                <Text style={styles.title}>Welcome Back!</Text>

                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}

                <View>
                    <Controller
                        control={control}
                        name="email"
                        rules={{ required: 'Email is required' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.input, errors.email && styles.inputError]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Email"
                                placeholderTextColor="#B0BEC5"
                                autoCapitalize="none"
                            />
                        )}
                    />
                    
                </View>

                <View>
                    <Controller
                        control={control}
                        name="password"
                        rules={{ required: 'Password is required' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.input, errors.password && styles.inputError]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Password"
                                secureTextEntry
                                placeholderTextColor="#B0BEC5"
                            />
                        )}
                    />
                    
                </View>

                <TouchableOpacity
                    style={[styles.button, isPressed && styles.buttonPressed]}
                    onPressIn={() => setIsPressed(true)}
                    onPressOut={() => setIsPressed(false)}
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Logging in...' : 'LOGIN'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.signIn}>
                    {/* <Text style={styles.linkText} onPress={() => navigation.navigate('ForgotPassword')}>
                        Forgot Password?
                    </Text> */}
                    <Text style={styles.linkText} onPress={() => navigation.navigate('Signup')}>
                        New user? Sign Up
                    </Text>
                </View>
            </View>
            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#E0F7FA', // Light cyan background
    },
    lottie: {
        width: '100%',
        height: 200,
        marginBottom: 20,
    },
    formContainer: {
        width: '90%',
        padding: 24,
        backgroundColor: 'white', // White background for the form
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#00796B', // Teal border color
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
        color: '#00796B', // Teal color for title
    },
    input: {
        width: '100%',
        padding: 16,
        fontSize: 18,
        borderRadius: 8,
        backgroundColor: '#F1F1F1',
        color: '#000',
        marginBottom: 16,
        fontFamily: Platform.select({
            ios: 'System',
            android: 'sans-serif',
        }),
        borderColor: '#B0BEC5',
        borderWidth: 1,
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        paddingLeft: 8,
        paddingTop: 4,
        fontFamily: Platform.select({
            ios: 'System',
            android: 'sans-serif',
        }),
    },
    button: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#00796B', // Teal color for the button
        alignItems: 'center',
        marginBottom: 10,
        elevation: 3, // Shadow for button
    },
    buttonPressed: {
        backgroundColor: '#004D40', // Darker shade on press
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '600',
        fontFamily: Platform.select({
            ios: 'System',
            android: 'sans-serif',
        }),
    },
    signIn: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 15,
        fontFamily: Platform.select({
            ios: 'System',
            android: 'sans-serif',
        }),
    },
    linkText: {
        color: '#00796B', // Teal color for link
        fontWeight: '600',
        fontSize: 16,
    },
    toastSuccess: {
        backgroundColor: '#4CAF50', // Green color for success
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    toastError: {
        backgroundColor: '#F44336', // Red color for error
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    toastText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    toastSubText: {
        color: 'white',
        fontSize: 14,
    },
});

export default Login;
