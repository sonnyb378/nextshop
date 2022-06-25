export const constructSelectedOptions = (
  selectedColor: any,
  selectedSize: any,
  selectedStyle: any,
  selectedMaterial: any,
  keyName: string
) => {
  const cartLineAttributes = [];
  selectedColor.option_value &&
    cartLineAttributes.push({
      [keyName]: "Color",
      value: `${selectedColor.name.trim()}-${selectedColor.hexColor.trim()}`,
    });
  selectedSize.option_value &&
    cartLineAttributes.push({ [keyName]: "Size", value: selectedSize.option_value });
  selectedStyle.option_value &&
    cartLineAttributes.push({ [keyName]: "Style", value: selectedStyle.option_value });
  selectedMaterial.option_value &&
    cartLineAttributes.push({ [keyName]: "Material", value: selectedMaterial.option_value });
  return cartLineAttributes;
};
