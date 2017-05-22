import React from 'react'
import { ScrollView, TouchableOpacity, Text, Image, View, TouchableHighlight } from 'react-native'
import { Images } from '../Themes'
import ButtonBox from './ButtonBox'
import {Actions as NavigationActions } from 'react-native-router-flux'
import LoginActions from '../Redux/LoginRedux'
import { connect } from 'react-redux'
import styles from './Styles/LaunchScreenStyles'
import userDefaults from 'react-native-user-defaults'
import axios from 'axios';
import RoundedButton from '../../App/Components/RoundedButton'
import Modal from 'react-native-modalbox';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'



var Auth0Lock = require('react-native-lock');
var lock = new Auth0Lock({clientId: 'KhDTuf4lq48s3Db6kEvHHaLGaQCb7ETk', domain: 'lameme.auth0.com', allowedConnections: ['facebook'],
  theme:  {
    logo: Images.CC5,
    primaryColor: '#31324F'
  }
})


 class LaunchScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: true,
    }

    this.showLogin = this.showLogin.bind(this)
  }

  showLogin () {
    lock.show({connections: ['facebook', 'Username-Password-Authentication']}, (err, profile, token) => {
      if (err) {
        console.log(err)
        return
      } else {
      this.props.success(profile);
      var userID = profile.userId;
      axios.post('https://lemiz2.herokuapp.com/api/users', { params: {
        userID,
        profile,
      }})
      .then((result) => {
        this.props.updateuser(result.data)
      })
      .catch((err) => {
        console.log(err)
      })
      }
    })
  }


  handleClick = () => {

  }

  componentWillMount() {
    if (!this.props.username) {
      this.showLogin()
    } 
  }

  packSetter(name) {
      this.props.setPack(name);
  }

  render () {
    return (
      <View style={{flex: 1, flexShrink: 1/2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
      <View style={{flex: 1, flexShrink: 1/2, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Image source={Images.waves} style={styles.backgroundImage} resizeMode='repeat' />
        <ScrollView style={styles.container}>
          
          <View style={styles.centered}>
              <View style={{flex: 1/20}}><Text></Text></View>

            <Image source={Images.launch} resizeMode='contain' style={styles.logo} />
          </View>
          <View style={{paddingTop: 15, flex: 1, flexShrink: 1/4}}>
          
            <Text style={{textAlign: "center", backgroundColor: 'rgba(0,0,0,0)', fontSize: 30, fontWeight: "bold", fontFamily: "Avenir"}}> Rabbit Fitness </Text>
          </View>
          {/*<View style={{paddingTop: 25}}>
          <RoundedButton
            text={"LET'S RUN!"}
            onPress={NavigationActions.runTracker}
          />
          </View>*/}
          <View style={{flex: 2, flexShrink: 1, flexDirection: 'column', alignItems: 'center'}}>
              <View style={{flex: 1/25}}><Text></Text></View>
            <View style={{flex: 1, flexDirection: 'row', flexShrink: 2, alignItems: 'stretch'}}>
              <TouchableOpacity onPress={NavigationActions.cgscreen}>
                <View style={{flex: 2, flexShrink: 1/2}}><Image source={Images.CC2} resizeMode={"contain"} style={{height:127, width:127}}/></View>
              </TouchableOpacity>
              <TouchableOpacity onPress={NavigationActions.runTracker}>
                <View style={{backgroundColor: 'rgba(0,0,0,0)'}}><Text></Text></View><View style={{backgroundColor: 'rgba(0,0,0,0)'}}><Text></Text></View><View style={{backgroundColor: 'rgba(0,0,0,0)'}}><Text></Text></View><View style={{backgroundColor: 'rgba(0,0,0,0)'}}><Text></Text></View>
              <View style={{flex: 2}}><Image source={Images.CC5} resizeMode={"contain"} style={{height:170, width:170}}/></View>
              </TouchableOpacity>
              {/*<ButtonBox onPress={NavigationActions.packsScreen} style={styles.componentButton} image={Images.colorRun} text="View my Packs" />*/}
              {/*<ButtonBox onPress={NavigationActions.cgscreen} style={styles.usageButton} image={Images.home} text='Challenges & Goals' />*/}
            </View>
          </View>
        </ScrollView>
      </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.login.username,
    userobj: state.login.userobj

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    success: (username) => dispatch(LoginActions.loginSuccess(username)),
    updateuser: (userobj) => dispatch(LoginActions.loginUpdate(userobj)),
    setPack: (name) => dispatch(LoginActions.setCurrentPack(name))

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)

