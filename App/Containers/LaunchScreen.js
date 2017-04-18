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
var lock = new Auth0Lock({clientId: 'KhDTuf4lq48s3Db6kEvHHaLGaQCb7ETk', domain: 'lameme.auth0.com', allowedConnections: ['facebook']})


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
      <View style={styles.mainContainer}>
        <Image source={Images.waves} style={styles.backgroundImage} resizeMode='repeat' />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.launch} style={styles.logo} />
          </View>
          <View style={{paddingTop: 25}}>
            <Text style={{textAlign: "center", fontSize: 30, fontWeight: "bold", fontFamily: "Avenir"}}> Rabbit Fitness </Text>
          </View>
          {/*<View style={{paddingTop: 25}}>
          <RoundedButton
            text={"LET'S RUN!"}
            onPress={NavigationActions.runTracker}
          />
          </View>*/}
          <View style={{paddingTop: 25}}>
            <View>
              <TouchableOpacity onPress={NavigationActions.cgscreen}>
                <Image source={Images.CC2} style={{height:127, width:127, marginLeft: 40}}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={NavigationActions.runTracker}>
                <Image source={Images.CC5} style={{height:170, width:170, marginLeft: 170}}/>
              </TouchableOpacity>
              {/*<ButtonBox onPress={NavigationActions.packsScreen} style={styles.componentButton} image={Images.colorRun} text="View my Packs" />*/}
              {/*<ButtonBox onPress={NavigationActions.cgscreen} style={styles.usageButton} image={Images.home} text='Challenges & Goals' />*/}
            </View>
          </View>
        </ScrollView>
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

