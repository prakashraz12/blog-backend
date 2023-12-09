import { nanoid } from "nanoid";

export const uniqueIdGenerator = (baseValue) => {
  const uniqueId =
    baseValue
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .trim() + nanoid();
  return uniqueId;
};
