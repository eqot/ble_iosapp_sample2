#import "BLENative.h"

#import <CoreBluetooth/CoreBluetooth.h>

#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTLog.h"

@interface BLENative () <CBCentralManagerDelegate, CBPeripheralDelegate>
@property (nonatomic, strong) CBCentralManager *centralManager;
@property (nonatomic, strong) NSMutableArray *peripherals;
@property (nonatomic, strong) CBPeripheral *peripheral;
@property (nonatomic, strong) RCTResponseSenderBlock onConnectCallback;
@property (nonatomic, strong) RCTResponseSenderBlock onDiscoverServices;
@end

@implementation BLENative

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

RCT_EXPORT_METHOD(startScanning)
{
  self.peripherals = [NSMutableArray array];

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

  if (peripheral.name == nil) {
    return;
  }

  if ([self findPeripheral:peripheral.name] != nil) {
    return;
  }

  [self.peripherals addObject:peripheral];

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

  CBPeripheral *peripheral = [self findPeripheral:name];
  if (peripheral == nil) {
    return;
  }

  self.onConnectCallback = callback;
  [self.centralManager connectPeripheral:peripheral options:nil];
}

- (CBPeripheral *)findPeripheral:(NSString *)name
{
  for (CBPeripheral *peripheral in self.peripherals) {
    if ([peripheral.name isEqualToString:name]) {
      return peripheral;
    }
  }

  return nil;
}

- (void) centralManager:(CBCentralManager *)central
   didConnectPeripheral:(CBPeripheral *)peripheral
{
  RCTLogInfo(@"Connected");

  self.peripheral = peripheral;

  self.onConnectCallback(@[[NSNull null]]);
}

- (void) centralManager:(CBCentralManager *)central
  didFailToConnectPeripheral:(CBPeripheral *)peripheral
  error:(NSError *)error
{
  RCTLogInfo(@"Failed");
}

RCT_EXPORT_METHOD(discoverServices:(RCTResponseSenderBlock)callback)
{
  self.onDiscoverServices = callback;

  self.peripheral.delegate = self;
  [self.peripheral discoverServices:nil];
}

- (void)   peripheral:(CBPeripheral *)peripheral
  didDiscoverServices:(NSError *)error
{
  NSArray *services = peripheral.services;
  RCTLogInfo(@"%lu services: %@", (unsigned long)services.count, services);

  NSMutableArray *uuids = [NSMutableArray array];
  for (CBService *service in services) {
    [uuids addObject:service.UUID.UUIDString];
  }

  self.onDiscoverServices(@[uuids]);
}

@end
