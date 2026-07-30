export interface CustomizationOption {
  id: string;
  name: string;
  priceAdd: number;
}

export interface CustomizationGroup {
  id: string;
  title: string;
  type: "single" | "multiple";
  required: boolean;
  options: CustomizationOption[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  customizations?: CustomizationGroup[];
}

export const categories = ["Sandwiches", "Kebabs", "Burgers", "Toasties", "Snacks", "Halal Snack", "More"];

export const products: Product[] = [
  {
    id: "1",
    name: "Egg and Bacon Toastie",
    description: "Freshly toasted bread with free-range eggs and crispy bacon",
    price: 9.99,
    category: "Toasties",
    image: "/images/products/1.png",
    customizations: [
      {
        id: "bread",
        title: "Toastie Bread Selection",
        type: "single",
        required: true,
        options: [
          { id: "grilled-panini", name: "Grilled Panini", priceAdd: 3.99 },
          { id: "sourdough", name: "Sourdough", priceAdd: 2.99 }
        ]
      },
      {
        id: "addons",
        title: "Sandwich Add-ons",
        type: "multiple",
        required: false,
        options: [
          { id: "bacon", name: "Bacon", priceAdd: 1.99 },
          { id: "beetroot", name: "Beetroot", priceAdd: 1.99 }
        ]
      },
      {
        id: "cheese",
        title: "Sandwich Cheese Choice",
        type: "single",
        required: false,
        options: [
          { id: "american-cheese", name: "American Cheese", priceAdd: 1.00 }
        ]
      },
      {
        id: "recommended",
        title: "Recommended Add On Snacks",
        type: "multiple",
        required: false,
        options: [
          { id: "potato-cake", name: "Cheese and Bacon Potato Cake", priceAdd: 3.99 },
          { id: "sweet", name: "Something Sweet up Along", priceAdd: 0 },
          { id: "chocolate-mousse", name: "Chocolate Mousse", priceAdd: 8.99 }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Double Egg & Double Bacon Sandwich",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a...",
    price: 14.99,
    category: "Sandwiches",
    image: "/images/products/2.png",
    customizations: [
      {
        id: "bread",
        title: "Bread Selection",
        type: "single",
        required: true,
        options: [
          { id: "white", name: "White Bread", priceAdd: 0 },
          { id: "wholemeal", name: "Wholemeal", priceAdd: 0.50 },
          { id: "sourdough", name: "Sourdough", priceAdd: 1.50 }
        ]
      },
      {
        id: "cheese",
        title: "Add Cheese",
        type: "multiple",
        required: false,
        options: [
          { id: "cheddar", name: "Cheddar", priceAdd: 1.00 },
          { id: "swiss", name: "Swiss", priceAdd: 1.00 }
        ]
      }
    ]
  },
  {
    id: "3",
    name: "Meat Lover Sandwich",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a...",
    price: 15.99,
    category: "Sandwiches",
    image: "/images/products/3.png",
    customizations: [
      {
        id: "bread",
        title: "Bread Selection",
        type: "single",
        required: true,
        options: [
          { id: "white", name: "White Bread", priceAdd: 0 },
          { id: "wholemeal", name: "Wholemeal", priceAdd: 0.50 },
          { id: "sourdough", name: "Sourdough", priceAdd: 1.50 }
        ]
      }
    ]
  },
  {
    id: "4",
    name: "Cheesy Paneer Sandwich",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a...",
    price: 15.99,
    category: "Sandwiches",
    image: "/images/products/4.png",
    customizations: [
      {
        id: "spice",
        title: "Spice Level",
        type: "single",
        required: true,
        options: [
          { id: "mild", name: "Mild", priceAdd: 0 },
          { id: "medium", name: "Medium", priceAdd: 0 },
          { id: "hot", name: "Hot", priceAdd: 0 }
        ]
      }
    ]
  },
  {
    id: "5",
    name: "Double Egg & Bacon Sandwich",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a...",
    price: 14.99,
    category: "Sandwiches",
    image: "/images/products/5.png"
  },
  {
    id: "6",
    name: "Cheesy Paneer Sandwich",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a...",
    price: 15.99,
    category: "Sandwiches",
    image: "/images/products/6.png"
  },
  {
    id: "7",
    name: "Double Egg & Double Bacon Sandwich",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a...",
    price: 14.99,
    category: "Sandwiches",
    image: "/images/products/7.png"
  },
  {
    id: "8",
    name: "Meat Lover Sandwich",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a...",
    price: 15.99,
    category: "Sandwiches",
    image: "/images/products/8.png"
  },
  {
    id: "9",
    name: "Cheesy Paneer Sandwich",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a...",
    price: 15.99,
    category: "Sandwiches",
    image: "/images/products/9.png"
  },
  {
    id: "10",
    name: "Double Egg & Bacon Sandwich",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a...",
    price: 14.99,
    category: "Sandwiches",
    image: "/images/products/10.png"
  }
];