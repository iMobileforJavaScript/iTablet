//
//  RNBridgeModule.m
//  RN2iOSNative
//
//  Created by Jason on 16/8/4.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "SMSampleCodeBridgeModule.h"
#import "React/RCTBridge.h"
#import "React/RCTBridgeModule.h"
#import "AppDelegate.h"

@interface SMSampleCodeBridgeModule()<RCTBridgeModule>
{
  
}
@end
@implementation SMSampleCodeBridgeModule
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()
//RN跳转原生界面
RCT_EXPORT_METHOD(open:(NSString *)msg){
  
  [AppDelegate SetSampleCodeName:msg];
  NSLog(@"RN传入原生界面的数据为:%@",msg);
  dispatch_async(dispatch_get_main_queue(), ^{
    [[NSNotificationCenter defaultCenter]postNotificationName:@"RNOpenVC" object:msg];
  });
}
@end
