import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color } from '../../../../styles'
export default StyleSheet.create({
  sectionHeader: {
    fontSize: setSpText(28),
    fontWeight: 'bold',
    backgroundColor: color.theme,
    color: 'white',
  },
  item: {
    padding: scaleSize(5),
    fontSize: setSpText(24),
    paddingLeft: scaleSize(20),
    height: scaleSize(50),
    backgroundColor: color.theme,
    color: 'white',
  },
  workspaceItem: {
    padding: scaleSize(5),
    fontSize: setSpText(24),
    paddingLeft: scaleSize(20),
    height: scaleSize(50),
    backgroundColor: color.bgW,
    color: color.themeText2,
  },
  baseText: {
    padding: scaleSize(5),
    fontSize: setSpText(28),
    paddingLeft: scaleSize(20),
    height: scaleSize(50),
    backgroundColor: color.bgW,
    color: color.themeText2,
  },
  itemTime: {
    height: scaleSize(30),
    color: '#A3A3A3',
    paddingLeft: scaleSize(20),
    fontSize: setSpText(16),
    justifyContent: 'center',
  },
  Separator: {
    flex: 1,
    height: 1,
    // backgroundColor: color.fontColorGray,
    backgroundColor: '#A0A0A0',
  },
  text: {
    fontSize: setSpText(22),
    color: 'white',
  },
  key: {
    // width:scaleSize(200),
    flex: 4,
    height: scaleSize(60),
    // fontSize: scaleSize(22),
    alignItems: 'center',
    justifyContent: 'center',
    // textAlignVertical: 'center',
    backgroundColor: '#2D2D2F',
    borderBottomWidth: scaleSize(0.5),
    borderBottomColor: '#C4C4C4',
  },
  value: {
    // width:scaleSize(520),
    flex: 6,
    height: scaleSize(60),
    // fontSize: scaleSize(22),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F4F4F',
    borderBottomWidth: scaleSize(0.5),
    borderBottomColor: '#C4C4C4',
  },
  name: {
    width: scaleSize(200),
    height: scaleSize(40),
    fontSize: setSpText(24),
    color: color.themeText2,
    textAlign: 'center',
    // backgroundColor:"blue",
    alignItems: 'center',
  },
  result: {
    // width: scaleSize(300),
    flex: 1,
    height: scaleSize(40),
    fontSize: setSpText(24),
    color: color.themeText2,
    textAlign: 'center',
    // backgroundColor:"white",
  },
  row: {
    flex: 1,
    height: scaleSize(61),
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
  sceneHead: {
    flex: 1,
  },
  fltListHeader: {
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.subTheme,
  },
  sceneView: {
    // flex:1,
    height: scaleSize(80),
    flexDirection: 'row',
    // justifyContent:"center",
    alignItems: 'center',
    backgroundColor: color.subTheme,
  },
  sceneTitle: {
    fontSize: setSpText(28),
    color: '#F0F0F0',
    paddingLeft: scaleSize(30),
  },
  sceneItem: {
    flex: 1,
    height: scaleSize(81),
    // marginTop: scaleSize(20),
    flexDirection: 'column',
    // justifyContent:"center",
  },
  sceneImg: {
    width: scaleSize(55),
    height: scaleSize(55),
    marginLeft: scaleSize(30),
  },
  sceneItemImg: {
    width: scaleSize(40),
    height: scaleSize(40),
    marginLeft: scaleSize(50),
  },
  baseMapImg: {
    width: scaleSize(60),
    height: scaleSize(60),
    marginLeft: scaleSize(50),
  },
  baseMapTitle: {
    flex: 1,
    height: scaleSize(80),
    marginLeft: scaleSize(35),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sceneItemcontent: {
    flex: 1,
    height: scaleSize(80),
    marginLeft: scaleSize(15),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  newView: {
    flex: 1,
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: color.subTheme,
    // backgroundColor:"red",
  },
  newRout: {
    width: scaleSize(55),
    height: scaleSize(55),
    marginRight: scaleSize(15),
    // marginLeft: scaleSize(30),
  },
  newText: {
    fontSize: setSpText(28),
    color: '#F0F0F0',
    marginRight: scaleSize(30),
  },
})
