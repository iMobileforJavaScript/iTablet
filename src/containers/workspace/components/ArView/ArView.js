import * as React from 'react'
import { StyleSheet } from 'react-native'
import { SMArView } from 'imobile_for_reactnative'

export default class ArView extends React.Component {
  props: {}

  constructor(props) {
    super(props)
    this.state = {
      name: '公交站',
      x: 104.06827,
      y: 30.537225,
      isNaviPoint: true,
    }
  }

  render() {
    return (
      <SMArView
        style={styles.table}
        ARView={{
          name: GLOBAL.NAVIPOINTNAME,
          address: GLOBAL.NAVIPOINTADDRESS,
          isNaviPoint: this.state.isNaviPoint,
          x: GLOBAL.NAVIPOINTX,
          y: GLOBAL.NAVIPOINTY,
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  table: {
    flex: 1,
    backgroundColor: 'transparent',
  },
})
