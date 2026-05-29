const fs = require('fs');

let content = fs.readFileSync('./src/data/services.ts', 'utf8');

// The file currently exports `SERVICES` and `ALL_SERVICE_SLUGS`.
// We want to rename `SERVICES` to `SERVICES_TR`.
content = content.replace('export const SERVICES: Record<string, ServiceData> = {', 'export const SERVICES_TR: Record<string, ServiceData> = {');
content = content.replace('export const ALL_SERVICE_SLUGS = Object.keys(SERVICES);', 'export const ALL_SERVICE_SLUGS = Object.keys(SERVICES_TR);\nexport const getServices = (locale: string) => locale === "en" ? SERVICES_EN : SERVICES_TR;');

// We can just append SERVICES_EN manually translated
const servicesEn = `
export const SERVICES_EN: Record<string, ServiceData> = {
  "kazali-arac-alimi": {
    slug: "kazali-arac-alimi",
    title: "Accident Damaged Vehicle Purchasing",
    shortTitle: "Accident Damaged",
    metaDescription: "We pick up your accident-damaged vehicle from its location. Get a free quote, our expert team will get back to you quickly.",
    hero: {
      badge: "Accident Damaged",
      heading: "Get a Quick Quote for Your Accident Damaged Vehicle",
      description: "Get a free and non-binding quote for your vehicle involved in a traffic accident. We pick up the vehicle from its location and provide support with paperwork.",
    },
    problems: [
      { title: "Front Damage", desc: "Vehicles with damaged bumper, hood, or radiator" },
      { title: "Side Damage", desc: "Vehicles with damaged door, fender, or sill" },
      { title: "Rear Damage", desc: "Vehicles with damaged trunk lid or rear bumper" },
      { title: "Total Damage", desc: "Vehicles with serious damage in multiple areas" },
    ],
    conditions: [
      { label: "Front bumper damage" },
      { label: "Engine compartment damage" },
      { label: "Bodywork damage" },
      { label: "Glass damage" },
      { label: "Interior damage" },
      { label: "Mechanical damage" },
    ],
    faqs: [
      { id: "k1", question: "Do you also buy heavily damaged vehicles?", answer: "Yes. We evaluate accident-damaged vehicles regardless of the severity of the damage." },
      { id: "k2", question: "How many days does it take to get a quote for an accident-damaged vehicle?", answer: "We get back to you within 1 hour after your application." },
      { id: "k3", question: "Is a tow truck needed?", answer: "We provide guidance on tow trucks if necessary. We plan the delivery process together." },
      { id: "k4", question: "Do you buy vehicles with an open insurance file?", answer: "Yes. We also evaluate vehicles with open insurance files. We inform you about the process." },
    ],
  },
  "pert-arac-alimi": {
    slug: "pert-arac-alimi",
    title: "Written-Off Vehicle Purchasing",
    shortTitle: "Written-Off",
    metaDescription: "We buy your vehicle declared a total loss by insurance. Get a free quote.",
    hero: {
      badge: "Written-Off",
      heading: "Sell Your Written-Off Vehicle",
      description: "We provide fair valuation for your vehicle declared a total loss by the insurance company. Our team is with you during the paperwork process.",
    },
    problems: [
      { title: "Insurance Total Loss", desc: "Vehicles declared a total loss by insurance" },
      { title: "Heavy Damage", desc: "Vehicles where the repair cost exceeds the vehicle value" },
      { title: "Tow Certificate", desc: "Written-off vehicles with a tow certificate" },
      { title: "Damage Recorded", desc: "Vehicles with a damage record in registration documents" },
    ],
    conditions: [
      { label: "Insurance total loss record" },
      { label: "Heavy structural damage" },
      { label: "High repair cost" },
      { label: "With tow certificate" },
    ],
    faqs: [
      { id: "p1", question: "How do I prepare the written-off vehicle documents?", answer: "Just prepare the insurance total loss document, vehicle registration, and your ID. We guide you through the rest of the process." },
      { id: "p2", question: "Can I get a realistic quote for a written-off vehicle?", answer: "Yes. We offer a fair quote based on market conditions. Our offer is non-binding." },
      { id: "p3", question: "How does the process work with the insurance company?", answer: "The transfer process begins after the total loss procedures are completed. Our team will guide you through this process." },
      { id: "p4", question: "Do you assess the damage on the written-off vehicle?", answer: "We do a preliminary valuation based on photos. A physical inspection is carried out at the delivery stage." },
    ],
  },
  "yanmis-arac-alimi": {
    slug: "yanmis-arac-alimi",
    title: "Fire Damaged Vehicle Purchasing",
    shortTitle: "Fire Damaged",
    metaDescription: "We buy your fire-damaged vehicle at a fair price. Get a free quote.",
    hero: {
      badge: "Fire Damaged",
      heading: "Sell Your Fire Damaged Vehicle at Fair Value",
      description: "We offer a fair quote for vehicles that have suffered fire damage. We evaluate regardless of the vehicle condition.",
    },
    problems: [
      { title: "Partial Fire", desc: "Fire damage in the engine or trunk area" },
      { title: "Total Fire", desc: "Fire damage throughout the vehicle" },
      { title: "Electrical Fire", desc: "Fire caused by an electrical fault" },
      { title: "External Source", desc: "Fire damage caused by an external factor" },
    ],
    conditions: [
      { label: "Partially burnt" },
      { label: "Completely burnt" },
      { label: "Plastic and interior burnt" },
      { label: "Engine burnt" },
    ],
    faqs: [
      { id: "y1", question: "Do you buy completely burnt vehicles?", answer: "Yes. We evaluate regardless of the extent of the vehicle damage." },
      { id: "y2", question: "I received insurance compensation for the burnt vehicle. Can I sell the vehicle?", answer: "You can sell it after completing the insurance process. Call us for details." },
      { id: "y3", question: "How is delivery made if the vehicle cannot move?", answer: "We help with tow truck arrangements. We plan the delivery logistics together." },
      { id: "y4", question: "How much is a burnt vehicle worth?", answer: "It varies depending on the vehicle model, year, and damage condition. Fill out the form for a free valuation." },
    ],
  },
  "sel-hasarli-arac-alimi": {
    slug: "sel-hasarli-arac-alimi",
    title: "Flood Damaged Vehicle Purchasing",
    shortTitle: "Flood Damaged",
    metaDescription: "We buy your flood or water-damaged vehicle at a fair price. Get a free quote.",
    hero: {
      badge: "Flood Damaged",
      heading: "Sell Your Flood Damaged Vehicle",
      description: "We provide a fair valuation for vehicles damaged by flood or water. We pick up your vehicle from its location.",
    },
    problems: [
      { title: "Engine Flooded", desc: "Vehicles with water inside the engine compartment" },
      { title: "Interior Wet", desc: "Water entered the cabin, upholstery and electronics damaged" },
      { title: "Electrical Fault", desc: "Electrical system failure caused by flood water" },
      { title: "Rust and Odor", desc: "Vehicles with rust and musty odor after water damage" },
    ],
    conditions: [
      { label: "Engine flood damage" },
      { label: "Electronic damage" },
      { label: "Upholstery damage" },
      { label: "Rust and damp" },
    ],
    faqs: [
      { id: "s1", question: "Should I wait for insurance compensation for a flood-damaged vehicle?", answer: "You can sell without waiting for the insurance process. We evaluate your compensation situation and offer the best option." },
      { id: "s2", question: "Do you really buy flooded vehicles?", answer: "Yes. We regularly buy flood-damaged vehicles. We evaluate the vehicle condition based on photos." },
      { id: "s3", question: "What should I do if the vehicle is not running?", answer: "We also pick up non-running vehicles. We plan the delivery together." },
      { id: "s4", question: "How is the value of a flood-damaged vehicle determined?", answer: "We value it based on the vehicle age, model, engine condition, and extent of damage." },
    ],
  },
  "hurda-arac-alimi": {
    slug: "hurda-arac-alimi",
    title: "Scrap Vehicle Purchasing",
    shortTitle: "Scrap Vehicle",
    metaDescription: "We buy your scrap vehicle at a fair price. We support you with document processes. Get a free quote.",
    hero: {
      badge: "Scrap Vehicle",
      heading: "Get a Quote for Your Scrap Vehicle",
      description: "We buy vehicles that have completed their economic life. Our team will help you with the scrap certificate process.",
    },
    problems: [
      { title: "Old Model", desc: "Old model vehicles that have lost their economic value" },
      { title: "Not Running", desc: "Vehicles not running due to engine or transmission failure" },
      { title: "Heavy Damage", desc: "Heavily damaged vehicles that are not worth repairing" },
      { title: "Undocumented", desc: "Scrap vehicles with documentation issues" },
    ],
    conditions: [
      { label: "Engine not running" },
      { label: "Bodywork heavily damaged" },
      { label: "Document issue" },
      { label: "Completed economic life" },
    ],
    faqs: [
      { id: "h1", question: "How to get a scrap certificate?", answer: "A scrap certificate is obtained through the Traffic Registration Directorates. We guide you through the process." },
      { id: "h2", question: "How do I deliver a non-running vehicle?", answer: "We help with tow truck support. The vehicle is picked up from its location." },
      { id: "h3", question: "How is the price determined for scrap vehicles?", answer: "Pricing is based on vehicle weight, make, model, and parts value." },
      { id: "h4", question: "Is VAT paid on scrap vehicle sales?", answer: "Tax obligations regarding scrap vehicle sales may vary. Consult our expert for up-to-date information." },
    ],
  },
  "motor-arizali-arac-alimi": {
    slug: "motor-arizali-arac-alimi",
    title: "Engine Failure Vehicle Purchasing",
    shortTitle: "Engine Failure",
    metaDescription: "We buy your vehicle with an engine or transmission failure. Get a free quote.",
    hero: {
      badge: "Engine Failure",
      heading: "Sell Your Engine Failure Vehicle",
      description: "We offer a fair price for vehicles with engine or transmission failure. Sell your vehicle without bearing repair costs.",
    },
    problems: [
      { title: "Engine Damage", desc: "Internal engine fault or hydraulic damage" },
      { title: "Transmission Failure", desc: "Manual or automatic transmission failure" },
      { title: "Turbo Damage", desc: "Turbo compressor failure" },
      { title: "Fuel System", desc: "Fuel pump or injector failure" },
    ],
    conditions: [
      { label: "Engine not running" },
      { label: "Transmission broken" },
      { label: "Overheating engine" },
      { label: "Oil leak" },
    ],
    faqs: [
      { id: "m1", question: "How much can you value vehicles with engine failure?", answer: "We determine the price based on the vehicle model, year, and the condition of other parts." },
      { id: "m2", question: "Is a fault detection report required?", answer: "No, it's not mandatory. But if you have a report, it helps with the valuation." },
      { id: "m3", question: "How is delivery made if the vehicle doesn't move?", answer: "We provide guidance on tow trucks. The vehicle is picked up from its location." },
      { id: "m4", question: "Is it more logical to repair or sell the engine failure?", answer: "It depends on the repair cost. Let us know, we'll evaluate the most logical option together." },
    ],
  },
  "cekme-belgeli-arac-alimi": {
    slug: "cekme-belgeli-arac-alimi",
    title: "Tow Certificate Vehicle Purchasing",
    shortTitle: "Tow Certificate",
    metaDescription: "We buy your tow-certified vehicle. We support you during the paperwork process. Get a free quote.",
    hero: {
      badge: "Tow Certificate",
      heading: "Sell Your Tow Certificate Vehicle",
      description: "We buy vehicles with a tow record. Our team supports you during the registration and transfer process.",
    },
    problems: [
      { title: "Registration Issue", desc: "Vehicles with no or canceled registration certificate" },
      { title: "Insurance Total Loss", desc: "Vehicles with a total loss record in insurance records" },
      { title: "Modified", desc: "Vehicles with a tow certificate due to unauthorized modification" },
      { title: "Heavy Damage Record", desc: "Vehicles with a heavy damage note in the traffic record" },
    ],
    conditions: [
      { label: "Tow certificate available" },
      { label: "Registration canceled" },
      { label: "Insurance total loss record" },
      { label: "Heavy damage record" },
    ],
    faqs: [
      { id: "c1", question: "Is it legal to sell a vehicle with a tow certificate?", answer: "Yes, it can be sold within the framework of legal processes. Our team informs you about legal processes." },
      { id: "c2", question: "What documents are needed for a tow-certified vehicle?", answer: "Vehicle registration, tow certificate, and identity document are required. Call us for details." },
      { id: "c3", question: "How many days does it take to transfer a tow-certified vehicle?", answer: "It can be completed between 1-5 business days depending on the documents." },
      { id: "c4", question: "How is the price determined for a tow-certified vehicle?", answer: "We offer a quote based on the market value according to the vehicle model, age, and current damage." },
    ],
  },
  "agir-hasarli-arac-alimi": {
    slug: "agir-hasarli-arac-alimi",
    title: "Heavily Damaged Vehicle Purchasing",
    shortTitle: "Heavily Damaged",
    metaDescription: "We buy your heavily damaged vehicle at a fair price. Doorstep pickup, fast payment. Get a free quote.",
    hero: {
      badge: "Heavily Damaged",
      heading: "Sell Your Heavily Damaged Vehicle",
      description: "We offer fair quotes for vehicles with severe accident damage. We evaluate regardless of the degree of damage.",
    },
    problems: [
      { title: "Structural Damage", desc: "Serious damage to the chassis or body structure" },
      { title: "Multiple Damage", desc: "Simultaneous heavy damage in multiple areas" },
      { title: "Bodywork Damage", desc: "Major panel and bodywork damage" },
      { title: "Mechanical Damage", desc: "Engine, transmission, and suspension damage" },
    ],
    conditions: [
      { label: "Chassis damage" },
      { label: "Multi-panel damage" },
      { label: "Torque damage" },
      { label: "Vehicle not running" },
    ],
    faqs: [
      { id: "a1", question: "What is the limit for heavy damage?", answer: "If the repair cost exceeds fifty percent of the vehicle value, it is considered heavy damage. We evaluate your vehicle." },
      { id: "a2", question: "Insurance determined heavy damage. What should I do?", answer: "After completing your insurance process, you can apply to us. We will guide you." },
      { id: "a3", question: "How is delivery made if the vehicle cannot move?", answer: "We help with tow truck support. The vehicle is picked up from its location." },
      { id: "a4", question: "Can I get a realistic quote for a heavily damaged vehicle?", answer: "Yes. We offer a fair quote based on the vehicle model and parts value." },
    ],
  },
};
`;

content += '\n' + servicesEn;

fs.writeFileSync('./src/data/services.ts', content);
console.log('src/data/services.ts updated');
