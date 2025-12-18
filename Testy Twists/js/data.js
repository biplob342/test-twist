// Food data for Testy Twists online food ordering website
// Contains all menu items with their details

/**
 * Array of food items available on the menu
 * Each item contains: id, name, category, price, description, image
 */
const foods = [
  // Fast Food Items (matching menu.html)
  {
    id: 1,
    name: "Classic Cheeseburger",
    category: "fast-food",
    price: 450,
    description: "Juicy beef patty with melted cheese, lettuce, and tomato",
    image: "./image/burger.jpeg"
  },
  {
    id: 2,
    name: "Margherita Pizza",
    category: "fast-food",
    price: 650,
    description: "Fresh mozzarella, basil, and tomato sauce on crispy crust",
    image: "./image/pizza.jpeg"
  },
  {
    id: 3,
    name: "Chiken Drum Stick",
    category: "fast-food",
    price: 320,
    description: "Grilled Chicken with smash potato, mustard, and relish",
    image: "./image/chickenlollypop.jpeg"
  },
  {
    id: 4,
    name: "Fried Rice",
    category: "fast-food",
    price: 250,
    description: "Golden fried potatoes with a side of ketchup",
    image: "./image/friedrice.jpeg"
  },

  // Drinks
  {
    id: 5,
    name: "Virgin Blue Mojito",
    category: "drinks",
    price: 180,
    description: "Refreshing carbonated soft drink",
    image: "./image/drinks3.jpeg"
  },
  {
    id: 6,
    name: "Fresh Lemonade",
    category: "drinks",
    price: 140,
    description: "Homemade lemonade with real lemons",
    image: "./image/drinks4.jpeg"
  },
  {
    id: 7,
    name: "Classic Orange Juice",
    category: "drinks",
    price: 280,
    description: "Fresh orange juice with real oranges",
    image: "./image/drinks2.jpeg"
  },
  {
    id: 8,
    name: "Iced Chocklete Coffee",
    category: "drinks",
    price: 160,
    description: "Cold brew coffee with ice and cream and chocolate",
    image: "./image/coldcoffe.jpeg"
  },

  // Desserts
  {
    id: 9,
    name: "Chocolate Oreo Shake",
    category: "desserts",
    price: 280,
    description: "Chocolate Oreo Shake with ice cream and chocolate",
    image: "./image/shake3.jpeg"
  },
  {
    id: 10,
    name: "Strawberry Ice Cream",
    category: "desserts",
    price: 250,
    description: "Creamy strawberry ice cream with strawberry sauce",
    image: "./image/shake.jpeg"
  },
  {
    id: 11,
    name: "New York Cheesecake",
    category: "desserts",
    price: 320,
    description: "Rich and creamy cheesecake with graham cracker crust",
    image: "./image/cheesecake.jpg"
  },
  {
    id: 12,
    name: "Fudge Brownie",
    category: "desserts",
    price: 280,
    description: "Dense chocolate brownie with walnuts",
    image: "./image/briwnies.webp"
  },

  // Additional items (keeping for data compatibility)
  {
    id: 13,
    name: "Caesar Salad",
    category: "salads",
    price: 350,
    description: "Romaine lettuce, croutons, parmesan, and Caesar dressing",
    image: "./image/pasta.jpeg"
  },
  {
    id: 14,
    name: "Greek Salad",
    category: "salads",
    price: 400,
    description: "Tomatoes, cucumbers, olives, feta cheese, and olive oil",
    image: "./image/pasta2.jpeg"
  },
  {
    id: 15,
    name: "Garden Salad",
    category: "salads",
    price: 320,
    description: "Mixed greens, tomatoes, cucumbers, and balsamic vinaigrette",
    image: "./image/pasta3.jpeg"
  },
  {
    id: 16,
    name: "Chicken Avocado Salad",
    category: "salads",
    price: 480,
    description: "Grilled chicken, avocado, mixed greens, and honey mustard",
    image: "./image/chickenitem.jpeg"
  },
  {
    id: 17,
    name: "Chocolate Cake",
    category: "desserts",
    price: 280,
    description: "Rich chocolate cake with chocolate frosting",
    image: "./image/icecream.jpeg"
  },
  {
    id: 18,
    name: "Cheesecake",
    category: "desserts",
    price: 320,
    description: "Creamy New York style cheesecake with berry compote",
    image: "./image/icecream2.jpeg"
  },
  {
    id: 19,
    name: "Tiramisu",
    category: "desserts",
    price: 320,
    description: "Classic Italian dessert with coffee and mascarpone",
    image: "./image/shake2.jpeg"
  },
  {
    id: 20,
    name: "Ice Cream Sundae",
    category: "desserts",
    price: 250,
    description: "Vanilla ice cream with chocolate sauce and whipped cream",
    image: "./image/drinks.jpeg"
  },
  {
    id: 21,
    name: "Coca Cola",
    category: "drinks",
    price: 120,
    description: "Classic Coca Cola soft drink",
    image: "./image/drinks.jpeg"
  },
  {
    id: 22,
    name: "Fresh Orange Juice",
    category: "drinks",
    price: 200,
    description: "Freshly squeezed orange juice",
    image: "./image/drinks2.jpeg"
  },
  {
    id: 23,
    name: "Iced Coffee",
    category: "drinks",
    price: 160,
    description: "Cold brew coffee with ice",
    image: "./image/coldcoffe.jpeg"
  },
  {
    id: 24,
    name: "Lemonade",
    category: "drinks",
    price: 140,
    description: "Homemade fresh lemonade",
    image: "./image/drinks4.jpeg"
  }
];

/**
 * Get all unique categories from the foods array
 * @returns {Array} Array of unique category names
 */
function getCategories() {
  const categories = foods.map(food => food.category);
  return [...new Set(categories)];
}

/**
 * Get foods by category
 * @param {string} category - The category to filter by
 * @returns {Array} Array of food items in the specified category
 */
function getFoodsByCategory(category) {
  if (category === 'all') {
    return foods;
  }
  return foods.filter(food => food.category === category);
}

/**
 * Get a single food item by ID
 * @param {number} id - The ID of the food item
 * @returns {Object|undefined} The food item or undefined if not found
 */
function getFoodById(id) {
  return foods.find(food => food.id === id);
}
