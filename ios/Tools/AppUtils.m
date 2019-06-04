//
//  AppUtils.m
//  iTablet
//
//  Created by imobile-xzy on 2019/1/28.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "AppUtils.h"
#import <UIKit/UIKit.h>
#import "NativeUtil.h"
@implementation AppUtils
RCT_EXPORT_MODULE();
RCT_REMAP_METHOD(AppExit,AppExit:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  // NSString* home = NSHomeDirectory();
  dispatch_async(dispatch_get_main_queue(), ^{
    UIWindow* window =  [UIApplication sharedApplication].keyWindow;
    [UIView animateWithDuration:1.0f animations:^{
      window.alpha = 0;
      //window.frame = CGRectMake(0, window.bounds.size.height, 0, 0);
    } completion:^(BOOL finished) {
      exit(0);
    }];
  });
  resolve(@(1));
  
}

RCT_REMAP_METHOD(sendFileOfWechat, sendFileOfWechat:(NSDictionary*)data resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL result = [WeiXinUtils sendFileContent:data];
    resolve(@(result));
  } @catch (NSException *exception) {
    reject(@"AppUtils", exception.reason, nil);
  }
}
RCT_REMAP_METHOD(getCurrentLocation, resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    [NativeUtil openGPS];
    GPSData* gpsData = [NativeUtil getGPSData];
    resolve(@{@"longitude":@(gpsData.dLongitude),@"latitude":@(gpsData.dLatitude)});
  } @catch (NSException *exception) {
    reject(@"AppUtils", exception.reason, nil);
  }
}
@end
