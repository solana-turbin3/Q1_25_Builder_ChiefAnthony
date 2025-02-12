import wallet from "../wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

    const image = "https://devnet.irys.xyz/E8apaBhYZ6LGSxFwPN3AUp7F4XqTaQxHFFJEghP32kPw"
    const metadata = {
      name: "Art Vandelay",
      symbol: "AV",
      description: "Importer/Exporter",
      image,
      attributes: [
        { trait_type: 'Rug', value: '4' }
      ],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image
          },
        ]
      },
      creators: []
    };
    const myUri = await umi.uploader.uploadJson(metadata);
    console.log("Your metadata URI: ", myUri);

    const correct_uri = myUri.replace("https://arweave.net/", "https://devnet.irys.xyz/");
    console.log("Your image URI: ", correct_uri);


  }
  catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
