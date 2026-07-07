import dotenv from "dotenv";
import pg from "pg";
import { fileURLToPath } from "url";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const AVAILABLE_IMAGES = [
  "avocado toast.jpg",
  "baked cakes.jpg",
  "BBQ chicken pizza.jpg",
  "burger (2).jpg",
  "burger and fries.jpg",
  "burger.jpg",
  "cheese burger.jpg",
  "cheese pizza.jpg",
  "CHEESECAKE.jpg",
  "chicken burger.jpg",
  "chicken kebab.jpg",
  "chicken pizza.jpg",
  "chicken rice.jpg",
  "chicken rice1.jpg",
  "chicken wings (2).jpg",
  "chicken wings.jpg",
  "chocolate brownie.jpg",
  "chocolate cake slice.jpg",
  "classic beef burger.jpg",
  "Coffee Butter Cookies.jpg",
  "coffee.jpg",
  "coffee (2).jpg",
  "cookies.jpg",
  "coleslaw salad.jpg",
  "Crab Curry recipe by Tasmeya.jpg",
  "Crispy Chicken Burger.jpg",
  "crispy potato and chicken bowl - the palatable..jpg",
  "Crispy whole Fried Fish.jpg",
  "Cupcakes.jpg",
  "donut.jpg",
  "double patty burger.jpg",
  "Easy Banana Butter Cake {Light, Moist & Buttery} _ Foodelicacy.jpg",
  "french fries.jpg",
  "Fried Catfish.jpg",
  "fried chicken pieces.jpg",
  "fruit bowl.jpg",
  "fruit smoothie (2).jpg",
  "fruit smoothie.jpg",
  "Garlic bread.jpg",
  "garlic butter fish.jpg",
  "Goatmeat PepperSoup.jpg",
  "Greek coffee.jpg",
  "green vegetable salad.jpg",
  "grilled chicken (2).jpg",
  "grilled chicken (3).jpg",
  "grilled chicken wings.jpg",
  "grilled chicken.jpg",
  "grilled prawns.jpg",
  "Grilled vegetables 1.jpg",
  "grilled vegies.jpg",
  "grilled meat.jpg",
  "grilled meat (2).jpg",
  "grilled meat (3).jpg",
  "healthy.jpg",
  "Hotdog.jpg",
  "Ideal breakfast.jpg",
  "Lemon Loaf Cake With Icing.jpg",
  "milkshakes.jpg",
  "Orange Bread Recipe - Happy Foods Tube.jpg",
  "Perfect Grilled Burgers.jpg",
  "pilau kuku.jpg",
  "pilau.jpg",
  "pizza.jpg",
  "pizza1.jpg",
  "pizza2.jpg",
  "quinoa bowl inspo.jpg",
  "Recipe_ Authentic Chai.jpg",
  "rice with fish.jpg",
  "Sadza, stew and veg.jpg",
  "Salmon Cobb Salad {Whole30, Keto} The Paleo..jpg",
  "sea food platter.jpg",
  "sea food soup.jpg",
  "seafood.jpg",
  "soda.jpg",
  "sodas.jpg",
  "sodass.jpg",
  "Starbucks Cheesecake Frappuccinos Exist in 3 Mouthwatering Flavors, but There's a Catch.jpg",
  "stew.jpg",
  "Sweet Sticky Spicy Chicken.jpg",
  "Tanzania food.jpg",
  "tea cup.jpg",
  "Vanilla Iced Coffee.jpg",
  "Vanilla Sponge Cake.jpg",
  "vegie pizza.jpg",
  "Watermelon Slushie Recipe (Only 4 Ingredients!)..jpg",
  "White Bread Recipe _ Brown Eyed Baker.jpg",
  "Wings with fries_chips and salad.jpg",
  "Yoghurt bowl with fruits.jpg",
];

