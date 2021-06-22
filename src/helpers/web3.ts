import {Contract} from '@ethersproject/contracts';
import {getAddress} from '@ethersproject/address';
import resolveENSContentHash from '@/helpers/resolveENSContentHash';
import {decodeContenthash} from '@/helpers/content';
import abi from '@/helpers/abi';

export async function resolveContent(provider, name) {
    const contentHash = await resolveENSContentHash(name, provider);
    return decodeContenthash(contentHash);
}

export async function signMessage(web3, msg, address) {
    return await web3.send('personal_sign', [msg, address]);
}

export async function getBlockNumber(provider) {
    try {
        const blockNumber: any = await provider.getBlockNumber();
        return parseInt(blockNumber);
    } catch (e) {
        return Promise.reject();
    }
}

export async function getBlockTimestamp(provider, blockNumber) {
    try {
        const block: any = await provider.getBlock(blockNumber);
        return block.timestamp;
    } catch (e) {
        return Promise.reject();
    }
}

export async function sendTransaction(web3, [contractType, contractAddress, action, params]) {
    const signer = web3.getSigner();
    const contract = new Contract(getAddress(contractAddress), abi[contractType], web3);
    const contractWithSigner = contract.connect(signer);
    const overrides = {
        gasLimit: 12e5 + ''
    };

    try {
        const gasLimit = await contractWithSigner['estimateGas'][action](...params);
        overrides.gasLimit = gasLimit.toString();
    } catch (err) {
        console.error(err);
    }

    const tx = await contractWithSigner[action](...params, overrides);
    await tx.wait();
    return tx;
}

export async function getContract(contractAddress, contractType, web3) {
    return new Contract(getAddress(contractAddress), abi[contractType], web3);
}
