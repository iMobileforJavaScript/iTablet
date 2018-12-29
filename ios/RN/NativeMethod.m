//
//  NativeUtil.m
//  iTablet
//
//  Created by Shanglong Yang on 2018/12/12.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "NativeMethod.h"

@implementation NativeMethod
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(getTemplates, getTemplatesByUserName:(NSString *)userName resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    if (userName == nil || [userName isEqualToString:@""]) {
      userName = @"Customer";
    }
    NSString* templatePath = [NSHomeDirectory() stringByAppendingFormat:@"%@%@%@", @"/Documents/iTablet/User/", userName, @"/Downloads"];
    
    NSMutableArray* templateList = [NSMutableArray array];
    BOOL flag = YES;
    if ([[NSFileManager defaultManager] fileExistsAtPath:templatePath isDirectory:&flag]) {
      NSArray* tempsArray = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:templatePath error:nil];
      for (NSString* fileName in tempsArray) {
        NSString* tempPath = [templatePath stringByAppendingPathComponent:fileName];
        if ([[NSFileManager defaultManager] fileExistsAtPath:tempPath isDirectory:&flag]) {
          NSArray* tempArray = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:tempPath error:nil];
          
          for (NSString* tempFileName in tempArray) {
            NSString* extension = [tempFileName pathExtension].lowercaseString;
            if ([extension isEqualToString:@"smw"] || [extension isEqualToString:@"sxwu"] ||
                [extension isEqualToString:@"sxw"] || [extension isEqualToString:@"smwu"]) {
              NSMutableDictionary* templateInfo = [[NSMutableDictionary alloc] init];
              [templateInfo setObject:fileName forKey:@"name"];
              [templateInfo setObject:[NSString stringWithFormat:@"%@/%@", tempPath, tempFileName] forKey:@"path"];
              
              [templateList addObject:templateInfo];
              break;
            }
          }
        } else {
          NSString* extension = [fileName pathExtension].lowercaseString;
          if ([extension isEqualToString:@"smw"] || [extension isEqualToString:@"sxwu"] ||
              [extension isEqualToString:@"sxw"] || [extension isEqualToString:@"smwu"]) {
            NSMutableDictionary* templateInfo = [[NSMutableDictionary alloc] init];
            [templateInfo setObject:fileName forKey:@"name"];
            [templateInfo setObject:[NSString stringWithFormat:@"%@/%@", tempPath, fileName] forKey:@"path"];
            
            [templateList addObject:templateInfo];
            break;
          }
        }
      }
    }
    
    resolve(templateList);
  } @catch (NSException *exception) {
    reject(@"zipFile", exception.reason, nil);
  }
}

@end
