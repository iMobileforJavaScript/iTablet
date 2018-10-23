import { StyleSheet } from 'react-native'
// import * as Util from '../../../../utils/constUtil'
import { scaleSize, constUtil as Util } from '../../../../utils'
import { color } from '../../../../styles'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
  pop: {
    position: 'absolute',
    left: 0,
    bottom: 0.75 * 1.4 * 0.1 * Util.WIDTH + 5,
    backgroundColor: 'white',
  },
  measure: {
    position: 'absolute',
    left: 0.35 * Util.WIDTH,
    top: 5,
    // left: 0,
    // bottom: 0.75 * 1.4 * 0.1 * Util.WIDTH + 5,
    borderRadius: 5,
    backgroundColor: 'white',
    // zIndex:10,
    borderStyle: 'solid',
    borderColor: Util.USUAL_SEPARATORCOLOR,
    borderWidth: 1,
  },
  mapMenu: {
    width: '100%',
    borderBottomWidth: scaleSize(3),
    borderColor: '#E8E8E8',
    backgroundColor: 'white',
    alignSelf: 'center',
    paddingVertical: scaleSize(10),
  },
  mapMenuOverlay: {
    // flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundColor: '#rgba(0, 0, 0, 0.3)',
  },
  cutline: {
    width: '100%',
    backgroundColor: '#E8E8E8',
    height: scaleSize(3),
    marginVertical: scaleSize(10),
  },
  changeLayerBtn: {
    position: 'absolute',
    // flexDirection: 'column',
    // left: 0,
    right: scaleSize(20),
    bottom: scaleSize(200),
    backgroundColor: 'transparent',
  },
  changeLayerImage: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  popView: {
    position: 'absolute',
    flexDirection: 'column',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },

  leftToolbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: color.theme,
  },
  rightToolbar: {
    position: 'absolute',
    top: scaleSize(20),
    right: scaleSize(20),
    backgroundColor: color.white,
  },
  headerBtnSeparator: {
    marginLeft: scaleSize(40),
  },
})
