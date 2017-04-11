import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet, AppRegistry, ListView } from 'react-native'
import { Images } from './DevTheme'
import RoundedButton from '../../App/Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'
import PopupDialog, { dialogStyle } from 'react-native-popup-dialog';
import { connect } from 'react-redux'
import axios from 'axios';
import { StackNavigator } from 'react-navigation'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import styles from './Styles/LaunchScreenStyles'
import LoginActions from '../Redux/LoginRedux'



class PacksScreen extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
        };
    }

    packSetter(name) {
        this.props.setPack(name);
    }

    render() {
        if (!this.props.userobj) {
            return (
                <Text>LOADING </Text>
            )
        }
        return (
            <View>
                <TouchableOpacity onPress={() => NavigationActions.pop()} style={{
                    position: 'absolute',
                    paddingTop: 7,
                    paddingHorizontal: 5,
                    zIndex: 10
                }}>
                    <Image source={Images.backButton} />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 50, paddingTop: 40, paddingBottom: 15 }}>
                        PACKS
                    </Text>
                </View>
                {this.props.userobj.Packs.map((ele, idx) => {
                    return (
                        <TouchableOpacity onPress={() => this.packSetter(ele["name"])}>
                            <Text>{ele["name"]}</Text>
                        </TouchableOpacity>
                    )
                }
                )}
                <View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
  return {
      currentPack: state.login.currentPack,
      userobj: state.login.userobj
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPack: (name) => dispatch(LoginActions.setCurrentPack(name))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PacksScreen)
