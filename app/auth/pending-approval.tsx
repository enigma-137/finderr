import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useUser } from '../../constants/UserContext';

const { width, height } = Dimensions.get('window');

const PendingApprovalScreen = () => {
  const { logout, checkAuth, userProfile } = useUser();
  const router = useRouter();
  const [checkingStatus, setCheckingStatus] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/signin');
  };

  const handleCheckStatus = async () => {
    setCheckingStatus(true);
    try {
      await checkAuth();
      // The navigation will be handled automatically by the layout based on the updated userProfile
      // If approved, user will be redirected to main app
      if (userProfile?.approved) {
        Alert.alert('Congratulations!', 'Your account has been approved! Welcome to Student Connect!');
        router.replace('/(tabs)');
      } else {
        Alert.alert('Still Pending', 'Your account is still under review. Please check back later.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check approval status. Please try again.');
    } finally {
      setCheckingStatus(false);
    }
  };

  return (
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
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Account Under Review</Text>
            <Text style={styles.subtitle}>
              Your student profile and ID card are being reviewed by our administrators.
              You'll receive access once your account is approved.
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>What happens next?</Text>
              <Text style={styles.infoText}>
                • Our team will verify your student status{'\n'}
                • Review your profile information{'\n'}
                • Check your student ID card{'\n'}
                • Approve your account (usually within 24 hours)
              </Text>
            </View>

            <View style={styles.contactBox}>
              <Text style={styles.contactText}>
                Need help? Contact us at support@finderr.com
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.checkStatusButton, checkingStatus && styles.checkStatusButtonDisabled]}
              onPress={handleCheckStatus}
              disabled={checkingStatus}
            >
              <Text style={styles.checkStatusButtonText}>
                {checkingStatus ? 'Checking...' : 'Check Approval Status'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundImageStyle: {
    opacity: 0.3,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#214723',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#214723',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  contactBox: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    marginBottom: 30,
  },
  contactText: {
    fontSize: 14,
    color: '#214723',
    textAlign: 'center',
    fontWeight: '500',
  },
  checkStatusButton: {
    backgroundColor: '#214723',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  checkStatusButtonDisabled: {
    backgroundColor: '#6c757d',
    elevation: 0,
    shadowOpacity: 0,
  },
  checkStatusButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#6c757d',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PendingApprovalScreen;