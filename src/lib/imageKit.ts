import Kit from "imagekit";

const imageKit = new Kit({
  urlEndpoint: process.env.VITE_IMAGE_KIT_ENDPOINT!,
  publicKey: process.env.VITE_IMAGE_KIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY!,
});

export default imageKit;
