from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, RegexValidator
from django.db.models import F
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models

class User(AbstractUser):
    # Regular user, admin user, and super user roles
    class Role(models.TextChoices):
        NORMAL = 'NORMAL', 'Normal User'
        ADMIN = 'ADMIN', 'Admin User'
        SUPERUSER = 'SUPERUSER', 'Super User'

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.NORMAL)

    phone_regex = RegexValidator(
        regex=r'^\d{10}$',
        message="Phone number must be entered in the format: '9999999999'. Up to 10 digits allowed."
    )
    phone_number = models.CharField(
        max_length=15, 
        unique=True,
        validators=[phone_regex],
        null=True,       # Allow NULL in the database
        blank=True,      # Allow blank values in forms
    )

    # Override the save method
    def save(self, *args, **kwargs):
        # If the user is an admin, set is_staff to True
        if self.role == self.Role.ADMIN:
            self.is_staff = True
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ('id', 'phone_number')
        
    def __str__(self):
        return f"{self.username} - {self.phone_number}"

    def is_normal_user(self):
        return self.role == self.Role.NORMAL

    def is_admin_user(self):
        return self.role == self.Role.ADMIN

    def is_super_user(self):
        return self.role == self.Role.SUPERUSER
    

class LivePrice(models.Model):
    gold_price = models.DecimalField(max_digits=10, decimal_places=2)
    silver_price = models.DecimalField(max_digits=10, decimal_places=2)  # Fixed typo in field name
    timestamp = models.DateTimeField(default=timezone.now)  # Added timestamp for tracking price changes

    class Meta:
        verbose_name = 'Live Price'
        verbose_name_plural = 'Live Prices'
        ordering = ['-timestamp']  # Most recent prices first

    def __str__(self) -> str:
        return f"Gold: {self.gold_price}, Silver: {self.silver_price}"


def get_current_date():
    return timezone.now().date()

class JoinScheme(models.Model):
    PACKAGE_CHOICES = (
        ('Daily', 'Daily'),
        ('Weekly', 'Weekly'),
        ('Monthly', 'Monthly'),
    )

    chosenPackage = models.CharField(
        max_length=10,
        choices=PACKAGE_CHOICES,
        default='Monthly'
    )
    payAmount = models.DecimalField(max_digits=10, decimal_places=2)
    Name = models.CharField(max_length=255)
    phone = models.ForeignKey(User, on_delete=models.CASCADE, related_name='join_schemes')
    Address = models.TextField()
    schemeCode = models.CharField(max_length=20, unique=True, editable=False)
    joiningDate = models.DateField(default=get_current_date)
    totalAmountPaid = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    totalGold = models.FloatField(default=0.0, validators=[MinValueValidator(0.0)])
    NumberOfTimesPaid = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    remainingPayments = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    def __str__(self):
        return f"{self.Name} - {self.schemeCode}"

    def save(self, *args, **kwargs):
        # Set initial number of payments based on package
        is_new = not self.pk  # Check if this is a new instance
        
        if is_new:
            if self.chosenPackage == 'Daily':
                self.remainingPayments = 365
            elif self.chosenPackage == 'Weekly':
                self.remainingPayments = 52
            elif self.chosenPackage == 'Monthly':
                self.remainingPayments = 12

        # Generate schemeCode if it doesn't exist
        if not self.schemeCode:
            current_year = timezone.now().year
            count = JoinScheme.objects.filter(joiningDate__year=current_year).count() + 1
            self.schemeCode = f"PON{current_year}{count:04d}"

        super().save(*args, **kwargs)



class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = (
        ('online', 'Online'),
        ('cash', 'Cash'),
    )

    schemeCode = models.ForeignKey(JoinScheme, on_delete=models.CASCADE, related_name='payments')
    paymentDate = models.DateField(default=get_current_date)
    amountPaid = models.DecimalField(max_digits=10, decimal_places=2)
    goldAdded = models.FloatField(default=0.0, validators=[MinValueValidator(0.0)])
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES, default='online')

    def save(self, *args, **kwargs):
        is_new = not self.pk  # Check if this is a new payment
        
        # First save the payment itself
        super().save(*args, **kwargs)
        
        if is_new:
            # Update the scheme's total amounts
            scheme = self.schemeCode
            scheme.totalAmountPaid += self.amountPaid
            scheme.NumberOfTimesPaid += 1
            scheme.remainingPayments = max(0, scheme.remainingPayments - 1)
            scheme.save()

    def __str__(self):
        return f"Payment for {self.schemeCode.schemeCode} on {self.paymentDate}"
    

