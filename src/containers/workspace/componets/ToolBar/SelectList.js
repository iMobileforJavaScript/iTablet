import React from 'react'
import { TouchableHighlight, Text, FlatList } from 'react-native'
import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'
import { size } from '../../../../styles'

export default class SelectList extends React.PureComponent {
  props: {
    currentLayer: Object,
    list: Object,
    selectKey: '',
  }

  render() {
    return (
      <FlatList
        data={this.props.list}
        renderItem={({ item }) => {
          if (this.props.selectKey === item.selectKey) {
            return (
              <TouchableHighlight
                activeOpacity={0.9}
                underlayColor="#4680DF"
                style={styles.btn1}
                onPress={() => item.action(item)}
              >
                <Text style={styles.text}>{item.key}</Text>
              </TouchableHighlight>
            )
          } else {
            return (
              <TouchableHighlight
                activeOpacity={0.9}
                underlayColor="#4680DF"
                style={styles.btn}
                onPress={() => item.action(item)}
              >
                <Text style={styles.text}>{item.key}</Text>
              </TouchableHighlight>
            )
          }
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(80),
    backgroundColor: 'transparent',
    minWidth: scaleSize(100),
    width: scaleSize(300),
  },
  btn1: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(80),
    backgroundColor: '#4680DF',
    minWidth: scaleSize(100),
    width: scaleSize(300),
  },
})
