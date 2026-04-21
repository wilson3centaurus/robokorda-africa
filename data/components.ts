// Static robotics components catalogue
// In a future iteration, this can be moved to Supabase for dynamic management

export type ComponentStatus = "in_stock" | "out_of_stock" | "coming_soon" | "limited";

export type RoboticsComponent = {
  id: string;
  name: string;
  category: string;
  priceUSD: number;
  priceZWG?: number;
  imageSrc: string;
  shortDescription: string;
  status: ComponentStatus;
  badge?: string;
};

export const componentCategories = [
  "All",
  "Microcontrollers",
  "Sensors",
  "Motors & Actuators",
  "Power",
  "Displays",
  "Communication",
  "Prototyping",
  "Robotics Kits",
] as const;

export type ComponentCategory = (typeof componentCategories)[number];

export const roboticsComponents: RoboticsComponent[] = [
  // Microcontrollers
  {
    id: "arduino-uno",
    name: "Arduino Uno R3",
    category: "Microcontrollers",
    priceUSD: 12,
    priceZWG: 16800,
    imageSrc: "https://picsum.photos/seed/arduino-uno/400/400",
    shortDescription: "The classic beginner microcontroller. Ideal for first robotics and electronics projects.",
    status: "in_stock",
    badge: "Most Popular",
  },
  {
    id: "arduino-mega",
    name: "Arduino Mega 2560",
    category: "Microcontrollers",
    priceUSD: 22,
    priceZWG: 30800,
    imageSrc: "https://picsum.photos/seed/arduino-mega/400/400",
    shortDescription: "Expanded I/O for complex projects needing more pins and memory.",
    status: "in_stock",
  },
  {
    id: "esp32",
    name: "ESP32 Development Board",
    category: "Microcontrollers",
    priceUSD: 10,
    priceZWG: 14000,
    imageSrc: "https://picsum.photos/seed/esp32/400/400",
    shortDescription: "Wi-Fi + Bluetooth microcontroller. Perfect for IoT and wireless robotics.",
    status: "in_stock",
    badge: "IoT Ready",
  },
  {
    id: "raspberry-pi-pico",
    name: "Raspberry Pi Pico",
    category: "Microcontrollers",
    priceUSD: 8,
    priceZWG: 11200,
    imageSrc: "https://picsum.photos/seed/rpi-pico/400/400",
    shortDescription: "Affordable dual-core microcontroller from the Raspberry Pi Foundation.",
    status: "in_stock",
  },
  // Sensors
  {
    id: "ultrasonic-hcsr04",
    name: "Ultrasonic Sensor (HC-SR04)",
    category: "Sensors",
    priceUSD: 3,
    priceZWG: 4200,
    imageSrc: "https://picsum.photos/seed/ultrasonic/400/400",
    shortDescription: "Distance measurement sensor. Essential for obstacle-avoiding robots.",
    status: "in_stock",
  },
  {
    id: "ir-sensor",
    name: "IR Infrared Sensor Module",
    category: "Sensors",
    priceUSD: 2.5,
    priceZWG: 3500,
    imageSrc: "https://picsum.photos/seed/ir-sensor/400/400",
    shortDescription: "Line detection and proximity sensing for line-following robots.",
    status: "in_stock",
  },
  {
    id: "dht22",
    name: "DHT22 Temperature & Humidity",
    category: "Sensors",
    priceUSD: 4,
    priceZWG: 5600,
    imageSrc: "https://picsum.photos/seed/dht22/400/400",
    shortDescription: "Accurate environmental sensing for weather station and IoT projects.",
    status: "in_stock",
  },
  {
    id: "pir-sensor",
    name: "PIR Motion Sensor",
    category: "Sensors",
    priceUSD: 3.5,
    priceZWG: 4900,
    imageSrc: "https://picsum.photos/seed/pir-motion/400/400",
    shortDescription: "Passive infrared motion detection for security and automation projects.",
    status: "in_stock",
  },
  {
    id: "flex-sensor",
    name: "Flex / Bend Sensor",
    category: "Sensors",
    priceUSD: 6,
    priceZWG: 8400,
    imageSrc: "https://picsum.photos/seed/flex-sensor/400/400",
    shortDescription: "Detects bending. Used in robotic gloves and wearable projects.",
    status: "limited",
  },
  {
    id: "color-sensor",
    name: "TCS3200 Color Sensor",
    category: "Sensors",
    priceUSD: 5,
    priceZWG: 7000,
    imageSrc: "https://picsum.photos/seed/color-sensor/400/400",
    shortDescription: "RGB color detection for sorting robots and art projects.",
    status: "in_stock",
  },
  // Motors
  {
    id: "servo-sg90",
    name: "SG90 Micro Servo Motor",
    category: "Motors & Actuators",
    priceUSD: 4,
    priceZWG: 5600,
    imageSrc: "https://picsum.photos/seed/servo-sg90/400/400",
    shortDescription: "Lightweight servo motor for grippers, steering, and moving parts.",
    status: "in_stock",
    badge: "Classroom Favourite",
  },
  {
    id: "dc-motor",
    name: "DC Motor + Wheel Kit",
    category: "Motors & Actuators",
    priceUSD: 6,
    priceZWG: 8400,
    imageSrc: "https://picsum.photos/seed/dc-motor/400/400",
    shortDescription: "Standard 6V DC motors and wheels for building chassis-based robots.",
    status: "in_stock",
  },
  {
    id: "stepper-28byj",
    name: "28BYJ-48 Stepper Motor + Driver",
    category: "Motors & Actuators",
    priceUSD: 5,
    priceZWG: 7000,
    imageSrc: "https://picsum.photos/seed/stepper-motor/400/400",
    shortDescription: "Precision movement for 3D printer-style projects and pen plotters.",
    status: "in_stock",
  },
  {
    id: "l298n-driver",
    name: "L298N Motor Driver Module",
    category: "Motors & Actuators",
    priceUSD: 4.5,
    priceZWG: 6300,
    imageSrc: "https://picsum.photos/seed/l298n-driver/400/400",
    shortDescription: "Dual H-bridge motor driver to control 2 DC motors from a microcontroller.",
    status: "in_stock",
  },
  // Power
  {
    id: "lipo-battery",
    name: "Li-Po Battery 3.7V 2000mAh",
    category: "Power",
    priceUSD: 8,
    priceZWG: 11200,
    imageSrc: "https://picsum.photos/seed/lipo-battery/400/400",
    shortDescription: "Rechargeable lithium-polymer battery for portable robotics projects.",
    status: "in_stock",
  },
  {
    id: "voltage-regulator",
    name: "LM7805 Voltage Regulator Kit",
    category: "Power",
    priceUSD: 2,
    priceZWG: 2800,
    imageSrc: "https://picsum.photos/seed/voltage-reg/400/400",
    shortDescription: "Regulate supply voltage to 5V for stable circuit operation.",
    status: "in_stock",
  },
  // Displays
  {
    id: "oled-display",
    name: "0.96\" OLED Display (I2C)",
    category: "Displays",
    priceUSD: 5,
    priceZWG: 7000,
    imageSrc: "https://picsum.photos/seed/oled-display/400/400",
    shortDescription: "Compact OLED screen for displaying sensor data and status messages.",
    status: "in_stock",
  },
  {
    id: "lcd-1602",
    name: "LCD 16x2 Display + I2C",
    category: "Displays",
    priceUSD: 4,
    priceZWG: 5600,
    imageSrc: "https://picsum.photos/seed/lcd1602/400/400",
    shortDescription: "Classic 16-character, 2-line LCD display with I2C backpack.",
    status: "in_stock",
  },
  // Communication
  {
    id: "bluetooth-hc05",
    name: "HC-05 Bluetooth Module",
    category: "Communication",
    priceUSD: 7,
    priceZWG: 9800,
    imageSrc: "https://picsum.photos/seed/hc05-bluetooth/400/400",
    shortDescription: "Add Bluetooth wireless control to any Arduino project.",
    status: "in_stock",
  },
  {
    id: "nrf24-radio",
    name: "NRF24L01 Wireless Module",
    category: "Communication",
    priceUSD: 5,
    priceZWG: 7000,
    imageSrc: "https://picsum.photos/seed/nrf24/400/400",
    shortDescription: "2.4GHz wireless communication for remote-controlled robots.",
    status: "limited",
  },
  // Prototyping
  {
    id: "breadboard-kit",
    name: "Breadboard + Jumper Wire Kit",
    category: "Prototyping",
    priceUSD: 5,
    priceZWG: 7000,
    imageSrc: "https://picsum.photos/seed/breadboard-kit/400/400",
    shortDescription: "Full-size breadboard with 65-piece jumper wire assortment.",
    status: "in_stock",
    badge: "Essential",
  },
  // Kits
  {
    id: "robotics-starter-kit",
    name: "Robokorda Starter Robotics Kit",
    category: "Robotics Kits",
    priceUSD: 179,
    priceZWG: 250600,
    imageSrc: "https://picsum.photos/seed/robokit-starter/400/400",
    shortDescription: "Complete beginner kit: chassis, motors, Arduino, sensors, and learning guide.",
    status: "in_stock",
    badge: "Best Starter Kit",
  },
  {
    id: "sensor-kit-20",
    name: "20-in-1 Sensor Learning Kit",
    category: "Robotics Kits",
    priceUSD: 79,
    priceZWG: 110600,
    imageSrc: "https://picsum.photos/seed/sensor-kit/400/400",
    shortDescription: "20 of the most-used sensors with project cards and component guide.",
    status: "in_stock",
  },
];
