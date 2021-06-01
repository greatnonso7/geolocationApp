/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  View,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const App = () => {
  const [position, setPosition] = React.useState({longitude: '', latitude: ''});
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      requestLocationPermission();
    } else {
      Geolocation.requestAuthorization();
    }
  }, []);

  console.log(position);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Location Permission',
          message:
            'Geolocation App needs access to your location ' +
            'so you can realtime location update when riding.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestCurrentPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
    await handleLocation();
  };

  const handleLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('position', position.coords);
        const {latitude, longitude} = position.coords;
        setPosition({
          latitude: latitude,
          longitude: longitude,
        });
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => requestCurrentPermission()}
        style={styles.locationButton}>
        <Text style={styles.locationButtonText}>Get Location</Text>
      </TouchableOpacity>

      {position && (
        <View style={{padding: 20}}>
          <Text>Longitude: {position.longitude}</Text>
          <Text>Latitude: {position.latitude}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  locationButton: {
    height: 60,
    width: 180,
    backgroundColor: '#3C597B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  locationButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
  },
});

export default App;