class Feeds(models.Model):
    feedsTitle = models.CharField(max_length=125)
    image = models.ImageField(
        upload_to='feeds/%Y/%m/%d/',
        blank=True,
        null=True
    )
    context = models.TextField(
        help_text="Content of the feed post"
    )
    created_at = models.DateTimeField(default=timezone.now)
    joiningDate = models.DateField(default=get_current_date)

    class Meta:
        ordering = ['-created_at']





































#         import { View, Text, Image, ScrollView, ToastAndroid, Platform, Alert, Modal } from 'react-native';
# import React, { useState, useEffect } from 'react';
# import { SafeAreaView } from 'react-native-safe-area-context';
# import AsyncStorage from '@react-native-async-storage/async-storage';
# import images from '../constants/images';
# import { Link, useRouter } from "expo-router";
# import InputField from "../components/InputField";
# import CustomButton from "../components/CustomButton";
# import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
# import { auth } from '@/config/FirebaseConfig';

# // Constants
# const INACTIVITY_THRESHOLD = 7 * 24 * 60 * 60 * 1000;
# const LAST_ACTIVE_KEY = 'lastActiveTimestamp';
# const BACKEND_URL = 'http://127.0.0.1:8000/user/';

# const SignUp = () => {
#   const router = useRouter();
#   const [phoneNumber, setPhoneNumber] = useState('');
#   const [verificationId, setVerificationId] = useState('');
#   const [verificationCode, setVerificationCode] = useState('');
#   const [modalVisible, setModalVisible] = useState(false);
#   const [loading, setLoading] = useState(false);
#   const recaptchaVerifier = React.useRef(null);

#   useEffect(() => {
#     checkLastActive();
#     updateLastActive();
#   }, []);

#   const checkLastActive = async () => {
#     try {
#       const lastActive = await AsyncStorage.getItem(LAST_ACTIVE_KEY);
#       if (lastActive) {
#         const timeDiff = Date.now() - parseInt(lastActive);
#         if (timeDiff > INACTIVITY_THRESHOLD) {
#           await auth.signOut();
#           await AsyncStorage.removeItem(LAST_ACTIVE_KEY);
#           showNotification('Session expired due to inactivity');
#           router.replace('/sign-in');
#         }
#       }
#     } catch (error) {
#       console.error('Error checking last active:', error);
#     }
#   };

#   const updateLastActive = async () => {
#     try {
#       await AsyncStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
#     } catch (error) {
#       console.error('Error updating last active:', error);
#     }
#   };

#   const showNotification = (message: string) => {
#     if (Platform.OS === 'android') {
#       ToastAndroid.show(message, ToastAndroid.BOTTOM);
#     } else {
#       Alert.alert('Notice', message);
#     }
#   };

#   const formatPhoneNumber = (number: string) => {
#     if (!number.startsWith('+')) {
#       return '+' + number;
#     }
#     return number;
#   };

#   const saveUserToBackend = async (phone: string) => {
#     try {
#       const response = await fetch(BACKEND_URL, {
#         method: 'POST',
#         headers: {
#           'Content-Type': 'application/json',
#         },
#         body: JSON.stringify({
#           phone: phone
#         }),
#       });

#       if (!response.ok) {
#         const errorData = await response.json();
#         throw new Error(errorData.detail || 'Failed to save user data');
#       }

#       return await response.json();
#     } catch (error) {
#       console.error('Error saving to backend:', error);
#       throw error;
#     }
#   };

#   const OnCreateAccount = async () => {
#     if (!phoneNumber) {
#       showNotification("Please enter your phone number");
#       return;
#     }

#     try {
#       setLoading(true);
#       const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      
#       // Use the expo-firebase-recaptcha verifier
#       const provider = new PhoneAuthProvider(auth);
#       const verificationId = await provider.verifyPhoneNumber(
#         formattedPhoneNumber,
#         recaptchaVerifier.current
#       );
      
