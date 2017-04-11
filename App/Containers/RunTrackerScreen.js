import React from 'react'
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Images } from './DevTheme'
import MapView from 'react-native-maps'
import styles from './Styles/RunTrackerScreenStyles'
import RoundedButton from '../../App/Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'
import PopupDialog, {dialogStyle} from 'react-native-popup-dialog'
import { connect } from 'react-redux'
import axios from 'axios'

@connect(store => ({
  userinfo: store.login.username,
  currentPack: store.login.currentPack
}))

class RunTrackerScreen extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        text: 'start',
        timerOpacity: 0.0,
        timer: '',
        start: '', 
        end: '',
        timeMsg: '',
        distanceMsg: '',
        initialPosition: {},
        lastPosition: {},
        coordinates: [], 
        distance: 0,
      };
      console.log(this.props)
  }

  handleClick = () => {
    if (this.state.text === 'start') {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }

  calcDistance = (lat1, lon1, lat2, lon2, unit) => {
    var radlat1 = Math.PI * lat1/ 180
	var radlat2 = Math.PI * lat2/ 180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/ 180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180 / Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
  }

  startTimer = () => {
    this.watchID = navigator.geolocation.watchPosition((position) => {
      if(this.state.coordinates.length){
        console.log(position.coords.latitude, "THIS IS POS LATTTT")
        console.log(this.state.coordinates[this.state.coordinates.length-1].latitude, "this is the long latt thing")
      var tempdistance = this.state.distance + this.calcDistance(position.coords.latitude, position.coords.longitude, this.state.coordinates[this.state.coordinates.length-1].latitude, this.state.coordinates[this.state.coordinates.length-1].longitude, "M")
      this.setState({
        distance: tempdistance
      })
  }
    

      this.setState({lastPosition: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421
      }})
         
      this.setState({
        coordinates: [...this.state.coordinates, {latitude: position.coords.latitude, longitude: position.coords.longitude}]
      }
      )
    }, 
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 250, maximumAge: 0, desiredAccuracy: 0, frequency: 1 })
    var startTime = (Date.now()/ 1000).toFixed(2);
    this.setState({text: 'stop', timerOpacity: 1.0, start: startTime});
    var startTimeSeconds = Math.floor(startTime);
    var sw = setInterval(() => {
      var currentTimeSeconds = Math.floor(Date.now()/ 1000);
      var secondsElapsed = currentTimeSeconds - startTimeSeconds;
      var hours = Math.floor(secondsElapsed / 3600);
      var minutes = Math.floor((secondsElapsed - (hours * 3600)) / 60);
      var seconds = Math.floor(secondsElapsed - (hours * 3600) - (minutes * 60));
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      if (secondsElapsed >= 3600) {
        if (minutes < 10) {
          minutes = '0' + minutes;
        }
        var timer = hours + ':' + minutes + ':' + seconds;
      } else {
        var timer = minutes + ':' + seconds;
      }
      if (this.state.text === 'start') {
        clearInterval(sw);
      } else {
        this.setState({timer: timer});
      }
    }, 1000)
  }

  stopTimer = () => {
    var endTime = (Date.now() / 1000).toFixed(2);
    var totalSeconds = (endTime - this.state.start).toFixed(2);
    var runHistoryEntry = {
      duration: totalSeconds,
      distance: this.state.distance, // add distance
      coordinates: this.state.coordinates,
      initialPosition: this.state.initialPosition,
      today: Date.now(),
      userID: this.props.userinfo.userId,
      currentPack: this.props.currentPack,
      //current pack called from props here, not in state
      //this.props = { dispatch, navigation, userinfo }
    }
    console.log(runHistoryEntry);
    axios.post('https://lemiz2.herokuapp.com/api/runHistory', { params: {
      runHistoryEntry
    }})
    .then((result) => {
      console.log("axios sent")
      console.log(result)

      // this.setState({
      //   text: 'start',
      //   timerOpacity: 0.0,
      //   timer: '',
      //   start: '', 
      //   end: '',
      //   timeMsg: '',
      //   initialPosition: {},
      //   lastPosition: {},
      //   coordinates: [], 
      //   distance: 0
      // })
      // dispatch(signInSuccess(result.data));
    })
    .catch((err) => {
      console.log("axios error");
      console.log(err)
    })
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
    if (totalSeconds >= 3600) {
      var timeMsg = 'Total time: \n' + hours + ' hr \n' + minutes + ' min ' + seconds.toFixed(2) + ' sec \n';
    } else {
      var timeMsg = 'Total time: \n' + minutes + ' min ' + seconds.toFixed(2) + ' sec \n';
    }
    var distanceMsg = 'Distance: \n' + this.state.distance.toFixed(2) + ' miles'; 
    this.setState({text: 'start', timerOpacity: 0.0, timer: '0:00', distance: 0, end: endTime, timeMsg, distanceMsg, coordinates: []});
    this.popupDialog.show();
    navigator.geolocation.clearWatch(this.watchID)
  }

  watchID: ?number = null;

  componentDidMount () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position)
        this.setState({initialPosition: position.coords})
        this.setState({lastPosition: position.coords})
      },
      (error) => console.log(error),
      {enableHighAccuracy: true, timeout: 250, maximumAge: 0}
    )
  }
  componentWillUnmount () {
    navigator.geolocation.clearWatch(this.watchID)
  }

  render () {
    if(!this.state.initialPosition.latitude){
      return (
        <Text style={styles.title}>LOADING </Text>
      )
    }
    return (

      <View style={styles.mainContainer}>

        <View style={styles.popupContainer}>
          <PopupDialog 
            dialogStyle={styles.popup}
            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
          >
          <View >
            <Text style={styles.popupText}>{this.state.timeMsg + this.state.distanceMsg}</Text>
            <RoundedButton text="okay" onPress={() => {this.popupDialog.dismiss()}}> 
            </RoundedButton>
          </View>
          </PopupDialog>
        </View>

        <TouchableOpacity onPress={() => NavigationActions.pop()} style={{
          position: 'absolute',
          paddingTop: 30,
          paddingHorizontal: 5,
          zIndex: 10
        }}>
          <Image source={Images.backButton} />
        </TouchableOpacity>

        <ScrollView style={styles.container}>

    <View style={{
      alignItems: 'center'
    }}><Text style={{fontSize: 50, paddingTop: 10, paddingBottom: 0, opacity: this.state.timerOpacity}}>
       {this.state.timer || '0:00'}

    </Text>
    <Text style={{fontSize: 50, paddingTop: 0, paddingBottom: 0, opacity: this.state.timerOpacity}}>
       {this.state.distance.toFixed(2)} miles
    </Text>
    
    </View>
          <View
            style={{
              alignItems: 'center'
            }}>
            <MapView.Animated
              style={{
                width: 320,
                height: 320
              }}
              initialRegion={{
                latitude: this.state.lastPosition.latitude,
                longitude: this.state.lastPosition.longitude,
                latitudeDelta: 0.00022,
                longitudeDelta: 0.00021
              }}

              showsUserLocation
              followsUserLocation
              showsCompass
            >
              <MapView.Polyline
                coordinates={this.state.coordinates}
                strokeColor='blue'
                strokeWidth={5}

            />
            </MapView.Animated>
          </View>
          <RoundedButton
            text={this.state.text}
            onPress={this.handleClick}
          />

        </ScrollView>
      </View>
    )
  }
}

export default StackNavigator({
  RunTrackerScreen: {screen: RunTrackerScreen}
}, {
  headerMode: 'screen',
  initialRouteName: 'RunTrackerScreen',
  navigationOptions: {
    header: {
      visible: true,
      style: {
        backgroundColor: 'teal'
      }
    }
  }
})
