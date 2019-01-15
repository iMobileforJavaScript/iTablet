//
//  NativeMethod.h
//  iTablet
//
//  Created by Shanglong Yang on 2018/12/12.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import "FileTools.h"

@interface NativeMethod : NSObject<RCTBridgeModule>
+ (NSMutableArray *)getTemplate:(NSString *)path;
@end
