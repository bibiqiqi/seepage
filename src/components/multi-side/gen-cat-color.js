import Color from 'color';

export default function genCatColor(categoryArray){
  const singleColors = {
    media: {r: 255, g: 52, b: 75}, //red
    performance: {r: 255, g: 235, b: 29}, //yellow
    text: {r: 8, g: 205, b: 255} //blue
  };

  const blendedColors = {
    mediaPerformance: {r: 255, g: 116, b: 65},
    performanceText: {r: 34, g: 255, b: 28},
    textMedia: {r: 93, g: 53, b: 255},
    all: {r: 0, g: 0, b: 0}
  }

  let newColor;
  if(categoryArray.length === 1) { //if there's just one category
    for(let key in singleColors){
      if (key === (categoryArray[0])) {
        newColor = Color(singleColors[key]);
      }
    }
  }
  else if (categoryArray.length === 2) { //if there's two categories
    if(categoryArray.includes('media') && categoryArray.includes('performance')) {
      newColor = Color(blendedColors.mediaPerformance);
    } else if(categoryArray.includes('performance') && categoryArray.includes('text')) {
      newColor = Color(blendedColors.performanceText);
    } else if(categoryArray.includes('text') && categoryArray.includes('media')) {
      newColor = Color(blendedColors.textMedia);
    }
  } else if (categoryArray.length === 3) { //it there's three categories
    newColor = Color(blendedColors.all);
  }
  return newColor;
}