const KEYWORD_IMAGE_MAP = [
  // Specific multi-word items first
  {
    keywords: ["avocado toast"],
    images: ["avocado toast.jpg"],
  },
  {
    keywords: ["chicken burger"],
    images: ["chicken burger.jpg", "Crispy Chicken Burger.jpg"],
  },
  {
    keywords: ["chicken rice", "pilau kuku", "rice chicken"],
    images: ["chicken rice.jpg", "chicken rice1.jpg", "pilau kuku.jpg"],
  },
  {
    keywords: ["chicken soup", "pepper soup", "goat soup"],
    images: ["Goatmeat PepperSoup.jpg", "Chicken pepper soup.jpg"],
  },
  {
    keywords: ["ceylon cinnamon tea", "herbal tea", "chai tea", "authentic chai"],
    images: ["Ceylon Cinnamon Tea.jpg", "Recipe_ Authentic Chai.jpg", "tea cup.jpg", "Greek coffee.jpg"],
  },
  {
    keywords: ["coffee butter cookies", "butter cookies"],
    images: ["Coffee Butter Cookies.jpg", "cookies.jpg"],
  },
  {
    keywords: ["fruit bowl"],
    images: ["fruit bowl.jpg"],
  },
  {
    keywords: ["fruit smoothie", "watermelon slushie"],
    images: ["fruit smoothie.jpg", "fruit smoothie (2).jpg", "Watermelon Slushie Recipe (Only 4 Ingredients!)..jpg"],
  },
  {
    keywords: ["garlic bread"],
    images: ["Garlic bread.jpg"],
  },
  {
    keywords: ["garlic fish"],
    images: ["garlic butter fish.jpg"],
  },
  {
    keywords: ["green salad", "veg salad"],
    images: ["green vegetable salad.jpg", "Salmon Cobb Salad {Whole30, Keto} The Paleo..jpg"],
  },
  {
    keywords: ["grilled chicken"],
    images: ["grilled chicken.jpg", "grilled chicken (2).jpg", "grilled chicken (3).jpg", "grilled chicken wings.jpg"],
  },
  {
    keywords: ["grilled fish", "fried fish"],
    images: ["garlic butter fish.jpg", "Fried Catfish.jpg", "Crispy whole Fried Fish.jpg", "fish.jpg", "rice with fish.jpg"],
  },
  {
    keywords: ["grilled meat", "nyama choma", "roast meat", "bbq meat"],
    images: ["grilled meat.jpg", "grilled meat (2).jpg", "grilled meat (3).jpg"],
  },
  {
    keywords: ["grilled vegetable", "grilled veg"],
    images: ["Grilled vegetables 1.jpg", "grilled vegies.jpg"],
  },
  {
    keywords: ["hot dog", "hotdog"],
    images: ["Hotdog.jpg"],
  },
  {
    keywords: ["quinoa bowl", "healthy bowl"],
    images: ["quinoa bowl inspo.jpg", "healthy.jpg"],
  },
  {
    keywords: ["rice beef", "beef rice", "rice and beef"],
    images: ["rice_beef.jpg", "wali nyama.jpg"],
  },
  {
    keywords: ["seafood platter", "seafood soup", "sea food"],
    images: ["seafood.jpg", "sea food platter.jpg", "sea food soup.jpg"],
  },
  {
    keywords: ["ugali beef", "ugali nyama", "ugali"],
    images: ["ugali.jpg", "ugali nyama.jpg", "ugali with grilled meat.jpg", "ugali, vegies and meat.jpg", "Sadza, stew and veg.jpg"],
  },
  {
    keywords: ["yoghurt bowl", "yogurt bowl"],
    images: ["Yoghurt bowl with fruits.jpg"],
  },
  // Broader single-keyword groups
  {
    keywords: ["americano", "cappuccino", "espresso", "latte", "mocha"],
    images: ["coffee.jpg", "coffee (2).jpg", "Vanilla Iced Coffee.jpg"],
  },
  {
    keywords: ["coffee"],
    images: ["coffee.jpg", "coffee (2).jpg", "Vanilla Iced Coffee.jpg", "Greek coffee.jpg"],
  },
  {
    keywords: ["tea"],
    images: ["Ceylon Cinnamon Tea.jpg", "Recipe_ Authentic Chai.jpg", "tea cup.jpg", "Greek coffee.jpg"],
  },
  {
    keywords: ["cheesecake"],
    images: ["CHEESECAKE.jpg", "Starbucks Cheesecake Frappuccinos Exist in 3 Mouthwatering Flavors, but There's a Catch.jpg"],
  },
  {
    keywords: ["brownie"],
    images: ["chocolate brownie.jpg"],
  },
  {
    keywords: ["chocolate cake", "chocolate"],
    images: ["chocolate cake slice.jpg", "chocolate brownie.jpg"],
  },
  {
    keywords: ["vanilla cake", "sponge cake", "lemon loaf", "cake"],
    images: ["Vanilla Sponge Cake.jpg", "Lemon Loaf Cake With Icing.jpg", "Easy Banana Butter Cake {Light, Moist & Buttery} _ Foodelicacy.jpg", "baked cakes.jpg"],
  },
  {
    keywords: ["cookie"],
    images: ["cookies.jpg", "Coffee Butter Cookies.jpg"],
  },
  {
    keywords: ["cupcake"],
    images: ["Cupcakes.jpg"],
  },
  {
    keywords: ["donut"],
    images: ["donut.jpg"],
  },
  {
    keywords: ["smoothie", "slushie"],
    images: ["fruit smoothie.jpg", "fruit smoothie (2).jpg", "Watermelon Slushie Recipe (Only 4 Ingredients!)..jpg"],
  },
  {
    keywords: ["milkshake"],
    images: ["milkshakes.jpg", "Vanilla Iced Coffee.jpg"],
  },
  {
    keywords: ["yoghurt", "yogurt"],
    images: ["Yoghurt bowl with fruits.jpg"],
  },
  {
    keywords: ["avocado"],
    images: ["avocado toast.jpg"],
  },
  {
    keywords: ["fruit"],
    images: ["fruit bowl.jpg", "fruit smoothie.jpg", "fruit smoothie (2).jpg"],
  },
  {
    keywords: ["salad", "sukuma", "greens", "coleslaw"],
    images: ["green vegetable salad.jpg", "coleslaw salad.jpg", "Grilled vegetables 1.jpg", "grilled vegies.jpg", "Sadza, stew and veg.jpg"],
  },
  {
    keywords: ["pizza", "margherita", "pepperoni", "cheese burst", "veggie pizza"],
    images: ["pizza1.jpg", "pizza2.jpg", "pizza.jpg", "cheese pizza.jpg", "BBQ chicken pizza.jpg", "vegie pizza.jpg", "chicken pizza.jpg"],
  },
  {
    keywords: ["bread"],
    images: ["Garlic bread.jpg", "White Bread Recipe _ Brown Eyed Baker.jpg", "Orange Bread Recipe - Happy Foods Tube.jpg"],
  },
  {
    keywords: ["cheeseburger", "double burger", "classic burger", "burger"],
    images: ["burger.jpg", "burger (2).jpg", "cheese burger.jpg", "double patty burger.jpg", "classic beef burger.jpg", "burger and fries.jpg", "Perfect Grilled Burgers.jpg"],
  },
  {
    keywords: ["fries", "chips", "chips mayai"],
    images: ["french fries.jpg", "Wings with fries_chips and salad.jpg"],
  },
  {
    keywords: ["fried chicken", "chicken wings"],
    images: ["fried chicken pieces.jpg", "chicken wings.jpg", "chicken wings (2).jpg"],
  },
  {
    keywords: ["chicken"],
    images: ["grilled chicken.jpg", "grilled chicken (2).jpg", "grilled chicken (3).jpg", "fried chicken pieces.jpg", "chicken wings.jpg", "chicken wings (2).jpg", "Sweet Sticky Spicy Chicken.jpg"],
  },
  {
    keywords: ["beef stew", "chicken stew", "stew"],
    images: ["stew.jpg", "Sweet Sticky Spicy Chicken.jpg", "Tanzania food.jpg"],
  },
  {
    keywords: ["prawns", "shrimp"],
    images: ["grilled prawns.jpg", "Fried Catfish.jpg"],
  },
  {
    keywords: ["crab", "crab curry"],
    images: ["Crab Curry recipe by Tasmeya.jpg"],
  },
  {
    keywords: ["fish"],
    images: ["garlic butter fish.jpg", "Fried Catfish.jpg", "Crispy whole Fried Fish.jpg", "fish.jpg", "rice with fish.jpg"],
  },
  {
    keywords: ["rice"],
    images: ["chicken rice.jpg", "chicken rice1.jpg", "pilau.jpg", "pilau kuku.jpg", "rice with fish.jpg", "rice_beef.jpg"],
  },
  {
    keywords: ["soda", "soft drink"],
    images: ["soda.jpg", "sodas.jpg", "sodass.jpg"],
  },
];

