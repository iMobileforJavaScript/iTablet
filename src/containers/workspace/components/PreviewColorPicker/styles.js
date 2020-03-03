/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import color from '../../../../styles/color'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    height: scaleSize(400),
    width: '100%',
    backgroundColor: '#EEEEEE',
    paddingHorizontal: scaleSize(40),
    paddingTop: scaleSize(20),
  },
  header: {
    width: '100%',
    height: scaleSize(40),
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: color.gray,
    overflow: 'hidden',
  },
  headerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
  },
  headerTxt: {
    fontSize: setSpText(16),
    color: '#303030',
  },
  progressContainer: {
    paddingTop: scaleSize(20),
    flex: 1,
  },
  colorView: {
    width: '80%',
    marginLeft: '10%',
    height: scaleSize(40),
    borderRadius: 5,
  },
  progresses: {
    width: '80%',
    marginLeft: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderText: {
    fontSize: setSpText(16),
  },
  leftIcon: {
    width: scaleSize(30),
    height: scaleSize(30),
    borderRadius: scaleSize(15),
    borderWidth: 1,
    borderColor: color.gray,
    marginLeft: scaleSize(20),
  },
  rightIcon: {
    width: scaleSize(30),
    height: scaleSize(30),
    borderRadius: scaleSize(15),
    borderWidth: 1,
    borderColor: color.gray,
    marginRight: scaleSize(20),
  },
  slider: {
    marginHorizontal: scaleSize(10),
    flex: 1,
  },
})
