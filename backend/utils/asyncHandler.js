const asyncHandler = (fn) => {
    return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(err => next(err));
}

// const asyncHandler = (fn) => {
//     return (req, res, next) => {
//         try {
//             return fn(req, res, next);
//         } catch(err) {
//             next(err)
//         }
//     }
// }

export {asyncHandler}