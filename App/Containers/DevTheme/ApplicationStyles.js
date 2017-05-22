import Fonts from './Fonts'
import Metrics from './Metrics'
import Colors from './Colors'

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const ApplicationStyles = {
  screen: {
    mainContainer: {
      flex: 1,
      justifyContent: 'space-around'
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      justifyContent: 'space-around'
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    section: {
    },
    sectionText: {
      ...Fonts.normal,
      // color: Colors.snow,
      justifyContent: 'space-around',
      textAlign: 'center'
    },
    subtitle: {
      // color: Colors.snow,
    },
    titleText: {
      ...Fonts.style.h2,
      fontSize: 14,
      color: Colors.text
    },
    popupContainer: {
      zIndex: 100
    },
    popup: {
      width: '90%',
      height: 260,
      borderColor: 'teal',
      borderWidth: 3
    },
    popupText: {
      fontSize: 32,
      textAlign: 'center',
      marginTop: 15
    }
  },
  darkLabelContainer: {
      justifyContent: 'space-around'
  },
  darkLabel: {
    fontFamily: Fonts.type.bold,
    color: Colors.snow
  },
  groupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  }
}

export default ApplicationStyles
