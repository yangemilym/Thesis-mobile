import React from 'react'
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native'
import { Images } from './DevTheme'
import RoundedButton from '../../App/Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'
import PopupDialog, {dialogStyle} from 'react-native-popup-dialog';
import { connect } from 'react-redux'
import axios from 'axios';
import { StackNavigator } from 'react-navigation'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import RunTrackerScreen from './RunTrackerScreen'
import GoalsPage from './Goals'
import ChallengePage from './Challenges'
import Tabs from 'react-native-tabs';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from './Styles/RunTrackerScreenStyles'

@connect(store => ({
  userinfo: store.login.username,
  userobj: store.login.userobj
}))

class CGscreen extends React.Component {
  constructor(props) {
    super();
      this.state = {
        animating: true
      };
    }

  // componentDidMount() {
  //   setInterval(() => {
  //     this.setState({
  //       visible: !this.state.visible
  //     });
  //   }, 3000);
  // }

   closeActivityIndicator() {
      setTimeout(() => {
         this.setState({animating: false});
      }, 3000);
   }
   componentDidMount() {
      this.closeActivityIndicator();
   }

  render () {
        if(!this.props.userobj){
      return (
      <View>
          <Image source={Images.waves2} style={styles.backgroundImage} resizeMode='repeat' />
         <ActivityIndicator
            size="large"
            color="#0000ff"
            animating = {this.state.animating}/>
      </View>
      )
    } 
    return (
      <View>
        <Image source={Images.waves2} style={styles.backgroundImage} resizeMode='repeat' />

       <TouchableOpacity onPress={() => NavigationActions.pop()} style={{
          position: 'absolute',
          paddingTop: 0,
          paddingHorizontal: 5,
          zIndex: 10
        }}>
          <Image source={Images.backButton} />
        </TouchableOpacity>
      <ScrollView >

      <View>
         <ScrollableTabView style={{backgroundColor: 'rgba(0,0,0,0)'}}>
        <GoalsPage tabLabel="Goals"/>
        <ChallengePage tabLabel="Challenges"/>
        </ScrollableTabView>
      </View>
      </ScrollView>
      </View>

    )
  }
  }


export default StackNavigator({
  CGscreen: {screen: CGscreen}
}, {
  headerMode: 'screen',
  initialRouteName: 'CGscreen',
  navigationOptions: {
    header: {
      visible: true,
      style: {
        backgroundColor: 'teal'
      }
    }
  }
})


