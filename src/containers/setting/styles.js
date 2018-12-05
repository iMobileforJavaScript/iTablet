import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'
export default StyleSheet.create({
  container: {
    backgroundColor: '#333333',
  },
  section: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(60),
    backgroundColor: '#4F4F4F',
    paddingLeft: scaleSize(20),
    alignItems: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(60),
    backgroundColor: '#333333',
    paddingLeft: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selection: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  sectionsTitile: {
    color: 'white',
    fontSize: scaleSize(24),
  },
  itemName: {
    color: 'white',
    fontSize: scaleSize(20),
  },
  itemValue: {
    color: '#C4C4C4',
  },
})
