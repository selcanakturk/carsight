export interface FormValues {
  marka: string;
  yıl: string;
  kilometre_Km: string;
  vitesTipi: string;
  yakitTuru: string;
  kasaTipi: string;
}

export type FormErrors = Partial<Record<keyof FormValues, string>>;
