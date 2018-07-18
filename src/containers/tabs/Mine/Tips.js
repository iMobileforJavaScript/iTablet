/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com 
*/

import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as Util from '../../../utils/constUtil';

import { TextBtn } from '../../../components';

const BGCOLOR = Util.USUAL_GREEN;
const BORDERCOLOR = Util.USUAL_SEPARATORCOLOR;
const WIDTH = 250;

export default class Tips extends React.Component {

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.tipsContainer}>
          <Text style={styles.tips}>{this.props.tipText}</Text>
        </View>
        <TextBtn btnText={this.props.btnText} btnClick={this.props.btnClick}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    height: 40,
    marginTop: 5,
  },
  tipsContainer: {
    height:40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tips: {
    fontSize: 17,
  }
});