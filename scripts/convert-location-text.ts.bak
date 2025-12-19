/**
 * Script to convert location text fields:
 * 1. projectLocationText should only contain Thai
 * 2. projectLocationTextEn should contain English translation
 * 3. Same for Property table
 *
 * Run with: DATABASE_URL="postgresql://..." npx tsx scripts/convert-location-text.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// =============================================================================
// Thai to English mappings (reverse of thai-address-constants.ts)
// =============================================================================

const PROVINCE_EN_MAP: Record<string, string> = {
  กรุงเทพมหานคร: "Bangkok",
  สมุทรปราการ: "Samut Prakan",
  นนทบุรี: "Nonthaburi",
  ปทุมธานี: "Pathum Thani",
  นครปฐม: "Nakhon Pathom",
  สมุทรสาคร: "Samut Sakhon",
  สมุทรสงคราม: "Samut Songkhram",
  พระนครศรีอยุธยา: "Ayutthaya",
  อ่างทอง: "Ang Thong",
  ลพบุรี: "Lop Buri",
  สิงห์บุรี: "Sing Buri",
  ชัยนาท: "Chai Nat",
  สระบุรี: "Saraburi",
  เชียงใหม่: "Chiang Mai",
  เชียงราย: "Chiang Rai",
  ลำปาง: "Lampang",
  ลำพูน: "Lamphun",
  แม่ฮ่องสอน: "Mae Hong Son",
  น่าน: "Nan",
  พะเยา: "Phayao",
  แพร่: "Phrae",
  อุตรดิตถ์: "Uttaradit",
  ขอนแก่น: "Khon Kaen",
  อุดรธานี: "Udon Thani",
  นครราชสีมา: "Nakhon Ratchasima",
  อุบลราชธานี: "Ubon Ratchathani",
  บุรีรัมย์: "Buriram",
  สุรินทร์: "Surin",
  ศรีสะเกษ: "Sisaket",
  ร้อยเอ็ด: "Roi Et",
  กาฬสินธุ์: "Kalasin",
  มหาสารคาม: "Maha Sarakham",
  หนองคาย: "Nong Khai",
  เลย: "Loei",
  สกลนคร: "Sakon Nakhon",
  นครพนม: "Nakhon Phanom",
  มุกดาหาร: "Mukdahan",
  อำนาจเจริญ: "Amnat Charoen",
  ยโสธร: "Yasothon",
  ชัยภูมิ: "Chaiyaphum",
  หนองบัวลำภู: "Nong Bua Lam Phu",
  บึงกาฬ: "Bueng Kan",
  ชลบุรี: "Chonburi",
  ระยอง: "Rayong",
  จันทบุรี: "Chanthaburi",
  ตราด: "Trat",
  ปราจีนบุรี: "Prachinburi",
  สระแก้ว: "Sa Kaeo",
  นครนายก: "Nakhon Nayok",
  กาญจนบุรี: "Kanchanaburi",
  ราชบุรี: "Ratchaburi",
  สุพรรณบุรี: "Suphan Buri",
  เพชรบุรี: "Phetchaburi",
  ประจวบคีรีขันธ์: "Prachuap Khiri Khan",
  ตาก: "Tak",
  ภูเก็ต: "Phuket",
  กระบี่: "Krabi",
  สุราษฎร์ธานี: "Surat Thani",
  นครศรีธรรมราช: "Nakhon Si Thammarat",
  สงขลา: "Songkhla",
  ปัตตานี: "Pattani",
  ยะลา: "Yala",
  นราธิวาส: "Narathiwat",
  พังงา: "Phang Nga",
  ตรัง: "Trang",
  สตูล: "Satun",
  พัทลุง: "Phatthalung",
  ชุมพร: "Chumphon",
  ระนอง: "Ranong",
};

const DISTRICT_EN_MAP: Record<string, string> = {
  // Bangkok Districts (with เขต prefix)
  เขตปทุมวัน: "Pathum Wan",
  เขตวัฒนา: "Watthana",
  เขตคลองเตย: "Khlong Toei",
  เขตพระโขนง: "Phra Khanong",
  เขตสวนหลวง: "Suan Luang",
  เขตบางนา: "Bang Na",
  เขตประเวศ: "Prawet",
  เขตบางเขน: "Bang Khen",
  เขตบางรัก: "Bang Rak",
  เขตคลองสาน: "Khlong San",
  เขตบางแค: "Bang Khae",
  เขตบางซื่อ: "Bang Sue",
  เขตสาทร: "Sathorn",
  เขตจตุจักร: "Chatuchak",
  เขตห้วยขวาง: "Huai Khwang",
  เขตบางกะปิ: "Bang Kapi",
  เขตลาดพร้าว: "Lat Phrao",
  เขตดินแดง: "Din Daeng",
  เขตพญาไท: "Phaya Thai",
  เขตราชเทวี: "Ratchathewi",
  เขตดุสิต: "Dusit",
  เขตป้อมปราบศัตรูพ่าย: "Pom Prap Sattru Phai",
  เขตสัมพันธวงศ์: "Samphanthawong",
  เขตยานนาวา: "Yan Nawa",
  เขตธนบุรี: "Thon Buri",
  เขตบางกอกใหญ่: "Bangkok Yai",
  เขตบางกอกน้อย: "Bangkok Noi",
  เขตทวีวัฒนา: "Thawi Watthana",
  เขตตลิ่งชัน: "Taling Chan",
  เขตหนองแขม: "Nong Khaem",
  เขตภาษีเจริญ: "Phasi Charoen",
  เขตจอมทอง: "Chom Thong",
  เขตราษฎร์บูรณะ: "Rat Burana",
  เขตทุ่งครุ: "Thung Khru",
  เขตบางขุนเทียน: "Bang Khun Thian",
  เขตสะพานสูง: "Saphan Sung",
  เขตคันนายาว: "Khan Na Yao",
  เขตวังทองหลาง: "Wang Thonglang",
  เขตบึงกุ่ม: "Bueng Kum",
  เขตสายไหม: "Sai Mai",
  เขตดอนเมือง: "Don Mueang",
  เขตหลักสี่: "Lak Si",
  เขตมีนบุรี: "Min Buri",
  เขตหนองจอก: "Nong Chok",
  เขตลาดกระบัง: "Lat Krabang",
  // Without prefix
  ปทุมวัน: "Pathum Wan",
  วัฒนา: "Watthana",
  คลองเตย: "Khlong Toei",
  พระโขนง: "Phra Khanong",
  สวนหลวง: "Suan Luang",
  บางนา: "Bang Na",
  ประเวศ: "Prawet",
  บางเขน: "Bang Khen",
  บางรัก: "Bang Rak",
  คลองสาน: "Khlong San",
  บางแค: "Bang Khae",
  บางซื่อ: "Bang Sue",
  สาทร: "Sathorn",
  จตุจักร: "Chatuchak",
  ห้วยขวาง: "Huai Khwang",
  บางกะปิ: "Bang Kapi",
  ลาดพร้าว: "Lat Phrao",
  ดินแดง: "Din Daeng",
  พญาไท: "Phaya Thai",
  ราชเทวี: "Ratchathewi",
  ดุสิต: "Dusit",
  ยานนาวา: "Yan Nawa",
  ธนบุรี: "Thon Buri",
  บางกอกใหญ่: "Bangkok Yai",
  บางกอกน้อย: "Bangkok Noi",
  ทวีวัฒนา: "Thawi Watthana",
  ตลิ่งชัน: "Taling Chan",
  หนองแขม: "Nong Khaem",
  ภาษีเจริญ: "Phasi Charoen",
  จอมทอง: "Chom Thong",
  ราษฎร์บูรณะ: "Rat Burana",
  ทุ่งครุ: "Thung Khru",
  บางขุนเทียน: "Bang Khun Thian",
  สะพานสูง: "Saphan Sung",
  คันนายาว: "Khan Na Yao",
  วังทองหลาง: "Wang Thonglang",
  บึงกุ่ม: "Bueng Kum",
  สายไหม: "Sai Mai",
  ดอนเมือง: "Don Mueang",
  หลักสี่: "Lak Si",
  มีนบุรี: "Min Buri",
  หนองจอก: "Nong Chok",
  ลาดกระบัง: "Lat Krabang",
  // Other province districts (with อำเภอ prefix)
  อำเภอเมืองเชียงใหม่: "Mueang Chiang Mai",
  อำเภอเมืองภูเก็ต: "Mueang Phuket",
  อำเภอเมืองนนทบุรี: "Mueang Nonthaburi",
  อำเภอชะอำ: "Cha-am",
  อำเภอบางกรวย: "Bang Kruai",
  อำเภอปากเกร็ด: "Pak Kret",
  อำเภอบางบัวทอง: "Bang Bua Thong",
  อำเภอเมืองสมุทรปราการ: "Mueang Samut Prakan",
  อำเภอเมืองชลบุรี: "Mueang Chonburi",
  อำเภอบางละมุง: "Bang Lamung",
  อำเภอศรีราชา: "Si Racha",
  อำเภอพัทยา: "Pattaya",
  // Without prefix - other provinces
  บางพลี: "Bang Phli",
  เมืองสมุทรปราการ: "Mueang Samut Prakan",
  พระประแดง: "Phra Pradaeng",
  ปากเกร็ด: "Pak Kret",
  เมืองนนทบุรี: "Mueang Nonthaburi",
  บางใหญ่: "Bang Yai",
  บางบัวทอง: "Bang Bua Thong",
  ศรีราชา: "Si Racha",
  บางละมุง: "Bang Lamung",
  พัทยา: "Pattaya",
  เมืองชลบุรี: "Mueang Chonburi",
};

const SUB_DISTRICT_EN_MAP: Record<string, string> = {
  // Bangkok Sub-districts (with แขวง prefix)
  แขวงคลองเตยเหนือ: "Khlong Toei Nuea",
  แขวงคลองเตย: "Khlong Toei",
  แขวงพระโขนงเหนือ: "Phra Khanong Nuea",
  แขวงพระโขนงใต้: "Phra Khanong Tai",
  แขวงพระโขนง: "Phra Khanong",
  แขวงลุมพินี: "Lumphini",
  แขวงอนุสาวรีย์: "Anusawari",
  แขวงมหาพฤฒาราม: "Maha Phruettharam",
  แขวงคลองต้นไทร: "Khlong Ton Sai",
  แขวงสีลม: "Silom",
  แขวงบางแค: "Bang Khae",
  แขวงบางแคเหนือ: "Bang Khae Nuea",
  แขวงสวนหลวง: "Suan Luang",
  แขวงบางจาก: "Bang Chak",
  แขวงบางซื่อ: "Bang Sue",
  แขวงบางนาใต้: "Bang Na Tai",
  แขวงบางนา: "Bang Na",
  แขวงหนองบอน: "Nong Bon",
  แขวงบางลำภูล่าง: "Bang Lamphu Lang",
  แขวงทุ่งวัดดอน: "Thung Wat Don",
  แขวงจอมพล: "Chomphon",
  แขวงสามเสนนอก: "Sam Sen Nok",
  แขวงลาดพร้าว: "Lat Phrao",
  แขวงคลองจั่น: "Khlong Chan",
  แขวงปทุมวัน: "Pathum Wan",
  แขวงวังใหม่: "Wang Mai",
  แขวงรองเมือง: "Rong Muang",
  แขวงยานนาวา: "Yan Nawa",
  แขวงทุ่งมหาเมฆ: "Thung Maha Mek",
  แขวงคลองตัน: "Khlong Tan",
  แขวงคลองตันเหนือ: "Khlong Tan Nuea",
  แขวงดินแดง: "Din Daeng",
  แขวงห้วยขวาง: "Huai Khwang",
  แขวงบางกะปิ: "Bang Kapi",
  แขวงจตุจักร: "Chatuchak",
  // Without prefix
  คลองเตยเหนือ: "Khlong Toei Nuea",
  คลองเตย: "Khlong Toei",
  พระโขนงเหนือ: "Phra Khanong Nuea",
  พระโขนงใต้: "Phra Khanong Tai",
  พระโขนง: "Phra Khanong",
  ลุมพินี: "Lumphini",
  อนุสาวรีย์: "Anusawari",
  มหาพฤฒาราม: "Maha Phruettharam",
  คลองต้นไทร: "Khlong Ton Sai",
  สีลม: "Silom",
  บางแค: "Bang Khae",
  บางแคเหนือ: "Bang Khae Nuea",
  สวนหลวง: "Suan Luang",
  บางจาก: "Bang Chak",
  บางซื่อ: "Bang Sue",
  บางนาใต้: "Bang Na Tai",
  บางนา: "Bang Na",
  หนองบอน: "Nong Bon",
  บางลำภูล่าง: "Bang Lamphu Lang",
  ทุ่งวัดดอน: "Thung Wat Don",
  จอมพล: "Chomphon",
  สามเสนนอก: "Sam Sen Nok",
  ลาดพร้าว: "Lat Phrao",
  คลองจั่น: "Khlong Chan",
  ปทุมวัน: "Pathum Wan",
  วังใหม่: "Wang Mai",
  รองเมือง: "Rong Muang",
  ยานนาวา: "Yan Nawa",
  ทุ่งมหาเมฆ: "Thung Maha Mek",
  คลองตัน: "Khlong Tan",
  คลองตันเหนือ: "Khlong Tan Nuea",
  ดินแดง: "Din Daeng",
  ห้วยขวาง: "Huai Khwang",
  บางกะปิ: "Bang Kapi",
  จตุจักร: "Chatuchak",
  // Other provinces
  ตำบลสุเทพ: "Suthep",
  ตำบลตลาดใหญ่: "Talat Yai",
  ตำบลชะอำ: "Cha-am",
  สุเทพ: "Suthep",
  ตลาดใหญ่: "Talat Yai",
  ชะอำ: "Cha-am",
};

// English to Thai mappings (from existing constants)
const PROVINCE_TH_MAP: Record<string, string> = {
  Bangkok: "กรุงเทพมหานคร",
  bangkok: "กรุงเทพมหานคร",
  "Krung Thep Maha Nakhon": "กรุงเทพมหานคร",
  "Krung Thep": "กรุงเทพมหานคร",
  "Samut Prakan": "สมุทรปราการ",
  Nonthaburi: "นนทบุรี",
  "Pathum Thani": "ปทุมธานี",
  "Chiang Mai": "เชียงใหม่",
  Phuket: "ภูเก็ต",
  Chonburi: "ชลบุรี",
  "Nakhon Pathom": "นครปฐม",
  Rayong: "ระยอง",
  "Hua Hin": "ประจวบคีรีขันธ์",
  Pattaya: "ชลบุรี",
};

const DISTRICT_TH_MAP: Record<string, string> = {
  "Pathum Wan": "ปทุมวัน",
  Pathumwan: "ปทุมวัน",
  Watthana: "วัฒนา",
  Wattana: "วัฒนา",
  "Khlong Toei": "คลองเตย",
  "Klong Toey": "คลองเตย",
  "Phra Khanong": "พระโขนง",
  Phrakanong: "พระโขนง",
  "Suan Luang": "สวนหลวง",
  "Bang Na": "บางนา",
  Bangna: "บางนา",
  Prawet: "ประเวศ",
  "Bang Khen": "บางเขน",
  "Bang Rak": "บางรัก",
  Bangrak: "บางรัก",
  "Khlong San": "คลองสาน",
  "Bang Khae": "บางแค",
  "Bang Sue": "บางซื่อ",
  Sathorn: "สาทร",
  Sathon: "สาทร",
  Chatuchak: "จตุจักร",
  "Huai Khwang": "ห้วยขวาง",
  "Bang Kapi": "บางกะปิ",
  "Lat Phrao": "ลาดพร้าว",
  "Din Daeng": "ดินแดง",
  "Phaya Thai": "พญาไท",
  Ratchathewi: "ราชเทวี",
  Dusit: "ดุสิต",
  "Yan Nawa": "ยานนาวา",
  "Thon Buri": "ธนบุรี",
};

const SUB_DISTRICT_TH_MAP: Record<string, string> = {
  "Khlong Toei Nuea": "คลองเตยเหนือ",
  "Khlong Toei": "คลองเตย",
  "Phra Khanong Nuea": "พระโขนงเหนือ",
  "Phra Khanong": "พระโขนง",
  Lumphini: "ลุมพินี",
  Lumpini: "ลุมพินี",
  Anusawari: "อนุสาวรีย์",
  "Maha Phruettharam": "มหาพฤฒาราม",
  "Khlong Ton Sai": "คลองต้นไทร",
  Silom: "สีลม",
  "Si Lom": "สีลม",
  "Bang Chak": "บางจาก",
  "Bang Sue": "บางซื่อ",
  "Suan Luang": "สวนหลวง",
  "Bang Khae": "บางแค",
  "Bang Khae Nuea": "บางแคเหนือ",
};

// BTS/MRT Station mappings (English <-> Thai)
const STATION_EN_MAP: Record<string, string> = {
  สุขุมวิท: "Sukhumvit",
  อโศก: "Asoke",
  พร้อมพงษ์: "Phrom Phong",
  ทองหล่อ: "Thong Lo",
  เอกมัย: "Ekkamai",
  พระโขนง: "Phra Khanong",
  อ่อนนุช: "On Nut",
  บางจาก: "Bang Chak",
  ปุณณวิถี: "Punnawithi",
  อุดมสุข: "Udom Suk",
  บางนา: "Bang Na",
  แบริ่ง: "Bearing",
  สำโรง: "Samrong",
  สยาม: "Siam",
  ชิดลม: "Chit Lom",
  เพลินจิต: "Phloen Chit",
  นานา: "Nana",
  ราชดำริ: "Ratchadamri",
  ศาลาแดง: "Sala Daeng",
  ช่องนนทรี: "Chong Nonsi",
  สุรศักดิ์: "Surasak",
  สะพานตากสิน: "Saphan Taksin",
  กรุงธนบุรี: "Krung Thon Buri",
  วงเวียนใหญ่: "Wong Wian Yai",
  อนุสาวรีย์ชัยสมรภูมิ: "Victory Monument",
  พญาไท: "Phaya Thai",
  ราชเทวี: "Ratchathewi",
  สนามกีฬาแห่งชาติ: "National Stadium",
  หมอชิต: "Mo Chit",
  สะพานควาย: "Saphan Khwai",
  อารีย์: "Ari",
  เสนานิคม: "Sena Nikhom",
  รัชโยธิน: "Ratchayothin",
  พหลโยธิน: "Phahon Yothin",
  ลาดพร้าว: "Lat Phrao",
  รัชดาภิเษก: "Ratchadaphisek",
  สุทธิสาร: "Sutthisan",
  ห้วยขวาง: "Huai Khwang",
  ศูนย์วัฒนธรรมแห่งประเทศไทย: "Thailand Cultural Centre",
  พระราม9: "Rama 9",
  เพชรบุรี: "Phetchaburi",
  สามย่าน: "Sam Yan",
  หัวลำโพง: "Hua Lamphong",
  วัดมังกร: "Wat Mangkon",
  สามยอด: "Sam Yot",
  สนามไชย: "Sanam Chai",
  อิสรภาพ: "Itsaraphap",
  บางหว้า: "Bang Wa",
  ตลาดพลู: "Talat Phlu",
  วุฒากาศ: "Wutthakat",
  บางแค: "Bang Khae",
  หลักสอง: "Lak Song",
  บางขุนนนท์: "Bang Khun Non",
  บางยี่ขัน: "Bang Yi Khan",
  สิรินธร: "Sirindhorn",
  บางพลัด: "Bang Phlat",
  บางอ้อ: "Bang O",
  บางโพ: "Bang Pho",
  เตาปูน: "Tao Poon",
  บางซื่อ: "Bang Sue",
  กำแพงเพชร: "Kamphaeng Phet",
  จตุจักร: "Chatuchak",
};

const STATION_TH_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(STATION_EN_MAP).map(([th, en]) => [en, th])
);

// Additional station names that might appear in English
const ADDITIONAL_STATION_TH: Record<string, string> = {
  "On Nut": "อ่อนนุช",
  Onnut: "อ่อนนุช",
  "Phrom Phong": "พร้อมพงษ์",
  "Thong Lor": "ทองหล่อ",
  "Thong Lo": "ทองหล่อ",
  Thonglor: "ทองหล่อ",
  Ekkamai: "เอกมัย",
  "Phra Khanong": "พระโขนง",
  Asoke: "อโศก",
  Asok: "อโศก",
  "Chit Lom": "ชิดลม",
  Chitlom: "ชิดลม",
  "Phloen Chit": "เพลินจิต",
  Ploenchit: "เพลินจิต",
  Siam: "สยาม",
  Nana: "นานา",
  "Sala Daeng": "ศาลาแดง",
  "Chong Nonsi": "ช่องนนทรี",
  "Victory Monument": "อนุสาวรีย์ชัยสมรภูมิ",
  "Phaya Thai": "พญาไท",
  Ratchathewi: "ราชเทวี",
  "Mo Chit": "หมอชิต",
  Mochit: "หมอชิต",
  "Saphan Khwai": "สะพานควาย",
  Ari: "อารีย์",
  "Lat Phrao": "ลาดพร้าว",
  Ladprao: "ลาดพร้าว",
  "Huai Khwang": "ห้วยขวาง",
  "Rama 9": "พระราม9",
  "Rama IX": "พระราม9",
  "Sam Yan": "สามย่าน",
  Samyan: "สามย่าน",
  "Hua Lamphong": "หัวลำโพง",
  "Bang Wa": "บางหว้า",
  Wutthakat: "วุฒากาศ",
  "Lak Song": "หลักสอง",
  "Tao Poon": "เตาปูน",
  "Bang Sue": "บางซื่อ",
  Chatuchak: "จตุจักร",
  "Krung Thon Buri": "กรุงธนบุรี",
  "Hua Mak": "หัวหมาก",
  Ramkhamhaeng: "รามคำแหง",
  "Sai Yud": "สายหยุด",
  Ratchadamri: "ราชดำริ",
  Sukhumvit: "สุขุมวิท",
  "Bang Na": "บางนา",
  Bearing: "แบริ่ง",
  Samrong: "สำโรง",
  Punnawithi: "ปุณณวิถี",
  "Udom Suk": "อุดมสุข",
  "Bang Chak": "บางจาก",
};

/**
 * Check if a string contains Thai characters
 */
