import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'
import { color } from '../../styles'

export default StyleSheet.create({
  listView: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: color.USUAL_SEPARATORCOLOR,
    // paddingVertical: scaleSize(10),
    backgroundColor: 'transparent',
    marginVertical: 0,
  },
  row: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
  },
  rowSeparator: {
    height: scaleSize(20),
    width: '100%',
  },
})
