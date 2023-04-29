import { ConnectButton } from "web3uikit"

function Header() {
    return (
        <div className="border-b-2 p-5 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">
                Super Fair Lottery In The World
            </h1>
            <ConnectButton moralisAuth={false} />
        </div>
    )
}

export default Header
