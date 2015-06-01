#import "BLENative.h"

#import <CoreBluetooth/CoreBluetooth.h>

#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTLog.h"

@interface BLENative () <CBCentralManagerDelegate, CBPeripheralDelegate>
@property (nonatomic, strong) CBCentralManager *centralManager;
@property (nonatomic, strong) NSMutableArray *peripherals;
@property (nonatomic, strong) NSArray *services;
@property (nonatomic, strong) NSArray *characteristics;
@property (nonatomic, strong) CBPeripheral *connectedPeripheral;
@property (nonatomic, strong) RCTResponseSenderBlock onConnectCallback;
@property (nonatomic, strong) RCTResponseSenderBlock onDiscoverServices;
@property (nonatomic, strong) RCTResponseSenderBlock onDiscoverCharacteristics;
@property (nonatomic, strong) RCTResponseSenderBlock onReadCharacteristic;
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

  self.connectedPeripheral = peripheral;

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

  self.connectedPeripheral.delegate = self;
  [self.connectedPeripheral discoverServices:nil];
}

- (void)   peripheral:(CBPeripheral *)peripheral
  didDiscoverServices:(NSError *)error
{
  self.services = peripheral.services;
  RCTLogInfo(@"%lu services: %@", (unsigned long)self.services.count, self.services);

  NSMutableArray *uuids = [NSMutableArray array];
  for (CBService *service in self.services) {
    [uuids addObject:service.UUID.UUIDString];
  }

  self.onDiscoverServices(@[uuids]);
}

RCT_EXPORT_METHOD(discoverCharacteristics:(NSString *)uuid callback:(RCTResponseSenderBlock)callback)
{
  RCTLogInfo(@"%@", uuid);

  CBService *service = [self findService:uuid];
  if (service == nil) {
    return;
  }

  RCTLogInfo(@"%@", service);

  self.onDiscoverCharacteristics = callback;
  [self.connectedPeripheral discoverCharacteristics:nil forService:service];
}

- (CBService *)findService:(NSString *)uuid
{
  for (CBService *service in self.services) {
    if ([service.UUID.UUIDString isEqualToString:uuid]) {
      return service;
    }
  }

  return nil;
}

- (void)                    peripheral:(CBPeripheral *)peripheral
  didDiscoverCharacteristicsForService:(CBService *)service
                                 error:(NSError *)error
{
  self.characteristics = service.characteristics;
  RCTLogInfo(@"%lu characteristics: %@", (unsigned long)self.characteristics.count, self.characteristics);

  NSMutableArray *uuids = [NSMutableArray array];
  for (CBCharacteristic *characteristic in self.characteristics) {
    [uuids addObject:characteristic.UUID.UUIDString];
  }

  self.onDiscoverCharacteristics(@[uuids]);
}

RCT_EXPORT_METHOD(read:(NSString *)uuid callback:(RCTResponseSenderBlock)callback)
{
  CBCharacteristic *characteristic = [self findCharacteristic:uuid];
  if (characteristic == nil) {
    return;
  }

  self.onReadCharacteristic = callback;
  [self.connectedPeripheral readValueForCharacteristic:characteristic];
}

- (void)               peripheral:(CBPeripheral *)peripheral
  didUpdateValueForCharacteristic:(CBCharacteristic *)characteristic
                            error:(NSError *)error
{
  if (characteristic.value == nil) {
    self.onReadCharacteristic(@[@-1]);
    return;
  }

  unsigned char byte;
  [characteristic.value getBytes:&byte length:1];

  self.onReadCharacteristic(@[@(byte)]);
}

- (CBCharacteristic *)findCharacteristic:(NSString *)uuid
{
  for (CBCharacteristic *characteristic in self.characteristics) {
    if ([characteristic.UUID.UUIDString isEqualToString:uuid]) {
      return characteristic;
    }
  }

  return nil;
}

@end
