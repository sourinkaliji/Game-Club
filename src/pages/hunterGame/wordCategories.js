export const wordCategories = {
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
    ],
  },
  places: {
    name: "شهر و کشور",
    words: [
      "تهران",
      "اصفهان",
      "شیراز",
      "مشهد",
      "تبریز",
      "کرج",
      "اهواز",
      "قم",
      "کرمانشاه",
      "رشت",
      "زاهدان",
      "همدان",
      "یزد",
      "اردبیل",
      "بندرعباس",
      "ایران",
      "آمریکا",
      "آلمان",
      "فرانسه",
      "انگلیس",
      "ژاپن",
      "چین",
      "ترکیه",
      "عراق",
      "افغانستان",
      "هند",
      "روسیه",
      "کانادا",
      "استرالیا",
    ],
  },
  objects: {
    name: "اشیاء و وسایل",
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
    ],
  },
  myList: {
    name: "لیست من",
    words: [], // لیست خالی که کاربر پر می‌کند
  },
};

// تابع برای بارگیری دسته‌بندی‌ها از localStorage
export const loadWordCategories = () => {
  try {
    const saved = localStorage.getItem("hunterWordCategories");
    if (saved) {
      const parsed = JSON.parse(saved);
      // ادغام با دسته‌بندی‌های پیش‌فرض (به جز لیست من)
      return {
        ...wordCategories,
        myList: parsed.myList || wordCategories.myList,
      };
    }
    return wordCategories;
  } catch (error) {
    console.error("Error loading word categories:", error);
    return wordCategories;
  }
};

// تابع برای ذخیره دسته‌بندی‌ها در localStorage
export const saveWordCategories = (categories) => {
  try {
    localStorage.setItem("hunterWordCategories", JSON.stringify(categories));
  } catch (error) {
    console.error("Error saving word categories:", error);
  }
};

// تابع برای دریافت کلمات انتخاب شده
export const getSelectedWords = (selectedCategories) => {
  const categories = loadWordCategories();
  let allWords = [];

  selectedCategories.forEach((categoryKey) => {
    if (categories[categoryKey]) {
      allWords = [...allWords, ...categories[categoryKey].words];
    }
  });

  return allWords;
};
