/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../utils'
import color from '../../styles/color'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  headContainer: {
    width: '100%',
    height: scaleSize(60),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.background,
  },
  menuTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: setSpText(22),
  },
  leftFlatListContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  rightFlatListContainer: {
    flex: 1,
    backgroundColor: color.background,
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
    backgroundColor: color.background,
  },
  leftItem: {
    flex: 1,
    marginLeft: scaleSize(40),
    fontSize: setSpText(20),
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
    fontSize: setSpText(20),
  },
})
