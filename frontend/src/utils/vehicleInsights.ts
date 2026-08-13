import type { FormValues } from "../types";

export type VehicleInsight = {
  title: string;
  description: string;
  tone: "positive" | "neutral" | "attention";
};

const LOW_MILEAGE_LIMIT = 75_000;
const HIGH_MILEAGE_LIMIT = 150_000;

function parseNumericBand(value: string): number | null {
  const numbers = value.match(/\d+(?:[.,]\d+)?/g)?.map((number) =>
    Number(number.replace(",", ".")),
  );

  if (!numbers?.length || numbers.some((number) => !Number.isFinite(number))) {
    return null;
  }
  return numbers.length === 1 ? numbers[0] : (numbers[0] + numbers[1]) / 2;
}

function getEnginePowerInsight(enginePower: string): VehicleInsight {
  const parsedPower = parseNumericBand(enginePower);
  const profile = parsedPower !== null && parsedPower >= 176
    ? "Seçilen yüksek güç profili"
    : parsedPower !== null && parsedPower < 100
      ? "Seçilen güç profili"
      : "Bu motor gücü";

  return {
    title: "Motor gücü etkisi",
    description: `${profile}, model değerlendirmesinde güçlü bir teknik sinyaldir. Motor gücü, bu modelde fiyat tahminini en çok etkileyen özelliklerden biridir.`,
    tone: "neutral",
  };
}

function getModelYearInsight(modelYear: number): VehicleInsight {
  const vehicleAge = new Date().getFullYear() - modelYear;

  if (vehicleAge <= 5) {
    return {
      title: "Güncel model yılı",
      description: "Model yılı, fiyat tahmininde güçlü bir belirleyicidir; daha yeni model yılları model genelinde genellikle daha yüksek değerlerle ilişkilidir.",
      tone: "positive",
    };
  }

  return {
    title: "Model yılı profili",
    description: "Model yılı, CarSight tahmininde güçlü belirleyicilerden biridir ve diğer teknik özelliklerle birlikte değerlendirilir.",
    tone: "neutral",
  };
}

function getMileageInsight(mileage: number): VehicleInsight {
  if (mileage < LOW_MILEAGE_LIMIT) {
    return {
      title: "Düşük kilometre bandı",
      description: `Girilen kilometre ${LOW_MILEAGE_LIMIT.toLocaleString("tr-TR")} km altındadır. Daha düşük kilometre, model tahminini genel olarak yukarı yönlü etkileyebilen özelliklerden biridir.`,
      tone: "positive",
    };
  }

  if (mileage <= HIGH_MILEAGE_LIMIT) {
    return {
      title: "Orta kilometre bandı",
      description: `Girilen kilometre ${LOW_MILEAGE_LIMIT.toLocaleString("tr-TR")}–${HIGH_MILEAGE_LIMIT.toLocaleString("tr-TR")} km aralığındadır. Kilometre, tahminde etkili özelliklerden biri olarak teknik yapı ile birlikte ele alınır.`,
      tone: "neutral",
    };
  }

  return {
    title: "Yüksek kilometre bandı",
    description: `Girilen kilometre ${HIGH_MILEAGE_LIMIT.toLocaleString("tr-TR")} km üzerindedir. Daha yüksek kilometre, modelin fiyat tahminini genel olarak aşağı yönlü etkileyebilir.`,
    tone: "attention",
  };
}

function getConditionInsight(form: FormValues): VehicleInsight {
  const localPainted = Number(form.lokal_boyalı_parça_sayısı);
  const painted = Number(form.boyalı_parça_sayısı);
  const replaced = Number(form.değişen_parça_sayısı);
  const paintedTotal = localPainted + painted;

  if (replaced === 0 && paintedTotal === 0) {
    return {
      title: "Korunmuş parça görünümü",
      description: "Girilen kondisyon bilgisinde boyalı veya değişen parça bulunmaması, model açısından olumlu bir kondisyon sinyali oluşturabilir.",
      tone: "positive",
    };
  }

  if (replaced === 0) {
    return {
      title: "Boya bilgisi",
      description: "Lokal veya tam boya adetleri, modelin kondisyon değerlendirmesine dahil edilir. Bu bilgi tek başına araç geçmişi hakkında kesin bir sonuç göstermez.",
      tone: "neutral",
    };
  }

  return {
    title: replaced >= 3 ? "Belirgin parça değişimi" : "Değişen parça bilgisi",
    description: `${replaced} değişen parça, modelin kondisyon sinyalinde dikkate alınır. Bu bilgi fiyat tahminini etkileyebilir ancak tek başına hasar geçmişi kanıtı değildir.`,
    tone: "attention",
  };
}

function getConfigurationInsight(form: FormValues): VehicleInsight {
  return {
    title: "Teknik yapı",
    description: `${form.cekisTipi}, ${form.vitesTipi} vites ve ${form.kasaTipi} kasa özellikleri modelde birlikte değerlendirilir; bu göstergelerin etkisi araç kombinasyonuna göre değişebilir.`,
    tone: "neutral",
  };
}

export function generateVehicleInsights(form: FormValues): VehicleInsight[] {
  return [
    getEnginePowerInsight(form.motorGucu_HP),
    getModelYearInsight(Number(form.yıl)),
    getMileageInsight(Number(form.kilometre_Km)),
    getConditionInsight(form),
    getConfigurationInsight(form),
  ];
}
