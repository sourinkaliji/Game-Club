export const spyWordCategories = {
  animals: {
    name: "حیوانات",
    words: [
      "گربه",
      "سگ",
      "شیر",
      "پلنگ",
      "خرس",
      "روباه",
      "گرگ",
      "خرگوش",
      "موش",
      "فیل",
      "زرافه",
      "اسب",
      "گاو",
      "گوسفند",
      "مرغ",
      "اردک",
      "کبوتر",
      "عقاب",
      "پرنده",
      "ماهی",
      "کوسه",
      "دلفین",
      "نهنگ",
      "پروانه",
    ],
  },
  food: {
    name: "غذا و نوشیدنی",
    words: [
      "چلوکباب",
      "قرمه‌سبزی",
      "فسنجان",
      "آش",
      "کوکو",
      "کتلت",
      "پیتزا",
      "برگر",
      "پاستا",
      "سالاد",
      "سوپ",
      "نان",
      "برنج",
      "سیب",
      "پرتقال",
      "موز",
      "هندوانه",
      "خیار",
      "گوجه",
      "شیر",
      "پنیر",
      "چای",
      "قهوه",
      "آب",
      "نوشابه",
      "آبمیوه",
      "بستنی",
      "کیک",
      "شکلات",
      "عسل",
    ],
  },
  places: {
    name: "مکان‌ها",
    words: [
      "خانه",
      "مدرسه",
      "پارک",
      "کتابخانه",
      "بیمارستان",
      "فروشگاه",
      "رستوران",
      "سینما",
      "استادیوم",
      "باغ‌وحش",
      "موزه",
      "کافه",
      "بازار",
      "مسجد",
      "کلیسا",
      "ساحل",
      "کوه",
      "جنگل",
      "صحرا",
      "دریا",
      "رودخانه",
      "آبشار",
      "غار",
    ],
  },
  objects: {
    name: "اشیاء",
    words: [
      "کتاب",
      "مداد",
      "خودکار",
      "کامپیوتر",
      "تلفن",
      "تلویزیون",
      "یخچال",
      "میز",
      "صندلی",
      "تخت",
      "کمد",
      "آینه",
      "ساعت",
      "کفش",
      "کلاه",
      "لباس",
      "کیف",
      "عینک",
      "کلید",
      "قفل",
      "چراغ",
      "پنکه",
      "بخاری",
      "ماشین",
      "دوچرخه",
      "هواپیما",
      "قطار",
      "کشتی",
    ],
  },
  professions: {
    name: "مشاغل",
    words: [
      "معلم",
      "دکتر",
      "مهندس",
      "وکیل",
      "پلیس",
      "آتش‌نشان",
      "نانوا",
      "آشپز",
      "راننده",
      "خلبان",
      "پزشک",
      "پرستار",
      "نقاش",
      "نجار",
      "برقکار",
      "آرایشگر",
      "خیاط",
      "کشاورز",
      "نویسنده",
      "خبرنگار",
      "عکاس",
      "موسیقیدان",
    ],
  },
  myList: {
    name: "لیست من",
    words: [],
  },
};

// تابع برای بارگیری دسته‌بندی‌ها از localStorage
export const loadSpyWordCategories = () => {
  try {
    const saved = localStorage.getItem("spyWordCategories");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...spyWordCategories,
        myList: parsed.myList || spyWordCategories.myList,
      };
    }
    return spyWordCategories;
  } catch (error) {
    console.error("Error loading spy word categories:", error);
    return spyWordCategories;
  }
};

// تابع برای ذخیره دسته‌بندی‌ها در localStorage
export const saveSpyWordCategories = (categories) => {
  try {
    localStorage.setItem("spyWordCategories", JSON.stringify(categories));
  } catch (error) {
    console.error("Error saving spy word categories:", error);
  }
};

// تابع برای دریافت کلمات انتخاب شده
export const getSpySelectedWords = (selectedCategories) => {
  const categories = loadSpyWordCategories();
  let allWords = [];

  selectedCategories.forEach((categoryKey) => {
    if (categories[categoryKey]) {
      allWords = [...allWords, ...categories[categoryKey].words];
    }
  });

  return allWords;
};
