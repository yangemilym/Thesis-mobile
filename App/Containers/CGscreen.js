import React from 'react'
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
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

@connect(store => ({
  userinfo: store.login.username
}))

class CGscreen extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
   
      };
    }



  render () {
    return (
      <View>
       <TouchableOpacity onPress={() => NavigationActions.pop()} style={{
          position: 'absolute',
          paddingTop: 0,
          paddingHorizontal: 5,
          zIndex: 10
        }}>
          <Image source={Images.backButton} />
        </TouchableOpacity>
      <ScrollView>

      <View>
         <ScrollableTabView>
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


