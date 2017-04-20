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
import LoginActions from '../Redux/LoginRedux'

class Goals extends React.Component {
  constructor(props) {
    super(props);

    const goals = [];
    const genGoals =[];
    const compGoals= [];

//- taking userobj from store & filtering the Challenges array by 
//mygoals, generated goals and completed goals
console.log(this.props, "THIS IS PROPPPS IN GOALS")
    for (var i=0; i<this.props.userobj.Challenges.length; i++) {
      if (this.props.userobj.Challenges[i].source !== null) {
      } else {
        if(this.props.userobj.Challenges[i].status === "completed"){
          compGoals.push(this.props.userobj.Challenges[i]);
        } else if (this.props.userobj.Challenges[i].status === "generated"){
          genGoals.push(this.props.userobj.Challenges[i]);
        } else {
          goals.push(this.props.userobj.Challenges[i])
        }
      }
    }
//setting state to be equaled to the filtered arrays from above
      this.state = {
        goalsArray: goals,
        genGoalsArray: genGoals,
        compGoalsArray: compGoals
    };
//binding this 
  this._renderContent = this._renderContent.bind(this);
  this._renderContentGen = this._renderContentGen.bind(this);

}


  _renderHeader(section) {
    return (
      <View>
        <Card style={{backgroundColor: "#008080" }}><Card.Body><Text style={{color:"white"}}> My Goals: {section.description}</Text></Card.Body></Card>
      </View>
    );
  }

  _renderHeaderGen(section) {
    return (
      <View>
         <Card style={{backgroundColor: "#FFD769" }}><Card.Body><Text>Rabbit Goals: {section.description}</Text></Card.Body></Card>
      </View>
    );
  }

  _renderContent(section) {
    // console.log(this.state.compGoalsArray,"THIS IS COMPLETED GOALLSSS ")

    completeMe = (section) => {

        axios.request({
          url: 'https://lemiz2.herokuapp.com/api/goals',
          method: 'put',
          data: { 
            id: section.id,
            status: "completed"}
        }).then((res) => {
    
          var goalsCopy = this.state.goalsArray.slice();
          for (var i = 0; i < goalsCopy.length; i++) {
            if (goalsCopy[i].id === section.id) {
             goalsCopy[i].status = 'completed';
             goalsCopy.splice(i, 1);
      
            }
          }
  
          this.setState({goalsArray: goalsCopy});

          var newUserObj = JSON.parse(JSON.stringify(this.props.userobj))
    
          for (var i= 0; i < newUserObj.Challenges.length ; i++){
            if(newUserObj.Challenges[i].id === section.id){
              newUserObj.Challenges[i].status = 'completed';
            }
          }
          this.props.updateuser(newUserObj)
        })
    };

    deleteMe = (section) => {
        axios.request({
          url: 'https://lemiz2.herokuapp.com/api/goals',
          method: 'delete',
          data: { id: section.id }
        }).then((res) => {
    
          var goalsCopy = this.state.goalsArray.slice();
          for (var i = 0; i < goalsCopy.length; i++) {
            if (goalsCopy[i].id === section.id) {
              goalsCopy.splice(i, 1);
            }
          }
  
          this.setState({goalsArray: goalsCopy});

          var newUserObj = JSON.parse(JSON.stringify(this.props.userobj))
    
          for (var i= 0; i < newUserObj.Challenges.length ; i++){
            if(newUserObj.Challenges[i].id === section.id){
              newUserObj.Challenges.splice(i,1);
            }
          }
          this.props.updateuser(newUserObj)
        })
    };

    return (
      <View>
        <Button onPress={() => completeMe(section)}text={"Complete"} />
         <Button onPress={() => deleteMe(section)} text={"Delete"} />
      </View>
    );
  }

    _renderContentGen(section) {
          // console.log(this.state.compGoalsArray,"THIS IS COMPLETED GOALLSSS ")

    completeMe = (section) => {

 axios.request({
          url: 'https://lemiz2.herokuapp.com/api/goals',
          method: 'put',
          data: { id: section.id,
          status: "completed" }
        }).then((res) => {
    
          var goalsCopy = this.state.genGoalsArray.slice();
          for (var i = 0; i < goalsCopy.length; i++) {
            if (goalsCopy[i].id === section.id) {
             goalsCopy[i].status = 'completed';
             goalsCopy.splice(i, 1);
      
            }
          }
  
          this.setState({genGoalsArray: goalsCopy});

          var newUserObj = JSON.parse(JSON.stringify(this.props.userobj))
    
          for (var i= 0; i < newUserObj.Challenges.length ; i++){
            if(newUserObj.Challenges[i].id === section.id){
              newUserObj.Challenges[i].status = 'completed';
            }
          }
          this.props.updateuser(newUserObj)
        })
    };

    deleteMe = (section) => {
        axios.request({
          url: 'https://lemiz2.herokuapp.com/api/goals',
          method: 'delete',
          data: { id: section.id }
        }).then((res) => {
          console.log(this.state.genGoalsArray, "This is gengoals")
          var goalsCopy = this.state.genGoalsArray.slice();
          for (var i = 0; i < goalsCopy.length; i++) {
            if (goalsCopy[i].id === section.id) {
              goalsCopy.splice(i, 1);
            }
          }
  
          this.setState({genGoalsArray: goalsCopy});

          var newUserObj = JSON.parse(JSON.stringify(this.props.userobj))
    
          for (var i= 0; i < newUserObj.Challenges.length ; i++){
            if(newUserObj.Challenges[i].id === section.id){
              newUserObj.Challenges.splice(i,1);
            }
          }
          this.props.updateuser(newUserObj)
        })
    };


    return (
      <View>
        <Button onPress={() => completeMe(section)}text={"Complete"} />
         <Button onPress={() => deleteMe(section)} text={"Delete"} />
      </View>
    );
  }



  render() {
    // console.log(this.props.userobj, "THIS IS CHALL USER")
    // console.log(this.state, "THIS IS STATE ")
    console.log(this.state.goalsArray, " THIS IS GOALS ARRAY")
    console.log(this.state.genGoalsArray, " THIS IS GENGOALS ARRAY")

    if(this.state.goalsArray.length === 0 && this.state.genGoalsArray.length === 0){
      return(
      <View>
      <Text style={{paddingTop: 30,  flex: 1, textAlign: "center"}}> Please go to RabbitFitness.run to set some goals! </Text>
      </View>
      )
    } else {
      return (
      <View>
      <Accordion
        sections={this.state.goalsArray}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
      />
      <Accordion
        sections={this.state.genGoalsArray}
        renderHeader={this._renderHeaderGen}
        renderContent={this._renderContentGen}
      />
      </View>
    );
  }
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
    updateuser: (userobj) => dispatch(LoginActions.loginUpdate(userobj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Goals)










/*import React, { Component } from 'react';
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


};*/




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

