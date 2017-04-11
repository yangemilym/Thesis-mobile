import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet, AppRegistry, ListView } from 'react-native'
import { Images } from './DevTheme'
import RoundedButton from '../../App/Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'
import PopupDialog, {dialogStyle} from 'react-native-popup-dialog';
import { connect } from 'react-redux'
import axios from 'axios';
import { StackNavigator } from 'react-navigation'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { Button, Card } from 'react-native-material-design';
import Tabs from 'react-native-tabs';
import Accordion from 'react-native-collapsible/Accordion';


// const SECTIONS = [
//   {
//     title: 'First',
//     content: 'Lorem ipsum...',
//   },
//   {
//     title: 'Second',
//     content: 'Lorem ipsum...',
//   }
// ];

@connect(store => ({
  userobj: store.login.userobj
}))


export default class Challenges extends React.Component {
  constructor(props) {
    super(props);

    const chall = [];
    const pendingchall =[];
    const compchall= [];

    for (var i=0; i<this.props.userobj.Challenges.length; i++) {
      if (this.props.userobj.Challenges[i].source === null) {
      } else {
        if(this.props.userobj.Challenges[i].status === "completed"){
          compchall.push(this.props.userobj.Challenges[i]);
        } else if (this.props.userobj.Challenges[i].status === "pending") {
        pendingchall.push(this.props.userobj.Challenges[i]);
        } else {
          chall.push(this.props.userobj.Challenges[i])
        }
      }
    }

      this.state = {
        challengesArray: chall,
        pendingChallArray: pendingchall,
        compChallArray: compchall
    };
  //  this.renderRow = this.renderRow.bind(this);
  }

  _renderHeader(section) {
    return (
      <View>
        <Text>{section.description}</Text>
      </View>
    );
  }

  _renderContent(section) {
    return (
      <View>
        <Button text={section.source} />
      </View>
    );
  }

  render() {
    console.log(this.props.userobj, "THIS IS CHALL USER")
    console.log(this.state, "THIS IS STATE ")
    return (
      <View>
      <Accordion
        sections={this.state.pendingChallArray}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
      />
      <Accordion
        sections={this.state.challengesArray}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
      />
      </View>
    );
  }
}




/*
export default class Goals extends React.Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
      };
    }


  render () {
    //   console.log(this.state.data2, "This is data2")
      console.log(this.props.userobj, "this is userobj")

      if(!this.props.userobj){

      return (
        <Text>LOADING </Text>
      )
    }

    return (
        <View>
        <View>
    <Text style={{fontSize: 50, paddingTop: 40, paddingBottom: 15}}>
       CHALLENGES
    </Text>
    </View>
        <View>
            
         {this.props.userobj.Challenges.map((ele, idx) => {
           if (ele.source !== null && ele.status === 'accepted'){
        return (<Text key={idx}> Challenge from {ele["source"]} : {ele["description"]}</Text>)
           } else if (ele.source !== null && ele.status === 'pending'){
              return (<Text key={idx}> Pending Challenge from {ele["source"]} : {ele["description"]}</Text>)
           } 
        })}
      </View>
      </View>
    )
  }
}*/
