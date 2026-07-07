const MENU_IMAGES = [
  "avocado toast.jpg",
  "baked cakes.jpg",
  "BBQ chicken pizza.jpg",
  "burger.jpg",
  "cheese burger.jpg",
  "cheese pizza.jpg",
  "CHEESECAKE.jpg",
  "chicken burger.jpg",
  "chicken pizza.jpg",
  "chicken rice.jpg",
  "chicken rice1.jpg",
  "chicken wings (2).jpg",
  "chicken wings.jpg",
  "chocolate brownie.jpg",
  "chocolate cake slice.jpg",
  "classic beef burger.jpg",
  "Coffee Butter Cookies.jpg",
  "cookies.jpg",
  "coleslaw salad.jpg",
  "Crab Curry recipe by Tasmeya.jpg",
  "Crispy Chicken Burger.jpg",
  "Cupcakes.jpg",
  "donut.jpg",
  "double patty burger.jpg",
  "french fries.jpg",
  "fried chicken pieces.jpg",
  "fruit bowl.jpg",
  "fruit smoothie (2).jpg",
  "fruit smoothie.jpg",
  "Garlic bread.jpg",
  "garlic butter fish.jpg",
  "green vegetable salad.jpg",
  "grilled chicken wings.jpg",
  "grilled chicken.jpg",
  "grilled prawns.jpg",
  "Grilled vegetables 1.jpg",
  "grilled vegies.jpg",
  "Hotdog.jpg",
  "milkshakes.jpg",
  "quinoa bowl inspo.jpg",
  "sea food platter.jpg",
  "sea food soup.jpg",
  "soda.jpg",
  "sodas.jpg",
  "sodass.jpg",
  "tea cup.jpg",
  "Vanilla Sponge Cake.jpg",
  "vegie pizza.jpg",
  "Yoghurt bowl with fruits.jpg",
  "Ceylon Cinnamon Tea.jpg",
  "Chicken pepper soup.jpg",
  "Tanzania food.jpg",
];

function normalize(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ");
}

function tokenize(value) {
  return normalize(value).split(/\s+/).filter(Boolean);
}

function scoreMatch(name, filename) {
  const nameTokens = tokenize(name);
  const filenameTokens = tokenize(filename);
  if (nameTokens.length === 0 || filenameTokens.length === 0) return 0;

  const matches = nameTokens.filter((token) =>
    filenameTokens.some((fileToken) => fileToken.includes(token) || token.includes(fileToken))
  );

  return matches.length / nameTokens.length;
}

export function resolveMenuImage(name, explicitImage) {
  if (explicitImage) return explicitImage;
  if (!name) return null;

  let bestMatch = null;
  let bestScore = 0;

  for (const filename of MENU_IMAGES) {
    const score = scoreMatch(name, filename);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = filename;
    }
  }

  return bestScore >= 0.5 ? bestMatch : null;
}
