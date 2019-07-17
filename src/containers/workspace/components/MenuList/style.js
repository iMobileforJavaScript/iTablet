/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
export default StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: scaleSize(20),
    height: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: scaleSize(30),
    height: scaleSize(30),
    tintColor: color.imageColorBlack,
  },
})
