import { StyleSheet, Platform } from 'react-native'
import { scaleSize, setSpText } from '../../../../../../utils'
import { color } from '../../../../../../styles'

export default StyleSheet.create({
  textHeader: {
    backgroundColor: color.section_bg,
    height: scaleSize(80),
    alignItems: 'center',
    flexDirection: 'row',
  },
  textFont: {
    paddingLeft: scaleSize(20),
    fontSize: setSpText(30),
    fontWeight: 'bold',
    color: 'white',
  },
  row: {
    flex: 1,
    height: scaleSize(80),
    marginLeft: scaleSize(20),
    borderBottomWidth: 1,
    borderBottomColor: color.item_separate_white,
  },
  customInput: {
    textAlign: 'right',
    borderWidth: 0,
    height: scaleSize(48),
    marginRight: scaleSize(20),
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
    backgroundColor: 'transparent',
  },
})
