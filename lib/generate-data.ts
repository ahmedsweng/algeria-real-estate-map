import type { Agent, POI, Property } from "./types";

// Algerian cities with coordinates
const algerianCities = [
  { name: "Algiers", longitude: 3.042048, latitude: 36.752887 },
  { name: "Oran", longitude: -0.6417, latitude: 35.6936 },
  { name: "Constantine", longitude: 6.60659, latitude: 36.36562 },
  { name: "Annaba", longitude: 7.76574, latitude: 36.9 },
  { name: "Blida", longitude: 2.8275, latitude: 36.47 },
  { name: "Batna", longitude: 6.1742, latitude: 35.5565 },
  { name: "Djelfa", longitude: 3.25, latitude: 34.67 },
  { name: "Sétif", longitude: 5.4147, latitude: 36.1901 },
  { name: "Sidi Bel Abbès", longitude: -0.6333, latitude: 35.2 },
  { name: "Biskra", longitude: 5.7333, latitude: 34.85 },
  { name: "Tébessa", longitude: 8.12, latitude: 35.404 },
  { name: "El Oued", longitude: 6.867, latitude: 33.368 },
  { name: "Skikda", longitude: 6.909, latitude: 36.878 },
  { name: "Tiaret", longitude: 1.317, latitude: 35.371 },
  { name: "Béjaïa", longitude: 5.084, latitude: 36.751 },
  { name: "Tlemcen", longitude: -1.3154, latitude: 34.8801 },
  { name: "Ouargla", longitude: 5.324, latitude: 31.947 },
  { name: "Béchar", longitude: -2.214, latitude: 31.613 },
  { name: "Mostaganem", longitude: 0.089, latitude: 35.931 },
  { name: "Bordj Bou Arréridj", longitude: 4.763, latitude: 36.073 },
  { name: "Chlef", longitude: 1.333, latitude: 36.164 },
  { name: "Souk Ahras", longitude: 7.951, latitude: 36.286 },
  { name: "Médéa", longitude: 2.764, latitude: 36.264 },
  { name: "El Eulma", longitude: 5.69, latitude: 36.152 },
  { name: "Touggourt", longitude: 6.06, latitude: 33.1 },
];

// Property types
const propertyTypes = [
  "Apartment",
  "House",
  "Villa",
  "Land",
  "Duplex",
  "Studio",
  "Penthouse",
];

// Property features
const propertyFeatures = [
  "Air Conditioning",
  "Elevator",
  "Parking",
  "Security",
  "Balcony",
  "Furnished",
  "Swimming Pool",
  "Garden",
  "Garage",
  "Security System",
  "Heating",
  "Sea View",
  "Mountain View",
  "Terrace",
  "Fireplace",
  "Storage",
  "Gym",
  "Courtyard",
  "Traditional Architecture",
  "Modern Architecture",
  "High Ceilings",
  "Marble Floors",
  "Wooden Floors",
  "Smart Home",
  "Solar Panels",
  "Double Glazing",
  "Fiber Optic Internet",
];

// Algerian names for agents
const agentFirstNames = [
  "Ahmed",
  "Mohamed",
  "Ali",
  "Karim",
  "Omar",
  "Youcef",
  "Sofiane",
  "Amine",
  "Farid",
  "Samir",
  "Leila",
  "Samira",
  "Fatima",
  "Amina",
  "Karima",
  "Nadia",
  "Yasmine",
  "Meriem",
  "Sabrina",
  "Souad",
];

const agentLastNames = [
  "Benali",
  "Hadj",
  "Boudiaf",
  "Mebarki",
  "Ziani",
  "Benmalek",
  "Benmoussa",
  "Khelifi",
  "Mansouri",
  "Bouzid",
  "Hamidi",
  "Rahmani",
  "Messaoudi",
  "Bouaziz",
  "Cherif",
  "Taleb",
  "Benaissa",
  "Amrani",
  "Belkacem",
  "Hamdani",
];

