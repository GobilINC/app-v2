import { memo } from 'react'
import { Grid } from '@material-ui/core'

import { useS3dVaultContracts } from 'contexts/s3d-vault-context'
import PanelLayout, { usePanelStyles } from 'containers/StableVault/Shared/PanelLayout'
import AddLiquidityForm from 'containers/StableVault/Shared/AddLiquidityForm'
import ShareCard from 'containers/StableVault/Shared/ShareCard'
import CurrencyReserves from 'containers/StableVault/Shared/CurrencyReserves'

const LiquidityPanel = ({
  vault
}) => {
  const classes = usePanelStyles();
  const {
    svToken,
    tokenArray,
    tokenValues,
    totalSupply,
    getDepositReview,
    getWithdrawAmount,
    removeLiquidity,
    addLiquidity
  } = useS3dVaultContracts()

  return (
    <PanelLayout>
      <Grid item sm={12} md={6} className={classes.leftCard}>
        <AddLiquidityForm
          vault={vault}
          tokenArray={tokenArray}
          tokenValues={tokenValues}
          getDepositReview={getDepositReview}
          addLiquidity={addLiquidity}
        />
      </Grid>
      <Grid item sm={12} md={6} className={classes.rightCard}>
        <Grid container spacing={3}>
          <Grid item sm={12}>
            <ShareCard
              vault={vault}
              staked={svToken.balance}
              tokenArray={tokenArray}
              getWithdrawAmount={getWithdrawAmount}
              removeLiquidity={removeLiquidity}
            />
          </Grid>
          <Grid item sm={12}>
            <CurrencyReserves
              tokenArray={tokenArray}
              tokenValues={tokenValues}
              totalSupply={totalSupply}
            />
          </Grid>
        </Grid>
      </Grid>
    </PanelLayout>
  )
}

export default memo(LiquidityPanel)
