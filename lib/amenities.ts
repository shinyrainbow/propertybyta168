/**
 * Amenity Options Configuration
 * Maps English values to Thai and Chinese labels
 */

export interface AmenityOption {
  value: string;
  th: string;
  zh: string;
}

export const AMENITY_OPTIONS: AmenityOption[] = [
  // Original amenities
  { value: "Pool", th: "สระว่ายน้ำ", zh: "游泳池" },
  { value: "Gym", th: "ฟิตเนส", zh: "健身房" },
  { value: "Parking", th: "ที่จอดรถ", zh: "停车场" },
  { value: "Sauna", th: "ซาวน่า", zh: "桑拿房" },
  { value: "Co-working", th: "ห้องทำงานร่วม", zh: "共享办公室" },
  { value: "Shuttle", th: "รถรับส่ง", zh: "班车服务" },
  { value: "Security 24/7", th: "รักษาความปลอดภัย 24 ชม.", zh: "24小时安保" },
  { value: "Garden", th: "สวน", zh: "花园" },
  { value: "Playground", th: "สนามเด็กเล่น", zh: "儿童游乐场" },
  { value: "EV Charger", th: "ที่ชาร์จรถไฟฟ้า", zh: "电动车充电桩" },

  // Additional 20 amenities
  { value: "Air Conditioning", th: "เครื่องปรับอากาศ", zh: "空调" },
  { value: "Balcony", th: "ระเบียง", zh: "阳台" },
  { value: "Built-in Wardrobe", th: "ตู้เสื้อผ้าบิวท์อิน", zh: "内置衣柜" },
  { value: "Elevator", th: "ลิฟต์", zh: "电梯" },
  { value: "Internet/WiFi", th: "อินเทอร์เน็ต/WiFi", zh: "网络/WiFi" },
  { value: "Washing Machine", th: "เครื่องซักผ้า", zh: "洗衣机" },
  { value: "Kitchen", th: "ครัว", zh: "厨房" },
  { value: "Refrigerator", th: "ตู้เย็น", zh: "冰箱" },
  { value: "Water Heater", th: "เครื่องทำน้ำอุ่น", zh: "热水器" },
  { value: "Furnished", th: "เฟอร์นิเจอร์ครบ", zh: "带家具" },
  { value: "Bathtub", th: "อ่างอาบน้ำ", zh: "浴缸" },
  { value: "Pet Friendly", th: "อนุญาตสัตว์เลี้ยง", zh: "允许宠物" },
  { value: "CCTV", th: "กล้องวงจรปิด", zh: "监控摄像" },
  { value: "Key Card Access", th: "คีย์การ์ด", zh: "门禁卡" },
  { value: "Mail Box", th: "ตู้จดหมาย", zh: "信箱" },
  { value: "Library", th: "ห้องสมุด", zh: "图书室" },
  { value: "BBQ Area", th: "พื้นที่บาร์บีคิว", zh: "烧烤区" },
  { value: "Rooftop", th: "ดาดฟ้า", zh: "天台" },
  { value: "Meeting Room", th: "ห้องประชุม", zh: "会议室" },
  { value: "Laundry Service", th: "บริการซักรีด", zh: "洗衣服务" },
  { value: "Convenience Store", th: "ร้านสะดวกซื้อ", zh: "便利店" },
  { value: "Restaurant", th: "ร้านอาหาร", zh: "餐厅" },
  { value: "Jogging Track", th: "ลู่วิ่ง", zh: "跑道" },
  { value: "Sky Lounge", th: "สกายเลาจน์", zh: "空中休息室" },
  { value: "Home Automation", th: "ระบบสมาร์ทโฮม", zh: "智能家居" },
  { value: "Microwave", th: "ไมโครเวฟ", zh: "微波炉" },
  { value: "TV", th: "ทีวี", zh: "电视" },
  { value: "Sofa", th: "โซฟา", zh: "沙发" },
  { value: "Dining Table", th: "โต๊ะอาหาร", zh: "餐桌" },
  { value: "Study Desk", th: "โต๊ะทำงาน", zh: "书桌" },

  // Additional 10 amenities
  { value: "Steam Room", th: "ห้องอบไอน้ำ", zh: "蒸汽房" },
  { value: "Tennis Court", th: "สนามเทนนิส", zh: "网球场" },
  { value: "Basketball Court", th: "สนามบาสเกตบอล", zh: "篮球场" },
  { value: "Yoga Room", th: "ห้องโยคะ", zh: "瑜伽室" },
  { value: "Game Room", th: "ห้องเกมส์", zh: "游戏室" },
  { value: "Cinema Room", th: "ห้องโฮมเธียเตอร์", zh: "影音室" },
  { value: "Maid's Room", th: "ห้องแม่บ้าน", zh: "佣人房" },
  { value: "Storage Room", th: "ห้องเก็บของ", zh: "储物室" },
  { value: "Dryer", th: "เครื่องอบผ้า", zh: "烘干机" },
  { value: "Dishwasher", th: "เครื่องล้างจาน", zh: "洗碗机" },
];

// Create maps for quick lookup
const AMENITY_MAP_TH = new Map(AMENITY_OPTIONS.map(a => [a.value, a.th]));
const AMENITY_MAP_ZH = new Map(AMENITY_OPTIONS.map(a => [a.value, a.zh]));

/**
 * Get the Thai label for an amenity value
 * Falls back to the original value if no translation found
 */
export function getAmenityLabel(value: string): string {
  return AMENITY_MAP_TH.get(value) || value;
}

/**
 * Get the Chinese label for an amenity value
 * Falls back to the original value if no translation found
 */
export function getAmenityLabelZh(value: string): string {
  return AMENITY_MAP_ZH.get(value) || value;
}

/**
 * Get the amenity label based on locale
 * @param value - The English amenity value
 * @param locale - The locale (th, zh, en)
 * @returns The translated label or original value for English
 */
export function getAmenityLabelByLocale(value: string, locale: string): string {
  switch (locale) {
    case "th":
      return AMENITY_MAP_TH.get(value) || value;
    case "zh":
      return AMENITY_MAP_ZH.get(value) || value;
    default:
      return value; // Return English value for 'en' and other locales
  }
}
