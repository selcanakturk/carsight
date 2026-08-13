export interface FormValues {
  marka: string;
  yıl: string;
  kilometre_Km: string;
  vitesTipi: string;
  yakitTuru: string;
  kasaTipi: string;
  motorGucu_HP: string;
  motorHacmi_Cc: string;
  cekisTipi: string;
  orjinal_parça_sayısı: string;
  lokal_boyalı_parça_sayısı: string;
  boyalı_parça_sayısı: string;
  değişen_parça_sayısı: string;
}

export type FormErrors = Partial<Record<keyof FormValues, string>> & {
  conditionTotal?: string;
};
