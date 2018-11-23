import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
export default StyleSheet.create({
  sectionHeader: {
    fontSize: scaleSize(28),
    fontWeight: 'bold',
    backgroundColor: color.theme,
    color: 'white',
  },
  item: {
    padding: scaleSize(5),
    fontSize: scaleSize(22),
    paddingLeft: scaleSize(20),
    height: scaleSize(50),
    backgroundColor: color.theme,
    color: 'white',
  },
  Separator: {
    flex: 1,
    height: scaleSize(15),
  },
  name: {
    width: scaleSize(200),
    height: scaleSize(50),
    fontSize: scaleSize(22),
    color: 'white',
  },
  value: {
    width: scaleSize(150),
    height: scaleSize(50),
    fontSize: scaleSize(22),
    color: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
  },
})
