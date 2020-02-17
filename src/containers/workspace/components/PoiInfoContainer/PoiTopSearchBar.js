/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import * as React from 'react'
import {
  Animated,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native'
import SearchBar from '../../../../components/SearchBar'
import { scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language'
import { SMap } from 'imobile_for_reactnative'
import NavigationService from '../../../NavigationService'

const HEADER_HEIGHT = scaleSize(88) + (Platform.OS === 'ios' ? 20 : 0)
const HEADER_PADDINGTOP = Platform.OS === 'ios' ? 20 : 0

export default class PoiTopSearchBar extends React.Component {
  props: {
    setMapNavigation: () => {},
  }

  constructor(props) {
    super(props)
    this.top = new Animated.Value(-HEADER_HEIGHT)
    this.state = {
      defaultValue: '',
      visible: false,
    }
  }
  setVisible = visible => {
    if (visible === this.state.visible) return
    let height = visible ? 0 : -HEADER_HEIGHT
    Animated.timing(this.top, {
      toValue: height,
      duration: 400,
    }).start()
    let obj = {
      visible,
    }
    !visible && (obj.defaultValue = '')
    this.setState(obj)
  }

  render() {
    const backImg = require('../../../../assets/public/Frenchgrey/icon-back-white.png')
    return (
      <Animated.View style={[styles.container, { top: this.top }]}>
        <TouchableOpacity
          onPress={async () => {
            if (GLOBAL.PoiInfoContainer) {
              let poiData = GLOBAL.PoiInfoContainer.state
              let tempResult = GLOBAL.PoiInfoContainer.tempResult
              if (tempResult.tempList.length > 0 && !poiData.showList) {
                //清除操作分开写，此处需要await，返回搜索界面无需await，加快速度
                await GLOBAL.PoiInfoContainer.clear()
                this.setState({ defaultValue: tempResult.name })
                GLOBAL.PoiInfoContainer.setState(
                  {
                    destination: '',
                    location: {},
                    address: '',
                    showMore: false,
                    showList: true,
                    neighbor: [],
                    resultList: tempResult.tempList,
                  },
                  async () => {
                    GLOBAL.PoiInfoContainer.show()
                    await SMap.addCallouts(tempResult.tempList)
                  },
                )
              } else {
                NavigationService.navigate('PointAnalyst', {
                  type: 'pointSearch',
                })
                GLOBAL.PoiInfoContainer.setVisible(false)
                GLOBAL.PoiInfoContainer.setState({
                  destination: '',
                  location: {},
                  address: '',
                  showMore: false,
                  showList: false,
                  neighbor: [],
                  resultList: [],
                })
                GLOBAL.PoiInfoContainer.tempResult = {
                  name: '',
                  tempList: [],
                }
                this.props.setMapNavigation({
                  isShow: false,
                  name: '',
                })
                this.setVisible(false)
                GLOBAL.PoiInfoContainer.clear()
              }
            }
          }}
        >
          <Image source={backImg} resizeMode={'contain'} style={styles.back} />
        </TouchableOpacity>
        <View style={styles.searchWrap}>
          <SearchBar
            defaultValue={this.state.defaultValue}
            ref={ref => (this.searchBar = ref)}
            onSubmitEditing={async searchKey => {
              GLOBAL.PoiInfoContainer.clear()
              GLOBAL.PoiInfoContainer.getSearchResult({ keyWords: searchKey })
              GLOBAL.PoiInfoContainer.setState({
                showList: true,
              })
            }}
            placeholder={getLanguage(global.language).Prompt.ENTER_KEY_WORDS}
            //{'请输入搜索关键字'}
          />
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: HEADER_HEIGHT,
    paddingTop: HEADER_PADDINGTOP,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'black',
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'column',
  },
  back: {
    width: scaleSize(60),
    height: scaleSize(60),
    backgroundColor: '#rgba(255, 255, 255, 0)',
  },
})
