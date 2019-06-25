import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { TextBtn } from '../../../../components'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import { Analyst_Types } from '../../../analystView/AnalystType'
import { getLanguage } from '../../../../language'
import { TouchType } from '../../../../constants'

const BTN_HEIGHT = scaleSize(40)
const BTN_GAPE = scaleSize(20)

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: scaleSize(30),
    top: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    width: scaleSize(160),
  },
  title: {
    color: color.content,
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  titleSelected: {
    color: color.blue2,
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  titleView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: BTN_HEIGHT,
    borderRadius: scaleSize(8),
    backgroundColor: color.white,
    width: scaleSize(160),
    borderWidth: 1,
    borderColor: color.content,
  },
  titleViewSelected: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: BTN_HEIGHT,
    borderRadius: scaleSize(8),
    backgroundColor: color.white,
    width: scaleSize(160),
    borderWidth: 1,
    borderColor: color.blue2,
  },
})

export default class AnalystMapButtons extends React.Component {
  props: {
    type: Number,
    language: Object,
  }

  state = {
    selected: -1,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      this.state.selected !== nextState.selected
    )
  }

  btnAction = ({ index, action }) => {
    this.setState({
      selected: index,
    })
    action && action()
  }

  getData = type => {
    let data = {
      [Analyst_Types.OPTIMAL_PATH]: [
        {
          title: getLanguage(this.props.language).Analyst_Labels
            .SET_START_STATION,
          action: () => {
            GLOBAL.TouchType = TouchType.SET_START_STATION
          },
        },
        {
          title: getLanguage(this.props.language).Analyst_Labels
            .MIDDLE_STATIONS,
          action: () => {
            GLOBAL.TouchType = TouchType.MIDDLE_STATIONS
          },
        },
        {
          title: getLanguage(this.props.language).Analyst_Labels
            .SET_END_STATION,
          action: () => {
            GLOBAL.TouchType = TouchType.SET_END_STATION
          },
        },
      ],
      [Analyst_Types.CONNECTIVITY_ANALYSIS]: [
        {
          title: getLanguage(this.props.language).Analyst_Labels
            .SET_AS_START_STATION,
          action: () => {
            GLOBAL.TouchType = TouchType.SET_AS_START_STATION
          },
        },
        {
          title: getLanguage(this.props.language).Analyst_Labels
            .SET_AS_END_STATION,
          action: () => {
            GLOBAL.TouchType = TouchType.SET_AS_END_STATION
          },
        },
      ],
      [Analyst_Types.FIND_TSP_PATH]: [
        {
          title: getLanguage(this.props.language).Analyst_Labels.ADD_STATIONS,
          action: () => {
            GLOBAL.TouchType = TouchType.ADD_STATIONS
          },
        },
        {
          title: getLanguage(this.props.language).Analyst_Labels
            .ADD_BARRIER_NODES,
          action: () => {
            GLOBAL.TouchType = TouchType.ADD_BARRIER_NODES
          },
        },
      ],
    }
    return data[type]
  }

  getAnalystButtons = () => {
    let data = []
    this.getData(this.props.type).forEach((item, index) => {
      data.push(this.renderTextBtn(item.title, index, item.action))
    })
    return data
  }

  renderTextBtn = (title, index, action = () => {}) => {
    return (
      <TextBtn
        key={index}
        btnText={title}
        textStyle={
          this.state.selected === index ? styles.titleSelected : styles.title
        }
        containerStyle={[
          this.state.selected === index
            ? styles.titleViewSelected
            : styles.titleView,
          { marginTop: index * BTN_GAPE },
        ]}
        btnClick={() => this.btnAction({ index, action })}
      />
    )
  }

  render() {
    return <View style={styles.container}>{this.getAnalystButtons()}</View>
  }
}
