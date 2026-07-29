import { getDb } from "../api/queries/connection";
import { menuItems } from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  const existing = await db.select().from(menuItems);
  if (existing.length > 0) {
    console.log(`Menu already has ${existing.length} items — skipping seed.`);
    process.exit(0);
  }

  await db.insert(menuItems).values([
    // --- Aparatifler / Appetizers ---
    {
      category: "aparatif",
      nameTr: "Sigara Böreği",
      nameEn: "Crispy Cheese Rolls",
      price: "180",
      ingredientsTr: "Yufka, beyaz peynir, maydanoz. Yanında süzme yoğurt ile servis edilir.",
      ingredientsEn: "Thin pastry, white cheese, parsley. Served with strained yogurt.",
      sortOrder: 1,
    },
    {
      category: "aparatif",
      nameTr: "Patates Kızartması",
      nameEn: "French Fries",
      price: "150",
      ingredientsTr: "El kesimi patates, deniz tuzu. Ketçap ve mayonez ile.",
      ingredientsEn: "Hand-cut potatoes, sea salt. With ketchup and mayonnaise.",
      sortOrder: 2,
    },
    {
      category: "aparatif",
      nameTr: "Soğan Halkası",
      nameEn: "Onion Rings",
      price: "170",
      ingredientsTr: "Soğan, galeta unu, baharat karışımı. Çıtır kaplama ile kızartılır.",
      ingredientsEn: "Onion, breadcrumbs, spice mix. Fried with a crispy coating.",
      sortOrder: 3,
    },
    // --- Pizza ---
    {
      category: "pizza",
      nameTr: "Margherita",
      nameEn: "Margherita",
      price: "320",
      ingredientsTr: "Domates sosu, mozzarella, taze fesleğen, zeytinyağı.",
      ingredientsEn: "Tomato sauce, mozzarella, fresh basil, olive oil.",
      sortOrder: 1,
    },
    {
      category: "pizza",
      nameTr: "Karışık Pizza",
      nameEn: "Mixed Pizza",
      price: "380",
      ingredientsTr: "Domates sosu, mozzarella, sucuk, sosis, mantar, yeşil biber, mısır.",
      ingredientsEn: "Tomato sauce, mozzarella, Turkish pepperoni, sausage, mushroom, green pepper, corn.",
      sortOrder: 2,
    },
    {
      category: "pizza",
      nameTr: "Akdeniz Pizza",
      nameEn: "Mediterranean Pizza",
      price: "360",
      ingredientsTr: "Domates sosu, mozzarella, beyaz peynir, zeytin, cherry domates, roka.",
      ingredientsEn: "Tomato sauce, mozzarella, feta, olives, cherry tomatoes, arugula.",
      sortOrder: 3,
    },
    // --- Mantı ---
    {
      category: "manti",
      nameTr: "Klasik Mantı",
      nameEn: "Classic Manti",
      price: "280",
      ingredientsTr: "El açması hamur, kıymalı iç harç, sarımsaklı yoğurt, kızdırılmış tereyağı ve pul biber.",
      ingredientsEn: "Hand-rolled dough, minced beef filling, garlic yogurt, melted butter and chili flakes.",
      sortOrder: 1,
    },
    {
      category: "manti",
      nameTr: "Çıtır Mantı",
      nameEn: "Crispy Fried Manti",
      price: "300",
      ingredientsTr: "Kızarmış mantı, yoğurt sos, nane ve sumak ile servis edilir.",
      ingredientsEn: "Fried manti, yogurt sauce, served with mint and sumac.",
      sortOrder: 2,
    },
    {
      category: "manti",
      nameTr: "Domates Soslu Mantı",
      nameEn: "Manti with Tomato Sauce",
      price: "290",
      ingredientsTr: "Haşlanmış mantı, domates sos, sarımsaklı yoğurt, tereyağı.",
      ingredientsEn: "Boiled manti, tomato sauce, garlic yogurt, butter.",
      sortOrder: 3,
    },
    // --- Hamburger ---
    {
      category: "hamburger",
      nameTr: "Klasik Burger",
      nameEn: "Classic Burger",
      price: "290",
      ingredientsTr: "Dana köfte, marul, domates, turşu, burger sos, patates kızartması ile.",
      ingredientsEn: "Beef patty, lettuce, tomato, pickles, burger sauce, served with fries.",
      sortOrder: 1,
    },
    {
      category: "hamburger",
      nameTr: "Cheeseburger",
      nameEn: "Cheeseburger",
      price: "320",
      ingredientsTr: "Dana köfte, cheddar peyniri, karamelize soğan, marul, domates, özel sos.",
      ingredientsEn: "Beef patty, cheddar cheese, caramelized onion, lettuce, tomato, special sauce.",
      sortOrder: 2,
    },
    {
      category: "hamburger",
      nameTr: "Double Burger",
      nameEn: "Double Burger",
      price: "380",
      ingredientsTr: "Çift dana köfte, çift cheddar, füme et, turşu, barbekü sos.",
      ingredientsEn: "Double beef patty, double cheddar, pastrami, pickles, BBQ sauce.",
      sortOrder: 3,
    },
    // --- İçecekler / Drinks ---
    {
      category: "icecek",
      nameTr: "Taze Sıkılmış Portakal Suyu",
      nameEn: "Fresh Squeezed Orange Juice",
      price: "150",
      ingredientsTr: "Günlük taze portakallar ile hazırlanır.",
      ingredientsEn: "Made daily with fresh oranges.",
      sortOrder: 1,
    },
    {
      category: "icecek",
      nameTr: "Ayran",
      nameEn: "Ayran",
      price: "60",
      ingredientsTr: "Geleneksel yoğurt içeceği.",
      ingredientsEn: "Traditional Turkish yogurt drink.",
      sortOrder: 2,
    },
    {
      category: "icecek",
      nameTr: "Buz Gibi Limonata",
      nameEn: "Ice Cold Lemonade",
      price: "120",
      ingredientsTr: "Taze limon, nane, buz. Ev yapımı.",
      ingredientsEn: "Fresh lemon, mint, ice. Homemade.",
      sortOrder: 3,
    },
  ]);

  console.log("Done.");
  process.exit(0);
}

seed();
