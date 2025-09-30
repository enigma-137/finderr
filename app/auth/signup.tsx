import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from "expo-file-system";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { supabase, supabaseAdmin } from '../../constants/supabase';

const { width, height } = Dimensions.get('window');

const INTERESTS = [
  'Sports', 'Movies', 'Music', 'Reading', 'Gaming', 'Travel',
  'Cooking', 'Art', 'Photography', 'Dance', 'Technology', 'Fitness'
];

const SignupScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [level, setLevel] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [activities, setActivities] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [idCard, setIdCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const pickProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll permissions are required to select an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const pickIdCard = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll permissions are required to select an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 2],
      quality: 0.8,
    });

    if (!result.canceled) {
      setIdCard(result.assets[0].uri);
    }
  };



const uploadImageToSupabase = async (imageUri: string, bucket: string, fileName: string) => {
  try {
    console.log(`Starting upload for: ${fileName} to bucket: ${bucket}`);

    // Read file into base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 -> ArrayBuffer
    const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, binary, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    console.log("Upload successful:", publicUrl);
    return publicUrl;

  } catch (err) {
    console.error("Error in uploadImageToSupabase:", err);
    throw err;
  }
};


  const verifySystemReady = async () => {
    try {
      // Quick verification that buckets are accessible
      const { data: buckets, error } = await supabase.storage.listBuckets();
      if (error || !buckets || buckets.length === 0) {
        throw new Error('Storage system not ready');
      }
      
      const profilesBucket = buckets.find(b => b.name === 'profiles');
      const idCardsBucket = buckets.find(b => b.name === 'id-cards');
      
      if (!profilesBucket || !idCardsBucket) {
        throw new Error('Required storage buckets not found');
      }
      
      return true;
    } catch (error) {
      console.error('System verification failed:', error);
      return false;
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (!email || !password || !name || !gender || !college || !department || !matricNumber) {
        Alert.alert('Error', 'Please fill in all required fields.');
        setLoading(false);
        return;
      }

      // Validate required images
      if (!profileImage || !idCard) {
        Alert.alert('Error', 'Please upload both profile image and ID card.');
        setLoading(false);
        return;
      }

      // Quick system verification
      console.log('Verifying system readiness...');
      const systemReady = await verifySystemReady();
      if (!systemReady) {
        Alert.alert('System Error', 'Storage system is not ready. Please try again later.');
        setLoading(false);
        return;
      }

      // Create account with Supabase Auth
      console.log('Creating auth account...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      console.log('Account created successfully!', authData);

      // Upload images and save profile data
      if (authData.user) {
        const userId = authData.user.id;
        console.log('User ID:', userId);
        
        try {
          // Upload profile image
          console.log('Uploading profile image...');
          const profileImageFileName = `${userId}_profile_${Date.now()}.jpg`;
          const profileImageUrl = await uploadImageToSupabase(
            profileImage, 
            'profiles',
            profileImageFileName
          );

          // Upload ID card image  
          console.log('Uploading ID card...');
          const idCardFileName = `${userId}_idcard_${Date.now()}.jpg`;
          const idCardUrl = await uploadImageToSupabase(
            idCard, 
            'id-cards',
            idCardFileName
          );

          // Insert profile data
          console.log('Saving profile data...');
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                name: name,
                nickname: nickname,
                email: email,
                gender: gender,
                age_range: ageRange,
                college: college,
                department: department,
                matric_number: matricNumber,
                level: level,
                interests: selectedInterests,
                activities: activities,
                profile_image: profileImageUrl,
                id_card: idCardUrl,
                approved: false,
                status: 'pending'
              }
            ]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
            throw profileError;
          }

          console.log('Profile created successfully!');
          
        } catch (uploadError: any) {
          console.error('Upload/profile creation failed:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      }

      // Show success message and navigate
      Alert.alert(
        'Success', 
        'Account created successfully! Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setEmail('');
              setPassword('');
              setName('');
              setNickname('');
              setGender('');
              setAgeRange('');
              setCollege('');
              setDepartment('');
              setMatricNumber('');
              setLevel('');
              setSelectedInterests([]);
              setActivities('');
              setProfileImage(null);
              setIdCard(null);
              setCurrentStep(1);
              
              router.replace('/auth/pending-approval');
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert(
        'Signup Error', 
        error.message || 'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#214723', '#214723', '#1a1a1a']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ImageBackground
          source={require('../../assets/images/sign-up.jpg')} 
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Text style={styles.welcomeText}>Join Student Connect</Text>
              <Text style={styles.subtitle}>Create your account and start meeting fellow students</Text>
            </View>

            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <View key={step} style={styles.stepContainer}>
                  <View style={[
                    styles.stepCircle,
                    currentStep >= step && styles.stepCircleActive
                  ]}>
                    <Text style={[
                      styles.stepText,
                      currentStep >= step && styles.stepTextActive
                    ]}>
                      {step}
                    </Text>
                  </View>
                  {step < 6 && <View style={styles.stepLine} />}
                </View>
              ))}
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              {currentStep === 1 && (
                <>
                  <Text style={styles.formTitle}>BASIC INFO</Text>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="#999"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Nickname (optional)"
                      placeholderTextColor="#999"
                      value={nickname}
                      onChangeText={setNickname}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#999"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <Text style={styles.formTitle}>STUDENT DETAILS</Text>

                  <View style={styles.inputContainer}>
                    <Picker
                      selectedValue={gender}
                      style={styles.input}
                      onValueChange={(itemValue) => setGender(itemValue)}
                      dropdownIconColor="#214723"
                    >
                      <Picker.Item label="Select Gender" value="" color="#999" />
                      <Picker.Item label="Male" value="Male" />
                      <Picker.Item label="Female" value="Female" />
                    </Picker>
                  </View>

                  <View style={styles.inputContainer}>
                    <Picker
                      selectedValue={ageRange}
                      style={styles.input}
                      onValueChange={(itemValue) => setAgeRange(itemValue)}
                      dropdownIconColor="#214723"
                    >
                      <Picker.Item label="Select Age Range" value="" color="#999" />
                      <Picker.Item label="18-22" value="18-22" />
                      <Picker.Item label="23-25" value="23-25" />
                      <Picker.Item label="26-30" value="26-30" />
                      <Picker.Item label="30-35" value="30-35" />
                    </Picker>
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="College/University"
                      placeholderTextColor="#999"
                      value={college}
                      onChangeText={setCollege}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Department"
                      placeholderTextColor="#999"
                      value={department}
                      onChangeText={setDepartment}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Matric Number"
                      placeholderTextColor="#999"
                      value={matricNumber}
                      onChangeText={setMatricNumber}
                      autoCapitalize="characters"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Picker
                      selectedValue={level}
                      style={styles.input}
                      onValueChange={(itemValue) => setLevel(itemValue)}
                      dropdownIconColor="#214723"
                    >
                      <Picker.Item label="Select Level" value="" color="#999" />
                      <Picker.Item label="100L" value="100L" />
                      <Picker.Item label="200L" value="200L" />
                      <Picker.Item label="300L" value="300L" />
                      <Picker.Item label="400L" value="400L" />
                      <Picker.Item label="500L" value="500L" />
                      <Picker.Item label="600L" value="600L" />
                    </Picker>
                  </View>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <Text style={styles.formTitle}>INTERESTS</Text>
                  <Text style={styles.subtitleText}>Select your interests to find like-minded students</Text>

                  <View style={styles.interestsContainer}>
                    <FlatList
                      data={INTERESTS}
                      keyExtractor={(item) => item}
                      numColumns={3}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.interestButton,
                            selectedInterests.includes(item) && styles.interestButtonSelected
                          ]}
                          onPress={() => toggleInterest(item)}
                        >
                          <Text style={[
                            styles.interestText,
                            selectedInterests.includes(item) && styles.interestTextSelected
                          ]}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      )}
                      contentContainerStyle={styles.interestsList}
                    />
                  </View>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <Text style={styles.formTitle}>ACTIVITIES</Text>
                  <Text style={styles.subtitleText}>Tell us what you do outside of school</Text>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Describe your hobbies, part-time jobs, clubs, etc."
                      placeholderTextColor="#999"
                      value={activities}
                      onChangeText={setActivities}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>
                </>
              )}

              {currentStep === 5 && (
                <>
                  <Text style={styles.formTitle}>PROFILE IMAGE</Text>
                  <Text style={styles.subtitleText}>Upload a profile picture</Text>

                  <View style={styles.imageUploadContainer}>
                    <TouchableOpacity style={styles.imageUploadButton} onPress={pickProfileImage}>
                      {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.uploadedImage} />
                      ) : (
                        <View style={styles.uploadPlaceholder}>
                          <Text style={styles.uploadText}>Tap to select image</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {currentStep === 6 && (
                <>
                  <Text style={styles.formTitle}>STUDENT ID CARD</Text>
                  <Text style={styles.subtitleText}>Upload a picture of your student ID card</Text>

                  <View style={styles.imageUploadContainer}>
                    <TouchableOpacity style={styles.idCardUploadButton} onPress={pickIdCard}>
                      {idCard ? (
                        <Image source={{ uri: idCard }} style={styles.uploadedIdCard} />
                      ) : (
                        <View style={styles.uploadPlaceholder}>
                          <Text style={styles.uploadText}>Tap to select ID card</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Navigation Buttons */}
              <View style={styles.buttonContainer}>
                {currentStep > 1 && (
                  <TouchableOpacity
                    style={[styles.navButton, styles.prevButton]}
                    onPress={handlePrevious}
                  >
                    <Text style={styles.navButtonText}>Previous</Text>
                  </TouchableOpacity>
                )}

                {currentStep < 6 ? (
                  <TouchableOpacity
                    style={[styles.navButton, styles.nextButton]}
                    onPress={handleNext}
                  >
                    <Text style={styles.navButtonText}>Next</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.signupButton, loading && styles.signupButtonDisabled]}
                    onPress={handleSignup}
                    disabled={loading}
                  >
                    <View style={styles.signupButtonSolid}>
                      <Text style={styles.signupButtonTextSolid}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                onPress={() => router.replace('/auth/signin')}
                style={styles.linkContainer}
              >
                <Text style={styles.linkText}>
                  Already have an account? <Text style={styles.linkHighlight}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundImageStyle: {
    opacity: 0.3,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    minHeight: height,
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingBottom: 50,
    minHeight: height * 0.65,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
    letterSpacing: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  signupButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 20,
  },
  signupButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  signupButtonSolid: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#214723',
    borderRadius: 12,
  },
  signupButtonTextSolid: {
    color: 'white',
    fontSize: 14,
    padding: 8,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  linkContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  linkText: {
    color: '#6c757d', 
    fontSize: 16,
  },
  linkHighlight: {
    color: '#214723',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#214723',
  },
  stepCircleActive: {
    backgroundColor: '#214723',
  },
  stepText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepTextActive: {
    color: 'white',
  },
  stepLine: {
    width: 30,
    height: 2,
    backgroundColor: '#e9ecef',
    marginHorizontal: 5,
  },
  subtitleText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  interestsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  interestsList: {
    paddingHorizontal: 10,
  },
  interestButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 80,
    alignItems: 'center',
  },
  interestButtonSelected: {
    backgroundColor: '#214723',
    borderColor: '#214723',
  },
  interestText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  interestTextSelected: {
    color: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 16,
  },
  prevButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 8,
  },
  nextButton: {
    backgroundColor: '#214723',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 8,
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageUploadButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  idCardUploadButton: {
    width: 200,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  uploadedImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  uploadedIdCard: {
    width: 200,
    height: 120,
    borderRadius: 12,
  },
  uploadPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#6c757d',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SignupScreen;