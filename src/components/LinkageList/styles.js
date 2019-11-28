/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'
import { color, size } from '../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  headContainer: {
    width: '100%',
    height: scaleSize(90),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.bgW,
  },
  menuTitle: {
    textAlign: 'center',
    fontSize: size.fontSize.fontSizeLg,
  },
  leftFlatListContainer: {
    // flex: 1,
    width: scaleSize(240),
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  rightFlatListContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: color.bgW,
    borderLeftWidth: 1,
    borderLeftColor: color.separateColorGray,
    justifyContent: 'flex-start',
  },
  leftWrap: {
    flex: 1,
    height: scaleSize(60),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#rgba(240, 240, 240 ,0)',
  },
  leftWrapSelect: {
    flex: 1,
    height: scaleSize(60),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.separateColorGray,
  },
  leftItem: {
    flex: 1,
    marginLeft: scaleSize(40),
    fontSize: size.fontSize.fontSizeSm,
  },
  rightWrap: {
    flex: 1,
    height: scaleSize(60),
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightItem: {
    flex: 1,
    marginLeft: scaleSize(40),
    fontSize: size.fontSize.fontSizeSm,
  },
  leftSelectTag: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: scaleSize(20),
    backgroundColor: color.switch,
  },
  shortLine1: {
    flex: 1,
    height: 1,
    backgroundColor: color.separateColorGray,
    marginLeft: scaleSize(40),
    marginRight: scaleSize(28),
  },
  shortLine2: {
    flex: 1,
    height: 1,
    backgroundColor: color.separateColorGray,
    marginLeft: scaleSize(28),
    marginRight: scaleSize(40),
  },
  moveSeparator: {
    width: scaleSize(20),
    backgroundColor: color.separateColorGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragIcon: {
    height: scaleSize(60),
    width: scaleSize(12),
  },
})
