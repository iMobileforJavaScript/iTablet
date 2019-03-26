/**
 * Created by imobile-xzy on 2019/3/25.
 */
import React, { PureComponent } from 'react'
import {
  View,
  // StyleSheet,
  // Text,
  //
  // TouchableOpacity,
  // Dimensions,
  // TextInput,
  // FlatList,
  // Image,
} from 'react-native'

import { scaleSize } from '../../../utils/screen'

class AddMore extends PureComponent {
  props: {
    style: Object,
  }
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <View
        style={[
          {
            position: 'absolute',
            backgroundColor: 'red',
            justifyContent: 'center',
            height: scaleSize(120),
            width: scaleSize(70),
            borderRadius: scaleSize(5),
            top: scaleSize(0),
            left: scaleSize(10),
          },
          this.props.style,
        ]}
      />
    )
  }
}

export default AddMore
