import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { color } from '../../../../styles'
export default StyleSheet.create({
  sectionView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.contentColorGray,
    height: scaleSize(80),
  },
  sectionImg: {
    width: scaleSize(30),
    height: scaleSize(30),
    marginLeft: 10,
    tintColor: color.imageColorWhite,
  },
  sectionText: {
    color: color.fontColorWhite,
    paddingLeft: 15,
    fontSize: setSpText(26),
    fontWeight: 'bold',
    backgroundColor: 'transparent',
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
