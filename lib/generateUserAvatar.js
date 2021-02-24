import Avatar from 'avatar-builder';
import fs from 'fs';
import path from 'path';
import { IMG_DIR, TEMP_DIR } from './dirPaths.js';
import { handleError } from './handlerror.js';

async function generateUseAvatar(userData) {
  console.log(userData);
  try {
    const avatar = Avatar.builder(
      Avatar.Image.margin(Avatar.Image.circleMask(Avatar.Image.identicon())),
      128,
      128,
    );

    await avatar
      .create(userData.email)
      .then(buffer =>
        fs.writeFileSync(`tmp/avatar-${userData.email}.png`, buffer),
      );

    const tempAvatarPath = path.join(TEMP_DIR, `avatar-${userData.email}.png`);
    const avatarPath = path.join(IMG_DIR, `avatar-${userData.email}.png`);

    fs.renameSync(tempAvatarPath, avatarPath);

    return avatarPath;
  } catch (error) {
    handleError(error);
  }
}

export default generateUseAvatar;