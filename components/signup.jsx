import React from "react";
import { TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { Text, View, TextInput, StyleSheet, Platform } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { useState } from "react";
import Lottie from 'lottie-react-native'; // Import Lottie

const Signup = ({ navigation }) => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [isPressed, setIsPressed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const response = await fetch(`http://192.168.76.154:8080/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.status === 400) {
                Toast.show({
                    text1: 'Error',
                    text2: 'All fields are required',
                    type: 'error',
                    position: 'top',
                    visibilityTime: 3000,
                    autoHide: true,
                });
                return;
            }

            if (response.status !== 201) {
                throw new Error("Signup failed. Please try again.");
            }

            const responseData = await response.json();
            Toast.show({
                text1: 'Signup Successful',
                text2: 'Your account has been created',
                type: 'success',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
            });

            setTimeout(() => navigation.navigate('Login'), 3000);
        } catch (error) {
            Toast.show({
                text1: 'Signup Failed',
                text2: error.message || 'An unexpected error occurred',
                type: 'error',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
            });
            console.error('Signup error:', error);
        } finally {
            setLoading(false);
        }
    };

    const backgroundImage = require('../assets/bg.jpg');
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
                    <Text style={styles.title}>Create an Account</Text>

                    {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}

                    <View>
                        <Controller
                            control={control}
                            name="username"
                            rules={{ required: 'Username is required' }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.username && styles.inputError]}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Username"
                                    placeholderTextColor="#B0BEC5"
                                />
                            )}
                        />
                        {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
                    </View>

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
                        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
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
                        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                    </View>

                    <View>
                        <Controller
                            control={control}
                            name="number"
                            rules={{ required: 'Mobile number is required' }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.number && styles.inputError]}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Mobile Number"
                                    keyboardType="numeric"
                                    placeholderTextColor="#B0BEC5"
                                />
                            )}
                        />
                        {errors.number && <Text style={styles.errorText}>{errors.number.message}</Text>}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isPressed && styles.buttonPressed]}
                        onPressIn={() => setIsPressed(true)}
                        onPressOut={() => setIsPressed(false)}
                        onPress={handleSubmit(onSubmit)}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Signing up...' : 'SIGN UP'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.signIn}>
                        <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
                            Already have an account? Sign In
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
        backgroundColor: '#E0F7FA',
        paddingBottom:50, // Light cyan background
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
        justifyContent: 'center',
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
        padding: 16,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
    },
    toastError: {
        padding: 16,
        backgroundColor: '#F44336',
        borderRadius: 8,
    },
    toastText: {
        color: 'white',
        fontWeight: 'bold',
    },
    toastSubText: {
        color: 'white',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
});

export default Signup;
