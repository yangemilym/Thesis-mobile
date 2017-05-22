import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  button: {
    height: 55,
    borderRadius: 5,
    marginHorizontal: Metrics.section,
    marginVertical: Metrics.baseMargin,
    backgroundColor: 'teal',
    justifyContent: 'center'
  },
  buttonText: {
    color: Colors.snow,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: Fonts.size.h4,
    marginVertical: Metrics.baseMargin
  }
})
