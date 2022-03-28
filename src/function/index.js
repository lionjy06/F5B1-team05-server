/**
 * Triggered from a change to a Cloud Storage bucket.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */

 const { Storage } = require(`@google-cloud/storage`);

 exports.helloGCS = (event, context) => {
   const sharp = require("sharp");
   const storage = new Storage();
   console.log(`event!!!`, JSON.stringify(event));
   const size = [
     ["s", 320],
     ["m", 640],
     ["l", 1280],
   ];
 
   const getUrl = event.name.split("/");
   console.log(getUrl);
 
   const url = getUrl[getUrl.length - 2] + "/" + getUrl[getUrl.length - 1];
   console.log(url);
 
   size.forEach((item) => {
     storage
       .bucket("mycodecamp")
       .file(url)
       .createReadStream()
       .pipe(sharp().resize({ width: item[1] }))
       .pipe(
         storage
           .bucket("mycodecamp-test")
           .file(`${item[0]}/${getUrl[getUrl.length - 1]}`)
           .createWriteStream()
       )
       .on("finish", () => console.log("해치웠나...?"))
       .on("error", (error) => console.log(error));
   });
 };
 