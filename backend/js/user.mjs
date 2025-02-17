import AWS from 'aws-sdk';
export const dynamoDb = new AWS.DynamoDB.DocumentClient();
import crypto, { sign } from 'crypto';
import { ethers } from 'ethers';
// import { keccak256, encodePacked } from 'ethers/lib/utils';


import { createResponse, parseTelegramUserData, verifyTelegramUser } from './utils.mjs';
import { getTotalReferrals } from './refer.mjs';


export const login = async (telegramInitData) => {
    // Verify user.
    try {
        const verifiedUser = verifyTelegramUser(telegramInitData);

        if (!verifiedUser) {
            throw new Error('Failed to verify Telegram user');
        }
    } catch (error) {
        return createResponse(403, 'Forbidden', 'login', `Failed to verify Telegram user ${error.message}`);
    }


    // Parse Telegram user data.
    let telegramUser;
    let telegramUserId;
    try {
        const telegramUserData = parseTelegramUserData(telegramInitData);
        telegramUser = telegramUserData.telegramUser;
        telegramUserId = telegramUserData.telegramUserId;

        if (!telegramUser?.id) {
            throw new Error('Invalid user data');
        }

        if (telegramUserData.is_bot) {
            return createResponse(403, 'Forbidden', 'login', 'Bots cannot play');
        }
    } catch (error) {
        return createResponse(400, 'Bad Request', 'login', `Failed to parse Telegram user data ${error.message}`);
    }


    // Return user if it already exists.
    let userData;
    try {
        const user = await readUser(telegramUserId);
        console.log('user DEBUG', user);

        if (user.statusCode == 200) {
            userData = JSON.parse(user.body).data;

            // Update username if it has changed.
            if (userData.username !== telegramUser.username) {
                try {
                    const params = {
                        TableName: process.env.USERS_TABLE_NAME,
                        Key: {
                            PK: userData.PK
                        },
                        UpdateExpression: 'set username = :username',
                        ExpressionAttributeValues: {
                            ':username': telegramUser.username
                        }
                    };
                    await dynamoDb.update(params).promise();
                } catch (error) {
                    return createResponse(500, 'Internal Server Error', 'login', `Failed to update username: ${error.message}`);
                }
            }

            return createResponse(200, 'OK', 'login', 'User existed', userData);
        }
    } catch (error) {
        return createResponse(500, 'Internal Server Error', 'login', `Failed to check existing user: ${error.message}`);
    }


    // Check if the new user already has an EOA in the pending refers table.
    let address;
    try {
        const params = {
            TableName: process.env.PENDING_REFERS_TABLE_NAME,
            Key: {
                PK: telegramUser.username
            }
        };
        const result = await dynamoDb.get(params).promise();

        if (result?.Item) {
            address = result.Item.walletAddress;
        }
    } catch (error) {
        return createResponse(500, 'Internal Server Error', 'login', `Failed to check pending user: ${error.message}`);
    }


    // Create a new Ethereum EOA for the user.
    let wallet, privateKey;
    if (!address) {
        try {
            wallet = ethers.Wallet.createRandom();
            privateKey = wallet.privateKey;
            address = wallet.address;
        } catch (error) {
            return createResponse(500, 'Internal Server Error', 'login', 'Failed to create Ethereum wallet');
        }


        // Encrypt private key.
        let encryptedPrivateKey;
        try {
            const cipher = crypto.createCipher('aes-256-cbc', process.env.PRIVATE_KEY_ENCRYPTION_KEY);
            encryptedPrivateKey = cipher.update(privateKey, 'utf8', 'hex') + cipher.final('hex');

            const params = {
                TableName: process.env.ENCRYPTED_PRIVATE_KEY_TABLE_NAME,
                Item: {
                    PK: address,
                    SK: encryptedPrivateKey
                }
            };
            await dynamoDb.put(params).promise();
        } catch (error) {
            return createResponse(500, 'Internal Server Error', 'login', error.message);
        }
    }


    // Create ENS
    try {
        // Initialize provider
        const provider = new ethers.JsonRpcProvider(`https://base-sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);

        // Use administrative wallet that owns the parent domain
        const adminWallet = new ethers.Wallet(process.env.ADMIN_WALLET_PK, provider);

        // ENS registry contract address and ABI
        const ensRegistarAddress = '0x25ED63F2716F7A5B1d0115BEa38B5f8019E41923';
        const ensRegistarABI = [
            { "type": "constructor", "inputs": [{ "name": "_registry", "type": "address", "internalType": "contract IL2Registry" }, { "name": "_contractOwner", "type": "address", "internalType": "address" }], "stateMutability": "nonpayable" }, { "type": "function", "name": "available", "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" }, { "type": "function", "name": "owner", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "register", "inputs": [{ "name": "label", "type": "string", "internalType": "string" }, { "name": "owner", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "renounceOwnership", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "targetRegistry", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "contract IL2Registry" }], "stateMutability": "view" }, { "type": "function", "name": "transferOwnership", "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "event", "name": "NameRegistered", "inputs": [{ "name": "label", "type": "string", "indexed": true, "internalType": "string" }, { "name": "owner", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false }, { "type": "event", "name": "OwnershipTransferred", "inputs": [{ "name": "previousOwner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false }, { "type": "error", "name": "OwnableInvalidOwner", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "OwnableUnauthorizedAccount", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }] }
        ];
        const ensRegistar = new ethers.Contract(ensRegistarAddress, ensRegistarABI, adminWallet);

        // Define the parent domain and subdomain
        let label;
        if (telegramUser.username) {
            // label = normalize(telegramUser.username);
            label = telegramUser.username.toLowerCase() + 'test17';
        } else {
            // label = normalize(telegramUserId.toString());
            label = telegramUserId.toString().toLowerCase();
        }

        const tx = await ensRegistar.register(label, address, {
            gasLimit: 500000,
        });

        console.log(`Transaction sent: ${tx.hash}`);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log(`Transaction mined in block ${receipt.blockNumber}`);

        // User signature
        let signature;
        try {
            const contents = ethers.solidityPacked(
                ['address', 'bytes4', 'string', 'address', 'uint256', 'uint256'],
                [
                    '0xa12159e5131b1eEf6B4857EEE3e1954744b5033A', // base sepolia reverse resolver
                    '0x7f87032e', // selector of setNameForAddrWithSignature()
                    `${label}.bubblewars.eth`, // name we're setting the reverse record for
                    address, // addr
                    BigInt(1731809935), // expiry (tomorrow)
                    BigInt(2147568180), // coinType - convertEVMChainIdToCoinType(baseSepolia.id)
                ]);

            signature = await wallet.signMessage(
                ethers.getBytes(ethers.keccak256(contents)),
            );
            console.log('signature', signature);

        } catch (error) {
            console.error('ENS signature error:', error);
        }


        // Dev execution on behalf of user
        try {
            const l2ReverseResolver = "0xa12159e5131b1eEf6B4857EEE3e1954744b5033A";
            const l2ReverseResolverAbi = [{ inputs: [{ internalType: "bytes32", name: "_L2ReverseNode", type: "bytes32" }, { internalType: "uint256", name: "_coinType", type: "uint256" }], stateMutability: "nonpayable", type: "constructor" }, { inputs: [], name: "InvalidSignature", type: "error" }, { inputs: [], name: "NotOwnerOfContract", type: "error" }, { inputs: [], name: "SignatureExpired", type: "error" }, { inputs: [], name: "SignatureExpiryTooHigh", type: "error" }, { inputs: [], name: "Unauthorised", type: "error" }, { anonymous: false, inputs: [{ indexed: true, internalType: "bytes32", name: "node", type: "bytes32" }, { indexed: false, internalType: "string", name: "name", type: "string" }], name: "NameChanged", type: "event" }, { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "addr", type: "address" }, { indexed: true, internalType: "bytes32", name: "node", type: "bytes32" }], name: "ReverseClaimed", type: "event" }, { inputs: [], name: "L2ReverseNode", outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }], stateMutability: "view", type: "function" }, { inputs: [], name: "coinType", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }, { inputs: [{ internalType: "bytes[]", name: "data", type: "bytes[]" }], name: "multicall", outputs: [{ internalType: "bytes[]", name: "results", type: "bytes[]" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "bytes32", name: "nodehash", type: "bytes32" }, { internalType: "bytes[]", name: "data", type: "bytes[]" }], name: "multicallWithNodeCheck", outputs: [{ internalType: "bytes[]", name: "results", type: "bytes[]" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }], name: "name", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" }, { inputs: [{ internalType: "address", name: "addr", type: "address" }], name: "node", outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }], stateMutability: "view", type: "function" }, { inputs: [], name: "parentNode", outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }], stateMutability: "view", type: "function" }, { inputs: [{ internalType: "string", name: "name", type: "string" }], name: "setName", outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "addr", type: "address" }, { internalType: "string", name: "name", type: "string" }], name: "setNameForAddr", outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "addr", type: "address" }, { internalType: "string", name: "name", type: "string" }, { internalType: "uint256", name: "signatureExpiry", type: "uint256" }, { internalType: "bytes", name: "signature", type: "bytes" }], name: "setNameForAddrWithSignature", outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "contractAddr", type: "address" }, { internalType: "address", name: "owner", type: "address" }, { internalType: "string", name: "name", type: "string" }, { internalType: "uint256", name: "signatureExpiry", type: "uint256" }, { internalType: "bytes", name: "signature", type: "bytes" }], name: "setNameForAddrWithSignatureAndOwnable", outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "bytes4", name: "interfaceID", type: "bytes4" }], name: "supportsInterface", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" }];

            const l2ReverseResolverContract = new ethers.Contract(l2ReverseResolver, l2ReverseResolverAbi, adminWallet);
            const tx2 = await l2ReverseResolverContract.setNameForAddrWithSignature(
                address,
                `${label}.bubblewars.eth`,
                BigInt(1731809935),
                signature,
                {
                    gasLimit: 500000,
                }
            );

            const receipt = await tx2.wait();
            console.log(`Transaction sent good: ${receipt}`);

        } catch (error) {
            console.error('ENS dev execution error:', error);
        }



        // Set name 
        // try {
        //     const l2ReverseResolver = "0xa12159e5131b1eEf6B4857EEE3e1954744b5033A";
        //     const l2ReverseResolverAbi = parseAbi([
        //         'function node(address) view returns (bytes32)',
        //         'function name(bytes32) view returns (string)',
        //         'function setName(string calldata name) public returns (bytes32)'
        //     ]);

        //     const l2ReverseResolverContract = new ethers.Contract(l2ReverseResolver, l2ReverseResolverAbi, address);
        // const tx2 = await l2ReverseResolverContract.setName(`${label}.bubblewars.eth`, {
        //     gasLimit: 500000,
        // });

        //     console.log(`Transaction sent: ${tx2.hash}`);

        // } catch (error) {
        //     console.error('ENS reverse resolver error:', error);
        // }


    } catch (error) {
        console.error('ENS creation error:', error);
        return createResponse(500, 'Internal Server Error', 'login', `Failed to create ENS: ${error.message}`);
    }



    // Record user in DynamoDB.
    let userRecord;
    try {
        userRecord = {
            PK: `TELEGRAM_ID#${telegramUserId}`,

            telegramId: telegramUserId,
            walletAddress: address
        };
        if (telegramUser.first_name) userRecord.firstName = telegramUser.first_name;
        if (telegramUser.last_name) userRecord.lastName = telegramUser.last_name;
        if (telegramUser.username) { // Not all users have a Telegram username.
            userRecord.username = telegramUser.username;
        }

        const params = {
            TableName: process.env.USERS_TABLE_NAME,
            Item: userRecord,
        };
        await dynamoDb.put(params).promise();
    } catch (error) {
        return createResponse(500, 'Internal Server Error', 'login', error.message);
    }


    // Return success.
    return createResponse(200, 'OK', 'login', 'User created', userRecord);
};


