import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'

import { IS_MAINNET, CONTRACTS } from 'config'
import MAIN_ERC20_ABI from 'libs/abis/main/erc20.json'
import TEST_ERC20_ABI from 'libs/abis/test/erc20.json'
import S3D_VAULT_ABI from 'libs/abis/s3d-vault.json'
import ICE_QUEEN_ABI from 'libs/abis/ice-queen.json'
import { isEmpty, delay } from 'utils/helpers/utility'

const ERC20_ABI = IS_MAINNET ? MAIN_ERC20_ABI : TEST_ERC20_ABI
const ContractContext = createContext(null)

export function S3dVaultContractProvider({ children }) {
  const { library, account } = useWeb3React();

  const [loading, setLoading] = useState(false)
  const [s3dToken, setS3dToken] = useState({ name: 'S3D', priceId: 's3d', decimal: 18, price: 0, balance: 0, supply: 0, percentage: 0, ratio: 0 })
  const [usdtToken, setUsdtToken] = useState({ index: 0, name: 'USDT', priceId: 'usdt', decimal: 6, price: 0, balance: 0, supply: 0, percentage: 0 })
  const [busdToken, setBusdToken] = useState({ index: 1, name: 'BUSD', priceId: 'busd', decimal: 18, price: 0, balance: 0, supply: 0, percentage: 0 })
  const [daiToken, setDaiToken] = useState({ index: 2, name: 'DAI', priceId: 'dai', decimal: 18, price: 0, balance: 0, supply: 0, percentage: 0 })
  const [totalSupply, setTotalSupply] = useState(0);
  const [staked, setStaked] = useState(0);

  const s3dContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.TOKEN, ERC20_ABI, library.getSigner()) : null, [library])
  const usdtContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.USDT, ERC20_ABI, library.getSigner()) : null, [library])
  const busdContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.BUSD, ERC20_ABI, library.getSigner()) : null, [library])
  const daiContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.DAI, ERC20_ABI, library.getSigner()) : null, [library])
  const vaultContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.VAULT, S3D_VAULT_ABI, library.getSigner()) : null, [library])
  const iceQueenContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.ICE_QUEEN, ICE_QUEEN_ABI, library.getSigner()) : null, [library])
  const tokenArray = useMemo(() => [usdtToken, busdToken, daiToken], [usdtToken, busdToken, daiToken]);

  const getTokenContract = (token) => {
    switch (token.name) {
      case 'USDT': return usdtContract;
      case 'BUSD': return busdContract;
      case 'DAI': return daiContract;
      default: return usdtContract;
    }
  }

  useEffect(() => {
    if (s3dContract && usdtContract && busdContract && daiContract && vaultContract && iceQueenContract) {
      getInit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s3dContract, usdtContract, busdContract, daiContract, vaultContract, iceQueenContract]);

  const getInit = async () => {
    try {
      const [
        s3dBalance,
        usdtBalance,
        busdBalance,
        daiBalance,
        s3dSupply,
        usdtSupply,
        busdSupply,
        daiSupply,
        stakedPool
      ] = await Promise.all([
        s3dContract.balanceOf(account, { gasLimit: 1000000 }),
        usdtContract.balanceOf(account, { gasLimit: 1000000 }),
        busdContract.balanceOf(account, { gasLimit: 1000000 }),
        daiContract.balanceOf(account, { gasLimit: 1000000 }),
        s3dContract.totalSupply({ gasLimit: 1000000 }),
        usdtContract.balanceOf(CONTRACTS.S3D.VAULT, { gasLimit: 1000000 }),
        busdContract.balanceOf(CONTRACTS.S3D.VAULT, { gasLimit: 1000000 }),
        daiContract.balanceOf(CONTRACTS.S3D.VAULT, { gasLimit: 1000000 }),
        iceQueenContract.userInfo(7, account, { gasLimit: 1000000 })
      ]);

      const s3dBalanceValue = parseFloat(ethers.utils.formatUnits(s3dBalance, 18))
      const usdtBalanceValue = parseFloat(ethers.utils.formatUnits(usdtBalance, 6))
      const busdBalanceValue = parseFloat(ethers.utils.formatUnits(busdBalance, 18))
      const daiBalanceValue = parseFloat(ethers.utils.formatUnits(daiBalance, 18))
      const s3dSupplyValue = parseFloat(ethers.utils.formatUnits(s3dSupply, 18))
      const usdtSupplyValue = parseFloat(ethers.utils.formatUnits(usdtSupply, 6))
      const busdSupplyValue = parseFloat(ethers.utils.formatUnits(busdSupply, 18))
      const daiSupplyValue = parseFloat(ethers.utils.formatUnits(daiSupply, 18))
      const stakedValue = parseFloat(ethers.utils.formatUnits(stakedPool.amount, 18))
      const totalSupply = usdtSupplyValue + busdSupplyValue + daiSupplyValue
      const s3dPercentage = s3dSupplyValue ? s3dBalanceValue / s3dSupplyValue : 0
      const usdtPercentage = totalSupply ? usdtSupplyValue / totalSupply : 0
      const busdPercentage = totalSupply ? busdSupplyValue / totalSupply : 0
      const daiPercentage = totalSupply ? daiSupplyValue / totalSupply : 0
      const s3dRatio = s3dSupplyValue ? totalSupply / s3dSupplyValue : 0
      setTotalSupply(totalSupply)
      setStaked(stakedValue)
      setS3dToken((prev) => ({ ...prev, balance: s3dBalanceValue, percentage: s3dPercentage, supply: s3dSupplyValue, ratio: s3dRatio }))
      setUsdtToken((prev) => ({ ...prev, balance: usdtBalanceValue, percentage: usdtPercentage, supply: usdtSupplyValue }));
      setBusdToken((prev) => ({ ...prev, balance: busdBalanceValue, percentage: busdPercentage, supply: busdSupplyValue }));
      setDaiToken((prev) => ({ ...prev, balance: daiBalanceValue, percentage: daiPercentage, supply: daiSupplyValue }));
    } catch (error) {
      console.log('[Error] getInit => ', error)
    }
  }

  const getToSwapAmount = async (fromToken, toToken, fromAmount) => {
    try {
      if (!vaultContract) { return 0; }
      if (fromToken.name === toToken.name) { return fromAmount }

      const fromAmountValue = ethers.utils.parseUnits(fromAmount.toString(), fromToken.decimal);
      const toAmount = await vaultContract.calculateSwap(fromToken.index, toToken.index, fromAmountValue)
      const toAmountValue = parseFloat(ethers.utils.formatUnits(toAmount, toToken.decimal))
      return toAmountValue || 0;
    } catch (error) {
      console.log('[Error] getToSwapAmount => ', error)
      return 0
    }
  }

  const onSwap = async ({ fromToken, toToken, fromAmount, toAmount, maxSlippage }) => {
    setLoading(true)
    try {
      let loop = true
      let tx = null
      const ethereumProvider = await detectEthereumProvider();
      const web3 = new Web3(ethereumProvider);
      const tokenContract = getTokenContract(fromToken);

      const amount = ethers.utils.parseEther((fromAmount).toString());
      const { hash: approveHash } = await tokenContract.approve(CONTRACTS.S3D.VAULT, amount);

      while (loop) {
        tx = await web3.eth.getTransactionReceipt(approveHash);
        if (isEmpty(tx)) {
          await delay(300)
        } else {
          loop = false
        }
      }

      if (!tx.status) {
        setLoading(false)
        return;
      }

      const fromAmountValue = ethers.utils.parseUnits(fromAmount.toString(), fromToken.decimal)
      const slippageMultiplier = 1000 - (maxSlippage * 10);
      const minAmount = toAmount * slippageMultiplier / 1000;
      const minAmountValue = ethers.utils.parseUnits(minAmount.toString(), toToken.decimal)
      const deadline = Date.now() + 180;

      const { hash: swapHash } = await vaultContract.swap(
        fromToken.index,
        toToken.index,
        fromAmountValue,
        minAmountValue,
        deadline
      );

      loop = true;
      tx = null;
      while (loop) {
        tx = await web3.eth.getTransactionReceipt(swapHash);
        if (isEmpty(tx)) {
          await delay(300)
        } else {
          loop = false
        }
      }

      if (tx.status) {
        await getInit();
      }
    } catch (error) {
      console.log('[Error] onSwap => ', error)
    }
    setLoading(false)
  }

  return (
    <ContractContext.Provider
      value={{
        loading,
        s3dToken,
        usdtToken,
        busdToken,
        daiToken,
        tokenArray,
        totalSupply,
        staked,
        getToSwapAmount,
        onSwap
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export function useS3dVaultContracts() {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error('Missing stats context')
  }

  const {
    loading,
    s3dToken,
    usdtToken,
    busdToken,
    daiToken,
    tokenArray,
    totalSupply,
    staked,
    getToSwapAmount,
    onSwap
  } = context

  return {
    loading,
    s3dToken,
    usdtToken,
    busdToken,
    daiToken,
    tokenArray,
    totalSupply,
    staked,
    getToSwapAmount,
    onSwap
  }
}