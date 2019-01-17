//
//  JSZipArchive.h
//  iTablet
//
//  Created by Yang Shang Long on 2018/9/21.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#import <ZipArchive/ZipArchive.h>

@interface FileTools : NSObject<RCTBridgeModule>
+(BOOL)zipFile:(NSString *)archivePath targetPath:(NSString *)targetPath;
+(BOOL)zipFiles:(NSArray *)archivePaths targetPath:(NSString *)targetPath;
+(BOOL)unZipFile:(NSString *)archivePath targetPath:(NSString *)targetPath;
+(BOOL)deleteFile:(NSString *)path;
+(BOOL)createFileDirectories:(NSString*)path;
+(BOOL)copyFile:(NSString *)fromPath targetPath:(NSString *)toPath;
@end
