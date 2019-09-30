export const normalizeResponseErrors = res => {
  console.log('res sent back from server to client is:', res);
    //debugger;
    if (!res.ok) {
        if (
            res.headers.has('content-type') &&
            res.headers.get('content-type').startsWith('application/json')
        ) {
            console.log('Its a nice JSON error returned by us, so decode it');
            return res.json().then(err => Promise.reject(err));
        }
        console.log('Its a less informative error returned by express');
        return Promise.reject({
            code: res.status,
            message: res.statusText
        });
    }
    console.log('normalizeResponseErrors is passing response on', res);
    return res;
};
