import {
    PublicClient, WalletClient,
    createPublicClient, createWalletClient,
    custom, http, Address
} from 'viem'
import {
    localhost
} from 'viem/chains'
import info from './contract.json'

export class Provider {
    private publicClient: PublicClient
    private walletClient: WalletClient

    constructor() {
        this.publicClient = createPublicClient({
            chain: localhost,
            transport: http()
        })
        this.walletClient = createWalletClient({
            chain: localhost,
            transport: custom((window as any).ethereum)
        })
        this.connect()
    }

    private async connect() {
        return await this.walletClient.requestAddresses()
    }

    async getTopRankings() {
        return await this.publicClient.readContract({
            address: info.address as Address,
            abi: info.abi,
            functionName: 'getTopEntries',
            args: [5]
        })
    }

    async saveNewEntry(name: string, score: number) {
        const [ account ] = await this.connect()
        if (account == undefined) {
            console.log('Cannot connect to chain')
            return
        }
        const { request } = await this.publicClient.simulateContract({
            address: info.address as Address,
            abi: info.abi,
            functionName: 'addEntry',
            args: [name, score],
            account: account,    
        })
        await this.walletClient.writeContract(request)
    }
}

const provider = new Provider()
export default provider