function containsThai(str: string): boolean {
  return /[\u0E00-\u0E7F]/.test(str);
}

/**
 * Check if a string contains English letters
 */
function containsEnglish(str: string): boolean {
  return /[a-zA-Z]/.test(str);
}

/**
 * Extract Thai parts from a mixed string
 */
function extractThai(str: string): string {
  // Match Thai characters and spaces between Thai characters
  const thaiParts = str.match(/[\u0E00-\u0E7F\s]+/g);
  if (!thaiParts) return "";
  return thaiParts.join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Convert English location terms to Thai
 */
function convertEnglishToThai(str: string): string {
  let result = str;

  // Convert stations
  for (const [en, th] of Object.entries(ADDITIONAL_STATION_TH)) {
    const regex = new RegExp(`\\b${en}\\b`, "gi");
    result = result.replace(regex, th);
  }

  // Convert provinces
  for (const [en, th] of Object.entries(PROVINCE_TH_MAP)) {
    if (th) {
      const regex = new RegExp(`\\b${en}\\b`, "gi");
      result = result.replace(regex, th);
    }
  }

  // Convert districts
  for (const [en, th] of Object.entries(DISTRICT_TH_MAP)) {
    if (th) {
      const regex = new RegExp(`\\b${en}\\b`, "gi");
      result = result.replace(regex, th);
    }
  }

  // Convert sub-districts
  for (const [en, th] of Object.entries(SUB_DISTRICT_TH_MAP)) {
    if (th) {
      const regex = new RegExp(`\\b${en}\\b`, "gi");
      result = result.replace(regex, th);
    }
  }

  return result;
}

/**
 * Convert Thai location text to English
 */
function convertThaiToEnglish(str: string): string {
  let result = str;

  // Convert stations
  for (const [th, en] of Object.entries(STATION_EN_MAP)) {
    result = result.replace(new RegExp(th, "g"), en);
  }

  // Convert provinces
  for (const [th, en] of Object.entries(PROVINCE_EN_MAP)) {
    result = result.replace(new RegExp(th, "g"), en);
  }

  // Convert districts
  for (const [th, en] of Object.entries(DISTRICT_EN_MAP)) {
    result = result.replace(new RegExp(th, "g"), en);
  }

  // Convert sub-districts
  for (const [th, en] of Object.entries(SUB_DISTRICT_EN_MAP)) {
    result = result.replace(new RegExp(th, "g"), en);
  }

  // Clean up: remove Thai characters that weren't converted
  result = result.replace(/[\u0E00-\u0E7F]+/g, "").trim();

  // Clean up multiple spaces
  result = result.replace(/\s+/g, " ").trim();

  return result;
}

/**
 * Process a location text to get Thai-only version
 */
function processToThai(text: string): string {
  if (!text || text.trim() === "") return "";

  // If already pure Thai, return as-is
  if (containsThai(text) && !containsEnglish(text)) {
    return text.trim();
  }

  // If mixed or English-only, convert English parts to Thai
  let result = convertEnglishToThai(text);

  // Extract only Thai parts (remove remaining English)
  if (containsEnglish(result)) {
    const thaiOnly = extractThai(result);
    if (thaiOnly) {
      result = thaiOnly;
    }
  }

  return result.replace(/\s+/g, " ").trim();
}

/**
 * Process location text to get English version
 */
function processToEnglish(thaiText: string): string {
  if (!thaiText || thaiText.trim() === "") return "";

  return convertThaiToEnglish(thaiText);
}

// =============================================================================
// Main processing functions
// =============================================================================

interface ProjectUpdate {
  projectCode: string;
  projectNameEn: string;
  oldLocationText: string;
  newLocationTextTh: string;
  newLocationTextEn: string;
}

interface PropertyUpdate {
  id: string;
  propertyType: string;
  oldLocationText: string;
  newLocationTextTh: string;
  newLocationTextEn: string;
}

async function processProjects(
  dryRun: boolean = true
): Promise<ProjectUpdate[]> {
  console.log("\n=== Processing Projects ===");

  const projects = await prisma.project.findMany({
    where: { projectLocationText: { not: "" } },
    select: {
      projectCode: true,
      projectNameEn: true,
      projectLocationText: true,
      addressSubDistrict: true,
      addressDistrict: true,
      addressProvince: true,
    },
  });

  console.log(`Found ${projects.length} projects with locationText`);

  const updates: ProjectUpdate[] = [];

  for (const project of projects) {
    const oldText = project.projectLocationText;

    // Process to Thai
    let newThaiText = processToThai(oldText);

    // If we couldn't extract Thai, try building from address fields
    if (!newThaiText && (project.addressSubDistrict || project.addressDistrict || project.addressProvince)) {
      const parts = [
        project.addressSubDistrict,
        project.addressDistrict,
        project.addressProvince,
      ].filter(Boolean);
      newThaiText = processToThai(parts.join(" "));
    }

    // Generate English from Thai
    const newEnglishText = processToEnglish(newThaiText || oldText);

    // Only record if there's a change or if we need to populate English
    if (oldText !== newThaiText || newEnglishText) {
      updates.push({
        projectCode: project.projectCode,
        projectNameEn: project.projectNameEn,
        oldLocationText: oldText,
        newLocationTextTh: newThaiText,
        newLocationTextEn: newEnglishText,
      });
    }
  }

  console.log(`\nProjects to update: ${updates.length}`);

  // Show sample updates
  console.log("\n--- Sample Project Updates (first 10) ---");
  for (const update of updates.slice(0, 10)) {
    console.log(`\n[${update.projectCode}] ${update.projectNameEn}`);
    console.log(`  OLD: "${update.oldLocationText}"`);
    console.log(`  TH:  "${update.newLocationTextTh}"`);
    console.log(`  EN:  "${update.newLocationTextEn}"`);
  }

  if (!dryRun && updates.length > 0) {
    console.log("\n--- Applying Project Updates ---");
    let updated = 0;
    for (const update of updates) {
      await prisma.project.update({
        where: { projectCode: update.projectCode },
        data: {
          projectLocationText: update.newLocationTextTh,
          projectLocationTextEn: update.newLocationTextEn,
        },
      });
      updated++;
      if (updated % 100 === 0) {
        console.log(`  Updated ${updated}/${updates.length} projects...`);
      }
    }
    console.log(`  ✅ Updated ${updated} projects`);
  }

  return updates;
}

async function processProperties(
  dryRun: boolean = true
): Promise<PropertyUpdate[]> {
  console.log("\n=== Processing Properties ===");

  const properties = await prisma.property.findMany({
    where: { propertyLocationText: { not: "" } },
    select: {
      id: true,
      propertyType: true,
      propertyLocationText: true,
      propertySubDistrict: true,
      propertyDistrict: true,
      propertyProvince: true,
    },
  });

  console.log(`Found ${properties.length} properties with locationText`);

  const updates: PropertyUpdate[] = [];

  for (const property of properties) {
    const oldText = property.propertyLocationText;

    // Process to Thai
    let newThaiText = processToThai(oldText);

    // If we couldn't extract Thai, try building from address fields
    if (!newThaiText && (property.propertySubDistrict || property.propertyDistrict || property.propertyProvince)) {
      const parts = [
        property.propertySubDistrict,
        property.propertyDistrict,
        property.propertyProvince,
      ].filter(Boolean);
      newThaiText = processToThai(parts.join(" "));
    }

    // Generate English from Thai
    const newEnglishText = processToEnglish(newThaiText || oldText);

    if (oldText !== newThaiText || newEnglishText) {
      updates.push({
        id: property.id,
        propertyType: property.propertyType || "Unknown",
        oldLocationText: oldText,
        newLocationTextTh: newThaiText,
        newLocationTextEn: newEnglishText,
      });
    }
  }

  console.log(`\nProperties to update: ${updates.length}`);

  // Show sample updates
  if (updates.length > 0) {
    console.log("\n--- Sample Property Updates ---");
    for (const update of updates.slice(0, 5)) {
      console.log(`\n[${update.propertyType}] ${update.id}`);
      console.log(`  OLD: "${update.oldLocationText}"`);
      console.log(`  TH:  "${update.newLocationTextTh}"`);
      console.log(`  EN:  "${update.newLocationTextEn}"`);
    }
  }

  if (!dryRun && updates.length > 0) {
    console.log("\n--- Applying Property Updates ---");
    let updated = 0;
    for (const update of updates) {
      await prisma.property.update({
        where: { id: update.id },
        data: {
          propertyLocationText: update.newLocationTextTh,
          propertyLocationTextEn: update.newLocationTextEn,
        },
      });
      updated++;
    }
    console.log(`  ✅ Updated ${updated} properties`);
  }

  return updates;
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes("--execute");

  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║         Location Text Conversion Script                    ║");
  console.log("╠════════════════════════════════════════════════════════════╣");
  console.log(`║  Mode: ${dryRun ? "DRY RUN (preview only)" : "EXECUTE (will update DB)"}                        ║`);
  console.log("╚════════════════════════════════════════════════════════════╝");

  if (dryRun) {
    console.log("\n⚠️  This is a DRY RUN. No changes will be made.");
    console.log("    To execute updates, run with: --execute\n");
  }

  try {
    const projectUpdates = await processProjects(dryRun);
    const propertyUpdates = await processProperties(dryRun);

    console.log("\n" + "=".repeat(60));
    console.log("SUMMARY");
    console.log("=".repeat(60));
    console.log(`Projects to update: ${projectUpdates.length}`);
    console.log(`Properties to update: ${propertyUpdates.length}`);

    if (dryRun) {
      console.log("\n📋 To apply these changes, run:");
      console.log(
        '   DATABASE_URL="..." npx tsx scripts/convert-location-text.ts --execute'
      );
    } else {
      console.log("\n✅ All updates applied successfully!");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
