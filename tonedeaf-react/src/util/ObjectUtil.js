export const isEqual = (obj1, obj2) => {
  if (!obj1 || !obj2 || typeof obj1 != "object" || typeof obj2 != "object") return false;
  for(const property in obj1) {
    if(obj1[property] !== obj2[property]) {
      return false;
    }
  }
  return true;
}