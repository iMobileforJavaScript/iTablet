import * as React from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import { scaleSize, setSpText, Toast } from '../../../../utils'
// import { getLanguage } from '../../../../language/index'
import NavigationService from '../../../../containers/NavigationService'
import { MTBtn } from '../../../../components'
import { TouchType } from '../../../../constants'
import styles from './styles'
import { color } from '../../../../styles'
import PropTypes from 'prop-types'
import { SMap } from 'imobile_for_reactnative'

export default class NavigationView extends React.Component {
  static propTypes = {
    mapNavigation: PropTypes.object,
    setMapNavigation: PropTypes.func,
    mapSelectPoint: PropTypes.object,
    setMapSelectPoint: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.PointType = null
  }

  componentDidMount() {
    SMap.setStartPointNameListener({
      callback: result => {
        this.props.setMapSelectPoint({
          firstPoint: result,
          secondPoint: this.props.mapSelectPoint.secondPoint,
        })
      },
    })
    SMap.setEndPointNameListener({
      callback: result => {
        this.props.setMapSelectPoint({
          firstPoint: this.props.mapSelectPoint.firstPoint,
          secondPoint: result,
        })
      },
    })
  }

  close = () => {
    this.props.setMapNavigation({ isShow: false, name: '' })
    GLOBAL.MAPSELECTPOINT.setVisible(false)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false)
    NavigationService.goBack()
  }

  _renderSearchView = () => {
    return (
      <View style={{ flex: 1, backgroundColor: color.background }}>
        <View
          style={{
            height: scaleSize(165),
            width: '100%',
            backgroundColor: 'black',
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.close()
            }}
            style={{ marginLeft: scaleSize(40) }}
          >
            <Image
              resizeMode={'contain'}
              source={require('../../../../assets/public/icon-back-white.png')}
              style={styles.analyst1}
            />
          </TouchableOpacity>
          <View style={styles.pointAnalystView}>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <Image
                  resizeMode={'contain'}
                  source={require('../../../../assets/Navigation/icon_tool_start.png')}
                  style={styles.startPoint}
                />
                <TouchableOpacity
                  style={styles.onInput}
                  onPress={async () => {
                    GLOBAL.TouchType = TouchType.NAVIGATION_TOUCH_BEGIN
                    GLOBAL.MAPSELECTPOINT.setVisible(true)
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(true, {
                      button: '设为起点',
                    })
                    GLOBAL.toolBox.showFullMap(true)
                    this.props.setMapNavigation({
                      isShow: true,
                      name: '',
                    })
                    NavigationService.goBack()
                  }}
                >
                  <Text style={{ fontSize: setSpText(20) }}>
                    {this.props.mapSelectPoint.firstPoint}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <Image
                  resizeMode={'contain'}
                  source={require('../../../../assets/Navigation/icon_tool_end.png')}
                  style={styles.endPoint}
                />
                <TouchableOpacity
                  style={styles.secondInput}
                  onPress={async () => {
                    GLOBAL.TouchType = TouchType.NAVIGATION_TOUCH_END
                    GLOBAL.MAPSELECTPOINT.setVisible(true)
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(true, {
                      button: '设为终点',
                    })
                    GLOBAL.toolBox.showFullMap(true)
                    this.props.setMapNavigation({
                      isShow: true,
                      name: '',
                    })
                    NavigationService.goBack()
                  }}
                >
                  <Text style={{ fontSize: setSpText(20) }}>
                    {this.props.mapSelectPoint.secondPoint}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <MTBtn
              style={styles.btn}
              size={MTBtn.Size.NORMAL}
              image={require('../../../../assets/Navigation/navi_icon.png')}
              onPress={() => {
                GLOBAL.TouchType = TouchType.NORMAL
                if (!GLOBAL.INDOORSTART && !GLOBAL.INDOOREND) {
                  if (GLOBAL.STARTX !== undefined) {
                    SMap.beginNavigation(
                      GLOBAL.STARTX,
                      GLOBAL.STARTY,
                      GLOBAL.ENDX,
                      GLOBAL.ENDY,
                    )
                    GLOBAL.MAPSELECTPOINT.setVisible(false)
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false, {
                      button: '',
                    })
                    NavigationService.goBack()
                  } else {
                    Toast.show('请先设置起终点')
                  }
                }
                if (GLOBAL.INDOORSTART && GLOBAL.INDOOREND) {
                  if (GLOBAL.STARTX !== undefined) {
                    SMap.beginIndoorNavigation(
                      GLOBAL.STARTX,
                      GLOBAL.STARTY,
                      GLOBAL.ENDX,
                      GLOBAL.ENDY,
                    )
                    GLOBAL.MAPSELECTPOINT.setVisible(false)
                    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false, {
                      button: '',
                    })
                    NavigationService.goBack()
                  } else {
                    Toast.show('请先设置起终点')
                  }
                }
              }}
            />
            <MTBtn
              style={styles.btn}
              size={MTBtn.Size.NORMAL}
              image={require('../../../../assets/Navigation/clean_route.png')}
              onPress={async () => {
                GLOBAL.TouchType = TouchType.NORMAL
                this.props.setMapSelectPoint({
                  firstPoint: '选择起点',
                  secondPoint: '选择终点',
                })
                SMap.clearPoint()
              }}
            />

            {/*<Image*/}
            {/*resizeMode={'contain'}*/}
            {/*source={require('../../../../assets/mapToolbar/icon_scene_pointAnalyst.png')}*/}
            {/*style={styles.analyst}*/}
            {/*/>*/}
          </View>
        </View>

        {/*<View>*/}
        {/*<FlatList*/}
        {/*data={this.state.analystData}*/}
        {/*renderItem={this.renderItem}*/}
        {/*/>*/}
        {/*</View>*/}
      </View>
    )
  }

  renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.itemView}
          onPress={() => {
            this.toLocationPoint(item.pointName, index)
          }}
        >
          <Image
            style={styles.pointImg}
            source={require('../../../../assets/mapToolbar/icon_scene_position.png')}
          />
          {item.pointName && (
            <Text style={styles.itemText}>{item.pointName}</Text>
          )}
        </TouchableOpacity>
        <View style={styles.itemSeparator} />
      </View>
    )
  }

  render() {
    return this._renderSearchView()
  }
}
