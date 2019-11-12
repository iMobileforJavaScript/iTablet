import * as React from 'react'
import { View } from 'react-native'
import Header from '../../../../components/Header'

export default class MapSelectPoint extends React.Component {
  props: {
    headerProps: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
  }

  setVisible = iShow => {
    this.setState({ show: iShow })
  }

  render() {
    if (this.state.show) {
      return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
          }}
        >
          <Header
            ref={ref => (this.containerHeader = ref)}
            {...this.props.headerProps}
          />
        </View>
      )
    } else {
      return <View />
    }
  }
}
