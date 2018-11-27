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
  key: {
    // flex:1
    width: scaleSize(200),
    height: scaleSize(60),
    fontSize: scaleSize(22),
    textAlign: 'center',
    color: 'white',
  },
  value: {
    flex: 1,
    height: scaleSize(60),
    fontSize: scaleSize(22),
    color: 'white',
    textAlign: 'center',
  },
  name: {
    width: scaleSize(200),
    height: scaleSize(40),
    fontSize: scaleSize(24),
    color: 'white',
    textAlign: 'center',
    // backgroundColor:"blue",
    alignItems: 'center',
  },
  result: {
    // width: scaleSize(300),
    flex: 1,
    height: scaleSize(40),
    fontSize: scaleSize(24),
    color: 'white',
    textAlign: 'center',
    // backgroundColor:"white",
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  analystView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    // backgroundColor:"red",
    // alignItems:"center",
    marginTop: scaleSize(20),
  },
  container: {
    flex: 1,
  },
})
