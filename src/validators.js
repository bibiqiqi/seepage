export const required = value => (value ? undefined : 'Required');

export const nonEmpty = value =>
    value.trim() !== '' ? undefined : 'cannot be empty';
// Uses a regular expression (regex) to check whether it looks enough like an
// email address.  Broken down:
// ^ Matches the start of the text
// \S+ Matches one or more non-whitespace characters before the @
// @ A literal at sign
// \S+ Matches one or more non-whitespace characters after the @
// $ Matches the end of the text
export const email = value =>
    /^\S+@\S+$/.test(value) ? undefined : 'must be a valid email address';

//login validators
export const isTrimmed = value =>
    value.trim() === value ? undefined : 'cannot start or end with whitespace';

//validator creator function (a function which returns another function, and its
// the inner function which returns the string if the field is invalid.)
//the outer function takes a length object: length({min: 10, max: 72}), and returns
//the validator function, which takes the value from the field and carries out the check
export const length = length => value => {
    if (length.min && value.length < length.min) {
        return `must be at least ${length.min} characters long`;
    }
    if (length.max && value.length > length.max) {
        return `must be at most ${length.max} characters long`;
    }
};
export const matches = field => (value, allValues) =>
    field in allValues && value.trim() === allValues[field].trim()
        ? undefined
        : 'does not match';

export function validateUrl(videoId) {
  return new Promise(function(resolve, reject) {
    const emptyValidator = (nonEmpty(videoId));
    if(emptyValidator) {
      reject(emptyValidator)
    } else {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`;
        fetch(url)
         .then(res => {
           if(res.ok) {
             resolve()
           } else {
             reject('there was an error with validating your Youtube video ID')
           }
        }).then(data => {
           if (data.items.length < 1) {
             reject('please upload the video to the Seepage Youtube account and input the ID of the video')
           }
        })
        .catch(err => {
          reject('there was an error with validating your Youtube video ID')
        })
    }
  })
}
