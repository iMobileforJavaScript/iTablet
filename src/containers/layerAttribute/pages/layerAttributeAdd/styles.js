import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: scaleSize(20),
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  headerBtnTitle: {
    color: 'white',
    fontSize: 17,
  },
  btns: {
    height: scaleSize(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scaleSize(150),
    alignItems: 'center',
    marginVertical: scaleSize(30),
  },
  rows: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: scaleSize(60),
    backgroundColor: 'transparent',
  },
})
