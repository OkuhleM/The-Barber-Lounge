import MarcusImage from "../Assets/Marcus.jpeg";
import DanielImage from "../Assets/Daniel.jpeg";
import ThaboImage from "../Assets/Thabo.jpeg";


export const services = [
  {
    id: "1",
    name: "Classic Cut",
    price: 250,
    duration: 45,
    durationLabel: "45 MIN",
    description: "A clean, timeless cut finished with precision.",
  },
  {
    id: "2",
    name: "Skin Fade",
    price: 300,
    duration: 60,
    durationLabel: "60 MIN",
    description: "A sharp skin fade blended to perfection.",
  },
  {
    id: "3",
    name: "Beard Trim",
    price: 150,
    duration: 30,
    durationLabel: "30 MIN",
    description: "Shape, trim and define your beard.",
  },
  {
    id: "4",
    name: "Cut & Beard",
    price: 380,
    duration: 75,
    durationLabel: "75 MIN",
    description: "A precision haircut paired with a detailed beard trim.",
  },
  {
    id: "5",
    name: "Kids Cut",
    price: 180,
    duration: 30,
    durationLabel: "30 MIN",
    description: "A fresh, comfortable cut for the younger ones.",
  },
  {
    id: "6",
    name: "The Full Groom",
    price: 500,
    duration: 90,
    durationLabel: "90 MIN",
    description: "The complete grooming experience from cut to finish.",
  },
];

export const barbers = [
  {
    id: "marcus",
    name: "Marcus Williams",
    role: "MASTER BARBER",
    specialty: "Fades · Precision Cuts · Beard Design",
    image: MarcusImage,
  },
  {
    id: "daniel",
    name: "Daniel Mokoena",
    role: "SENIOR BARBER",
    specialty: "Classic Cuts · Styling · Grooming",
    image: DanielImage,
  },
  {
    id: "thabo",
    name: "Thabo Nkosi",
    role: "BARBER",
    specialty: "Fades · Kids Cuts · Beard Trims",
    image: ThaboImage,
  },
];

export const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];