// Flatten and sort keywords so longer, more specific keywords match first
const SORTED_KEYWORD_MAP = KEYWORD_IMAGE_MAP
  .flatMap((group) => group.keywords.map((keyword) => ({ keyword, images: group.images })))
  .sort((a, b) => b.keyword.length - a.keyword.length);

const COFFEE_CORNER_MENU = [
  { name: "Espresso", price: 3500, description: "Strong and rich single shot espresso", image: "coffee.jpg" },
  { name: "Cappuccino", price: 5500, description: "Espresso with steamed milk and foam", image: "coffee (2).jpg" },
  { name: "Ceylon Cinnamon Tea", price: 4000, description: "Fragrant spiced tea", image: "Ceylon Cinnamon Tea.jpg" },
  { name: "Herbal Tea", price: 3800, description: "Calming herbal blend", image: "Greek coffee.jpg" },
  { name: "Vanilla Sponge Cake", price: 6000, description: "Light and fluffy vanilla cake", image: "Vanilla Sponge Cake.jpg" },
  { name: "Chocolate Cake", price: 6500, description: "Rich chocolate cake slice", image: "chocolate cake slice.jpg" },
  { name: "Cheesecake", price: 7000, description: "Creamy classic cheesecake", image: "CHEESECAKE.jpg" },
  { name: "Coffee Butter Cookies", price: 4500, description: "Buttery cookies with coffee", image: "Coffee Butter Cookies.jpg" },
  { name: "Fruit Smoothie", price: 7500, description: "Blended fresh fruit smoothie", image: "fruit smoothie.jpg" },
  { name: "Milkshake", price: 8000, description: "Creamy vanilla milkshake", image: "milkshakes.jpg" },
  { name: "Avocado Toast", price: 9000, description: "Toasted bread with ripe avocado", image: "avocado toast.jpg" },
  { name: "Yoghurt Bowl with Fruits", price: 8500, description: "Creamy yoghurt topped with fresh fruits", image: "Yoghurt bowl with fruits.jpg" },
];

