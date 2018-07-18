/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com 
*/

import * as React from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import * as Util from '../../utils/constUtil';

import ListBtn from './ListBtn';
import Avatar from './avatar';

const WIDTH = Util.WIDTH;
const BGCOLOR = Util.USUAL_GREEN;

export default class Setting extends React.Component {

  _testClick = ()=>{
    console.log('click listBtn');
  }

  render() {
    let data = [{ key: '用户名', onClick: this._testClick },
    { key: '绑定手机', onClick: this._testClick },
    { key: '地区', onClick: this._testClick },
    { key: '二维码名称', onClick: this._testClick }];
    return (
      <View style={styles.container}>
        <Avatar name='Zihao Wang' email='zihao12345@qq.com' />
        <ListBtn data={data}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGCOLOR,
  }
});