#       setVerificationId(verificationId);
#       setModalVisible(true);
#       showNotification("Verification code sent!");
#     } catch (error: any) {
#       console.error('Error sending code:', error);
#       showNotification(error.message || "Failed to send verification code");
#     } finally {
#       setLoading(false);
#     }
#   };

#   const verifyCode = async () => {
#     try {
#       setLoading(true);
#       if (!verificationCode || verificationCode.length !== 6) {
#         showNotification("Please enter a valid 6-digit code");
#         return;
#       }

#       const credential = PhoneAuthProvider.credential(
#         verificationId,
#         verificationCode
#       );

#       await signInWithCredential(auth, credential);
#       await saveUserToBackend(phoneNumber);
#       await updateLastActive();
      
#       showNotification("Phone number verified and account created successfully!");
#       setModalVisible(false);
#       router.replace('/(root)/(tabs)');
#     } catch (error: any) {
#       console.error('Error in verification process:', error);
#       if (error.code?.includes('auth')) {
#         showNotification("Invalid verification code");
#       } else {
#         showNotification("Verification successful but failed to create account. Please try again.");
#       }
#     } finally {
#       setLoading(false);
#     }
#   };

#   return (
#     <SafeAreaView className="bg-white flex-1">
#       <ScrollView>
#         <View className="items-center">
#           <Image 
#             source={images.onboarding} 
#             className="w-[450px] h-[250px]" 
#             resizeMode="contain" 
#           />
#         </View>
#         <View className="px-6">
#           <Text className="text-center font-rubik text-primary-100 text-2xl mt-10">
#             Welcome to
#             {"\n"} 
#             <Text className="text-3xl font-rubik-semibold text-primary-100">
#               Ponnudurai Digi
#               <Text className="text-accent-100">Gold</Text>
#             </Text>
#           </Text>
#           <Text className="text-lg font-rubik text-black-200 text-center mt-7">
#             Your golden moments begin here.
#           </Text>
          
#           <View className="mt-4 space-y-4">
#             <InputField
#               label="Phone Number"
#               placeholder="Enter phone number with country code (+1234567890)"
#               textContentType="telephoneNumber"
#               keyboardType="phone-pad"
#               value={phoneNumber}
#               onChangeText={setPhoneNumber}
#             />
#           </View>

#           <CustomButton 
#             title={loading ? "Please wait..." : "Create Account"}
#             onPress={OnCreateAccount}
#             className="mt-6 bg-primary-100 w-full rounded-lg"
#             disabled={loading}
#           />

#           <Link href="/sign-in" asChild>
#             <Text className="text-lg text-center text-general-200 mt-5">
#               Already have an account?{' '}
#               <Text className="text-secondary-200 text-primary-100">Sign In</Text>
#             </Text>
#           </Link>
#         </View>
#       </ScrollView>

#       <Modal
#         animationType="slide"
#         transparent={true}
#         visible={modalVisible}
#         onRequestClose={() => !loading && setModalVisible(false)}
#       >
#         <View className="flex-1 justify-center items-center bg-black/50">
#           <View className="bg-white p-6 rounded-lg w-[80%]">
#             <Text className="text-xl font-rubik-semibold mb-4">
#               Enter Verification Code
#             </Text>
#             <InputField
#               placeholder="Enter 6-digit code"
#               keyboardType="number-pad"
#               value={verificationCode}
#               onChangeText={setVerificationCode}
#               maxLength={6}
#             />
#             <View className="flex-row justify-end mt-4 space-x-2">
#               <CustomButton
#                 title="Cancel"
#                 onPress={() => !loading && setModalVisible(false)}
#                 bgVariant="danger"
#                 className="flex-1"
#                 disabled={loading}
#               />
#               <CustomButton
#                 title={loading ? "Verifying..." : "Verify"}
#                 onPress={verifyCode}
#                 className="flex-1"
#                 disabled={loading}
#               />
#             </View>
#           </View>
#         </View>
#       </Modal>
#     </SafeAreaView>
#   );
# };

# export default SignUp;