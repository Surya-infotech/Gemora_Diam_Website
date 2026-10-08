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
  USD: { symbol: "$", rate: 1 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
  INR: { symbol: "₹", rate: 83 }
};
