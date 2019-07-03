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
#import "SMap.h"
#import "FileUtils.h"

NSString *USER_NAME;
static BOOL hasImportedData = NO;

@interface FileTools : RCTEventEmitter<RCTBridgeModule, SSZipArchiveDelegate>
@property(nonatomic) id<SSZipArchiveDelegate> zipArchiveDelegate;



+(BOOL)zipFile:(NSString *)archivePath targetPath:(NSString *)targetPath;
+(BOOL)zipFiles:(NSArray *)archivePaths targetPath:(NSString *)targetPath;
+(BOOL)unZipFile:(NSString *)archivePath targetPath:(NSString *)targetPath;
+(BOOL)deleteFile:(NSString *)path;
+(BOOL)createFileDirectories:(NSString*)path;
+(BOOL)copyFile:(NSString *)fromPath targetPath:(NSString *)toPath;
+(BOOL)initUserDefaultData:(NSString *)userName;
+(NSString*)getLastModifiedTime:(NSDate*) nsDate;
+ (NSDictionary *)readLocalFileWithPath:(NSString *)path;
+(BOOL)getUriState:(NSURL *)url;
+(void)sendShareResult;
@end
