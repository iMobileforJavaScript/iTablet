import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
export default StyleSheet.create({
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
