import { StyleSheet, Platform } from 'react-native'
import { color, size } from '../../../../../styles'
import { scaleSize } from '../../../../../utils'

export default StyleSheet.create({
  dialogContainer: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: scaleSize(30),
    paddingVertical: scaleSize(30),
    paddingHorizontal: scaleSize(60),
    // backgroundColor: 'yellow',
  },
  label: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.title,
    // width: scaleSize(160),
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    marginLeft: scaleSize(10),
    height: scaleSize(60),
    borderColor: color.grayLight2,
    borderWidth: 1,
    borderRadius: scaleSize(4),
    backgroundColor: 'transparent',
    textAlign: 'center',
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
})
