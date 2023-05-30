import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "@/constant"
import { useEffect, useState } from "react"
import {
    BigNumberish,
    ethers,
    TransactionResponse,
    ContractTransaction
} from "ethers"
import { useNotification } from "web3uikit"

interface contractAddressesInterface {
    [key: string]: string[]
}

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()
    const addresses: contractAddressesInterface = contractAddresses
    const raffleAddress = chainId in addresses ? addresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState<string | Number>("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const [currentBalance, setCurrentBalance] = useState("0")

    const dispatchNotification = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!, // To specify network ID
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!, // To specify network ID
        functionName: "getEntranceFee",
        params: {}
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!, // To specify network ID
        functionName: "getNumberOfPlayers",
        params: {}
    })

    const { runContractFunction: getCurrentBalance } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!, // To specify network ID
        functionName: "getCurrentBalance",
        params: {}
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!, // To specify network ID
        functionName: "getRecentWinner",
        params: {}
    })

    async function updateUI() {
        setNumberOfPlayers(
            ((await getNumberOfPlayers()) as BigNumberish).toString()
        )
        setRecentWinner(((await getRecentWinner()) as string).toString())
        setEntranceFee(((await getEntranceFee()) as BigNumberish).toString())
        setCurrentBalance(
            ((await getCurrentBalance()) as BigNumberish).toString()
        )
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            // Read raffle entrance fee

            updateUI()
        }
    }, [isWeb3Enabled])

    const handleEnterRaffle = async () => {
        await enterRaffle({
            onSuccess: async (tx) => handleSuccess(tx as TransactionResponse),
            onError: (e) => console.log(e)
        })
    }

    const handleSuccess = async (tx: TransactionResponse) => {
        await tx.wait(1)
        console.log("this is tx", tx)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = (tx: TransactionResponse) => {
        dispatchNotification({
            type: "info",
            position: "topR",
            message: "Tracsaction Completed ~~~",
            title: "Transaction Status",
            icon: <div>hehe</div>
        })
    }

    return (
        <div className="px-4 py-4">
            <h1 className="font-bold text-xl mb-2">
                Welcome to the most random raffle in the world!
            </h1>
            {raffleAddress ? (
                <div>
                    <div>
                        Entrance Fee: {ethers.formatUnits(entranceFee, "ether")}{" "}
                        ETH
                    </div>
                    <button
                        onClick={handleEnterRaffle}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded ml-auto"
                        disabled={isFetching || isLoading}
                    >
                        {isFetching || isLoading ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Enter Raffle"
                        )}
                    </button>

                    <div>Tickets: {numberOfPlayers as string}</div>
                    <div>Recent winner: {recentWinner}</div>
                    <div>
                        Current prize:{" "}
                        {ethers.formatUnits(currentBalance, "ether")} ETH
                    </div>
                </div>
            ) : (
                <div>This chain haven't been supported yet</div>
            )}
        </div>
    )
}
