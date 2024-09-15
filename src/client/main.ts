import { Keypair, LAMPORTS_PER_SOL, Connection, PublicKey, Transaction, SystemProgram, TransactionInstruction, sendAndConfirmRawTransaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { fs } from "mz";
// import fs from "node:fs";
import path from "path";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const PROGRAM_KEYPAIR = path.join(__dirname, "../../contract/program/program-keypair.json");

// main function
async function main() {
    console.log("Hello, Welcome on our Dapp!");
    try {
        // connect with solana network
        const local_rpc_connection = new Connection("http://localhost:8899", "confirmed");

        // read program keypair
        const secretKey = JSON.parse(await fs.readFile(PROGRAM_KEYPAIR, { encoding: "utf8" }));
        const programKeypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));

        // Get program Id
        const programId = programKeypair.publicKey;
        console.log("Program Id : ", programId.toBase58());

        // Generating new keypair
        const accountKeypair = Keypair.generate();
        const airdrop = await local_rpc_connection.requestAirdrop(accountKeypair.publicKey, LAMPORTS_PER_SOL);
        await local_rpc_connection.confirmTransaction(airdrop);

        // get balance
        const balance = await local_rpc_connection.getBalance(accountKeypair.publicKey);
        console.log("Balance : ", balance);

        // create transaction
        console.log("Creating transaction...");
        const transaction = new TransactionInstruction({
            keys: [{ pubkey: accountKeypair.publicKey, isSigner: true, isWritable: true }],
            programId: programId,
            data: Buffer.alloc(0),
        })
        await sendAndConfirmTransaction(
            local_rpc_connection, 
            new Transaction().add(transaction), 
            [accountKeypair]
        );
        
        

    } catch (error) {
        console.log("Error in main function : ", error);
    }
}

main()
.then(() => {
    console.log("Hello, Welcome on our Dapp!");
})
.catch((error) => {
    console.log("Error in main function : ", error);
})
.finally(() => {
    process.exit();
});