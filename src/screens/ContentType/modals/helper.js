export const translatableFields = ["string", "media", "richText"];
export const fieldsAppearance = {
  string: [
    {
      name: "text",
      title: { en: "Text" },
      apearance: "",
      selected: true,
    },
    { name: "email", title: { en: "Email" }, apearance: "" },
    { name: "password", title: { en: "Password" }, apearance: "" },
    { name: "url", title: { en: "URL" }, apearance: "" },
    {
      name: "phoneNumber",
      title: { en: "Phone Number" },
      apearance: "",
    },
  ],
  number: [
    {
      name: "number",
      title: { en: "Number" },
      apearance: "",
      selected: true,
    },
    {
      name: "rangeSlider",
      title: { en: "Range Slider", fa: "" },
      apearance: "",
    },
    {
      name: "currency",
      title: { en: "Currency", fa: "" },
      apearance: "",
    },
    {
      name: "year",
      title: { en: "Year", fa: "" },
      apearance: "",
    },
  ],
  reference: [
    {
      name: "default",
      title: { en: "Default View" },
      apearance: "",
      selected: true,
    },
    { name: "cards", title: { en: "Card View" }, apearance: "" },
  ],
  keyValue: [
    {
      name: "default",
      title: { en: "Default View" },
      apearance: "",
      selected: true,
    },
    { name: "buttons", title: { en: "Buttons" }, apearance: "" },
  ],
};
export const acceptedMediaTypes = [
  {
    id: 1,
    name: "all",
    title: "All Files",
  },
  {
    id: 2,
    name: "image",
    title: "Image",
  },
  {
    id: 3,
    name: "video",
    title: "Video",
  },
  {
    id: 4,
    name: "audio",
    title: "Audio",
  },
  {
    id: 5,
    name: "pdf",
    title: "PDF",
  },
  {
    id: 6,
    name: "spreadsheet",
    title: "Spreadsheet",
  },
];
