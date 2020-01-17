import { Dimensions, StyleSheet, Platform } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize } from '../../../../utils'
export const itemWidth = Dimensions.get('window').width
export const itemHeight = 140
export const imageWidth = 90
export const imageHeight = 90
export const textHeight = 40
const smallFontSize = 12
const largeFontSize = 18
const paddingLeft = 15
const styles = StyleSheet.create({
  //PublicData
  stateView: {
    height: scaleSize(40),
    alignItems: 'center',
  },
  HeaderRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreImg: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  searchImg: {
    height: scaleSize(40),
    width: scaleSize(40),
    marginRight: scaleSize(10),
  },
  ListViewStyle: {
    flex: 1,
    backgroundColor: color.content_white,
  },

  //DataItem
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

  seperator: {
    height: scaleSize(1),
    backgroundColor: '#A0A0A0',
  },

  //DrowdownView
  backgroudViewStyle: {
    flex: 1,
    position: 'absolute',
    marginTop: scaleSize(88) + (Platform.OS === 'ios' ? 20 : 0),
    width: '100%',
    height: '100%',
  },
  bagroudTouchViewStyle: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  //CatagoryMenu
  listContainerStyle: {
    width: '100%',
  },
  listBottonViewStyle: {
    height: scaleSize(40),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: scaleSize(10),
    paddingHorizontal: scaleSize(20),
  },
  textStyle: {
    fontSize: scaleSize(26),
  },
  ListItemContainerStyle: {
    paddingLeft: scaleSize(20),
    backgroundColor: color.content_white,
  },
  ListItemViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(80),
  },
  ListItemMoreViewStyle: {
    position: 'absolute',
    right: 0,
    width: scaleSize(80),
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ListItemMoreImgViewStyle: {
    width: scaleSize(40),
    height: scaleSize(40),
  },

  //MoreMenu
  MoreMenuContainer: {
    width: '40%',
    borderRadius: scaleSize(20),
    backgroundColor: color.content_white,
    alignSelf: 'flex-end',
  },
  MenuItemContainerStyle: {
    borderRadius: scaleSize(20),
  },
  MenuImageStyle: {
    width: scaleSize(60),
    height: scaleSize(60),
    marginHorizontal: scaleSize(10),
  },
  menuSeperator: {
    marginLeft: scaleSize(80),
    height: scaleSize(1),
    backgroundColor: '#A0A0A0',
  },

  //SearchMenu
  SearchMenuContainer: {
    width: '100%',
    maxHeight: '60%',
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
  },
  searchViewStyle: {
    marginVertical: scaleSize(20),
    paddingHorizontal: scaleSize(30),
  },
  searchBarStyle: {
    width: '100%',
    height: scaleSize(60),
    backgroundColor: color.content_white,
    borderRadius: scaleSize(30),
    paddingHorizontal: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchImgStyle: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  searchInputStyle: {
    flex: 1,
    paddingVertical: 0,
    fontSize: scaleSize(26),
  },
  searchButtonContainer: {
    width: '100%',
    height: scaleSize(100),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: scaleSize(1),
    borderTopColor: '#A0A0A0',
  },
  searchButton: {
    width: scaleSize(200),
    height: scaleSize(80),
    borderRadius: scaleSize(40),
    borderWidth: scaleSize(1),
    borderColor: '#A0A0A0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: scaleSize(26),
  },
})
export default styles