export const readUser = async (data) => {
    let telegramUserId;
    if (data.telegramInitData) {
        // Parse data.
        let telegramInitData;
        try {
            telegramInitData = data.telegramInitData;
        } catch (error) {
            return createResponse(400, 'Bad Request', 'readUser', 'Invalid data');
        }


        // Parse Telegram user data.
        let telegramUser;
        try {
            const telegramUserData = parseTelegramUserData(telegramInitData);
            telegramUser = telegramUserData.telegramUser;
            telegramUserId = telegramUserData.telegramUserId;

            if (!telegramUser?.id) {
                throw new Error('Invalid user data');
            }

            if (telegramUserData.is_bot) {
                return createResponse(403, 'Forbidden', 'login', 'Bots cannot play');
            }
        } catch (error) {
            return createResponse(400, 'Bad Request', 'login', `Failed to parse Telegram user data ${error.message}`);
        }
    } else {
        telegramUserId = data;
    }


    // Read user from db.
    let userRecord = {};
    try {
        const params = {
            TableName: process.env.USERS_TABLE_NAME,
            Key: {
                PK: `TELEGRAM_ID#${telegramUserId}`
            }
        };
        const result = await dynamoDb.get(params).promise();

        if (result?.Item) {
            userRecord = result.Item;
        } else {
            return createResponse(404, 'Not Found', 'readUser', 'User not found');
        }
    } catch (error) {
        return createResponse(500, 'Internal Server Error', 'readUser', `Failed to read user data: ${error.message}`);
    }


    // Read user from referrals contract.
    try {
        const totalReferrals = await getTotalReferrals(userRecord.walletAddress);
        userRecord.totalReferrals = totalReferrals || 0;
    } catch (error) {
        // return createResponse(500, 'Internal Server Error', 'readUser', `Failed to read user referrals: ${error.message}`);
    }


    // Read user's ENS.
    // try {
    //     // const provider = new ethers.JsonRpcProvider('https://1rpc.io/sepolia');
    //     // const ensName = await provider.lookupAddress(userRecord.walletAddress);
    //     // console.log('ensName', ensName);
    //     // userRecord.ens = ensName;

    //     const { data: name } = useEnsName({
    //         address: userRecord.walletAddress,
    //         chainId: sepolia.id,
    //     });
    //     userRecord.ens = name;
    // } catch (error) {
    //     return createResponse(500, 'Internal Server Error', 'readUser', `Failed to read user ENS: ${error.message}`);
    // }


    // Return success.
    return createResponse(200, 'OK', 'readUser', 'User found', userRecord);
};
