import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TextBtn } from '../../../../components'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'

// let data = []
// let analystType = -1
// let analystLanguage = -1
// let selected = -1

const HEIGHT = scaleSize(100)
const HEIGHT2 = scaleSize(60)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: HEIGHT,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    color: color.content,
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    marginLeft: scaleSize(30),
  },
  subTitle: {
    color: color.themePlaceHolder,
    fontSize: size.fontSize.fontSizeSm,
    backgroundColor: 'transparent',
    marginLeft: scaleSize(30),
  },
  btnTitle: {
    color: color.blue2,
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  btnTitleView: {
    height: HEIGHT2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleSize(8),
    backgroundColor: color.white,
    width: scaleSize(160),
    marginRight: scaleSize(20),
    borderWidth: 1,
    borderColor: color.blue2,
  },
})

export default class AnalystMapRecommendItem extends React.Component {
  props: {
    data: Object,
    btnTitle: String,
    btnAction: () => {},
  }

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps)
  }

  btnAction = () => {
    if (this.props.btnAction) {
      this.props.btnAction(this.props.data)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{this.props.data.title}</Text>
          <Text style={styles.subTitle}>{this.props.data.subTitle}</Text>
        </View>
        {this.props.btnTitle && (
          <TextBtn
            btnText={this.props.btnTitle}
            textStyle={styles.btnTitle}
            containerStyle={styles.btnTitleView}
            btnClick={() => this.btnAction()}
          />
        )}
      </View>
    )
  }
}
