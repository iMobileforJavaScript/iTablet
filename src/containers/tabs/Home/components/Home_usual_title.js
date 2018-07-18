import * as React from 'react'
import {
  View,
  StyleSheet,
  Dimensions
} from 'react-native'

import { UsualTitle } from '../../../../components'
import { Toast } from '../../../../utils'

export default class HomeUsualTitle extends React.Component {
  constructor(props) {
    super(props)
  }

  _moreUsualMap = () => {
    Toast.show('待完善')
  }

  render() {
    return ( <
      UsualTitle title = '最近常用'
      isRightBtn = {
        true
      }
      btnText = '更多'
      btnClick = {
        this._moreUsualMap
      }
      />
    )
  }
}