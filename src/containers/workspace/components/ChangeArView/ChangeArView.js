import * as React from 'react'
import { View, TouchableHighlight, Text } from 'react-native'
import { MTBtn } from '../../../../components'
import { scaleSize, constUtil } from '../../../../utils'
import styles from './styles'
import PropTypes from 'prop-types'
import { TouchType } from '../../../../constants'
import { SMap } from 'imobile_for_reactnative'

const BTN_UNDERCOLOR = constUtil.UNDERLAYCOLOR_TINT

export default class ChangeArView extends React.Component {
  static propTypes = {
    map2Dto3D: PropTypes.bool,
    setMap2Dto3D: PropTypes.func,
    mapIs3D: PropTypes.bool,
    setMapIs3D: PropTypes.func,
    mapNavigationShow: PropTypes.bool,
    setMapNavigationShow: PropTypes.func,
  }

  props: {
    showFullMap: () => {},
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View
        style={{
          position: 'absolute',
          right: scaleSize(31),
          bottom: scaleSize(500),
          flexDirection: 'column',
          elevation: 20,
          shadowOffset: { width: 0, height: 0 },
          shadowColor: 'black',
          shadowOpacity: 1,
          shadowRadius: 2,
          backgroundColor: 'white',
          borderRadius: scaleSize(4),
        }}
      >
        <TouchableHighlight
          style={{
            backgroundColor: 'white',
            borderRadius: scaleSize(4),
            height: scaleSize(60),
            width: scaleSize(60),
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
          onPress={async () => {}}
          underlayColor={BTN_UNDERCOLOR}
        >
          <Text style={styles.text1}>2D</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={{
            backgroundColor: 'white',
            borderRadius: scaleSize(4),
            height: scaleSize(60),
            width: scaleSize(60),
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
          onPress={async () => {}}
          underlayColor={BTN_UNDERCOLOR}
        >
          <Text style={styles.text1}>3D</Text>
        </TouchableHighlight>
        <MTBtn
          style={styles.btn}
          size={MTBtn.Size.NORMAL}
          image={require('../../../../assets/Navigation/start_point.png')}
          onPress={async () => {
            GLOBAL.TouchType = TouchType.NAVIGATION_TOUCH_BEGIN
          }}
        />
        <MTBtn
          style={styles.btn}
          size={MTBtn.Size.NORMAL}
          image={require('../../../../assets/Navigation/end_point.png')}
          onPress={async () => {
            GLOBAL.TouchType = TouchType.NAVIGATION_TOUCH_END
          }}
        />
        <MTBtn
          style={styles.btn}
          size={MTBtn.Size.NORMAL}
          image={require('../../../../assets/Navigation/navi_icon.png')}
          onPress={() => {
            GLOBAL.TouchType = TouchType.NORMAL
            if (!GLOBAL.INDOORSTART && !GLOBAL.INDOOREND) {
              SMap.beginNavigation(
                GLOBAL.STARTX,
                GLOBAL.STARTY,
                GLOBAL.ENDX,
                GLOBAL.ENDY,
              )
            }
            if (GLOBAL.INDOORSTART && GLOBAL.INDOOREND) {
              SMap.beginIndoorNavigation(
                GLOBAL.STARTX,
                GLOBAL.STARTY,
                GLOBAL.ENDX,
                GLOBAL.ENDY,
              )
            }
          }}
        />
        <MTBtn
          style={styles.btn}
          size={MTBtn.Size.NORMAL}
          image={require('../../../../assets/Navigation/clean_route.png')}
          onPress={async () => {
            GLOBAL.TouchType = TouchType.NORMAL
            SMap.clearPoint()
          }}
        />
        <MTBtn
          style={styles.btn}
          size={MTBtn.Size.NORMAL}
          image={require('../../../../assets/mapEdit/cancel_black.png')}
          onPress={async () => {
            GLOBAL.TouchType = TouchType.NORMAL
            SMap.clearPoint()
            this.props.setMapNavigationShow(false)
            this.props.showFullMap(false)
          }}
        />
      </View>
    )
  }
}
