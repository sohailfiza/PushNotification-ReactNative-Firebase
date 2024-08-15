import messaging from '@react-native-firebase/messaging';
import React, { useEffect } from 'react';
import { SafeAreaView, Text, PermissionsAndroid, StyleSheet } from 'react-native';
import PushNotification from 'react-native-push-notification';

const App = () => {

  async function requestUserPermission() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('Token =>', token);
      console.log('Use above token to start campaign');
    } catch (error) {
      console.error('Failed to get FCM token:', error);
    }
  };

  useEffect(() => {
    requestUserPermission();
    getToken();

    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: '',
          channelName: 'test',
          channelDescription: '',
          soundName: 'default',
          importance: 4,
          vibrate: true,
        }
      );
    }

    messaging().onMessage(async remoteMessage => {
      console.log('New FCM message arrived => \n', remoteMessage);
      PushNotification.localNotification({
        channelId: 'default-channel-id',
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        imageUrl: remoteMessage.notification.imageUrl
      });
    });
  }, []);

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <Text style={styles.heading} >Push Notification App</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // justifyContent: 'flex-start',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
   }
});


export default App;