import ring from "../assets/ring.jpg";
import necklace from "../assets/necklace.jpg";
import bracelet from "../assets/bracelet.jpg";
import earrings from "../assets/earrings.jpg";
import solitaire from "../assets/solitaire.jpg";
import lifestyle from "../assets/lifestyle.jpg";

export const images = { ring, necklace, bracelet, earrings, solitaire, lifestyle };

export const METALS = ["18k Yellow Gold", "Rose Gold", "Platinum"];

export const CATEGORIES = ["Rings", "Necklaces", "Bracelets", "Earrings", "Bespoke Solitaires"];

export const PRODUCTS = [];

export const getProduct = () => null;

export const CURRENCIES = {
  INR: { symbol: "₹", rate: 83, country: "India", code: "in", flagEmoji: "🇮🇳" },
  USD: { symbol: "$", rate: 1, country: "United States", code: "us", flagEmoji: "🇺🇸" },
  EUR: { symbol: "€", rate: 0.92, country: "European Union", code: "eu", flagEmoji: "🇪🇺" },
  GBP: { symbol: "£", rate: 0.79, country: "United Kingdom", code: "gb", flagEmoji: "🇬🇧" }
};