/**
 * Created by imobile-xzy on 2019/3/4.
 */
import { Dimensions, StyleSheet } from 'react-native'
import { color } from '../../../styles'
import { scaleSize, setSpText } from '../../../utils'

export const itemWidth = Dimensions.get('window').width
export const itemHeight = 140
export const imageWidth = 90
export const imageHeight = 90
export const textHeight = 40
const smallFontSize = 12
const largeFontSize = 18
const paddingLeft = 15
const styles = StyleSheet.create({
  searchView: {
    height: '100%',
    marginRight: 10,
    // width: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchImg: {
    flex: 1,
    height: scaleSize(45),
    width: scaleSize(45),
  },
  addFriendView: {
    width: scaleSize(45),
    height: scaleSize(45),
    // borderRadius: scaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addFriendImg: {
    width: scaleSize(45),
    // flex:1,
    height: scaleSize(45),
  },
  haveDataViewStyle: {
    flex: 1,
    backgroundColor: color.content_white,
  },
  noDataViewStyle: {
    flex: 1,
    backgroundColor: color.content_white,
  },

  itemViewStyle: {
    width: '100%',
    height: itemHeight,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: color.content_white,
  },
  imageStyle: {
    width: imageWidth,
    height: imageHeight,
    backgroundColor: color.image_bg_white,
  },
  restTitleTextStyle: {
    width: '100%',
    fontSize: largeFontSize,
    fontWeight: 'bold',
    // color: 'white',
    paddingLeft: paddingLeft,
    textAlign: 'left',
    flexWrap: 'wrap',
    marginRight: 100,
  },

  viewStyle2: {
    width: '100%',
    height: 20,
    flexDirection: 'row',
    paddingLeft: paddingLeft,
    marginTop: 10,
    marginRight: 100,
  },
  imageStyle2: {
    width: 20,
    height: 20,
  },
  textStyle2: {
    textAlign: 'left',
    // color: 'white',
    lineHeight: 20,
    fontSize: smallFontSize,
    paddingLeft: 5,
  },
  separateViewStyle: {
    width: '100%',
    height: 2,
  },
  //登陆按钮
  itemView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#505050',
    paddingHorizontal: scaleSize(50),
    width: scaleSize(450),
    height: scaleSize(180),
    marginVertical: scaleSize(50),
    borderRadius: scaleSize(10),
  },
  imagStyle: {
    width: scaleSize(80),
    height: scaleSize(80),
  },
  textStyle: {
    color: '#FBFBFB',
    fontSize: scaleSize(80),
  },
})

const dialogStyles = StyleSheet.create({
  dialogHeaderViewX: {
    paddingTop: scaleSize(10),
    flex: 1,
    //  backgroundColor:"pink",
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogHeaderImgX: {
    width: scaleSize(80),
    height: scaleSize(80),
    opacity: 1,
    // marginLeft:scaleSize(145),
    // marginTop:scaleSize(21),
  },
  promptTtileX: {
    fontSize: scaleSize(24),
    color: '#303030',
    marginTop: scaleSize(5),
    marginLeft: scaleSize(20),
    textAlign: 'center',
  },
  dialogBackgroundX: {
    height: scaleSize(240),
    // borderRadius: scaleSize(4),
    // backgroundColor: 'white',
  },
})

const inputStyles = StyleSheet.create({
  textInputStyle: {
    marginTop: scaleSize(25),
    height: scaleSize(70),
    flex: 1,
    fontSize: setSpText(20),
    borderRadius: scaleSize(8),
    borderWidth: 1,
    borderColor: '#808080',
    color: '#333333',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: scaleSize(30),
    height: scaleSize(80),
  },
})
export { dialogStyles, styles, inputStyles }