// Real estate images from Unsplash
const apartmentImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
];

const houseImages = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2078&q=80",
  "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
];

const villaImages = [
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
];

const landImages = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
  "https://images.unsplash.com/photo-1501084291732-13b1ba8f0ebc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
];

const duplexImages = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2084&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
];

const studioImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
];

const penthouseImages = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1600607687644-c7f34b5063c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1600047509782-20d39509f26d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
];

// Interior images for all property types
const interiorImages = [
  "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
  "https://images.unsplash.com/photo-1600121848594-d8644e57abab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1616137466211-f939a420be84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80",
  "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1600121848594-d8644e57abab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1600566752734-2a0cd26b6dd4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
];

// POI images
const schoolImages = [
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2132&q=80",
];

const hospitalImages = [
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80",
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
];

const shoppingImages = [
  "https://images.unsplash.com/photo-1567958451986-2de427a4a0be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1481437156560-3205f6a55735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2095&q=80",
];

const restaurantImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
];

// Helper function to get random images based on property type
function getPropertyImages(type: string): string[] {
  // Get exterior images based on property type
  let exteriorImages: string[];
  switch (type.toLowerCase()) {
    case "apartment":
      exteriorImages = apartmentImages;
      break;
    case "house":
      exteriorImages = houseImages;
      break;
    case "villa":
      exteriorImages = villaImages;
      break;
    case "land":
      exteriorImages = landImages;
      break;
    case "duplex":
      exteriorImages = duplexImages;
      break;
    case "studio":
      exteriorImages = studioImages;
      break;
    case "penthouse":
      exteriorImages = penthouseImages;
      break;
    default:
      exteriorImages = houseImages;
  }

  // Get a random exterior image
  const exteriorImage =
    exteriorImages[Math.floor(Math.random() * exteriorImages.length)];

  // Get 2 random interior images (except for land)
  const images = [exteriorImage];
  if (type.toLowerCase() !== "land") {
    // Add 2 random interior images
    const shuffledInteriors = [...interiorImages].sort(
      () => 0.5 - Math.random()
    );
    images.push(shuffledInteriors[0], shuffledInteriors[1]);
  } else {
    // For land, add more land images
    const shuffledLandImages = [...landImages]
      .filter((img) => img !== exteriorImage)
      .sort(() => 0.5 - Math.random());
    images.push(shuffledLandImages[0], shuffledLandImages[1]);
  }

  return images;
}

// Helper function to get POI images based on type
function getPOIImage(type: string): string {
  switch (type) {
    case "school":
      return schoolImages[Math.floor(Math.random() * schoolImages.length)];
    case "hospital":
      return hospitalImages[Math.floor(Math.random() * hospitalImages.length)];
    case "shopping":
      return shoppingImages[Math.floor(Math.random() * shoppingImages.length)];
    case "restaurant":
      return restaurantImages[
        Math.floor(Math.random() * restaurantImages.length)
      ];
    default:
      return schoolImages[0];
  }
}

