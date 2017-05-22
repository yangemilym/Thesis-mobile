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
import styles from './Styles/RunTrackerScreenStyles'


class Challenge extends React.Component {
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
  this._renderContent = this._renderContent.bind(this);
  this._renderContentPend = this._renderContentPend.bind(this);
  }

  _renderHeaderPend(section) {
    return (
      <View>
         <Card style={{backgroundColor: "gray" }}><Card.Body><Text style={{color:"white"}}>Pending: {section.description}</Text></Card.Body></Card>
      </View>
    );
  }

  _renderHeader(section) {
    return (
      <View>
         <Card style={{backgroundColor: "#FF8C69" }}><Card.Body><Text>Accepted: {section.description}</Text></Card.Body></Card>
      </View>
    );
  }



    _renderContentPend(section) {
    acceptMe = (section) => {

        axios.request({
          url: 'https://lemiz2.herokuapp.com/api/goals',
          method: 'put',
          data: { id: section.id,
          status: "accepted" }
        }).then((res) => {
    
          var challCopy = this.state.pendingChallArray.slice();
          var challaccept =this.state.challengesArray.slice()
          for (var i = 0; i < challCopy.length; i++) {
            if (challCopy[i].id === section.id) {
             challCopy[i].status = 'accepted';
             console.log(challCopy[i], "THIS IS CHALL CHII")
             challaccept.push(challCopy[i])
             challCopy.splice(i, 1);
             
            }
          }
  
          this.setState({pendingChallArray: challCopy});
          this.setState({challengesArray: challaccept});


          var newUserObj = JSON.parse(JSON.stringify(this.props.userobj))
    
          for (var i= 0; i < newUserObj.Challenges.length ; i++){
            if(newUserObj.Challenges[i].id === section.id){
              newUserObj.Challenges[i].status = 'accepted';
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
    
          var challCopy = this.state.pendingChallArray.slice();
          for (var i = 0; i < challCopy.length; i++) {
            if (challCopy[i].id === section.id) {
              challCopy.splice(i, 1);
              
            }
          }
  
          this.setState({pendingChallArray: challCopy});

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
        <Button onPress={() => acceptMe(section)}text={"Accept"} />
         <Button onPress={() => deleteMe(section)} text={"Delete"} />
      </View>
    );



  }


  _renderContent(section) {

    completeMe = (section) => {

        axios.request({
          url: 'https://lemiz2.herokuapp.com/api/goals',
          method: 'put',
          data: { id: section.id,
          status: "completed" }
        }).then((res) => {
    
          var goalsCopy = this.state.challengesArray.slice();
          for (var i = 0; i < goalsCopy.length; i++) {
            if (goalsCopy[i].id === section.id) {
             goalsCopy[i].status = 'completed';
             goalsCopy.splice(i, 1);
      
            }
          }
  
          this.setState({challengesArray: goalsCopy});

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
    
          var goalsCopy = this.state.challengesArray.slice();
          for (var i = 0; i < goalsCopy.length; i++) {
            if (goalsCopy[i].id === section.id) {
              goalsCopy.splice(i, 1);
            }
          }
  
          this.setState({challengesArray: goalsCopy});

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
    console.log(this.props.userobj, "THIS IS CHALL USER")
    console.log(this.state, "THIS IS STATE ")
    if(this.state.challengesArray.length === 0 && this.state.pendingChallArray.length === 0){
      return(
      <View>
      <Text style={{paddingTop: 30,  flex: 1, textAlign: "center"}}> Please go to RabbitFitness.run view Challenges! </Text>
      </View>
      )
    } else {

    return (
      <View>
      <Accordion
        sections={this.state.pendingChallArray}
        renderHeader={this._renderHeaderPend}
        renderContent={this._renderContentPend}
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

export default connect(mapStateToProps, mapDispatchToProps)(Challenge)




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
