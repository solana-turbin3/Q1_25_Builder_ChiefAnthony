import wallet from "../wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader({ address: "https://devnet.irys.xyz" }));
umi.use(signerIdentity(signer));

(async () => {
  try {
    //1. Load image
    const image = await readFile("./art-vandelay.png")
    //2. Convert image to generic file.
    const file = createGenericFile(image, "ChiefAnthonyrug.png", {
      contentType: "image/png",
    })
    //3. Upload image
    const [myUri] = await umi.uploader.upload([file]);
    console.log("Your image url ", myUri)

    const correct_uri = myUri.replace("https://arweave.net/", "https://devnet.irys.xyz/");
    console.log("Your image URI: ", correct_uri);

    // const image = ???

    // const [myUri] = ??? 
    // console.log("Your image URI: ", myUri);
  }
  catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
