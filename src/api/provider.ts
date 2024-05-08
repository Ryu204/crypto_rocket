import {
    PublicClient, WalletClient,
    createPublicClient, createWalletClient,
    custom, http, Address
} from 'viem'
import {
    localhost, sepolia
} from 'viem/chains'
import info from './contract.json'
import { dev, DevMode } from '../config'

export type Entry = {
    score: number,
    name: string
}

export class Provider {
    private publicClient: PublicClient | undefined
    private walletClient: WalletClient | undefined

    constructor() {
        try {
            this.publicClient = createPublicClient({
                chain: dev.mode == DevMode.development ? localhost : sepolia,
                transport: http()
            })
        } catch (e: unknown) {
            this.publicClient = undefined
        } 
        
        try {
            this.walletClient = createWalletClient({
                chain: dev.mode == DevMode.development ? localhost : sepolia,
                transport: custom((window as any).ethereum)
            })
        } catch (e: unknown) {
            this.walletClient = undefined
        }
    }

    private async createWallet(): Promise<boolean> {
        if (this.walletClient != undefined)
            return true;
        try {
            this.walletClient = createWalletClient({
                chain: dev.mode == DevMode.development ? localhost : sepolia,
                transport: custom((window as any).ethereum)
            })
            return true
        } catch (e: any) {
            this.logError(`Cannot creat wallet client`, `${e.stack}`)
            return false
        }
    }

    private async createPublic(): Promise<boolean> {
        if (this.publicClient != undefined)
            return true;
        try {
            this.publicClient = createPublicClient({
                chain: dev.mode == DevMode.development ? localhost : sepolia,
                transport: http()
            })
            return true
        } catch (e: any) {
            this.logError(`Cannot creat public client`, `${e.stack}`)
            return false
        }
    }

    private async connect() {
        return await this.walletClient!.requestAddresses()
    }

    async getTopRankings() {
        if (!await this.createPublic()) {
            return []
        }
        try {
            return (await this.publicClient!.readContract({
                address: info.address as Address,
                abi: info.abi,
                functionName: 'getTopEntries',
                args: [5]
            })) as Array<Entry>
        } catch (e: any) {
            this.logError(`Cannot read chain data`, `${e.stack}`)
            return []
        }
    }

    async saveNewEntry(name: string, score: number) {
        if (!await this.createWallet() || !await this.createPublic()) {
            return
        }
        const accounts = await this.connect()
        if (accounts.length == 0) {
            this.logError('No account found', 'Please check that you have a wallet extension installed')
            return
        }
        const [ account ] = accounts
        
        try {
            const { request } = await this.publicClient!.simulateContract({
                address: info.address as Address,
                abi: info.abi,
                functionName: 'addEntry',
                args: [name, score],
                account: account,    
            })
            await this.walletClient!.writeContract(request)
        } catch (e: any) {
            this.logError('Cannot call smart contract', `${e.stack}`)
        }
    }

    private logError(short: string, detail: string) {
        alert(short + '\nPlease check the console (F12) for detail :(')
        console.log(short + '\nReason: ' + detail)
    }
}

const provider = new Provider()
export default provider