// Generate a random agent
function generateAgent(): Agent {
  const firstName =
    agentFirstNames[Math.floor(Math.random() * agentFirstNames.length)];
  const lastName =
    agentLastNames[Math.floor(Math.random() * agentLastNames.length)];
  const name = `${firstName} ${lastName}`;

  return {
    name,
    phone: `+213 ${Math.floor(Math.random() * 900) + 100} ${
      Math.floor(Math.random() * 900) + 100
    } ${Math.floor(Math.random() * 900) + 100}`,
    avatar: `/placeholder.svg?height=50&width=50&text=${firstName.charAt(
      0
    )}${lastName.charAt(0)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
  };
}

// Generate a random property
function generateProperty(id: number): Property {
  // Select a random city
  const city =
    algerianCities[Math.floor(Math.random() * algerianCities.length)];

  // Add some randomness to the coordinates to spread properties around the city
  const longitude = city.longitude + (Math.random() - 0.5) * 0.05;
  const latitude = city.latitude + (Math.random() - 0.5) * 0.05;

  // Select a random property type
  const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];

  // Generate random property details
  const bedrooms = type === "Land" ? 0 : Math.floor(Math.random() * 5) + 1;
  const bathrooms = type === "Land" ? 0 : Math.floor(Math.random() * 4) + 1;
  const area = Math.floor(Math.random() * 300) + 50;
  const price = Math.floor(Math.random() * 90000000) + 5000000;
  const furnished = Math.random() > 0.5;
  const yearBuilt = Math.floor(Math.random() * 40) + 1980;

  // Generate random features
  const numFeatures = Math.floor(Math.random() * 8) + 3;
  const features: string[] = [];
  for (let i = 0; i < numFeatures; i++) {
    const feature =
      propertyFeatures[Math.floor(Math.random() * propertyFeatures.length)];
    if (!features.includes(feature)) {
      features.push(feature);
    }
  }

  // Generate a random status
  const statuses = ["For Sale", "For Rent", "Sold", "Rented"];
  const status = statuses[Math.floor(Math.random() * 2)] as
    | "For Sale"
    | "For Rent"
    | "Sold"
    | "Rented"; // Only use the first two (For Sale, For Rent)

  // Generate a random agent
  const agent = generateAgent();

  // Generate a random address
  const streets = ["Avenue", "Street", "Boulevard", "Road", "Lane"];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const streetNumber = Math.floor(Math.random() * 100) + 1;
  const address = `${streetNumber} ${street} ${Math.floor(
    Math.random() * 100
  )}, ${city.name}`;

  // Generate a random title
  const adjectives = [
    "Modern",
    "Spacious",
    "Cozy",
    "Luxurious",
    "Beautiful",
    "Elegant",
    "Charming",
    "Stunning",
  ];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const title = `${adjective} ${type} in ${city.name}`;

  // Generate a random description
  const descriptions = [
    `A ${adjective.toLowerCase()} ${type.toLowerCase()} located in the heart of ${
      city.name
    }. This property features ${bedrooms} spacious bedrooms, ${bathrooms} bathrooms, a large living room, and a fully equipped kitchen.`,
    `Beautiful ${type.toLowerCase()} with stunning views in ${
      city.name
    }. This property offers ${bedrooms} bedrooms, ${bathrooms} bathrooms, and a spacious living area.`,
    `Discover this ${adjective.toLowerCase()} ${type.toLowerCase()} in a prime location in ${
      city.name
    }. With ${bedrooms} bedrooms and ${bathrooms} bathrooms, it's perfect for a family.`,
    `This ${adjective.toLowerCase()} ${type.toLowerCase()} in ${
      city.name
    } features ${bedrooms} bedrooms, ${bathrooms} bathrooms, and all the modern amenities you need for comfortable living.`,
  ];
  const description =
    descriptions[Math.floor(Math.random() * descriptions.length)];

  // Get property images based on type
  const images = getPropertyImages(type);

  return {
    id,
    title,
    price,
    type,
    bedrooms,
    bathrooms,
    area,
    address,
    description,
    features,
    images,
    longitude,
    latitude,
    agent,
    furnished,
    yearBuilt,
    status,
  };
}

// Generate POI details
function generatePOIDescription(type: string, name: string): string {
  switch (type) {
    case "school":
      return `${name} is an educational institution offering quality education to students in the area. The school has modern facilities and a dedicated teaching staff.`;
    case "hospital":
      return `${name} is a healthcare facility providing medical services to the community. The hospital is equipped with modern medical equipment and has a team of experienced healthcare professionals.`;
    case "shopping":
      return `${name} is a shopping center offering a variety of retail stores, restaurants, and entertainment options. It's a popular destination for locals and tourists alike.`;
    case "restaurant":
      return `${name} is a popular dining establishment serving delicious local and international cuisine. The restaurant has a cozy atmosphere and friendly staff.`;
    default:
      return `${name} is a point of interest in the area.`;
  }
}