function normalize(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, " ");
}

function findKeywordMatch(name, usedImages) {
  const normalizedName = normalize(name);

  for (const { keyword, images } of SORTED_KEYWORD_MAP) {
    if (normalizedName.includes(normalize(keyword))) {
      const available = images.find((img) => !usedImages.has(img));
      if (available) return available;
    }
  }

  return null;
}

function tokenize(value) {
  return normalize(value).split(/\s+/).filter(Boolean);
}

function scoreMatch(name, filename) {
  const nameTokens = tokenize(name);
  const filenameTokens = tokenize(filename);
  if (nameTokens.length === 0 || filenameTokens.length === 0) return 0;

  const matches = nameTokens.filter((token) =>
    filenameTokens.some(
      (fileToken) => fileToken.includes(token) || token.includes(fileToken)
    )
  );

  return matches.length / nameTokens.length;
}

function findBestImage(name, usedImages) {
  // Prefer keyword-based mapping for relevance
  const keywordMatch = findKeywordMatch(name, usedImages);
  if (keywordMatch) return keywordMatch;

  // Fallback to fuzzy token matching
  let bestMatch = null;
  let bestScore = 0;

  for (const filename of AVAILABLE_IMAGES) {
    if (usedImages.has(filename)) continue;
    const score = scoreMatch(name, filename);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = filename;
    }
  }

  if (bestMatch) return bestMatch;

  // Last resort: first unused image
  const unused = AVAILABLE_IMAGES.find((filename) => !usedImages.has(filename));
  return unused || AVAILABLE_IMAGES[0];
}

async function run() {
  try {
    const client = await pool.connect();

    try {
      // 1. Add Coffee Corner menu if empty
      const coffeeResult = await client.query(
        "SELECT id FROM restaurants WHERE LOWER(name) = LOWER($1)",
        ["Coffee Corner"]
      );

      if (coffeeResult.rows.length === 0) {
        console.log("Coffee Corner restaurant not found.");
        return;
      }

      const coffeeCornerId = coffeeResult.rows[0].id;
      const existingMenu = await client.query(
        "SELECT COUNT(*)::int AS count FROM menu_items WHERE restaurant_id = $1",
        [coffeeCornerId]
      );

      if (existingMenu.rows[0].count === 0) {
        for (const item of COFFEE_CORNER_MENU) {
          await client.query(
            `INSERT INTO menu_items (restaurant_id, name, description, price, image, available)
             VALUES ($1, $2, $3, $4, $5, true)`,
            [coffeeCornerId, item.name, item.description, item.price, item.image]
          );
        }
        console.log(`Added ${COFFEE_CORNER_MENU.length} items to Coffee Corner.`);
      } else {
        console.log("Coffee Corner already has menu items. Skipping insert.");
      }

      // 2. Fix missing or invalid images and ensure uniqueness per restaurant
      const menuResult = await client.query(
        `SELECT mi.id, mi.name, mi.image, mi.restaurant_id, r.name AS restaurant_name
         FROM menu_items mi
         JOIN restaurants r ON mi.restaurant_id = r.id
         ORDER BY mi.restaurant_id, mi.id`
      );

      const itemsByRestaurant = new Map();
      for (const item of menuResult.rows) {
        if (!itemsByRestaurant.has(item.restaurant_id)) {
          itemsByRestaurant.set(item.restaurant_id, []);
        }
        itemsByRestaurant.get(item.restaurant_id).push(item);
      }

      for (const [restaurantId, items] of itemsByRestaurant) {
        const usedImages = new Set();

        for (const item of items) {
          const newImage = findBestImage(item.name, usedImages);
          usedImages.add(newImage);
          await client.query(
            "UPDATE menu_items SET image = $1 WHERE id = $2",
            [newImage, item.id]
          );
          if (item.image !== newImage) {
            console.log(
              `Updated "${item.name}" in ${item.restaurant_name}: ${item.image || "(none)"} -> ${newImage}`
            );
          }
        }
      }

      console.log("Menu image population complete.");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Failed to populate menu images:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

const isMain = fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  run();
}

export default run;
