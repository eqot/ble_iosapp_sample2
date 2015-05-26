#import "BLENative.h"

#import <CoreBluetooth/CoreBluetooth.h>

#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTLog.h"

@interface BLENative () <CBCentralManagerDelegate, CBPeripheralDelegate>
@property (nonatomic, strong) CBCentralManager *centralManager;
@property (nonatomic, strong) CBPeripheral *peripheral;
@property (nonatomic, strong) RCTResponseSenderBlock onConnectCallback;
@end

@implementation BLENative

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

RCT_EXPORT_METHOD(startScanning)
{
  self.centralManager = [[CBCentralManager alloc] initWithDelegate:self queue:nil];

  RCTLogInfo(@"Start scanning.");
}

- (void)centralManagerDidUpdateState:(CBCentralManager *)central {
  RCTLogInfo(@"state:%ld", (long)central.state);

  switch (central.state) {
    case CBCentralManagerStatePoweredOn:
      [self.centralManager stopScan];
      [self.centralManager scanForPeripheralsWithServices:nil options:nil];
      break;

    default:
      break;
  }
}

- (void) centralManager:(CBCentralManager *)central
  didDiscoverPeripheral:(CBPeripheral *)peripheral
      advertisementData:(NSDictionary *)advertisementData
                   RSSI:(NSNumber *)RSSI
{
  RCTLogInfo(@"peripheral:%@", peripheral);
  self.peripheral = peripheral;

  if (peripheral.name == nil) {
    return;
  }

  [self.bridge.eventDispatcher sendAppEventWithName:@"discoverPeripheral"
    body:@{
      @"name": peripheral.name,
      @"identifier": peripheral.identifier.UUIDString
    }];
}

RCT_EXPORT_METHOD(stopScanning)
{
  [self.centralManager stopScan];

  RCTLogInfo(@"Stop scanning.");
}

RCT_EXPORT_METHOD(connect:(NSString *)name callback:(RCTResponseSenderBlock)callback)
{
  RCTLogInfo(@"Connecting to %@", name);

  self.onConnectCallback = callback;

  [self.centralManager connectPeripheral:self.peripheral options:nil];
}

- (void) centralManager:(CBCentralManager *)central
   didConnectPeripheral:(CBPeripheral *)peripheral
{
  RCTLogInfo(@"Connected");

  self.onConnectCallback(@[[NSNull null]]);
}

- (void) centralManager:(CBCentralManager *)central
  didFailToConnectPeripheral:(CBPeripheral *)peripheral
  error:(NSError *)error
{
  RCTLogInfo(@"Failed");
}

@end