// Generate POI opening hours
function generateOpeningHours(type: string): string {
  switch (type) {
    case "school":
      return "Monday to Friday: 8:00 AM - 4:00 PM";
    case "hospital":
      return "24/7";
    case "shopping":
      return "Daily: 10:00 AM - 10:00 PM";
    case "restaurant":
      return "Daily: 11:00 AM - 11:00 PM";
    default:
      return "Varies";
  }
}

// Generate POI contact
function generateContact(type: string): string {
  return `+213 ${Math.floor(Math.random() * 900) + 100} ${
    Math.floor(Math.random() * 900) + 100
  } ${Math.floor(Math.random() * 900) + 100}`;
}

// Generate POI website
function generateWebsite(name: string, type: string): string {
  const formattedName = name.toLowerCase().replace(/\s+/g, "-");
  return `https://www.${formattedName}.dz`;
}

// Generate a random POI
function generatePOI(
  id: number,
  city: { name: string; longitude: number; latitude: number },
  type: string
): POI {
  // Add some randomness to the coordinates to spread POIs around the city
  const longitude = city.longitude + (Math.random() - 0.5) * 0.03;
  const latitude = city.latitude + (Math.random() - 0.5) * 0.03;

  // Generate a name based on the type and city
  let name = "";
  switch (type) {
    case "school":
      const schoolTypes = [
        "University",
        "High School",
        "Elementary School",
        "College",
        "Institute",
      ];
      const schoolType =
        schoolTypes[Math.floor(Math.random() * schoolTypes.length)];
      name = `${city.name} ${schoolType}`;
      break;
    case "hospital":
      const hospitalTypes = [
        "Hospital",
        "Medical Center",
        "Clinic",
        "Health Center",
      ];
      const hospitalType =
        hospitalTypes[Math.floor(Math.random() * hospitalTypes.length)];
      name = `${city.name} ${hospitalType}`;
      break;
    case "shopping":
      const mallTypes = ["Mall", "Shopping Center", "Market", "Plaza"];
      const mallType = mallTypes[Math.floor(Math.random() * mallTypes.length)];
      name = `${city.name} ${mallType}`;
      break;
    case "restaurant":
      const cuisines = [
        "Traditional",
        "Modern",
        "International",
        "Seafood",
        "Grill",
      ];
      const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
      name = `${cuisine} Restaurant ${city.name}`;
      break;
  }

  // Generate a random address
  const streets = ["Avenue", "Street", "Boulevard", "Road", "Lane"];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const streetNumber = Math.floor(Math.random() * 100) + 1;
  const address = `${streetNumber} ${street} ${Math.floor(
    Math.random() * 100
  )}, ${city.name}`;

  // Generate a random rating
  const rating = Math.floor(Math.random() * 5) + 1;

  // Get POI image based on type
  const image = getPOIImage(type);

  return {
    id,
    name,
    type,
    longitude,
    latitude,
    description: generatePOIDescription(type, name),
    address,
    rating,
    openingHours: generateOpeningHours(type),
    contact: generateContact(type),
    website: generateWebsite(name, type),
    image,
  };
}

// Generate 100 properties
export function generateProperties(count = 100): Property[] {
  const properties: Property[] = [];
  for (let i = 1; i <= count; i++) {
    properties.push(generateProperty(i));
  }
  return properties;
}

// Generate POIs for each city and type
export function generatePOIs(): POI[] {
  const poiTypes = ["school", "hospital", "shopping", "restaurant"];
  const pois: POI[] = [];
  let id = 1000;

  algerianCities.forEach((city) => {
    poiTypes.forEach((type) => {
      // Generate 1-3 POIs of each type for each city
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        pois.push(generatePOI(id++, city, type));
      }
    });
  });

  return pois;
}
