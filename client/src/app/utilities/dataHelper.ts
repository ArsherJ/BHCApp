export const isBase64JPEGDataURI = (data: any) => {
  const pattern = /^data:image\/jpeg;base64,/;
  return pattern.test(data);
};

export function isURL(input: string): boolean {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(input);
}

export const isBlobURL = (data: any) => {
  try {
    const parsedUrl = new URL(data);
    return parsedUrl.protocol === "blob:";
  } catch (error) {
    return false;
  }
};

export const isNotEdited = (obj1: any, obj2: any): boolean => {
  if (obj1 == null) {
    obj1 = "";
  }
  if (obj2 == null) {
    obj2 = "";
  }
  if (obj1 === obj2) {
    return true; // They are the same object
  }
  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return false; // One of them is not an object, indicating a difference
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1?.length !== keys2?.length) {
    return false; // Different number of properties
  }

  for (const key of keys1) {
    if (!isNotEdited(obj1[key], obj2[key])) {
      return false; // Recursively check the properties
    }
  }

  return true; // If all checks pass, the objects are equal
};

export const dataURItoBlob = (dataURI: string) => {
  const parts = dataURI.split(",");

  const dataType = parts[0];

  const base64Data = parts[1];

  const binaryData = atob(base64Data);

  const byteArray = new Uint8Array(binaryData?.length);

  for (let i = 0; i < binaryData?.length; i++) {
    byteArray[i] = binaryData.charCodeAt(i);
  }
  return new Blob([byteArray], { type: dataType });
};
