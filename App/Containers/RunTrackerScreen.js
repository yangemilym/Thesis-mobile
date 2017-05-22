import React from 'react'
import { View, ScrollView, Text, TouchableOpacity, TouchableHighlight, Image, StyleSheet } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Images } from '../Themes'
import MapView from 'react-native-maps'
import styles from './Styles/RunTrackerScreenStyles'
import RoundedButton from '../../App/Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'
import PopupDialog, {dialogStyle} from 'react-native-popup-dialog'
import { connect } from 'react-redux'
import axios from 'axios'
import ButtonBox from './ButtonBox'
import Modal from 'react-native-modalbox';
import LoginActions from '../Redux/LoginRedux'

@connect(store => ({
  userinfo: store.login.username,
  currentPack: store.login.currentPack,
  userobj: store.login.userobj,
}))

class RunTrackerScreen extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        text: 'start',
        timerOpacity: 1.0,
        timer: '',
        start: '', 
        end: '',
        timeMsg: '',
        initialPosition: {},
        lastPosition: {latitude: 33.9759, longitude: -118.3907},
        coordinates: [], 
        distance: 0,
        pack: "Solo Run",
        showPackModal: false,
        mounted: true,
        threeMileSet: false,
        totalSeconds: 0,
        totalAltitude: null,
        altitudeVariance: null,
        lastAlt: null,
        runHistoryEntry: null
      };
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
    if (this.props.currentPack) {
      this.setState({pack: "Pack: " + this.props.currentPack})
    } else {
      this.setState({pack: "Solo Run"})
    }

  navigator.geolocation.getCurrentPosition((position) => {
    this.setState({lastPosition: {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421
    }});

    var newTotalAlt = this.state.totalAltitude + position.coords.altitude
    if (this.state.lastAlt !== null) {
      var newAltChange = this.state.altitudeVariance = Math.abs(this.state.lastAlt - position.coords.altitude);
    }
    this.setState({
      coordinates: [...this.state.coordinates, {latitude: position.coords.latitude, longitude: position.coords.longitude}],
      totalAltitude: newTotalAlt,
      lastAlt: position.coords.altitude,
      altitudeVariance: newAltChange
    })
    },
    (error) => console.log(error),
    {enableHighAccuracy: true, maximumAge: 0, desiredAccuracy: 0}
  )

    var geoLoc = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        if (this.state.coordinates.length > 1) {
        var tempdistance = this.state.distance + this.calcDistance(position.coords.latitude, position.coords.longitude, this.state.coordinates[this.state.coordinates.length-1].latitude, this.state.coordinates[this.state.coordinates.length-1].longitude, "M")
        this.setState({
          distance: tempdistance
        });
        }
        this.setState({lastPosition: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421
        }});
        this.setState({
          coordinates: [...this.state.coordinates, {latitude: position.coords.latitude, longitude: position.coords.longitude}]
        });

        if (this.state.totalSeconds > 720 && this.state.distance >= 3 && !this.state.threeMileSet) {
          this.setState({threeMileSet: true});
          var threeMileTime = this.state.totalSeconds;
            axios.put('https://lemiz2.herokuapp.com/api/soloking', {
                bestThreeMile: threeMileTime,
                UserId: this.props.userobj.id
              })
              .then((result) => {
                console.log("axios sent: " + result)
              })
              .catch((err) => {
                console.log("Put Error: ", err)
              })
          for (var i = 0; i < this.props.userobj.Packs.length; i++) {
            if (this.props.userobj.Packs[i].name === this.props.currentPack && (
                this.userobj.Packs[i].Users_Packs.bestThreeMile > threeMileTime || this.userobj.Packs[i].Users_Packs.bestThreeMile === null)) {
              axios.put('https://lemiz2.herokuapp.com/api/king', {
                bestThreeMile: threeMileTime,
                PackId: this.userobj.Packs[i].id,
                UserId: this.userobj.id
              })
              .then((result) => {
                console.log("axios sent: " + result)
              })
              .catch((err) => {
                console.log("Put Error: ", err)
              })
            }
          }
        }
      },
      (error) => console.log(error),
      {enableHighAccuracy: true, maximumAge: 0, desiredAccuracy: 0}
    )}, 1000);
    
    var startTime = (Date.now()/ 1000).toFixed(2);
    this.setState({text: 'stop', timerOpacity: 1.0, start: startTime});
    var startTimeSeconds = Math.floor(startTime);
    var sw = setInterval(() => {
      var currentTimeSeconds = Math.floor(Date.now()/ 1000);
      var secondsElapsed = currentTimeSeconds - startTimeSeconds;
      this.setState({totalSeconds: secondsElapsed})
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
        clearInterval(geoLoc);
      } else {
        if (this.state.mounted) {
         this.setState({timer: timer});
        }
      }
    }, 1000)
    } 

  saveToHistory() {
    if (this.state.runHistoryEntry) {
      axios.post('https://lemiz2.herokuapp.com/api/runHistory', { params: {
        runHistoryEntry: this.state.runHistoryEntry
      }})
      .then((result) => {
        this.setState({
          runHistoryEntry: null
        })
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }

  stopTimer = () => {
    if (this.props.userinfo) {
    var endTime = (Date.now() / 1000).toFixed(2);
    var totalSeconds = (endTime - this.state.start).toFixed(2);
    var runHistoryEntry = {
      duration: totalSeconds,
      distance: this.state.distance, 
      coordinates: this.state.coordinates,
      initialPosition: this.state.initialPosition,
      avgAltitude: (this.state.totalAltitude / this.state.coordinates.length),
      altitudeVariance: this.state.altitudeVariance,
      today: Date.now(),
      userID: this.props.userinfo.userId,
      currentPack: this.props.currentPack,
    }
    this.setState({
      runHistoryEntry
    })
    }
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
    if (totalSeconds >= 3600) {
      var timeMsg = 'You ran ' + this.state.distance.toFixed(2) + ' miles in ' + hours + ' hr' + minutes + ' min ' + seconds.toFixed(2) + ' sec \n';
    } else {
      var timeMsg = 'You ran ' + this.state.distance.toFixed(2) + ' miles \n in ' + minutes + ' min ' + seconds.toFixed(2) + ' sec \n';
    }
    this.setState({text: 'start', timerOpacity: 1.0, timer: '0:00', distance: 0, end: endTime, timeMsg, coordinates: []});
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
    this.setState({text: 'start'})
    this.setState({mounted: false});
  }
  showPackSelector() {
    this.setState({
      showPackModal: true,
    })
  }

  packSetter(name) {
      this.props.dispatch(LoginActions.setCurrentPack(name))
      name === null ? name = "Solo Run" : null;
      this.setState({
        pack: name
      })
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
            <View style={{alignItems: 'flex-end'}}><Text onPress={() => {this.popupDialog.dismiss()}} style={{fontSize: 28, color: 'red'}}>x </Text></View>
            <Text style={styles.popupText}>{this.state.timeMsg}</Text>
            <RoundedButton text="Save to History" onPress={() => {this.popupDialog.dismiss(); this.saveToHistory()}}> 
            </RoundedButton>
          </View>
          </PopupDialog>
        </View>
        
        <Image source={Images.waves2} style={styles.backgroundImage} resizeMode='repeat' />

        <TouchableOpacity onPress={() => { this.setState({text: 'start'}) 
          NavigationActions.pop()}} style={{
          position: 'absolute',
          paddingTop: 30,
          paddingHorizontal: 5,
          zIndex: 10
        }}>
          <Image source={Images.backButton} />
        </TouchableOpacity>

        <ScrollView>
          <View style={{backgroundColor: 'rgba(0,0,0,0)', flexDirection: 'row', flex: 1 , height: 90, opacity: this.state.timerOpacity}}>
            <Text style={{
              width: 200, 
              fontSize: 50, 
              paddingTop: 10, 
              paddingBottom: 0, 
              textAlign: 'center',
              marginLeft: 10
            }}> 
            {this.state.timer || '0:00'}
            </Text >
              <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{ fontSize: 25, marginTop: 0, textAlign: 'center' }}>{this.state.distance.toFixed(2) + ' miles' } 
            </Text>
             <TouchableOpacity onPress={() => this.showPackSelector()}>
              <Text style={{ color: '#005DB3', fontSize: 15, marginTop: 8 }}>{ '\n\n\n' + 'Pack: ',this.state.pack + '\n'} </Text>
             </TouchableOpacity>
             </View>
             </View>
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
        <Modal style={{justifyContent: 'center', borderRadius: 7, borderColor: 'teal', borderWidth: 3, height: 500, width: 300}} isOpen={this.state.showPackModal} onClosed={() => this.setState({showPackModal: false})} position={"center"} >
            <Text style={{fontSize: 31, textAlign: 'center', margin: 10}}>Which pack will you be running with? {'\n'}</Text>
            <TouchableOpacity onPress={() => this.packSetter(null)}>
            <View style={{padding: 12, flexDirection: 'row'}}>
              <View style={[{
              height: 24,
              width: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: '#000',
              alignItems: 'center',
              justifyContent: 'center',
            }]}>
              {
                this.state.pack === 'Solo Run' ?
                  <View style={{
                    height: 12,
                    width: 12,
                    borderRadius: 6,
                    backgroundColor: '#000',
                  }}/>
                  : null
              }
            </View>
              <Text style={{marginLeft: 12, fontSize: 16}}> Run Solo</Text>
              </View>
            </TouchableOpacity>
              {!this.props.userobj ? <View></View> : this.props.userobj.Packs.map((ele, idx) => {
                    return (
                        <TouchableOpacity key={idx} onPress={() => this.packSetter(ele["name"])}>
                        
                        <View style={{padding: 12, flexDirection: 'row'}}>
                        <View style={[{
                        height: 24,
                        width: 24,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: '#000',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }]}>
                        {
                          this.state.pack === ele.name ?
                            <View style={{
                              height: 12,
                              width: 12,
                              borderRadius: 6,
                              backgroundColor: '#000',
                            }}/>
                            : null
                        }
                      </View>
                        <Text style={{marginLeft: 12, fontSize: 16}}> {ele["name"]}</Text>
                        </View>
                        </TouchableOpacity>
                    )
                })
              }
                <RoundedButton text={'Confirm'}
                  onPress={() => {this.setState({showPackModal: false})}}
                />
          </Modal> 


 

      </View>
    )
  }
}

export default StackNavigator({
  RunTrackerScreen: {screen: RunTrackerScreen}
}, {
  headerMode: 'float',
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
