/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View } from 'react-native'
import { MTBtn } from '../../../../components'
import { scaleSize } from '../../../../utils'
import styles from './styles'
import PropTypes from 'prop-types'

export default class ChangeArView extends React.Component {
  static propTypes = {
    map2Dto3D: PropTypes.bool,
    setMap2Dto3D: PropTypes.func,
    mapIs3D: PropTypes.bool,
    setMapIs3D: PropTypes.func,
    mapNavigationShow: PropTypes.bool,
    setMapNavigationShow: PropTypes.func,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View
        style={{
          position: 'absolute',
          right: scaleSize(20),
          bottom: scaleSize(600),
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
        <MTBtn
          style={styles.btn}
          size={MTBtn.Size.NORMAL}
          image={require('../../../../assets/mapTool/Frenchgrey/icon_location.png')}
          onPress={async () => {
            this.props.setMap2Dto3D(true)
            this.props.setMapIs3D(false)
            this.props.setMapNavigationShow(false)
          }}
        />
        <MTBtn
          style={styles.btn}
          size={MTBtn.Size.NORMAL}
          image={require('../../../../assets/mapTool/Frenchgrey/icon_location.png')}
          onPress={async () => {
            this.props.setMap2Dto3D(true)
            this.props.setMapIs3D(true)
            this.props.setMapNavigationShow(false)
          }}
        />
        <MTBtn
          style={styles.btn}
          size={MTBtn.Size.NORMAL}
          image={require('../../../../assets/mapTool/Frenchgrey/icon_location.png')}
          onPress={async () => {
            this.props.setMap2Dto3D(false)
            this.props.setMapNavigationShow(true)
          }}
        />
      </View>
    )
  }
}
