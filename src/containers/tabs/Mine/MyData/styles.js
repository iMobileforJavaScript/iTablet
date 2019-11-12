import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color, size } from '../../../../styles'
export default StyleSheet.create({
  section: {
    flex: 1,
    height: scaleSize(80),
    backgroundColor: color.contentColorGray,
    alignItems: 'center',
    flexDirection: 'row',
  },
  sectionText: {
    flex: 1,
    color: color.fontColorWhite,
    paddingLeft: 10,
    fontSize: size.fontSize.fontSizeXl,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  sectionImg: {
    tintColor: color.fontColorWhite,
    marginLeft: 10,
    width: scaleSize(30),
    height: scaleSize(30),
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: color.contentColorWhite,
    alignItems: 'center',
    height: scaleSize(80),
  },
  itemText: {
    color: color.fontColorBlack,
    paddingLeft: 15,
    fontSize: size.fontSize.fontSizeXl,
    flex: 1,
  },
  img: {
    width: scaleSize(30),
    height: scaleSize(30),
    marginLeft: 20,
    tintColor: color.fontColorBlack,
  },
  moreView: {
    height: '100%',
    marginRight: 10,
    // width: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightTextStyle: {
    color: '#FBFBFB',
    fontSize: scaleSize(26),
  },
  moreImg: {
    flex: 1,
    height: scaleSize(40),
    width: scaleSize(40),
  },
  bottomStyle: {
    height: scaleSize(80),
    paddingHorizontal: scaleSize(60),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: '#A0A0A0',
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  bottomItemStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
