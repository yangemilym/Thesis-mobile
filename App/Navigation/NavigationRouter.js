import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyles'
import NavigationDrawer from './NavigationDrawer'

// screens identified by the router
import LaunchScreen from '../Containers/LaunchScreen'
import RunTracker from '../Containers/RunTrackerScreen'
import LoginScreen from '../Containers/LoginScreen'
import CGscreen from '../Containers/CGscreen'
import Goalscreen from '../Containers/Goals'
import PacksScreen from '../Containers/PacksScreen'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  
  render () {
    return (
      <Router>
        <Scene key='drawer' component={NavigationDrawer} open={false}>
          <Scene key='drawerChildrenWrapper' navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>
            <Scene initial key='launchScreen' component={LaunchScreen} title='LaunchScreen' hideNavBar />
            <Scene key='runTracker' component={RunTracker} title='LaunchScreen' hideNavBar />
            <Scene key='cgscreen' component={CGscreen} title='LaunchScreen' hideNavBar />
            <Scene key='goalscreen' component={Goalscreen} title='LaunchScreen' hideNavBar />
            <Scene key='packsScreen' component={PacksScreen} title='LaunchScreen' hideNavBar />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
