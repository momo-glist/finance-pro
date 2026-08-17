import {
    IGenericStringMap,
    IToCamelCase,
} from "@/store/useExpensesStore.types";

const toCamalCase: IToCamelCase = (str) => {
  return str.replace(/([-_][a-z])/gi, (match) =>
    match.toUpperCase().replace("-", "").replace("_", ""),
  );
};

const convertKeysToCamelCase = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    const mappedArray = obj.map(convertKeysToCamelCase) as unknown as T;

    return mappedArray;
  }

  if (obj !== null && typeof obj === "object") {
    const keys = Object.keys(obj);

    return keys.reduce((result: T, key: string) => {
      const camelKey = toCamalCase(key);

      (result as IGenericStringMap)[camelKey] = convertKeysToCamelCase(
        (obj as IGenericStringMap)[key],
      );

      return result;
    }, {} as T);
  }

  return obj;
};

export { convertKeysToCamelCase };
