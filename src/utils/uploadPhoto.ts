import fs from "fs";
import Path from "path";

import Boom from "@hapi/boom";
import FileType from "file-type";
import { v4 as uuidv4 } from "uuid";

async function savePhoto(arrayBuffer: ArrayBuffer) {
  const allowedFiles = ["png", "jpeg", "jpg"];

  const buffer = Buffer.from(arrayBuffer);
  const fileType = await FileType.fromBuffer(buffer);

  if (fileType && fileType.ext && allowedFiles.includes(fileType.ext)) {
    const fileName = `${uuidv4()}.${fileType.ext}`;
    const ouptutFileName = Path.join(__dirname, "..", "..", "media", fileName);
    fs.createWriteStream(ouptutFileName).write(buffer);
    return fileName;
  }
  throw Boom.badData("Please upload valid image");
}

export default savePhoto;
