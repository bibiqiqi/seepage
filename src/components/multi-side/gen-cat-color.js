import Color from 'color';

export default function genCatColor(categoryArray, lighten){
  const singleColors = {
    media: {r: 255, g: 80, b: 100}, //red
    performance: {r: 255, g: 235, b: 30}, //yellow
    text: {r: 40, g: 210, b: 255} //blue
  };

  const blendedColors = {
    mediaPerformance: {r: 255, g: 115, b: 65},
    performanceText: {r: 35, g: 255, b: 30},
    textMedia: {r: 95, g: 55, b: 255},
    all: {r: 140, g: 70, b: 20}
  }

  let newColor;
  if(categoryArray.length === 1) { //if there's just one category
    for(let key in singleColors){
      if (key === (categoryArray[0])) {
        newColor = Color(singleColors[key]);
      }
    }
  } else if (categoryArray.length === 2) { //if there's two categories
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
  if(lighten) {
    newColor = newColor.desaturate(lighten);
  }
  return newColor;
}
