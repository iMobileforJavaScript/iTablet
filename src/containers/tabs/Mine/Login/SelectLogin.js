import * as React from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import Container from '../../../../components/Container'
import { scaleSize } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language/index'

export default class SelectLogin extends React.Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
  }

  renderBlock = type => {
    let image, text, loginPage
    if (type === 'online') {
      image = require('../../../../assets/Mine/online_white.png')
      text = 'Online'
      loginPage = 'Login'
    } else if (type === 'iportal') {
      image = require('../../../../assets/Mine/iportal_white.png')
      text = 'iPortal'
      loginPage = 'IPortalLogin'
    }
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          NavigationService.navigate(loginPage)
        }}
      >
        <View style={styles.itemView}>
          <Image style={styles.imagStyle} source={image} />
          <Text style={styles.textStyle}>{text}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.LOGIN,
          navigation: this.props.navigation,
        }}
      >
        <View style={styles.containerView}>
          {this.renderBlock('online')}
          {this.renderBlock('iportal')}
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#505050',
    paddingHorizontal: scaleSize(50),
    width: scaleSize(450),
    height: scaleSize(180),
    marginVertical: scaleSize(50),
    borderRadius: scaleSize(10),
  },
  imagStyle: {
    width: scaleSize(80),
    height: scaleSize(80),
  },
  textStyle: {
    color: '#FBFBFB',
    fontSize: scaleSize(80),
  },
})
