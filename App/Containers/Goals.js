import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableHighlight  ,TouchableOpacity, Image, StyleSheet, AppRegistry, ListView } from 'react-native'
import { Images } from './DevTheme'
import RoundedButton from '../../App/Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'
import PopupDialog, {dialogStyle} from 'react-native-popup-dialog';
import { connect } from 'react-redux'
import axios from 'axios';
import { StackNavigator } from 'react-navigation'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import styles from './Styles/LaunchScreenStyles'
import { Button, Card } from 'react-native-material-design';
import Tabs from 'react-native-tabs';
import Accordion from 'react-native-accordion';
import _ from 'lodash';


@connect(store => ({
  userobj: store.login.userobj
}))

export default class Goals extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    // const goals = _.filter(this.props.userobj.Challenges, (o) => { 
    //   console.log(o.source);
    //   return (o.source === null)
    // });
    const goals = [];
    const compGoals= [];
    for (var i=0; i<this.props.userobj.Challenges.length; i++) {
      if (this.props.userobj.Challenges[i].source !== null) {
      } else {
        if(this.props.userobj.Challenges[i].status !== "completed"){
          goals.push(this.props.userobj.Challenges[i]);
        } else {
        compGoals.push(this.props.userobj.Challenges[i]);
        }
      }
    }
    console.log(goals)
    console.log(compGoals, "THIS IS COMP GOALS")
      this.state = {
        challengesArray: goals,
        dataSource: ds.cloneWithRows(
        goals
      )
    };
  //  this.renderRow = this.renderRow.bind(this);
  }
  
_renderRow() {
    var header = (
      <View>
        <Text>Click to Expand</Text>
      </View>
    );

    var content = (
      <View>
        <Text>This content is hidden in the accordion</Text>
      </View>
    );

    return (
      <Accordion
        header={header}
        content={content}
        easing="easeOutCubic"
      />
    );
  }


render() {


        if(!this.props.userobj){
        //   console.log("INSIDE")
      return (
        <Text>LOADING </Text>
      )
    }


var listItem = (rowData) => {
  if(rowData.source === null && rowData.status === 'accepted'){
  return (<Card><Card.Body><Text> My Goal: {rowData.description}</Text></Card.Body></Card>)
} else {
  return(<Card><Card.Body><Text> Rabbit Goals:{rowData.description} </Text></Card.Body></Card>)
}
}
  
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={listItem}
      />
    );
  }


};




 /*render () {
    //   console.log(this.state.data2, "This is data2")
      // console.log(this.props.userobj.Challenges, "this is userobj Challenges")

      if(!this.props.userobj){
        //   console.log("INSIDE")
      return (
        <Text>LOADING </Text>
      )
    }

    return (
        <View>
        <View>
    <Text style={{fontSize: 50, paddingTop: 40, paddingBottom: 15}}>
       GOALS
    </Text>
    </View>

        <View>

         {this.props.userobj.Challenges.map((ele, idx) => {
           if (ele.source === null && ele.status === 'accepted'){
        return (
          <Card>
             <TouchableOpacity onPress={() => this.toggleButton()} >
            <Card.Body>
          <Text key={idx}> My Goal: {ele["description"]}</Text>  
          </Card.Body>
          </TouchableOpacity>
          </Card>
           )
           } else if (ele.source === null && ele.status === 'generated'){
              return (
                <Card>
                  <Card.Body>
                <Text key={idx}> Rabbit Goal: {ele["description"]}</Text>
                </Card.Body>
                </Card>
                )
           } 
        })}

      </View>
      </View>
    )
  }
}*/




// export default StackNavigator({
//   Goals: {screen: Goals}
// }, {
//   headerMode: 'screen',
//   initialRouteName: 'Goals',
//   navigationOptions: {
//     header: {
//       visible: true,
//       style: {
//         backgroundColor: 'teal'
//       }
//     }
//   }
// })
// AppRegistry.registerComponent('ListViewBasics', () => ListViewBasics);

